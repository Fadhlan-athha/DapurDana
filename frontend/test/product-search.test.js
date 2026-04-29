import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProductsByName } from '../src/services/productSearch.js'
import {
  formatIntegerInput,
  parseIntegerInput,
} from '../src/utils/formatters.js'

const products = [
  { id: 'cabai-merah', name: 'Cabai Merah' },
  { id: 'daging-ayam', name: 'Daging Ayam' },
  { id: 'telur-ayam', name: 'Telur Ayam' },
]

test('filters products by product name', () => {
  const result = filterProductsByName(products, 'ayam')

  assert.deepEqual(
    result.map((product) => product.name),
    ['Daging Ayam', 'Telur Ayam'],
  )
})

test('search is case insensitive and ignores surrounding spaces', () => {
  const result = filterProductsByName(products, '  CABAI  ')

  assert.deepEqual(
    result.map((product) => product.name),
    ['Cabai Merah'],
  )
})

test('formats integer input with Indonesian thousands separators', () => {
  assert.equal(formatIntegerInput(1500000), '1.500.000')
  assert.equal(formatIntegerInput(250000), '250.000')
})

test('parses formatted integer input back to a number', () => {
  assert.equal(parseIntegerInput('1.500.000'), 1500000)
  assert.equal(parseIntegerInput('Rp 250.000'), 250000)
})
