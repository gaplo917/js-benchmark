import fs from 'fs'
import path from 'path'

const fnHeader = `import { sample } from '../data'`

function genIdealJs(numOfFunction) {
  const fn = `
const calSum = (arr) => {
  let sum = 0
  for (const a of arr) {
    if (a.money !== null) {
      sum += a.money * 2
    }
  }
  return sum
}
    `
  const fnTemplate = `calSum(arr)`

  const fnStr = new Array(numOfFunction).fill(fnTemplate).join('\n')

  fs.writeFileSync(
    path.resolve(`./src/generated/ideal-${numOfFunction}.js`),
    `${fnHeader}\n${fn}\n${fnStr}`,
  )
}
const random = () => '_' + Math.random().toString(36).substring(4) // assume the random variable name is so random

function genNativeMapFilterReduce(numOfFunction) {
  const fn = ``
  const fnTemplate = () => {
    const r1 = random()
    const r2 = random()
    const r3 = random()
    const r4 = random()
    // webpack should rename it for better gzip, let see if it is work
    return `arr.filter(${r1} => ${r1}.money !== null).map(${r2} => ${r2}.money * 2).reduce((${r4}, ${r3}) => ${r4} + ${r3}, 0)`
  }

  const fnStr = new Array(numOfFunction).fill(fnTemplate()).join('\n')

  fs.writeFileSync(
    path.resolve(`./src/generated/nativeMapFilterReduce-${numOfFunction}.js`),
    `${fnHeader}\n${fn}\n${fnStr}`,
  )
}

function genArrayExt(numOfFunction) {
  const fn = `
Array.prototype.ktMapNotNull = function (predicate) {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = transform(this[i])
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktSum = function () {
  let sum = 0
  for (let i = 0, len = this.length; i < len; i++) {
    sum += this[i]
  }
  return sum
}
  `
  const fnTemplate = () => {
    const r1 = random()
    const r2 = random()
    return `arr.ktMapNotNull(${r1} => ${r1}.money).map(${r2} => ${r2} * 2).ktSum()`
  }

  const fnStr = new Array(numOfFunction).fill(fnTemplate()).join('\n')

  fs.writeFileSync(
    path.resolve(`./src/generated/array-ext-${numOfFunction}.js`),
    `${fnHeader}\n${fn}\n${fnStr}`,
  )
}

const numOfFunctions = [1, 10, 100, 1000, 10000]
numOfFunctions.forEach(genIdealJs)
numOfFunctions.forEach(genNativeMapFilterReduce)
numOfFunctions.forEach(genArrayExt)
