import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  OPTION: 'option',
};

const DraggableItem = ({ option }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.OPTION,
    item: { value: option.value, id: option.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
    >
      {option.isImage ? (
        <img
          src={option.value}
          alt="option"
          style={{ width: '100px', height: '100px' }}
        />
      ) : (
        option.value
      )}
    </div>
  );
};

export default DraggableItem;
