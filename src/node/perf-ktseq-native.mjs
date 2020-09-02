import assert from 'assert'
import Benchmark from 'benchmark'
import {
  createArr,
  isNotNullPredicate,
  someCalculation,
  someTransform,
  sumByReduceOp,
} from './perf-impl/common.mjs'

const arrSize = parseInt(process.env.ARR_SIZE)

if (!arrSize) {
  throw new Error('missing ARR_SIZE environment variable')
}
const setOperationSuite = new Benchmark.Suite('KtSeqNative Operation')

// simple for iteration + fn declaration
// only support single termination operator
class V1 {
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
          if (result === undefined) {
            // no initial value, use the first element
            result = value || null
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

// sosad, trying to optimize v1 for the distinct, ugly
class V2 {
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
          if (result === undefined) {
            // no initial value, use the first element
            result = value || null
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
    this.fns.push({
      __mode: 2,
      apply: (acc, e) => acc.add(e),
      initial: new Set(),
    })
    return new V2(Array.from(this.resolve()))
  }
}

// standard native iterator approach
class V3Seq {
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

class V3MapNotNullSeq extends V3Seq {
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

class V3DistinctSeq extends V3Seq {
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

Array.prototype.ktAsSequenceNativeV1Impl = function () {
  return new V1(this)
}
Array.prototype.ktAsSequenceNativeV2Impl = function () {
  return new V2(this)
}

Array.prototype.ktAsSequenceNativeV3Impl = function () {
  return new V3Seq(this)
}

function v1(arr) {
  return arr
    .ktAsSequenceNativeV1Impl()
    .mapNotNull(someTransform)
    .distinct()
    .sumBy(someCalculation)
}

function v2(arr) {
  return arr
    .ktAsSequenceNativeV2Impl()
    .mapNotNull(someTransform)
    .distinct()
    .sumBy(someCalculation)
}

function v3(arr) {
  return arr
    .ktAsSequenceNativeV3Impl()
    .mapNotNull(someTransform)
    .distinct()
    .sumBy(someCalculation)
}

const arr = createArr(arrSize)
const ans = v1(arr)
assert.strictEqual(v2(arr), ans)
assert.strictEqual(v3(arr), ans)

setOperationSuite
  .add('version 1, use filter operation to do distinct', function () {
    v1(arr)
  })
  .add('version 2, use aggregate operation to do distinct', function () {
    v2(arr)
  })
  .add('version 3, use iterator', function () {
    v3(arr)
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
