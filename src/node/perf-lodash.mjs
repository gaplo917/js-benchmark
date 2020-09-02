import assert from 'assert'
import Benchmark from 'benchmark'
import fp from 'lodash/fp.js'
import {
  createArr,
  isNotNullPredicate,
  mapNotNullReduceOp,
  someCalculation,
  someTransform,
} from './perf-impl/common.mjs'

const arrSize = parseInt(process.env.ARR_SIZE)

if (!arrSize) {
  throw new Error('missing ARR_SIZE environment variable')
}
const setOperationSuite = new Benchmark.Suite('Lodash Operation')

function v1Standard(arr) {
  return fp.pipe(
    fp.map(someTransform),
    fp.filter(isNotNullPredicate),
    fp.uniq,
    fp.sumBy(someCalculation),
  )(arr)
}

function v2(arr) {
  return fp.pipe(
    fp.reduce(mapNotNullReduceOp(someTransform), []),
    fp.uniq,
    fp.sumBy(someCalculation),
  )(arr)
}

const arr = createArr(arrSize)
const ans = v1Standard(arr)
assert.strictEqual(v2(arr), ans)

setOperationSuite
  .add('version 1, use map', function () {
    v1Standard(arr)
  })
  .add('version 2, group to reduce for mapNotNull', function () {
    v2(arr)
  })
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
