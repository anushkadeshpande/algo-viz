const SwapAnimation = ({element1, element2}: any) => {
  element1.addEventListener("swap", () => {
    [element2.innerText, element1.innerText] = [element1.innerText, element2.innerText]
  });
}

export default SwapAnimation