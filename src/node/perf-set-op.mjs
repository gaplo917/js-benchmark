import Benchmark from 'benchmark'
import assert from 'assert'
import { arrSize } from './perf-impl/common.mjs'

const setOperationSuite = new Benchmark.Suite('Set Operation')

const uniqNumberSet = new Set(
  new Array(arrSize).fill(null).map((value, index) => index),
)
const uniqStringSet = new Set(
  new Array(arrSize).fill(null).map((value, index) => `_${index}`),
)

const numbers = new Array(arrSize)
  .fill(null)
  .map((value, index) => index % (arrSize / 5))

function checkUniqAndAddAndDoSthIfNotExsit(set, value, cb) {
  const oriSize = set.size
  set.add(value)
  if (set.size !== oriSize) {
    cb()
  }
}

function checkUniqAndAddAndDoSthIfNotExsit2(set, value, cb) {
  const hasValue = set.has(value)
  if (!hasValue) {
    set.add(value)
    cb()
  }
}

function toUniqArray(arr) {
  return Array.from(new Set(arr))
}

function toUniqArray2(arr) {
  return Array.from(arr.reduce((acc, e) => acc.add(e), new Set()))
}

function toUniqArray3(arr) {
  const set = new Set()
  const result = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const e = arr[i] // can add transform logic here, probably used in distinctBy implementation
    const oriSize = set.size
    set.add(e)
    if (set.size !== oriSize) {
      result.push(e)
    }
  }
  return result
}

function toUniqArray4(arr) {
  const map = new Map()
  const result = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const e = arr[i]
    if (!map.has(e)) {
      map.set(e, null)
      result.push(e)
    }
  }
  return result
}

const ans = toUniqArray(numbers).length
assert.ok(toUniqArray2(numbers).length === ans)
assert.ok(toUniqArray3(numbers).length === ans)
assert.ok(toUniqArray4(numbers).length === ans)

setOperationSuite
  .add('convert toSet and convert to Array', function () {
    toUniqArray(numbers)
  })
  .add('reduce toSet and convert to Array', function () {
    toUniqArray2(numbers)
  })
  .add('for loop to use Set', function () {
    toUniqArray3(numbers)
  })
  .add('for loop to use Map for cache', function () {
    toUniqArray3(numbers)
  })
  .add(
    '[Num].add(value) whatever and compare size, non-exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit(uniqNumberSet, -1, () => {
        uniqNumberSet.delete(-1)
      })
    },
  )
  .add(
    '[Num].has(value) first and add if needed, non-exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit2(uniqNumberSet, -1, () => {
        uniqNumberSet.delete(-1)
      })
    },
  )
  .add(
    '[Num].add(value) whatever and compare size, exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit(uniqNumberSet, 0, () => {})
    },
  )
  .add('[Num].has(value) first and add if needed, exist-element', function () {
    checkUniqAndAddAndDoSthIfNotExsit2(uniqNumberSet, 0, () => {})
  })
  .add(
    '[String].add(value) whatever and compare size, non-exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit(uniqStringSet, '_-1', () => {
        uniqStringSet.delete('_-1')
      })
    },
  )
  .add(
    '[String].has(value) first and add if needed, non-exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit2(uniqStringSet, '_-1', () => {
        uniqStringSet.delete('_-1')
      })
    },
  )
  .add(
    '[String].add(value) whatever and compare size, exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit(uniqStringSet, '_0', () => {})
    },
  )
  .add(
    '[String].has(value) first and add if needed, exist-element',
    function () {
      checkUniqAndAddAndDoSthIfNotExsit2(uniqStringSet, '_0', () => {})
    },
  )
  // add listeners
  .on('start', function () {
    console.log(`${this.name} ARR_SIZE=${arrSize}`)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
