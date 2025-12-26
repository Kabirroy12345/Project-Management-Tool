# ProjectFlow Pro - Enterprise Project Management

🚀 **Live Demo**: [Coming Soon](#)

ProjectFlow Pro is a full-stack **enterprise-grade Project Management Platform** built with the MERN stack (MongoDB, Express.js, React, Node.js). It features a stunning premium UI, AI-powered insights, real-time collaboration, and advanced analytics for modern teams.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Functionality
- 🔐 **User Authentication** - Secure JWT-based login and registration
- 📊 **Interactive Dashboard** - Real-time stats with animated counters
- ✅ **Project Management** - Full CRUD with progress tracking
- 📝 **Task Management** - Create, assign, and track tasks with priorities
- 📅 **Interactive Calendar** - Visual scheduling with drag-and-drop
- 📈 **Advanced Analytics** - Charts, graphs, and productivity insights
- 👥 **Team Collaboration** - Assign tasks and manage team members
- 🗂️ **Kanban Board** - Drag-and-drop task visualization

### 🎨 Premium User Experience
- ✨ **Stunning Light UI** - Premium glassmorphism design with smooth gradients
- 🎭 **Micro-Animations** - Delightful hover effects and transitions
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔔 **Real-time Notifications** - Stay updated with live alerts
- ⚙️ **Customizable Settings** - Theme and profile personalization

### 🤖 AI-Powered Features
- 💡 **Smart Task Suggestions** - AI recommends next actions
- 📆 **Deadline Predictions** - Intelligent project timeline forecasting
- 🎯 **Priority Optimization** - ML-based task prioritization

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern component-based UI
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Beautiful DnD** - Drag-and-drop functionality
- **Socket.IO Client** - Real-time updates
- **Lucide React** - Premium icons
- **Custom CSS** - Premium glassmorphism styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Netlify / Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Git

### Clone the Repository
```bash
git clone https://github.com/Kabirroy12345/Project-Management-Tool.git
cd Project-Management-Tool
```

### Backend Setup
```bash
cd projectflow-backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/projectflow
JWT_SECRET=your_super_secure_jwt_secret
NODE_ENV=development
```

Start the server:
```bash
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Getting Started
1. **Register** - Create your account
2. **Dashboard** - View project overview with live statistics
3. **Projects** - Create and manage projects with progress tracking
4. **Kanban** - Drag-and-drop task management
5. **Tasks** - Create, assign, and prioritize tasks
6. **Calendar** - Schedule and visualize deadlines
7. **Analytics** - Deep dive into productivity metrics
8. **Team** - Manage team members and roles
9. **Settings** - Customize your experience

### Key Workflows
- **Project Creation**: Dashboard → New Project → Fill details
- **Task Management**: Projects → Select Project → Add Tasks
- **Team Collaboration**: Team → Add Members → Assign Tasks
- **Progress Tracking**: Analytics → View Reports → Export

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## 🌐 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
```
Deploy the `build` folder to your hosting provider.

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kabir Roy** - [GitHub Profile](https://github.com/Kabirroy12345)

## 🙏 Acknowledgments

- React.js and Node.js communities
- MongoDB for the powerful database
- All open-source contributors

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ by Kabir Roy
