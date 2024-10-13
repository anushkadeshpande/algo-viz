import React, { useCallback, useEffect, useRef, useState } from "react";
import "./NumberArray.css";
import { motion } from "framer-motion";

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

  const updateArray = (updatedArray: any) => {
    setTimeout(() => {
      console.log(updatedArray), 2000;
    });
  };

  let i = 1;
  useEffect(() => {
    const sorter = algorithm(arr.slice()); // Create a copy for sorting

    const iterateGenerator = (generator: Generator) => {
      const { done, value } = generator.next();

      const { stepArray, swap }: { stepArray: number[]; swap: number[] } =
        value as { stepArray: number[]; swap: number[] };

      if (!done) {
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
          console.log(stepArray);
          // console.log(arrayRef.current.children);
          {
            i++;
            setTimeout(() => {
              console.log("swapped");
              console.log(arrayRef.current.children[swap[0]])
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

            }, i * 2000);
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
