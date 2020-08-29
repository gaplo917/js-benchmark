export const arrSize = process.env.ARR_SIZE

if (!arrSize) {
  throw new Error('missing SIZE environment variable')
}

export const arr = new Array(parseInt(arrSize))
  .fill(null)
  .map((value, index) => ({
    id: index,
    name: 'SomeName' + index,
    someNum: index % 2 ? null : (index * index) % (arrSize / 10),
  }))
export const someTransform = (it) => it.someNum
export const isNotNullPredicate = (it) => it !== null
export const someNumIsNotNull = (it) => it.someNum !== null
export const sumReducer = (acc, e) => acc + e
export const someCalculation = (it) => it * 2
export const mapNotNullReducer = (transform) => (acc, e) => {
  const transformed = transform(e)
  if (transformed !== null) {
    acc.push(transformed)
  }
  return acc
}
