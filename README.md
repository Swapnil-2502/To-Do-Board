# 🧠 Real-Time Collaborative To-Do Board

A full-stack, real-time Kanban-style task management app (like Trello) where multiple users can collaborate, assign tasks, and track changes with live updates.

Built with **Node.js + MongoDB + Express (backend)** and **React + TypeScript (frontend)**, with **Socket.IO** for real-time syncing, and **JWT-based authentication**.

---

## 🔗 Live Demo Links

- 🚀 **Frontend (Vercel):** [https://to-do-board-alpha.vercel.app/login](https://to-do-board-alpha.vercel.app/login)
- ⚙️ **Backend (Railway):** [https://to-do-board-production.up.railway.app/api/](https://to-do-board-production.up.railway.app/api/)
- 🎥 **Walkthrough Video:** [https://drive.google.com/file/d/1wJLtyZB46zHYIv8rZjnLBfcYCWmFWS-U/view?usp=sharing](https://your-video-link.com)



---

## 🧰 Tech Stack

| Layer        | Tech Used                             |
|--------------|----------------------------------------|
| Frontend     | React, TypeScript, Vite, CSS Modules   |
| Backend      | Node.js, Express, TypeScript           |
| Database     | MongoDB (via Mongoose)                 |
| Real-Time    | Socket.IO                              |
| Auth         | JWT + bcrypt                           |
| Styling      | Custom CSS (no template libraries)     |
| Deployment   | Vercel (frontend), Railway (backend)   |

---

## 🔧 Setup Instructions

### ⚙️ Backend (Express + MongoDB)

1. Clone the repo:
   ```
   git clone https://github.com/yourusername/your-repo.git
   cd backend
   ```
  
  2. Install dependencies:
	 ```
	 npm install
	 ```
 
 3. Create a `.env` file:
	 ```
	 PORT=5000
	MONGO_URI=your-mongodb-uri
	JWT_SECRET=your-secret-key
	```

4. Start the server:
	```
	npm run dev
	```

### 🌐 Frontend (React + Vite + TypeScript)
1. Clone the repo (if not already):
	```
	cd frontend
	```
2. Install dependencies:
	 ```
	 npm install
	 ```
 
 3. Create `.env` file:
	```
	VITE_API_URL=https://your-backend-url.railway.app
	VITE_API_URL=https://your-backend-url.railway.app/api
	```
4. Start the server:
	```
	npm run dev
	```

### 🧭 Frontend Routes

| Page                     | Path                            | Description                                      |
|--------------------------|----------------------------------|--------------------------------------------------|
| Register/Login           | `/register`, `/login`           | User authentication pages                        |
| Dashboard                | `/dashboard`                    | Main landing page after login                    |               |
| Create/Edit Task         | Modal (on `/board`)             | Add/edit task via modal                          |
| Activity Logs            | `/activity`                     | Shows last 20 actions in real time               |
| Smart Assign (Button)    | On each task card/modal         | Assigns task to user with fewest active tasks    |
| Conflict Resolution Modal| Triggered via edit conflict     | Shown when two users edit the same task together |

### 🛰️ Backend API Routes

| Feature           | Endpoint                          | Method | Description                                          | Auth Required |
|------------------|-----------------------------------|--------|------------------------------------------------------|----------------|
| Register User     | `/api/auth/register`              | POST   | Register a new user                                 | ❌ No          |
| Login User        | `/api/auth/login`                 | POST   | Log in user and return JWT token                    | ❌ No          |   |          |
| Get All Users     | `/api/users`                      | GET    | List all users (for assignment dropdowns, etc.)     | ✅ Yes         |
| Get All Tasks     | `/api/tasks`                      | GET    | Fetch all tasks                                     | ✅ Yes         |        |
| Create Task       | `/api/tasks`                      | POST   | Create a new task                                   | ✅ Yes         |
| Update Task       | `/api/tasks/:id`                  | PUT    | Update task fields (with conflict detection)        | ✅ Yes         |
| Delete Task       | `/api/tasks/:id`                  | DELETE | Delete a task                                       | ✅ Yes         |
| Smart Assign      | `/api/tasks/:id/smart-assign`     | PUT    | Assign task to user with fewest active tasks        | ✅ Yes         |
| Recent Actions    | `/api/actions`             | GET    | Fetch last 20 actions (activity log)                | ✅ Yes         |

## ✨ Features

### 🔐 Auth
- User Registration and Login
- JWT-based session handling
- Passwords are hashed using `bcrypt`

---

### 📋 Task Management
- Create, edit, delete, and assign tasks
- Each task includes:
  - `title`
  - `description`
  - `status` (Todo, In Progress, Done)
  - `priority` (Low, Medium, High)
  - `assigned user`
- Drag and drop tasks between columns on the Kanban board

---

### 🌐 Real-Time Sync
- All changes (create/edit/delete/assign/drag-drop) are broadcast instantly to all users
- Built using **Socket.IO** on both frontend and backend

---

### 🧠 Smart Assign
- One-click **Smart Assign** button on each task
- Automatically assigns the task to the user with the **fewest active (non-Done) tasks**

---

### ⚔️ Conflict Handling
- If two users try to edit the same task:
  - Conflict is detected using the `updatedAt` timestamp
  - A **Conflict Resolution Modal** appears
  - Users can choose to:
    - ✅ **Overwrite** the task
    - 🔀 **Merge manually** using the modal interface

---

### 🕒 Activity Logs
- Logs every action:
  - Create
  - Edit
  - Delete
  - Assign
  - Drag & drop
- **Activity Log page** shows the most recent 20 actions
- Updated in **real-time** using Socket.IO

---

### 💫 UI & UX
- Fully **responsive**: works great on desktop and mobile
- Smooth transitions, drag animations, and modals
- Clean, minimal look
- **No UI libraries** used (fully custom CSS)

---

## 📜 Smart Assign Logic

- When a user clicks **Smart Assign**:
  - The backend counts how many active tasks (i.e., not "Done") each user currently has
  - The task is assigned to the user with the **fewest active tasks**
  - If there's a tie, the task is assigned to the user who registered **earlier**

---

## ⚔️ Conflict Handling Logic

- When a user tries to save changes to a task:
  - The client sends the current `updatedAt` timestamp in the request
  - The backend compares it with the latest timestamp in the database
- If the task was modified by someone else in the meantime:
  - Backend responds with a `409 Conflict` and sends back the latest version
  - Frontend shows a **Conflict Resolution Modal**
  - The user can then:
    - ✅ **Overwrite** → sends update with `force: true`
    - 🔀 **Merge** → manually resolve differences before re-submitting
