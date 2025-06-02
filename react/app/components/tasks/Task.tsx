import React, { useState } from 'react';
import { Task as TaskType } from '../../../lib/features/tasks/taskSlice';
import { useAppDispatch } from '@/lib/hooks';
import { updateTask, deleteTask } from '../../../lib/features/tasks/taskSlice';

const Task: React.FC<{ task: TaskType }> = ({ task }) => {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const dispatch = useAppDispatch();

  const handleUpdate = () => {
    dispatch(updateTask({ id: task.id, title, description, status }));
  };

  const handleDelete = () => {
    if (!task.id) return;
    dispatch(deleteTask(task.id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <select onChange={(e) => setStatus(Number(e.target.value))} value={status}>
            <option value={0}>Not Started</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
          <button style={{marginLeft: '10px'}} onClick={handleUpdate}>Update</button>
          <button style={{marginLeft: '10px'}} onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Task;