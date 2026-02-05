<img width="1919" height="940" alt="Screenshot 2026-02-05 170513" src="https://github.com/user-attachments/assets/7705e686-b11d-4a54-962e-9b80fe6a3f1b" />
<img width="1917" height="1029" alt="Screenshot 2026-02-05 105937" src="https://github.com/user-attachments/assets/6f27d76d-86d1-4e47-8c64-85bd517b45ed" />
<img width="1909" height="975" alt="Screenshot 2026-02-05 105927" src="https://github.com/user-attachments/assets/faddf869-beca-47d8-ab7c-cc0177684fa0" />
# Tetherfi Real-Time Chat Application

A high-performance, microservices-based real-time chat platform built with **.NET 8**, **SignalR**, **React (TypeScript)**, and **MySQL**.

## 🏗️ Architecture
- **Identity Service (Port 7277):** Handles JWT Authentication and user status persistence.
- **Chat Service (Port 7151):** Manages the SignalR WebSocket Hub and conversation history.
- **Frontend (Port 5173):** Responsive React UI served via Nginx.
- **Database:** Automatic schema generation for `IdentityDB` and `ChatDB`.

## 🚀 Key Features
- **Real-Time Messaging:** Instant delivery via SignalR.
- **WhatsApp-Style Sidebar:** Shows the most recent message and timestamps for every contact.
- **Microservices:** Truly decoupled services with connection resiliency (Retry loops).
- **Dockerized:** Entire stack launches with one command.

---

## 📖 User Manual (Testing Workflow)

To verify the full functionality of the system, please follow these steps:

1. **Start the System:** Ensure local MySQL is stopped, then run `docker-compose up --build`.
2. **Register Multiple Users:** 
   - Open [http://localhost:5173](http://localhost:5173).
   - Click **Sign Up** and create account `User_A`.
   - Log out, click **Sign Up** again, and create account `User_B`.
3. **Initiate Chat:**
   - Log in as `User_A`.
   - Select `User_B` from the colleagues list and send a message.
   - Note the sidebar updates instantly with a "You: [message]" preview.
4. **Switch and Reply:**
   - Log out and log in as `User_B`.
   - You will see the message from `User_A` in your sidebar.
   - Open the chat, hover over the message, and click the **Reply** icon to respond.

---

## 🛠️ How to Run
```bash
docker-compose up --build
