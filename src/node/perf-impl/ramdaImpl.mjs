import R from 'ramda'

import {
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
    // sosad, R.pipe not accept array value, but `fns` size is very small that is negligible in large array size
    // but it is shameful to write in this way.
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

export function ramdaPipe(arr) {
  return R.pipe(
    R.filter(someNumIsNotNull),
    R.map(someTransform),
    R.uniq,
    R.map(someCalculation),
    R.sum,
  )(arr)
}

export function ramdaPipeOpti(arr) {
  return R.pipe(
    R.reduce(mapNotNullReducer(someTransform), []),
    R.uniq,
    R.map(someCalculation),
    R.sum,
  )(arr)
}

export function arrayExtensionRamda(arr) {
  return arr
    .ktMapNotNullRamda(someTransform)
    .ktDistinctRamda()
    .map(someCalculation)
    .ktSumRamda()
}

export function lazySeqRamdaImpl(arr) {
  return arr
    .ktAsSequenceRamdaImpl()
    .mapNotNull(someTransform)
    .distinct()
    .map(someCalculation)
    .sum()
}
