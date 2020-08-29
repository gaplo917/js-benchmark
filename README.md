# Js playground
Just want to test something.

### Installation

```
yarn install
```

### Start the benchmark

```
# set ARR_SIZE=100 in environment variable
ARR_SIZE=100 yarn start

# Or
yarn start-all
```

### Start Webpack bundle test

```
yarn webpack-test

# check to see if it is working in the node
node build/js/ideal-1.js
node build/js/array-ext-1.js
node build/js/nativeMapFilterReduce-1.js
```
