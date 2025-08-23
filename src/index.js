import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { io } from "socket.io-client";
import config from "./config/environment";

// Create socket connection with fallback URL and better error handling
const socket = io(config.BACKEND_URL, { 
  autoConnect: true,
  path: config.WEBSOCKET_PATH,
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Add connection event listeners
socket.on('connect', () => {
  console.log('🔌 WebSocket connected successfully to:', config.BACKEND_URL);
});

socket.on('connect_error', (error) => {
  console.error('❌ WebSocket connection failed:', error.message);
  console.log('🔄 Attempting to reconnect...');
});

socket.on('disconnect', (reason) => {
  console.log('🔌 WebSocket disconnected:', reason);
});

console.log('🔌 Socket connecting to:', config.BACKEND_URL);
console.log('🌍 Environment:', config.IS_PRODUCTION ? 'Production' : 'Development');
console.log('🔌 WebSocket Path:', config.WEBSOCKET_PATH);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App socket={socket} />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
