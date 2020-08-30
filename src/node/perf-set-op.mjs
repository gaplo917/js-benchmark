import Benchmark from 'benchmark'
import { arrSize } from './perf-impl/common.mjs'

const setOperationSuite = new Benchmark.Suite('Set Operation')

const numberSet = new Set(
  new Array(arrSize).fill(null).map((value, index) => index),
)
const stringSet = new Set(
  new Array(arrSize).fill(null).map((value, index) => `_${index}`),
)

function checkUniqAndAddIfNotExsit(set, value) {
  const oriSize = set.size
  set.add(value)
  return set.size === oriSize
}

function checkUniqAndAddIfNotExsit2(set, value) {
  const hasValue = set.has(value)
  if (!hasValue) {
    set.add(value)
  }
  return hasValue
}

setOperationSuite
  .add('how fast is new Set(set)?', function () {
    new Set(numberSet)
  })
  .add(
    '[Num].add(value) whatever and compare size, non-exist-element',
    function () {
      checkUniqAndAddIfNotExsit(new Set(numberSet), -1)
    },
  )
  .add(
    '[Num].has(value) first and add if needed, non-exist-element',
    function () {
      checkUniqAndAddIfNotExsit2(new Set(numberSet), -1)
    },
  )
  .add(
    '[Num].add(value) whatever and compare size, exist-element',
    function () {
      checkUniqAndAddIfNotExsit(new Set(numberSet), 0)
    },
  )
  .add('[Num].has(value) first and add if needed, exist-element', function () {
    checkUniqAndAddIfNotExsit2(new Set(numberSet), 0)
  })
  .add(
    '[String].add(value) whatever and compare size, non-exist-element',
    function () {
      checkUniqAndAddIfNotExsit(new Set(stringSet), '_-1')
    },
  )
  .add(
    '[String].has(value) first and add if needed, non-exist-element',
    function () {
      checkUniqAndAddIfNotExsit2(new Set(stringSet), '_-1')
    },
  )
  .add(
    '[String].add(value) whatever and compare size, exist-element',
    function () {
      checkUniqAndAddIfNotExsit(new Set(stringSet), '_0')
    },
  )
  .add(
    '[String].has(value) first and add if needed, exist-element',
    function () {
      checkUniqAndAddIfNotExsit2(new Set(stringSet), '_0')
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
