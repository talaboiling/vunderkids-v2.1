import React from 'react';
import { useDrop } from 'react-dnd';

const ItemTypes = {
  OPTION: 'option',
};

const DroppablePlaceholder = ({ index, droppedItem, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.OPTION,
    drop: (item) => {
      onDrop(index, item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <span
      ref={drop}
      style={{
        display: 'inline-block',
        padding: '10px',
        border: '2px dashed gray',
        minWidth: '100px',
        backgroundColor: isOver ? 'lightgreen' : 'white',
        margin: '0 10px',
        minHeight: '30px',
      }}
    >
      {droppedItem}
    </span>
  );
};

export default DroppablePlaceholder;
