export function nativeStandard(arr) {
  const set = new Set()
  let sum = 0
  for (let i = 0, len = arr.length; i < len; i++) {
    const e = arr[i].someNum
    if (e !== null) {
      const oriSize = set.size
      set.add(e)
      if (set.size !== oriSize) {
        sum += e * 2
      }
    }
  }
  return sum
}

export function nativeIdeal(arr) {
  const set = new Set()
  let sum = 0
  let i = arr.length - 1

  // because order is not important
  while (i--) {
    const e = arr[i].someNum
    if (e !== null) {
      const oriSize = set.size
      set.add(e)
      if (set.size !== oriSize) {
        sum += e * 2
      }
    }
  }
  return sum
}
