import { someCalculation, someTransform } from './common.mjs'

// standard native iterator approach
class KtSeqNativeImpl {
  constructor(seq) {
    this.seq = seq
  }

  [Symbol.iterator]() {
    return this.seq[Symbol.iterator]()
  }

  sumBy(selector) {
    const iterator = this[Symbol.iterator]()
    let sum = 0
    let result = iterator.next()
    while (!result.done) {
      sum += selector(result.value)
      result = iterator.next()
    }
    return sum
  }

  mapNotNull(transform) {
    return new V3MapNotNullSeq(this, transform)
  }

  distinct() {
    return new V3DistinctSeq(this)
  }
}

class V3MapNotNullSeq extends KtSeqNativeImpl {
  constructor(seq, transform) {
    super(seq)
    this.transform = transform
  }

  [Symbol.iterator]() {
    const iterator = this.seq[Symbol.iterator]()
    const transform = this.transform

    return {
      next: function () {
        let result = iterator.next()

        while (!result.done) {
          let applied = transform(result.value)
          if (applied !== null) {
            return { value: applied, done: false }
          }
          result = iterator.next()
        }
        return { done: true }
      },
    }
  }
}

class V3DistinctSeq extends KtSeqNativeImpl {
  constructor(seq) {
    super(seq)
  }
  [Symbol.iterator]() {
    const cacheSet = new Set()
    const iterator = this.seq[Symbol.iterator]()

    return {
      next: function () {
        let result = iterator.next()
        while (!result.done) {
          let oriSize = cacheSet.size
          cacheSet.add(result.value)

          if (oriSize !== cacheSet.size) {
            return { value: result.value, done: false }
          } else {
            result = iterator.next()
          }
        }
        return { done: true }
      },
    }
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
