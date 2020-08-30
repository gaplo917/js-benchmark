import {
  mapNotNullReducer,
  someCalculation,
  someNumIsNotNull,
  someTransform,
  sumReducer,
} from './common.mjs'

Array.prototype.ktMapNotNullNativeMapFilter = function (transform) {
  return this.reduce(mapNotNullReducer(transform), [])
}

Array.prototype.ktSumNativeReduce = function () {
  return this.reduce(sumReducer, 0)
}

Array.prototype.ktDistinctNativeFilter = function () {
  return Array.from(this.reduce((acc, e) => acc.add(e), new Set()))
}

export function nativeFunctionalOperator(arr) {
  return Array.from(
    arr
      .filter(someNumIsNotNull)
      .map(someTransform)
      .reduce((acc, e) => acc.add(e), new Set()),
  )
    .map(someCalculation)
    .reduce(sumReducer, 0)
}

export function nativeFunctionalOperatorOpti(arr) {
  return Array.from(
    arr
      .reduce(mapNotNullReducer(someTransform), [])
      .reduce((acc, e) => acc.add(e), new Set()),
  )
    .map(someCalculation)
    .reduce(sumReducer, 0)
}

export function arrayExtensionNativeFunctionalOperator(arr) {
  return arr
    .ktMapNotNullNativeMapFilter(someTransform)
    .ktDistinctNativeFilter()
    .map(someCalculation)
    .ktSumNativeReduce()
}
