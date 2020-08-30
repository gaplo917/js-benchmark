import assert from 'assert'
import Benchmark from 'benchmark'
import fp from 'lodash/fp.js'
import {
  arr,
  arrSize,
  mapNotNullReduceOp,
  someCalculation,
  someNumIsNotNull,
  someTransform,
  targetProp,
} from './perf-impl/common.mjs'

const setOperationSuite = new Benchmark.Suite('Lodash Operation')

function v1Standard(arr) {
  return fp.pipe(
    fp.filter(someNumIsNotNull),
    fp.map(someTransform),
    fp.uniq,
    fp.sumBy(someCalculation),
  )(arr)
}

function v1UseString(arr) {
  return fp.pipe(
    fp.filter(someNumIsNotNull),
    fp.map(targetProp),
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

const ans = v1Standard(arr)
assert.ok(v1UseString(arr) === ans)
assert.ok(v2(arr) === ans)

setOperationSuite
  .add('version 1, use map', function () {
    v1Standard(arr)
  })
  .add('version 1, use string to transform', function () {
    v1UseString(arr)
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
