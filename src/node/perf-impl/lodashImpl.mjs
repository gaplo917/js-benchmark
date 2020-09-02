import _ from 'lodash'
import fp from 'lodash/fp.js'
import {
  isNotNullPredicate,
  mapNotNullReduceOp,
  someCalculation,
  someTransform,
} from './common.mjs'

class KtSeqLodashImpl {
  constructor(wrapped) {
    this.wrapped = wrapped
    this.fns = []
  }
  sumBy(selector) {
    this.fns.push(fp.sumBy(selector))
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
    this.fns.push(fp.reduce(mapNotNullReduceOp(transform), []))
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
  return fp.pipe(fp.reduce(mapNotNullReduceOp(transform), []))(this)
}

Array.prototype.ktSumByLodash = function (selector) {
  return _.sumBy(this, selector)
}

Array.prototype.ktDistinctLodash = function () {
  return _.uniq(this)
}

export function lodashOneByOne(arr) {
  return _.sumBy(
    _.uniq(_.filter(_.map(arr, someTransform), isNotNullPredicate)),
    someCalculation,
  )
}

export function lodashOneByOneOpti(arr) {
  return _.sumBy(
    _.uniq(_.reduce(arr, mapNotNullReduceOp(someTransform), [])),
    someCalculation,
  )
}

export function lodashLazyChain(arr) {
  return _.chain(arr)
    .map(someTransform)
    .filter(isNotNullPredicate)
    .uniq()
    .sumBy(someCalculation)
    .value()
}

export function lodashLazyChainOpti(arr) {
  return _.chain(arr)
    .reduce(mapNotNullReduceOp(someTransform), [])
    .uniq()
    .sumBy(someCalculation)
    .value()
}

export function lodashFp(arr) {
  return fp.pipe(
    fp.map(someTransform),
    fp.filter(isNotNullPredicate),
    fp.uniq,
    fp.sumBy(someCalculation),
  )(arr)
}

export function lodashFpOpti(arr) {
  return fp.pipe(
    fp.reduce(mapNotNullReduceOp(someTransform), []),
    fp.uniq,
    fp.sumBy(someCalculation),
  )(arr)
}

export function arrayExtensionLodash(arr) {
  return arr
    .ktMapNotNullLodash(someTransform)
    .ktDistinctLodash()
    .map(someCalculation)
    .ktSumByLodash()
}

export function lazySeqLodashImpl(arr) {
  return arr
    .ktAsSequenceLodashImpl()
    .mapNotNull(someTransform)
    .distinct()
    .sumBy(someCalculation)
}
