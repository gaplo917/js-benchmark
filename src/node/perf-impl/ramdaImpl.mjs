import R from 'ramda'

import {
  arr,
  mapNotNullReducer,
  someCalculation,
  someNumIsNotNull,
  someTransform,
} from './common.mjs'

class KtSeqRamdaImpl {
  constructor(wrapped) {
    this.wrapped = wrapped
    this.fns = []
  }
  sum() {
    this.fns.push(R.sum)
    return R.pipe(...this.fns)(this.wrapped)
  }

  map(transform) {
    this.fns.push(R.map(transform))
    return this
  }

  filterNotNull(predicate) {
    this.fns.push(R.filter(predicate))
    return this
  }

  mapNotNull(transform) {
    this.fns.push(R.reduce(mapNotNullReducer(transform), []))
    return this
  }

  distinct() {
    this.fns.push(R.uniq)
    return this
  }
}

Array.prototype.ktAsSequenceRamdaImpl = function () {
  return new KtSeqRamdaImpl(this)
}

Array.prototype.ktMapNotNullRamda = function (tranform) {
  return R.pipe(R.reduce(mapNotNullReducer(tranform), []))(this)
}

Array.prototype.ktSumRamda = function () {
  return R.sum(this)
}

Array.prototype.ktDistinctRamda = function () {
  return R.uniq(this)
}

export function ramdaCompose() {
  return calSumR(arr)
}

export function ramdaComposeOpti() {
  return calSumROpti(arr)
}

export function arrayExtensionRamda() {
  return arr
    .ktMapNotNullRamda(someTransform)
    .ktDistinctRamda()
    .map(someCalculation)
    .ktSumRamda()
}

export function lazySeqRamdaImpl() {
  return arr
    .ktAsSequenceRamdaImpl()
    .mapNotNull(someTransform)
    .distinct()
    .map(someCalculation)
    .sum()
}

const calSumR = R.pipe(
  R.filter(someNumIsNotNull),
  R.map(someTransform),
  R.uniq,
  R.map(someCalculation),
  R.sum,
)

const calSumROpti = R.pipe(
  R.reduce(mapNotNullReducer(someTransform), []),
  R.uniq,
  R.map(someCalculation),
  R.sum,
)
