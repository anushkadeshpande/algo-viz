function* bubbleSort(arr: Array<number>): IterableIterator<string | any> {
  // const arr = [1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]
console.log(arr)
  for(let i=arr.length; i>0; i--) {
    for(let j=0; j<i-1; j++) {
      if(arr[j] > arr[j+1]) {
        [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
        yield {array: arr, swap: [j, j+1]}
      }
    }
  }

  yield {array: arr, swap: [0]}
  console.log(arr)
}


export default bubbleSort