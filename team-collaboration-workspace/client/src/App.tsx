import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { TaskList } from './components/TaskList';
import { NotificationPanel } from './components/NotificationPanel';
import './App.css';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  createdBy: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser] = useState('User' + Math.floor(Math.random() * 1000));

  useEffect(() => {
    const newSocket = io('http://localhost:3002');
    setSocket(newSocket);

    newSocket.on('tasks-update', (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    newSocket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    });

    newSocket.on('task-updated', (task: Task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    if (socket) {
      socket.emit('update-task', { taskId, status, user: currentUser });
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdBy'>) => {
    if (socket) {
      socket.emit('add-task', { ...task, createdBy: currentUser });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Team Collaboration Workspace</h1>
        <div className="user-info">
          Logged in as: <strong>{currentUser}</strong>
          <span className="connection-status">
            {socket?.connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </header>
      <main>
        <div className="workspace-layout">
          <div className="main-content">
            <TaskList
              tasks={tasks}
              onUpdateTaskStatus={updateTaskStatus}
              onAddTask={addTask}
            />
          </div>
          <NotificationPanel notifications={notifications} />
        </div>
      </main>
    </div>
  );
}

export default App;