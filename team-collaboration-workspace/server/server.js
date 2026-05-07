const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock tasks data
let tasks = [
  {
    id: uuidv4(),
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new marketing landing page',
    assignee: 'Alice',
    status: 'in-progress',
    dueDate: '2024-02-15',
    createdBy: 'Bob'
  },
  {
    id: uuidv4(),
    title: 'Implement user authentication',
    description: 'Add login/signup functionality with JWT tokens',
    assignee: 'Charlie',
    status: 'todo',
    dueDate: '2024-02-20',
    createdBy: 'Alice'
  },
  {
    id: uuidv4(),
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples',
    assignee: 'Bob',
    status: 'done',
    dueDate: '2024-01-30',
    createdBy: 'Charlie'
  }
];

// Broadcast tasks to all connected clients
const broadcastTasks = () => {
  io.emit('tasks-update', tasks);
};

// Send notification to all clients
const sendNotification = (message, type = 'info') => {
  const notification = {
    id: uuidv4(),
    message,
    type,
    timestamp: new Date()
  };
  io.emit('notification', notification);
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current tasks to new client
  socket.emit('tasks-update', tasks);

  // Handle task updates
  socket.on('update-task', (data) => {
    const { taskId, status, user } = data;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const oldStatus = task.status;
      task.status = status;

      // Broadcast updated task
      io.emit('task-updated', task);

      // Send notification
      sendNotification(`${user} moved "${task.title}" from ${oldStatus} to ${status}`, 'info');
    }
  });

  // Handle new task creation
  socket.on('add-task', (taskData) => {
    const newTask = {
      id: uuidv4(),
      ...taskData
    };
    tasks.push(newTask);

    // Broadcast all tasks
    broadcastTasks();

    // Send notification
    sendNotification(`${taskData.createdBy} created a new task: "${taskData.title}"`, 'success');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate some activity for demo purposes
setInterval(() => {
  if (Math.random() < 0.1) { // 10% chance every 30 seconds
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    if (randomTask.status === 'todo') {
      randomTask.status = 'in-progress';
      io.emit('task-updated', randomTask);
      sendNotification(`Task "${randomTask.title}" was automatically moved to In Progress`, 'warning');
    }
  }
}, 30000);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});