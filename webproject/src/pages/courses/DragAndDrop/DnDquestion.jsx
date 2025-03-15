import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DroppablePlaceholder from '../DroppablePlaceholder'
import DraggableItem from '../DraggableItem'
import CustomDragLayer from '../CustomDragLayer'
import { DndContext, useDraggable } from '@dnd-kit/core'
import DraggableItem2 from '../DraggableItem2';

const DnDquestion = ({currentQuestion, drags, drops}) => {

    const [answers, setAnswers] = useState([]);

    console.log(drags, drops);


    function handleDragEnd(event){
        const {active, over} = event;
        console.log(active, over);

        if (!over){
            return;
        }
        
        const optionId = active.id;
        const dropId = over.id;
        
        const answerIds = answers.map(current=>current.item);
        console.log(answerIds);
        if (answerIds.includes(dropId)){
            const index = answerIds.findIndex(element=> element===dropId);
            const currentAnswers = [...answers];
            currentAnswers[index] = {item:dropId, answer: optionId}
            console.log(index, currentAnswers); 
            setAnswers(currentAnswers);
        }else{
            setAnswers(prev=>[...prev, {item:dropId, answer: optionId}]);
        }
    }; 

    console.log(answers);

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>              
                {drops.length>0 && drops.map((drop) => {
                    console.log(drop);
                    const answer= answers.filter(ans=>ans.item==drop.id)[0];
                    return <DroppablePlaceholder
                        index={drop.id}
                        id={drop.id}
                        element={drop}
                        answer={answer}
                    />
                })} 
                <div style={{
                        width: "30%", 
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    {currentQuestion.question_type=="drag_and_drop_text" && <ul className="studTaskOptions">
                        {currentQuestion.options.map((option, idx) => (
                            <DraggableItem option={option} idx={idx}/>
                        ))}
                    </ul>}
                    {currentQuestion.question_type=="drag_and_drop_images" && 
                        <>
                            {drags.map((element, idx) => (
                                <DraggableItem2 element={element} id={element.id}/>
                            ))}
                        </>
                    }
                </div>
            </DndContext>
        </>
    )
}

export default DnDquestion