import { sample as arr } from '../data'

const calSum = (arr) => {
  let sum = 0
  for (const a of arr) {
    if (a.money !== null) {
      sum += a.money * 2
    }
  }
  return sum
}
    
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
calSum(arr)
console.log(calSum(arr))