import Benchmark from 'benchmark'
import assert from 'assert'
import {
  arrayExtensionNativeFunctionalOperator,
  nativeFunctionalOperator,
  nativeFunctionalOperatorOpti,
} from './perf-impl/nativeFunctional.mjs'
import {
  arrayExtensionLodash,
  lazySeqLodashImpl,
  lodashChain,
  lodashChainOpti,
  lodashFp,
  lodashOneByOne,
} from './perf-impl/lodashImpl.mjs'
import {
  arrayExtensionRamda,
  lazySeqRamdaImpl,
  ramdaCompose,
  ramdaComposeOpti,
} from './perf-impl/ramdaImpl.mjs'
import { arrayExtensionRaw, lazySeqRawImpl } from './perf-impl/raw.mjs'
import { ideal } from './perf-impl/ideal.mjs'
import { arrSize } from './perf-impl/common.mjs'
const suite = new Benchmark.Suite()

const ans = ideal()
assert.ok(ideal() === ans)
assert.ok(nativeFunctionalOperator() === ans)
assert.ok(nativeFunctionalOperatorOpti() === ans)
assert.ok(lodashOneByOne() === ans)
assert.ok(lodashChain() === ans)
assert.ok(lodashChainOpti() === ans)
assert.ok(lodashFp() === ans)
assert.ok(ramdaCompose() === ans)
assert.ok(ramdaComposeOpti() === ans)
assert.ok(arrayExtensionRaw() === ans)
assert.ok(arrayExtensionNativeFunctionalOperator() === ans)
assert.ok(arrayExtensionLodash() === ans)
assert.ok(arrayExtensionRamda() === ans)
assert.ok(lazySeqRamdaImpl() === ans)
assert.ok(lazySeqLodashImpl() === ans)
assert.ok(lazySeqRawImpl() === ans)

// add tests
suite
  .add(`ideal`, function () {
    ideal()
  })
  .add(`nativeFunctionalOperator`, function () {
    nativeFunctionalOperator()
  })
  .add(`nativeFunctionalOperatorOpti`, function () {
    nativeFunctionalOperatorOpti()
  })
  .add(`lodashOneByOne`, function () {
    lodashOneByOne()
  })
  .add(`lodashChain`, function () {
    lodashChain()
  })
  .add(`lodashChainOpti`, function () {
    lodashChainOpti()
  })
  .add(`lodashFp`, function () {
    lodashFp()
  })
  .add(`ramdaCompose`, function () {
    ramdaCompose()
  })
  .add(`ramdaComposeOpti`, function () {
    ramdaComposeOpti()
  })
  .add(`arrayExtensionRaw`, function () {
    arrayExtensionRaw()
  })
  .add(`arrayExtensionNativeFunctionalOperator`, function () {
    arrayExtensionNativeFunctionalOperator()
  })
  .add(`arrayExtensionLodashImpl`, function () {
    arrayExtensionLodash()
  })
  .add(`arrayExtensionRamdaImpl`, function () {
    arrayExtensionRamda()
  })
  .add(`lazySeqRawImpl`, function () {
    lazySeqRawImpl()
  })
  .add(`lazySeqLodashImpl`, function () {
    lazySeqLodashImpl()
  })
  .add(`lazySeqRamdaImpl`, function () {
    lazySeqRamdaImpl()
  })
  // add listeners
  .on('start', function () {
    console.log(`Starting ARR_SIZE=${arrSize} benchmark`)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: false })
