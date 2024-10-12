import NumberArray from "./components/NumberArray";
import bubbleSort from "./utils/bubbleSort";

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
			<NumberArray arr={arr} algorithm={bubbleSort} />
		</div>
	);
}

export default BubbleSort;
