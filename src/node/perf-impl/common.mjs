export const arrSize = parseInt(process.env.ARR_SIZE)

if (!arrSize) {
  throw new Error('missing ARR_SIZE environment variable')
}

export const arr = new Array(arrSize).fill(null).map((value, index) => ({
  id: index,
  name: 'SomeName' + index,
  // In this benchmark, we need:
  //  1. stable null elements for testing the mapNotNull operation
  //  2. stable duplicate elements for testing the distinct operation
  // Assume the arrSize are in [1, 10, 100, 1000, 10000, 100000, 1000000]
  someNum: index % 2 ? null : index % (arrSize / 5),
}))
export const targetProp = 'someNum'
export const someTransform = (it) => it.someNum
export const isNotNullPredicate = (it) => it !== null
export const someNumIsNotNull = (it) => it.someNum !== null
export const sumReduceOp = (acc, e) => acc + e
export const sumByReduceOp = (selector) => (acc, e) => acc + selector(e)
export const someCalculation = (it) => it * 2
export const mapNotNullReduceOp = (transform) => (acc, e) => {
  const transformed = transform(e)
  if (transformed !== null) {
    acc.push(transformed)
  }
  return acc
}
