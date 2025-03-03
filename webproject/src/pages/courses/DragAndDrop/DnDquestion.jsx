import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DroppablePlaceholder from '../DroppablePlaceholder'
import DraggableItem from '../DraggableItem'
import CustomDragLayer from '../CustomDragLayer'
import { DndContext } from '@dnd-kit/core'

const DnDquestion = ({currentQuestion, droppedOrder, handleDragEnd}) => {

    const [answers, setAnswers] = useState([]);


    useEffect(()=>{
        if (currentQuestion){
            const currentAnswers = [];
            currentQuestion.question_text.split("_").map((part, idx)=>{
                currentAnswers.push({id:idx, answer:null})
            }); 
            setAnswers(currentAnswers);
        }
    },[]);

    function handleDragEnd(event){
        const {active, over} = event;
        console.log(active, over);

        if (!over){
            return;
        }
        
        const optionId = active.id;
        const dropId = over.id;
        
        const answerIds = answers.map(current=>current.id);
        console.log(answerIds);
        if (answerIds.includes(dropId)){
            const index = answerIds.findIndex(element=> element===dropId);
            const currentAnswers = [...answers];
            currentAnswers[index] = {id:dropId, answer: optionId}
            console.log(index, currentAnswers); 
            setAnswers(currentAnswers);
        }else{
            setAnswers(prev=>[...prev, {id:dropId, answer: optionId}]);
        }
    }; 

    console.log(answers);

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>              
                {answers.length>0 && answers.map((part) => {
                    const droppedItem = part.answer;
                    console.log(part);
                    return <DroppablePlaceholder
                        index={part.id}
                        droppedItem={droppedItem ? droppedItem : null}
                    />
                })} 
            
                <ul className="studTaskOptions">
                    {currentQuestion.options.map((option, idx) => (
                        <DraggableItem option={option} idx={idx}/>
                    ))}
                </ul>
            </DndContext>
        </>
    )
}

export default DnDquestion