import Sketch from "react-p5";

function BubbleSort() {
	let i = 0;
	let j = 0;

	const values: any = [];

	const bubbleSort = (p5: any) => {
		for (let k = 0; k < 8; k++) {
			if (i < values.length) {
				const temp: any = values[j];
				if (values[j] > values[j + 1]) {
					values[j] = values[j + 1];
					values[j + 1] = temp;
				}
				j++;

				if (j >= values.length - i - 1) {
					j = 0;
					i++;
				}
			} else {
				p5.noLoop();
			}
		}
	};

	const simulateSorting = (p5: any) => {
		for (let i = 0; i < values.length; i++) {
			p5.stroke(100, 143, 143);
			p5.fill(50);
			p5.rect(i * 8, p5.height, 8, -values[i], 20);
		}
	};

	const setup = (p5: any, canvasParentRef: any) => {
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);

		//p5.createCanvas(720, 400).parent(canvasParentRef);

		//p5.frameRate(React.Component.frameRate);
		// use parent to render canvas in this ref (without that p5 render this canvas outside your component)
		for (let i = 0; i < 30; i++) {
			values.push(p5.random(p5.height));
		}

		p5.frameRate(120);
	};

	const draw = (p5: any) => {
		p5.background(220);
		bubbleSort(p5);
		simulateSorting(p5);
	};

	return (
		<div>
			<Sketch setup={setup} draw={draw} />
		</div>
	);
}

export default BubbleSort;
