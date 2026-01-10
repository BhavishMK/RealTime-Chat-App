# Tetherfi Real-Time Chat Application

A production-ready, microservices-based real-time chat application built with **.NET 8**, **SignalR**, **React (TypeScript)**, and **MySQL**.

## 🚀 Architecture Overview
The system is designed using a **Microservices Architecture** to ensure separation of concerns and scalability:

1.  **Identity Service (Port 7277):** Handles User Registration, Authentication (JWT), and Global User Status management (Available, Busy, Away, Offline).
2.  **Chat Service (Port 7151):** Manages the WebSocket server via SignalR, handles real-time private messaging, message persistence, and conversation history.
3.  **Frontend (Port 5173):** A responsive React application using Tailwind CSS for a modern, intuitive user experience.

## ✨ Features
- **Real-Time Messaging:** Powered by WebSockets (SignalR).
- **One-to-One Chat:** Secure private messaging between employees.
- **Reply Feature:** Ability to reply to specific messages.
- **User Status:** Live status updates (Available, Busy, Away, Offline) reflected across all clients.
- **Clean Architecture:** Domain-driven design principles applied in the backend.
- **Persistent Storage:** MySQL database for users and chat history.

## 🛠️ Tech Stack
- **Backend:** C# .NET 8, ASP.NET Core Web API, SignalR, Entity Framework Core.
- **Frontend:** React JS, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Database:** MySQL.
- **Containerization:** Docker & Docker Compose.

## 🏁 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js (v18+)
- MySQL Server (8.0+)
- Docker Desktop (Optional, for containerization)

### Database Setup
1. Create a database named `TetherfiChatDB` in MySQL.
2. Update the `ConnectionStrings` in `appsettings.json` for both services.
3. Run migrations:
   ```bash
   dotnet ef database update --project Tetherfi.Identity.Service
   dotnet ef database update --project Tetherfi.Chat.Service