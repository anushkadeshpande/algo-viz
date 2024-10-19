import React, { useCallback, useEffect, useRef, useState } from "react";
import "./NumberArray.css";

const NumberArray = ({
  arr,
  algorithm,
}: {
  arr: Array<number>;
  algorithm: any;
}) => {
  const [array, setArray] = useState<number[]>(arr);
  const [changedIndices, setChangedIndices] = useState<number[]>(arr);
  const arrayRef = useRef<any>();

  // const updateArray = (updatedArray: any) => {
  //   setTimeout(() => {
  //     console.log(updatedArray), 2000;
  //   });
  // };

  let i = 1;
  const swaps: any = []
  useEffect(() => {
    const sorter = algorithm(arr.slice()); // Create a copy for sorting

    const iterateGenerator = (generator: Generator) => {
      const { done, value } = generator.next();
      // console.log(done)
      

      if (!done) {
        const { stepArray, swap }: { stepArray: number[]; swap: number[] } =
        value as { stepArray: number[]; swap: number[] };
        console.log(stepArray)
        console.log(swap)
        if (swap.length > 1) {
          // const updatedArray = stepArray
          // setArray(prevState => {

          //   console.log("Swap" , swap)
          //   console.log("Previous state",  prevState);

          //   [prevState[swap[0]], prevState[swap[1]]] = [prevState[swap[1]], prevState[swap[0]]]
          //   console.log("Updated state",  prevState)
          //   console.log("Step Array" , stepArray);
          //   return prevState
          // });
          // console.log(stepArray);
          // console.log(arrayRef.current.children);
          {
            i++;
            setTimeout(() => {
              swaps.push(swap)
              if(swaps.length - 1 > 0) {
                // something was swapped before this
                // remove the styles applied to the previous swap
                const previousSwaps = swaps[swaps.length-2]
                // console.log(previousSwaps)
                arrayRef.current.children[previousSwaps[0]].style.backgroundColor = "#fff";
                arrayRef.current.children[previousSwaps[1]].style.backgroundColor = "#fff";
              }
              // console.log("swapped");
              // console.log(arrayRef.current.children[swap[0]])
              arrayRef.current.children[swap[0]].style.backgroundColor = "rgb(244 114 182)";
              arrayRef.current.children[swap[1]].style.backgroundColor = "rgb(34 211 238)";
              [
                arrayRef.current.children[swap[0]].innerText,
                arrayRef.current.children[swap[1]].innerText,
              ] = [
                arrayRef.current.children[swap[1]].innerText,
                arrayRef.current.children[swap[0]].innerText,
              ];

              // arrayRef.current.children[swap[0]].style.color = "black";
              // arrayRef.current.children[swap[1]].style.color = "black";

            }, i * 1000);
          } // setArray(() => {
          //   return stepArray})
          // updateArray(updatedArray)
          setChangedIndices(swap);
          iterateGenerator(generator);
        } else {
          // console.error("Unexpected value:", value);
        }
      }
    };

    iterateGenerator(sorter);
  }, []);

  return (
    <>
      {/* <motion.div
        style={{ backgroundColor: "#000", height: "200px", width: "200px" }}
        className="box"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      /> */}
      <div style={{ display: "flex" }} ref={arrayRef}>
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
    </>
  );
};

export default NumberArray;
