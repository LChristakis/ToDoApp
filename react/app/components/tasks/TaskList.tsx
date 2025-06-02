"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Task from './Task';
import { RootState } from '../../../lib/store';
import { useGetTasksQuery } from '@/lib/features/todo/tasksApiSlice';
// import { addTodo, removeTodo, toggleTodo } from '../../../lib/features/tasks/tasksSlice';

const TaskList: React.FC = () => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    // const tasks = [ { id: 1, title: 'Sample Task', description: 'This is a sample task', status: 0 } ]; 
    const { data, isError, isLoading, isSuccess } = useGetTasksQuery()
    // useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch();

    const handleAddTodo = () => {
    //     if (task.trim()) {
    //         dispatch(addTodo(task));
    //         setTask('');
    //     }
    };
    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task"
                />
                <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description"
                />
                <button onClick={handleAddTodo}>Add</button>
            </div>
            {isError && <div>Error loading tasks</div>}
            {isLoading && <div>Loading tasks...</div>}
            {isSuccess && <div>
                <ul>
                    {data.tasks.map((task) => (
                        <Task task={task} key={task.id} />
                    ))}
                </ul>
            </div>}
        </div>
    );
};

export default TaskList