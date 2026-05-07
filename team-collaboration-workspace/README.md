# Team Collaboration Workspace

**Stack:** React, Node.js, Socket.io

A collaborative workspace prototype built for real-time task management, user notifications, and multi-user synchronization.

## Features

- Real-time task updates with Socket.io
- Activity notifications for task changes and collaboration events
- Drag-and-drop-style status updates via task status selectors
- Simple task creation form with assignee and due date fields

## Local setup

```bash
cd team-collaboration-workspace/client
npm install
npm start
```

In a separate terminal:

```bash
cd team-collaboration-workspace/server
npm install
npm start
```
```

## Project structure

- `client/src/App.tsx` — entry point and socket connection management
- `client/src/components/TaskList.tsx` — task board and task creation UI
- `client/src/components/NotificationPanel.tsx` — live activity feed
- `server/server.js` — real-time backend and notifications

