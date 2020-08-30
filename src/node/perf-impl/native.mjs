import {
  isNotNullPredicate,
  someCalculation,
  someTransform,
  sumByReduceOp,
  sumReduceOp,
} from './common.mjs'

class KtSeqNativeImpl {
  constructor(wrapped) {
    this.wrapped = wrapped
    this.fns = []
  }

  resolve() {
    // assume the final functions must be an aggregation
    let result = this.fns[this.fns.length - 1].initial
    for (let i = 0, len = this.wrapped.length; i < len; i++) {
      let value = this.wrapped[i]
      for (let j = 0, len2 = this.fns.length; j < len2; j++) {
        const fn = this.fns[j]
        // 0:filter, 1: transform, 2:aggregate
        if (fn.__mode === 0) {
          if (!fn.apply(value)) {
            // if filtered, then all sub-sequence fn don't need to apply
            // break the for-function-loop
            break
          }
        } else if (fn.__mode === 1) {
          value = fn.apply(value)
        } else if (fn.__mode === 2) {
          if (!result) {
            // no initial value, use the first element
            result = value
          } else {
            result = fn.apply(result, value)
          }
        }
      }
    }
    return result
  }

  sumBy(selector) {
    this.fns.push({
      __mode: 2,
      apply: sumByReduceOp(selector),
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

Array.prototype.ktAsSequenceNativeImpl = function () {
  return new KtSeqNativeImpl(this)
}

Array.prototype.ktFilterNotNullNative = function () {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = this[i]
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktMapNotNullNative = function (transform) {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = transform(this[i])
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktDistinctNative = function () {
  return Array.from(new Set(this))
}

Array.prototype.ktSumByNative = function (selector) {
  let sum = 0
  for (let i = 0, len = this.length; i < len; i++) {
    sum += selector(this[i])
  }
  return sum
}

export function arrayExtensionNative(arr) {
  return arr
    .ktMapNotNullNative(someTransform)
    .ktDistinctNative()
    .ktSumByNative(someCalculation)
}

export function lazySeqNativeImpl(arr) {
  return arr
    .ktAsSequenceNativeImpl()
    .mapNotNull(someTransform)
    .distinct()
    .sumBy(someCalculation)
}
