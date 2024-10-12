import React, { useEffect, useState } from "react";
import './NumberArray.css'

const NumberArray = ({ arr, algorithm }: { arr: Array<number>; algorithm: any }) => {
  const [array, setArray] = useState<number[]>(arr);
  const [changedIndices, setChangedIndices] = useState<number[]>(arr);

  // function iterateGenerator(generator: Generator) {
  //   const { done, value } = generator.next();

  //   if (!done) {
  //     if (typeof value !== "string") {
  //       const arrayValue = value as number[];
  //       console.log("Swapping", value);
  //       setArray(arrayValue);

  //     }
  //     iterateGenerator(generator);
  //   } else {
  //     setArray(array);
  //   }
  // }

  // useEffect(() => {

  //   const sorter = algorithm(arr);
  //   iterateGenerator(sorter);
  // }, []);
  useEffect(() => {
    const sorter = algorithm(arr.slice()); // Create a copy for sorting

    const iterateGenerator = (generator: Generator) => {
      const { done, value } = generator.next();

      const { array, swap }: { array: number[]; swap: number[] } = value as { array: number[]; swap: number[] };

      if (!done) {
        if (swap.length > 1) {
          console.log(value)
          setArray(array);
          setChangedIndices(swap);
          iterateGenerator(generator);
        } else {
          // console.error("Unexpected value:", value);
        }
      }
    };

    iterateGenerator(sorter);
  }, []);

  // useEffect(() => {
    // const previousArray = previousArrayRef.current;
    // const changedIndices = [];

    // for (let i = 0; i < array.length; i++) {
    //   if (array[i] !== previousArray[i]) {
    //     changedIndices.push(i);
    //   }
    // }

    // previousArrayRef.current = array.slice();

    // Trigger rerender with animation
  //   changedIndices.forEach((index) => {
  //     // Apply animation to the element at index
  //     const element = document.getElementById(`arrayElement-${index}`);
  //     if (element) {
  //       element.classList.add("animate-swap");
  //       setTimeout(() => {
  //         element.classList.remove("animate-swap");
  //       }, 500); // Adjust animation duration as needed
  //     }
  //   });
  // }, [array]);

  // const animationPromise = new Promise((resolve) => {
  //   const element = document.getElementById('yourElementId');
  //   element?.addEventListener('animationend', resolve);
  // });

  return (
    <div style={{ display: "flex" }}>
      {array.map((element: number, idx: number) => (
        <div
          className="arrayElement"
          id={`arrayElement-${idx}`}
          key={idx}
          style={{
            height: "40px",
            width: "40px",
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {element}
        </div>
      ))}
    </div>
  );
};

export default NumberArray;
