import { someCalculation, someTransform } from './common.mjs'

export function nativeStandard(arr) {
  const set = new Set()
  let sum = 0
  for (let i = 0, len = arr.length; i < len; i++) {
    const e = someTransform(arr[i])
    if (e !== null) {
      const oriSize = set.size
      set.add(e)
      if (set.size !== oriSize) {
        sum += someCalculation(e)
      }
    }
  }
  return sum
}

export function ideal(arr) {
  const set = new Set()
  let sum = 0
  let i = arr.length - 1

  // because order is not important
  while (i--) {
    const e = someTransform(arr[i])
    if (e !== null) {
      const oriSize = set.size
      set.add(e)
      if (set.size !== oriSize) {
        sum += someCalculation(e)
      }
    }
  }
  return sum
}
