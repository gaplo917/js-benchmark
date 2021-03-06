import {
  isNotNullPredicate,
  mapNotNullReduceOp,
  someCalculation,
  someTransform,
  sumByReduceOp,
  sumReduceOp,
} from './common.mjs'

Array.prototype.ktMapNotNullNative = function (transform) {
  return this.reduce(mapNotNullReduceOp(transform), [])
}

Array.prototype.ktSumByNative = function (selector) {
  return this.reduce(sumByReduceOp(selector), 0)
}

Array.prototype.ktDistinctNative = function () {
  // choose from perf-set-op.mjs
  return Array.from(new Set(this))
}

export function nativeReduceImperative(arr) {
  return Array.from(
    arr.reduce((acc, e) => {
      const transformed = someTransform(e)
      if (transformed !== null) {
        acc.add(transformed)
      }
      return acc
    }, new Set()),
  ).reduce(sumByReduceOp(someCalculation), 0)
}

const uniqArr = (arr) => Array.from(new Set(arr))

export function nativeFunctionalOperator(arr) {
  return uniqArr(arr.map(someTransform).filter(isNotNullPredicate))
    .map(someCalculation)
    .reduce(sumReduceOp, 0)
}

export function nativeFunctionalOperatorOpti(arr) {
  return uniqArr(arr.reduce(mapNotNullReduceOp(someTransform), [])).reduce(
    sumByReduceOp(someCalculation),
    0,
  )
}

export function arrayExtensionNativeFunctionalOperator(arr) {
  return arr
    .ktMapNotNullNative(someTransform)
    .ktDistinctNative()
    .ktSumByNative(someCalculation)
}
