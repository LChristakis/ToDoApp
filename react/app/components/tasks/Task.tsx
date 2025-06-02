import React from 'react';
import { Task as TaskType } from '../../../lib/features/todo/tasksApiSlice';
import { useDispatch, useSelector } from 'react-redux';

const Task: React.FC<{ task: TaskType }> = ({ task }) => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    // dispatch(toggleTask(task.id));
  };

  const handleDelete = () => {
    // dispatch(deleteTask(task.id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ fontWeight: 'bold'}}>{task.title}</div>
        <div>{task.description}</div>
        <div>
          <select>
            <option value={0} selected={task.status === 0}>Not Started</option>
            <option value={1} selected={task.status === 1}>In Progress</option>
            <option value={2} selected={task.status === 2}>Completed</option>
          </select>
        </div>
      </div>
      {/* <button onClick={handleToggle}>
        {task.status === 'completed' ? 'Undo' : 'Complete'}
      </button>
      <button onClick={handleDelete}>Delete</button> */}
    </div>
  );
}

export default Task;