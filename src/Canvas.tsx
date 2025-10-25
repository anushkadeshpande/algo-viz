import { useEffect, useRef } from "react";
import * as p5 from 'p5';

interface DraggableDivProps {
  width: number;
  height: number;
  backgroundColor: string;
}

const Canvas: React.FC<DraggableDivProps> = ({ width, height, backgroundColor }) => {

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      p.setup = () => {
        p.createCanvas(width, height);
        p.background(255);
      };

      p.mousePressed = () => {
        if (p.mouseX >= draggableDivRef.current!.offsetLeft && p.mouseX <= draggableDivRef.current!.offsetLeft + draggableDivRef.current!.offsetWidth &&
            p.mouseY >= draggableDivRef.current!.offsetTop && p.mouseY <= draggableDivRef.current!.offsetTop + draggableDivRef.current!.offsetHeight) {
          dragging = true;
          offsetX = p.mouseX - draggableDivRef.current!.offsetLeft;
          offsetY = p.mouseY - draggableDivRef.current!.offsetTop;
        }
      };

      p.mouseReleased = () => {
        dragging = false;
      };

      p.mouseDragged = () => {
        if (dragging) {
          draggableDivRef.current!.style.left = (p.mouseX - offsetX) + 'px';
          draggableDivRef.current!.style.top = (p.mouseY - offsetY) + 'px';
        }
      };
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      new p5(sketch, canvasElement);
    }
  }, [width, height]);

  // See annotations in JS for more information
  // const setup = (p5: p5Types, canvasParentRef: Element) => {
  //   let cnv = p5.createCanvas(window.screen.availWidth, window.screen.availHeight).parent(canvasParentRef);

    // cnv.mousePressed((event) => {
    //   console.log("Clicked on the canvas. Event:", event)
    // })
  // };

  // const draw = (p5: p5Types) => {
    // p5.background(0);
    // let ellipse: any = p5.ellipse(x, y, 70, 70);

    // ellipse.mousePressed((e) => {
    //   console.log(e)
    // })
    // x++;
    // y = y + 2;
    // if(y == window.screen.availHeight)
      // y = 50;
  // };



  return <div>
    {/* <div className="box" style={{height: "100px", width: "200px", background: "blue"}} ref={boxRef}></div> */}
    {/* <Sketch setup={setup} draw={draw} />; */}
    <div ref={canvasRef}></div>
      <div ref={draggableDivRef} style={{ position: 'absolute', width: `${width}px`, height: `${height}px`, backgroundColor: backgroundColor }}></div>

    </div>
}

export default Canvas