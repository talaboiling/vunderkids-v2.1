import React from 'react';
import classes from "./Color.module.css";

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
}) => {
  console.log(attribute);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{placeholder}</h3>
      <div className={classes["color-picker"]} onClick={() => inputRef.current.click()}>
        <input
          type="color"
          value={attribute}
          ref={inputRef}
          style={{padding:0, margin: 0, minWidth:40}}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <label 
          className={classes.attribute} 
          style={{
            // backgroundColor: attribute, // Apply background color
            color: "blue", // Ensure text is visible (white text)
            padding: "5px 10px", // Some padding to see the color effect
            // display: "inline-block", // Prevent collapsing
            // borderRadius: "4px" // Optional: make it rounded
          }}
        >
          {attribute}
        </label>
      </div>
    </div>
  )
};

export default Color