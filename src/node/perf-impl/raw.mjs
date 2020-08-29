import {
  arr,
  isNotNullPredicate,
  someCalculation,
  someTransform,
} from './common.mjs'

class KtSeqRawImpl {
  constructor(wrapped) {
    this.wrapped = wrapped
    this.fns = []
  }

  resolve() {
    let result = null
    for (let i = 0, len = this.wrapped.length; i < len; i++) {
      let value = this.wrapped[i]
      let filtered = false
      for (let j = 0, len2 = this.fns.length; j < len2; j++) {
        const fn = this.fns[j]
        switch (fn.__mode) {
          case 0: // filter
            if (!fn.apply(value)) {
              filtered = true
            }
            break
          case 1: // transform
            value = fn.apply(value)
            break
          case 2: // aggregate
            if (result === null && fn.initial) {
              result = fn.apply(fn.initial, value)
            } else {
              result = fn.apply(result, value)
            }
        }
        if (filtered) {
          // if filtered, then all sub-sequence fn don't need to apply
          break
        }
      }
    }
    return result
  }

  sum() {
    this.fns.push({
      __mode: 2,
      apply: (acc, e) => acc + e,
      initial: 0,
    })
    return this.resolve()
  }

  map(transform) {
    this.fns.push({
      __mode: 1,
      apply: transform,
    })
    return this
  }

  filterNotNull() {
    this.fns.push({
      __mode: 0,
      apply: isNotNullPredicate,
    })
    return this
  }

  mapNotNull(transform) {
    this.fns.push({
      __mode: 1,
      apply: transform,
    })
    return this.filterNotNull()
  }

  distinct() {
    const set = new Set()
    this.fns.push({
      __mode: 0,
      apply: (t) => {
        const oriSize = set.size
        set.add(t)
        return oriSize !== set.size
      },
    })
    return this
  }
}

Array.prototype.ktAsSequenceRawImpl = function () {
  return new KtSeqRawImpl(this)
}

Array.prototype.ktFilterNotNullRaw = function () {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = this[i]
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktMapNotNullRaw = function (transform) {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = transform(this[i])
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktDistinctRaw = function () {
  const set = new Set()
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = this[i]
    const oriSize = set.size
    set.add(e)
    if (set.size !== oriSize) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktSumRaw = function () {
  let sum = 0
  for (let i = 0, len = this.length; i < len; i++) {
    sum += this[i]
  }
  return sum
}

export function arrayExtensionRaw() {
  return arr
    .ktMapNotNullRaw(someTransform)
    .ktDistinctRaw()
    .map(someCalculation)
    .ktSumRaw()
}

export function lazySeqRawImpl() {
  return arr
    .ktAsSequenceRawImpl()
    .mapNotNull(someTransform)
    .distinct()
    .map(someCalculation)
    .sum()
}
