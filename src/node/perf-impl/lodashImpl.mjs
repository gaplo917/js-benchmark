import _ from 'lodash'
import fp from 'lodash/fp.js'
import {
  arr,
  mapNotNullReducer,
  someCalculation,
  someNumIsNotNull,
  someTransform,
} from './common.mjs'

class KtSeqLodashImpl {
  constructor(wrapped) {
    this.wrapped = wrapped
    this.fns = []
  }
  sum() {
    this.fns.push(fp.reduce((acc, e) => acc + e, 0))
    return fp.pipe(this.fns)(this.wrapped)
  }

  map(transform) {
    this.fns.push(fp.map(transform))
    return this
  }

  filterNotNull(predicate) {
    this.fns.push(fp.filter(predicate))
    return this
  }

  mapNotNull(transform) {
    this.fns.push(fp.reduce(mapNotNullReducer(transform), []))
    return this
  }

  distinct() {
    this.fns.push(fp.uniq)
    return this
  }
}

Array.prototype.ktAsSequenceLodashImpl = function () {
  return new KtSeqLodashImpl(this)
}

Array.prototype.ktMapNotNullLodash = function (transform) {
  return fp.pipe(fp.reduce(mapNotNullReducer(transform), []))(this)
}

Array.prototype.ktSumLodash = function () {
  return _.sum(this)
}

Array.prototype.ktDistinctLodash = function () {
  return _.uniq(this)
}

export const calSumLodashFp = fp.pipe(
  fp.reduce(mapNotNullReducer(someTransform), []),
  fp.uniq,
  fp.map(someCalculation),
  fp.sum,
)

export function lodashOneByOne() {
  return _.sum(
    _.map(
      _.uniq(
        _.map(
          _.filter(arr, (it) => someNumIsNotNull(it)),
          someTransform,
        ),
      ),
      someCalculation,
    ),
  )
}

export function lodashChain() {
  return _.chain(arr)
    .filter(someNumIsNotNull)
    .map(someTransform)
    .uniq()
    .map(someCalculation)
    .sum()
    .value()
}

export function lodashChainOpti() {
  return _.chain(arr)
    .reduce(mapNotNullReducer(someTransform), [])
    .uniq()
    .map(someCalculation)
    .sum()
    .value()
}

export function lodashFp() {
  return calSumLodashFp(arr)
}

export function arrayExtensionLodash() {
  return arr
    .ktMapNotNullLodash(someTransform)
    .ktDistinctLodash()
    .map(someCalculation)
    .ktSumLodash()
}

export function lazySeqLodashImpl() {
  return arr
    .ktAsSequenceLodashImpl()
    .mapNotNull(someTransform)
    .distinct()
    .map(someCalculation)
    .sum()
}
