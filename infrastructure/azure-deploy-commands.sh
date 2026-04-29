# ── DapurDana Panduan Deploy Azure Student ──────────────────────────────

# Panduan ini mengasumsikan kamu sudah punya:
# - Akun Azure for Students (https://azure.microsoft.com/id-id/free/students)
# - GitHub repository untuk project DapurDana
# - Azure CLI terinstall (https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

# ==========================================================================
# LANGKAH 1: LOGIN KE AZURE CLI
# ==========================================================================
az login --use-device-code

# Cek apakah subscription studentmu aktif
az account list --output table

# Set subscription yang benar (sesuaikan ID dengan punyamu)
az account set --subscription "Azure for Students"


# ==========================================================================
# LANGKAH 2: BUAT RESOURCE GROUP
# ==========================================================================
# Resource Group adalah folder/wadah untuk semua resource DapurDana

az group create \
  --name "rg-dapurdana" \
  --location "southeastasia"
  # Pakai southeastasia (Singapura) untuk latency terendah dari Indonesia


# ==========================================================================
# LANGKAH 3: BUAT BACKEND — Azure App Service (Node.js)
# ==========================================================================

# 3a. Buat App Service Plan (level F1 = GRATIS untuk student)
az appservice plan create \
  --name "asp-dapurdana" \
  --resource-group "rg-dapurdana" \
  --sku F1 \
  --is-linux

# 3b. Buat Web App untuk backend Node.js
az webapp create \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana" \
  --plan "asp-dapurdana" \
  --runtime "NODE:20-lts"

# 3c. Set environment variables untuk backend di Azure
az webapp config appsettings set \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana" \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    WEBSITE_NODE_DEFAULT_VERSION="~20"

# 3d. Pastikan startup command sudah benar
az webapp config set \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana" \
  --startup-file "node server.js"

# Verifikasi backend berjalan:
# https://dapurdana-api.azurewebsites.net/api/health


# ==========================================================================
# LANGKAH 4: BUAT FRONTEND — Azure Static Web Apps (Vite/React)
# ==========================================================================

# Azure Static Web Apps = hosting gratis, CDN global, SSL otomatis

az staticwebapp create \
  --name "dapurdana-frontend" \
  --resource-group "rg-dapurdana" \
  --source "https://github.com/GITHUB_USERNAME/DapurDana" \
  --location "eastasia" \
  --branch "main" \
  --app-location "/frontend" \
  --output-location "dist" \
  --login-with-github
  # Perintah ini akan membuka browser untuk kamu authorize GitHub

# Ambil API Token Static Web App untuk GitHub Actions:
az staticwebapp secrets list \
  --name "dapurdana-frontend" \
  --resource-group "rg-dapurdana" \
  --query "properties.apiKey" \
  --output tsv
# COPY nilai ini! Akan dipakai sebagai AZURE_STATIC_WEB_APPS_API_TOKEN di GitHub Secrets


# ==========================================================================
# LANGKAH 5: SETUP GITHUB ACTIONS (CI/CD otomatis)
# ==========================================================================

# --- 5a. Buat Service Principal untuk GitHub Actions ---
# Service Principal = "akun robot" khusus untuk deployment otomatis

SUBSCRIPTION_ID=$(az account show --query id --output tsv)

az ad sp create-for-rbac \
  --name "sp-dapurdana-github" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-dapurdana" \
  --json-auth

# Output JSON akan berisi:
# {
#   "clientId":       "xxxx",   → AZUREAPPSERVICE_CLIENTID
#   "clientSecret":   "xxxx",   → (tidak dipakai, kita pakai OIDC)
#   "subscriptionId": "xxxx",   → AZUREAPPSERVICE_SUBSCRIPTIONID
#   "tenantId":       "xxxx"    → AZUREAPPSERVICE_TENANTID
# }

# --- 5b. Aktifkan OIDC federated credential (lebih aman dari password) ---
# Ganti GITHUB_USERNAME dan GITHUB_REPO_NAME sesuai punyamu

