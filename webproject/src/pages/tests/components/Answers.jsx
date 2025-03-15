import React from 'react'
import shuffle from '../assets/shuffle'

const Answers = ({answers,selectedAnswer,answerState, onSelect}) => {
    answers = shuffle(answers)
    return (
        <ul id='answers'>
            {answers.map(answer=>{
                const isSelected = selectedAnswer ===answer
                let cssClasses = ''
                if (answerState==='answered' && isSelected){
                    cssClasses = 'selected'
                }
                if ((answerState==='correct' || answerState==='wrong') && isSelected){
                    cssClasses = answerState
                }

                return (<li key={answer} className='answer'>
                    <button onClick={()=>onSelect(answer)} className={cssClasses}>
                        {answer}
                    </button>
                </li>)
                    })}
        </ul>
    )
}

export default Answers