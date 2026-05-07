import React, { useState } from 'react';
import './TaskList.css';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  createdBy: string;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdBy'>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTaskStatus, onAddTask }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.assignee) {
      onAddTask({
        ...newTask,
        status: 'todo',
      });
      setNewTask({ title: '', description: '', assignee: '', dueDate: '' });
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <select
          value={task.status}
          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as Task['status'])}
          className={`status-select status-${task.status}`}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <span>Assignee: {task.assignee}</span>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <span>Created by: {task.createdBy}</span>
      </div>
    </div>
  );

  return (
    <div className="task-list-container">
      <div className="task-columns">
        <div className="task-column">
          <h3>To Do ({getTasksByStatus('todo').length})</h3>
          <div className="task-cards">
            {getTasksByStatus('todo').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="task-column">
          <h3>In Progress ({getTasksByStatus('in-progress').length})</h3>
          <div className="task-cards">
            {getTasksByStatus('in-progress').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="task-column">
          <h3>Done ({getTasksByStatus('done').length})</h3>
          <div className="task-cards">
            {getTasksByStatus('done').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      <div className="add-task-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Assignee"
            value={newTask.assignee}
            onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
            required
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};