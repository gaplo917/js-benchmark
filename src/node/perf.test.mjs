import assert from 'assert'
import { ideal, nativeStandard } from './perf-impl/ideal.mjs'
import { createArr } from './perf-impl/common.mjs'
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

for (const size of [1, 10, 100, 1000, 10000, 100000, 100000]) {
  const arr = createArr(size)
  const ans = nativeStandard(arr)
  console.log(`when size=${size}, ans=${ans}`)
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
}
