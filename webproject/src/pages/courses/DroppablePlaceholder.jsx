import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useDrop } from 'react-dnd';
import Outside from './Outside';

function calculateBoundingRect(obj) {
  // Use default values if properties are missing
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);

  // If there is a rotation angle, compute the axis-aligned bounding box
  if (obj.angle) {
    const rad = obj.angle * Math.PI / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const bboxWidth = width * cos + height * sin;
    const bboxHeight = width * sin + height * cos;
    // Adjust left and top to center the rotated bounding box over the original object
    return {
      left: left - (bboxWidth - width) / 2,
      top: top - (bboxHeight - height) / 2,
      width: bboxWidth,
      height: bboxHeight
    };
  }
  return { left, top, width, height };
}


function renderOutsideElement(obj, styles, children) {
  const overlay = document.getElementById("overlay-content");
  if (!overlay) {
    console.error('Container with id "overlay-content" not found.');
    return;
  }

  console.log(obj);

  let htmlElem;
    if (obj.type === "image" && obj._element && obj._element.src) {
      htmlElem = document.createElement("img");
      htmlElem.src = obj._element.src;
      htmlElem.style.objectFit = "cover";
    } else {
      htmlElem = document.createElement("div");
      // Example styling for non-image objects.
      htmlElem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    }


    // Get the Fabric object's bounding rectangle.
    const bounds = calculateBoundingRect(obj);
    
    // Position and size the HTML element to match the Fabric object.
    htmlElem.style.position = "absolute";
    htmlElem.style.left = bounds.left + "px";
    htmlElem.style.top = bounds.top + "px";
    htmlElem.style.width = bounds.width + "px";
    htmlElem.style.height = bounds.height + "px";
    Object.entries(styles).forEach(([prop, value]) => {
      htmlElem.style[prop] = value;
    });

    // Apply rotation if the object is rotated.
    if (obj.angle) {
      htmlElem.style.transform = `rotate(${obj.angle}deg)`;
      htmlElem.style.transformOrigin = "center";
    }
    
    // Enable pointer events for drag-and-drop functionality.
    htmlElem.style.pointerEvents = "auto";
    // Optionally, add a class for additional styling or event handling.
    htmlElem.classList.add("canvas-clone");
    htmlElem.id = obj.id;
    if (children) htmlElem.innerHTML = children;
    // Append the HTML element to the overlay container.
    overlay.appendChild(htmlElem);

}


const DroppablePlaceholder = ({ id, element, answer, showAnswer}) => {
  // const [{ isOver, canDrop }, drop] = useDrop(() => ({
  //   accept: ItemTypes.OPTION,
  //   drop: (item) => {
  //     onDrop(index, item);
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }));
  console.log(element);
  const {setNodeRef, isOver} = useDroppable({
    id
  });

  const bounds = calculateBoundingRect(element);
  console.log(bounds);

  // Define common styles using the calculated bounds.
  const commonStyle = {
    position: 'absolute',
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    border: '2px dashed gray',
    backgroundColor: (isOver || answer) ? 'lightgreen' : 'white',
    zIndex: 10,
    transform: element.angle ? `rotate(${element.angle}deg)` : undefined,
    transformOrigin: element.angle ? 'center' : undefined,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  if (element.type === 'image' && element._element && element._element.src) {
    return (
      <img
        id={id}
        ref={setNodeRef}
        src={element._element.src}
        alt=""
        style={{ ...commonStyle, objectFit: 'cover' }}
      />
    );
  } else {
    console.log(answer);
    return (
      <div id={id} ref={setNodeRef} style={commonStyle}>
        {answer && showAnswer && <p>{answer.answer}</p>}
      </div>
    );
  }
};

export default DroppablePlaceholder;
