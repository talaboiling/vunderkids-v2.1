import React from 'react'

const Outside = ({children, element, styles}) => {
    console.log(element, styles);
    return (
      <>
        {renderOutsideElement(element, styles, children)}
      </>
    )
}

export default Outside