APP_ID=$(az ad sp list --display-name "sp-dapurdana-github" --query "[0].appId" -o tsv)

az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main-branch",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:GITHUB_USERNAME/DapurDana:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'


# ==========================================================================
# LANGKAH 6: TAMBAHKAN SECRETS KE GITHUB REPOSITORY
# ==========================================================================

# Buka: https://github.com/GITHUB_USERNAME/DapurDana/settings/secrets/actions
# Tambahkan secrets berikut satu per satu:

# ┌─────────────────────────────────────┬─────────────────────────────────┐
# │ Secret Name                         │ Nilai                           │
# ├─────────────────────────────────────┼─────────────────────────────────┤
# │ AZUREAPPSERVICE_CLIENTID            │ clientId dari Service Principal │
# │ AZUREAPPSERVICE_TENANTID            │ tenantId dari Service Principal │
# │ AZUREAPPSERVICE_SUBSCRIPTIONID      │ subscriptionId dari SP          │
# │ AZURE_BACKEND_APP_NAME              │ dapurdana-api                   │
# │ AZURE_STATIC_WEB_APPS_API_TOKEN     │ Token dari Langkah 4            │
# │ VITE_API_BASE_URL                   │ https://dapurdana-api.azurewebsites.net │
# └─────────────────────────────────────┴─────────────────────────────────┘


# ==========================================================================
# LANGKAH 7: KONFIGURASI CORS BACKEND UNTUK DOMAIN FRONTEND
# ==========================================================================

# Setelah frontend di-deploy, catat URLnya (contoh: https://happy-flower-xxx.azurestaticapps.net)
# Lalu update CORS di backend/server.js agar hanya menerima dari domain tersebut

# Atau set via Azure:
az webapp config appsettings set \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana" \
  --settings ALLOWED_ORIGINS="https://happy-flower-xxx.azurestaticapps.net"


# ==========================================================================
# LANGKAH 8: UPLOAD mlForecasts.json KE BACKEND
# ==========================================================================

# File ini tidak ikut ke git (terlalu besar), jadi perlu diupload manual.
# Gunakan Azure CLI atau Kudu Console.

# Opsi A: Via Azure CLI (ZIP Deploy)
cd backend
zip -r forecasts-only.zip data/mlForecasts.json data/commodityForecasts.js
az webapp deploy \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana" \
  --src-path forecasts-only.zip \
  --type zip

# Opsi B: Via Kudu SCM Console (lebih mudah)
# Buka: https://dapurdana-api.scm.azurewebsites.net/DebugConsole
# Navigate ke: site/wwwroot/data/
# Drag and drop file mlForecasts.json


# ==========================================================================
# LANGKAH 9: DEPLOY PERTAMA KALI (MANUAL TRIGGER)
# ==========================================================================

# Push ke GitHub untuk trigger CI/CD:
git add .
git commit -m "chore: setup Azure deployment configuration"
git push origin main

# Atau trigger manual di GitHub:
# Actions → "Deploy Backend to Azure App Service" → "Run workflow"


# ==========================================================================
# LANGKAH 10: VERIFIKASI DEPLOYMENT
# ==========================================================================

# Backend health check:
curl https://dapurdana-api.azurewebsites.net/api/health

# Backend API test:
curl -X POST https://dapurdana-api.azurewebsites.net/api/predict \
  -H "Content-Type: application/json" \
  -d '{}'

# Frontend: buka di browser
# https://dapurdana-frontend.azurestaticapps.net (atau URL yang diberikan Azure)


# ==========================================================================
# TIPS & TROUBLESHOOTING
# ==========================================================================

# Cek logs backend jika ada error:
az webapp log tail \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana"

# Restart backend jika perlu:
az webapp restart \
  --name "dapurdana-api" \
  --resource-group "rg-dapurdana"

# Cek status semua resource:
az resource list --resource-group "rg-dapurdana" --output table
