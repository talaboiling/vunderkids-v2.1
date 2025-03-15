import React from 'react'
import styles from "./TestCreationForm.module.css"
import QuestionsCreator from './QuestionsCreator'

const TestCreationForm = ({onClose}) => {

    function onSave(){

    };

    return (
        <div>
            <form className={styles.form}>
                <div className={styles.inputField}>
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" placeholder="Enter title" />
                </div>
                <div className={styles.inputField}>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" placeholder="Enter description"></textarea>
                </div>
                <div className={styles.inputField}>
                    <label htmlFor="type">Type</label>
                    <select id="type" name="type" style={{width: "fit-content"}}>
                        <option value="modo">Modo</option>
                        <option value="ent">Ent</option>
                    </select>
                </div>
                <QuestionsCreator/>
            </form>
            <button onClick={onSave}>Save</button>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default TestCreationForm