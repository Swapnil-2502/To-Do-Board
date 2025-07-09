# 🧠 Real-Time Collaborative To-Do Board

A full-stack, real-time Kanban-style task management app (like Trello) where multiple users can collaborate, assign tasks, and track changes with live updates.

Built with **Node.js + MongoDB + Express (backend)** and **React + TypeScript (frontend)**, with **Socket.IO** for real-time syncing, and **JWT-based authentication**.

---

## 🔗 Live Demo Links

- 🚀 **Frontend (Vercel):** [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
- ⚙️ **Backend (Railway):** [https://your-backend-url.railway.app](https://your-backend-url.railway.app)
- 🎥 **Walkthrough Video:** [https://your-video-link.com](https://your-video-link.com)



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
