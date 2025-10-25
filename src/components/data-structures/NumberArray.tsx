import React, { useCallback, useEffect, useRef, useState } from "react";
import "./NumberArray.css";

const NumberArray = ({
  arr,
  algorithm,
  eventArr
}: {
  arr: Array<number>;
  algorithm: any;
  eventArr: any
}) => {
  const [array, setArray] = useState<number[]>(arr);
  const [changedIndices, setChangedIndices] = useState<number[]>(arr);
  const arrayRef = useRef<any>();
  // const [algo, setAlgo] = useState(algorithm)

  let i = 1;
  const swaps: any = []
  useEffect(() => {
    console.log(algorithm)
    // Clear the eventArr
    console.log([...eventArr])
    console.log(eventArr)
    // console.log(eventArr.length)
    if(eventArr && eventArr.length > 0) {
      eventArr.forEach((e: any) => {
        clearTimeout(e)
      });
    }
    // Create an instance of the generator function
    const sorter = algorithm(arr.slice());

    const iterateGenerator = (generator: Generator) => {
      // Proceed with the function execution, till the next yield
      // get the status of the function (whether it is done or not) and the return value in done and value
      const { done, value } = generator.next();

      // if the generator is not done yet
      if (!done) {

        // destructure the values yielded
        const { stepArray, swap }: { stepArray: number[]; swap: number[] } =
        value as { stepArray: number[]; swap: number[] };
        
        // if the swap param has 2 numbers
        if (swap.length > 1) {
          /* 
          * It was tough to make the generator code wait till the action was displayed on the dom
          * The generator used to do its action and exit and show the final result on the dom at the end
          * 
          * To overcome this problem, timeouts have been utilized
          * 
          * 1. An iterator variable `i` of type let was declared at the top level
          * 2. Created a block and incremented the value of i
          * 3. Added a setTimeout to perform the actual swap simulation on the DOM
          * This setTimeout will execute every step in 1s and to ensure this, a block has been created where the value of i is incremented. setTimeout will refer to the value of i in its parent block, and i being block scoped, every block will refer to a different i, with different value. This ensures that every simulation happens exactly 1s apart from each other
          * 
          * 
          * In a nutshell, the entire sorting is executed, the values are yielded and then the simulation begins.
          * 
          * TODO: What are the issues faced with extremely large inputs
          */
          {
            i++;
            eventArr.push(setTimeout(() => {
              swaps.push(swap)
              if(swaps.length - 1 > 0) {
                // something was swapped before this
                // remove the styles applied to the previous swap
                const previousSwaps = swaps[swaps.length-2]
                // console.log(previousSwaps)
                arrayRef.current.children[previousSwaps[0]].style.backgroundColor = "transparent";
                arrayRef.current.children[previousSwaps[1]].style.backgroundColor = "transparent";
              }
              arrayRef.current.children[swap[0]].style.backgroundColor = "rgb(244 114 182)";
              arrayRef.current.children[swap[1]].style.backgroundColor = "rgb(34 211 238)";
              [
                arrayRef.current.children[swap[0]].innerText,
                arrayRef.current.children[swap[1]].innerText,
              ] = [
                arrayRef.current.children[swap[1]].innerText,
                arrayRef.current.children[swap[0]].innerText,
              ];

            }, i * 1000))
          } 
          setChangedIndices(swap);
          iterateGenerator(generator);
        } else {
          // console.error("Unexpected value:", value);
        }
      }
    };

    iterateGenerator(sorter);
  }, [algorithm]);

  return (
    <>
      {/* <motion.div
        style={{ backgroundColor: "#000", height: "200px", width: "200px" }}
        className="box"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      /> */}
      {algorithm? 
      <div style={{ display: "flex" }} ref={arrayRef}>
        {array.map((element: number, idx: number) => (
          <div
            className="arrayElement font-bold"
            id={`arrayElement-${idx}`}
            key={idx}
            style={{
              height: "50px",
              width: "50px",
              border: "2px solid #fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {element}
          </div>
        ))}
      </div>
: ''}
    </>
  );
};

export default NumberArray;
