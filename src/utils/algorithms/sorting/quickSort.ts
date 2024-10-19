function* quickSort(arr: Array<number>, low = 0, high = arr.length - 1): any {
  if (low < high) {
    const pivot = arr[high];

    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {stepArray: arr, swap: [i, j]}
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i+1]];
    yield {stepArray: arr, swap: [i+1, high]}

    const pi = i + 1;

    yield * quickSort(arr, low, pi - 1);
    yield * quickSort(arr, pi + 1, high);
  }
}

export default quickSort;