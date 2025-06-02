"use client";

import React, { useEffect, useState } from 'react';
import Task from './Task';
import {
    selectTasks,
    fetchTasks,
    createTask,
} from '@/lib/features/tasks/taskSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
// import { addTodo, removeTodo, toggleTodo } from '../../../lib/features/tasks/tasksSlice';

const TaskList: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTasks());
    }, []);

    const tasks = useAppSelector(selectTasks);

    const handleAddTask = () => {
        dispatch(createTask({ title, description }));
    };

    return (
        <div>
            <h1 style={{paddingLeft: '30px'}}>Todo List</h1>
            <div>
                <ul>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add a new task"
                        />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task description"
                        />
                        <button onClick={handleAddTask}>Add</button>
                    </div>
                </ul>
            </div>
                <ul>
                    {tasks.map((task) => (
                        <Task task={task} key={task.id} />
                    ))}
                </ul>
        </div>
    );
};

export default TaskList