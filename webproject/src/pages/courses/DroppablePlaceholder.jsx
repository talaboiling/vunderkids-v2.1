import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useDrop } from 'react-dnd';

const ItemTypes = {
  OPTION: 'option',
};

const DroppablePlaceholder = ({ index, droppedItem, onDrop }) => {
  // const [{ isOver, canDrop }, drop] = useDrop(() => ({
  //   accept: ItemTypes.OPTION,
  //   drop: (item) => {
  //     onDrop(index, item);
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }));

  const {setNodeRef} = useDroppable({
    id: index
  });
  console.log(index, droppedItem);
  return (
    <span
      ref={setNodeRef}
      style={{
        display: 'inline-block',
        padding: '10px',
        border: '2px dashed gray',
        minWidth: '100px',
        backgroundColor: 1 ? 'lightgreen' : 'white',
        margin: '0 10px',
        minHeight: '30px',
        zIndex: 10
      }}
    >
      {droppedItem}
    </span>
  );
};

export default DroppablePlaceholder;
