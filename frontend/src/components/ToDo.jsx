import '../css/ToDo.css'
import React, { useState } from 'react';

function ToDo() {
    const [tasks, setTasks] = useState(["ahmad","omar","other"]);
    const [taskName, setTaskName] = useState("");

    const handleAddTask = () => {
        if (taskName.trim()) {
            setTasks(t => [...t, taskName]);
            setTaskName("");
        }
    }

    const handleRemoveTask = (index) => {
        setTasks(t => t.filter((_, i) => i !== index));
    }

    const moveUp = (index) => {
        if(index > 0) {
            const updatedTask = [...tasks]
            [updatedTask[index],updatedTask[index-1]]=[updatedTask[index-1],updatedTask[index]]
            setTasks(updatedTask);
        }
    }
    const moveDown = (index) => {
        
    }
    return (
        <div>
            <h1>To-Do List</h1>
            <input 
                type="text" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                placeholder="Enter a task..." 
            />
            <button onClick={handleAddTask}>Add</button>
            <ol>
                {tasks.map((task, index) => (
                    <li key={index}>
                        {task}
                        <button onClick={() => handleRemoveTask(index)}>Remove</button>
                        <button onClick={() => moveUp(index)}>Up</button>
                        <button onClick={() => moveDown(index)}>Down</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDo;
