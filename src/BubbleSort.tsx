import NumberArray from "./components/NumberArray";
import bubbleSort from "./utils/algorithms/sorting/bubbleSort";
import quickSort from "./utils/algorithms/sorting/quickSort";

function BubbleSort({arr}: any) {
	// console.log(Array.props.children)
	// const arr = Array?.props?.childern
	// console.log(Array)
	// if(arr) {
	// 	// arr[0] = 0
	// 	bubbleSort(arr)
	// }
	return (
		<div>
			<h2>Bubble Sort:</h2>
			<NumberArray arr={arr} algorithm={bubbleSort} />
			<h2>Quick Sort:</h2>
			<NumberArray arr={arr} algorithm={quickSort} />
		</div>
	);
}

export default BubbleSort;
