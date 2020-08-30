import fs from 'fs'
import path from 'path'

const myArgs = process.argv.slice(2)

const jsonPath = path.resolve(myArgs[0])

const result = JSON.parse(
  String(fs.readFileSync(jsonPath, { encoding: 'utf-8' })),
)

const csvArr = result.reduce((acc, e, index) => {
  const { benchmark, results } = e
  if (index === 0) {
    acc.push(['', ...results.map((it) => it.size)])
  }
  acc.push([benchmark, ...results.map((it) => it.hz)])
  return acc
}, [])

function transpose(a) {
  return Object.keys(a[0]).map((c) => {
    return a.map((r) => r[c])
  })
}

const csvStr = csvArr.map((it) => it.join(',')).join('\n')
const csvT = transpose(csvArr)
const csvStrT = csvT.map((it) => it.join(',')).join('\n')

fs.writeFileSync(path.resolve('./output/result.csv'), csvStr)
fs.writeFileSync(path.resolve('./output/result-t.csv'), csvStrT)
