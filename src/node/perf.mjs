import Benchmark from 'benchmark'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import {
  arrayExtensionNativeFunctionalOperator,
  nativeFunctionalOperator,
  nativeFunctionalOperatorOpti,
  nativeReduceImperative,
} from './perf-impl/nativeFunctional.mjs'
import {
  arrayExtensionLodash,
  lazySeqLodashImpl,
  lodashFp,
  lodashFpOpti,
  lodashLazyChain,
  lodashLazyChainOpti,
  lodashOneByOne,
  lodashOneByOneOpti,
} from './perf-impl/lodashImpl.mjs'
import {
  arrayExtensionRamda,
  lazySeqRamdaImpl,
  ramdaPipe,
  ramdaPipeOpti,
} from './perf-impl/ramdaImpl.mjs'
import { arrayExtensionNative, lazySeqNativeImpl } from './perf-impl/native.mjs'
import { ideal, nativeStandard } from './perf-impl/ideal.mjs'
import { arr, arrSize } from './perf-impl/common.mjs'

const ans = nativeStandard(arr)
assert.strictEqual(ideal(arr), ans)
assert.strictEqual(nativeReduceImperative(arr), ans)
assert.strictEqual(nativeFunctionalOperator(arr), ans)
assert.strictEqual(nativeFunctionalOperatorOpti(arr), ans)
assert.strictEqual(lodashOneByOne(arr), ans)
assert.strictEqual(lodashOneByOneOpti(arr), ans)
assert.strictEqual(lodashLazyChain(arr), ans)
assert.strictEqual(lodashLazyChainOpti(arr), ans)
assert.strictEqual(lodashFp(arr), ans)
assert.strictEqual(lodashFpOpti(arr), ans)
assert.strictEqual(ramdaPipe(arr), ans)
assert.strictEqual(ramdaPipeOpti(arr), ans)
assert.strictEqual(arrayExtensionNative(arr), ans)
assert.strictEqual(arrayExtensionNativeFunctionalOperator(arr), ans)
assert.strictEqual(arrayExtensionLodash(arr), ans)
assert.strictEqual(arrayExtensionRamda(arr), ans)
assert.strictEqual(lazySeqNativeImpl(arr), ans)
assert.strictEqual(lazySeqLodashImpl(arr), ans)
assert.strictEqual(lazySeqRamdaImpl(arr), ans)

Benchmark.options.initCount = 5
Benchmark.options.minSamples = process.env.MIN_SAMPLE || 200

const suite = new Benchmark.Suite('Standard Array Processing')
// add tests
suite
  .add('native-ideal-while', function () {
    ideal(arr)
  })
  .add('native-standard-for-loop', function () {
    nativeStandard(arr)
  })
  .add('native-fp', function () {
    nativeFunctionalOperator(arr)
  })
  .add('native-fp-optimized', function () {
    nativeFunctionalOperatorOpti(arr)
  })
  .add('native-fp-reduce-imperative', function () {
    nativeReduceImperative(arr)
  })
  .add('lodash-one-by-one', function () {
    lodashOneByOne(arr)
  })
  .add('lodash-one-by-one-optimized', function () {
    lodashOneByOneOpti(arr)
  })
  .add('lodash-lazy-chain', function () {
    lodashLazyChain(arr)
  })
  .add('lodash-lazy-chain-optimized', function () {
    lodashLazyChainOpti(arr)
  })
  .add('lodash-fp', function () {
    lodashFp(arr)
  })
  .add('lodash-fp-optimized', function () {
    lodashFpOpti(arr)
  })
  .add('ramda', function () {
    ramdaPipe(arr)
  })
  .add('ramda-optimized', function () {
    ramdaPipeOpti(arr)
  })
  .add('array-ext-native', function () {
    arrayExtensionNative(arr)
  })
  .add('array-ext-native-fp-optimized', function () {
    arrayExtensionNativeFunctionalOperator(arr)
  })
  .add('array-ext-lodash-optimized', function () {
    arrayExtensionLodash(arr)
  })
  .add('array-ext-ramda-optimized', function () {
    arrayExtensionRamda(arr)
  })
  .add('lazy-sequence-native', function () {
    lazySeqNativeImpl(arr)
  })
  .add('lazy-sequence-lodash-optimized', function () {
    lazySeqLodashImpl(arr)
  })
  .add('lazy-sequence-ramda-optimized', function () {
    lazySeqRamdaImpl(arr)
  })
  // add listeners
  .on('start', function () {
    console.log(`${this.name} ARR_SIZE=${arrSize}`)
  })
  .on('cycle', function (event) {
    const currentBench = event.target
    const benchName = currentBench.name

    console.log(String(currentBench))

    const outputDir = path.resolve('./benchmark')
    const resultPath = `${outputDir}/result.json`
    const result = JSON.parse(
      String(fs.readFileSync(resultPath, { encoding: 'utf-8' })),
    )

    const record = result.find((it) => it.benchmark === benchName) || {
      benchmark: null,
      results: [],
    }

    const filteredResults = record.results.filter((it) => it.size !== arrSize)

    const overwriteRecord = {
      ...record,
      results: [...filteredResults, { size: arrSize, hz: currentBench.hz }],
      benchmark: benchName,
    }

    const filtered = result.filter((it) => it.benchmark !== benchName)

    const overwriteResult = [...filtered, overwriteRecord].sort(
      (it) => it.benchmark,
    )

    fs.writeFileSync(resultPath, JSON.stringify(overwriteResult, null, 2))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: false })
