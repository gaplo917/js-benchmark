export const createArr = (size) =>
  new Array(size).fill(null).map((value, index) => ({
    id: index,
    name: 'SomeName' + index,
    // In this benchmark, we need stable duplicate elements for testing the distinct operation
    someNum: index % (size / 5),
  }))
export const someTransform = (it) => (it.someNum % 2 ? it.someNum : null)
export const someCalculation = (it) => it % 5

export const isNotNullPredicate = (it) => it !== null
export const sumReduceOp = (acc, e) => acc + e
export const sumByReduceOp = (selector) => (acc, e) => acc + selector(e)
export const mapNotNullReduceOp = (transform) => (acc, e) => {
  const transformed = transform(e)
  if (transformed !== null) {
    acc.push(transformed)
  }
  return acc
}
