import { io } from "socket.io-client";

const socket = io("http://localhost:3004", {
  withCredentials: true,
  autoConnect: false, 
});

export default socket;