import { someCalculation, someTransform } from './common.mjs'

export function nativeStandard(arr) {
  const len = arr.length
  if (len === 0) {
    return 0
  }
  const set = new Set()
  let sum = 0
  for (let i = 0; i < len; i++) {
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
  const len = arr.length
  if (len === 0) {
    return 0
  }
  const set = new Set()
  let sum = 0
  let i = len - 1

  // because order is not important
  do {
    const e = someTransform(arr[i])
    if (e !== null) {
      const oriSize = set.size
      set.add(e)
      if (set.size !== oriSize) {
        sum += someCalculation(e)
      }
    }
  } while (i--) // leave when i equals to 0
  return sum
}
