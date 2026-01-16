Chat Web App

A simple real-time chat web application built using WebSockets, where all users join a common chat room. Messages are shared instantly, and all chat data disappears once the chat session ends.

Features
Real-time messaging using WebSockets
Single shared (common) chat room
Messages are broadcast to all connected users
No authentication or user accounts
No permanent message storage (in-memory only)

Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js
Real-time Communication: WebSockets

How It Works
Users connect to the server via WebSockets
All connected users join a common chat room
Messages are instantly broadcast to every user
Messages are stored only in memory and cleared when users disconnect or the server restarts

Purpose
This project was created during the learning process to understand:
WebSocket-based real-time communication
Server-side message broadcasting
Managing multiple users in a shared chat room

Future Improvements
Add user authentication and usernames
Support multiple chat rooms
Introduce persistent message storage
Implement typing indicators and read receipts
Use a Publish–Subscribe (Pub/Sub) messaging model to improve scalability and decouple message broadcasting (e.g., Redis Pub/Sub) for handling multiple servers
