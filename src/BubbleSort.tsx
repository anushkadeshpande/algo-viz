import NumberArray from "./components/data-structures/NumberArray";
import bubbleSort from "./utils/algorithms/sorting/bubbleSort";
import quickSort from "./utils/algorithms/sorting/quickSort";
import { useRef } from "react";

function BubbleSort({arr}: any) {
	const eventArrRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
	const eventArr = eventArrRef.current;
	
	return (
		<div>
			<h2>Bubble Sort:</h2>
			<NumberArray arr={arr} algorithm={bubbleSort} eventArr={eventArr} />
			<h2>Quick Sort:</h2>
			<NumberArray arr={arr} algorithm={quickSort} eventArr={eventArr} />
		</div>
	);
}

export default BubbleSort;
