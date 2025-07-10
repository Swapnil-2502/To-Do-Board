import { io } from "socket.io-client";

const socket = io("https://to-do-board-production.up.railway.app/", {
  withCredentials: true,
  autoConnect: false, 
  transports: ['websocket']
});

export default socket;