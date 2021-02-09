const socket = io();

//hvata emitanu poruku
socket.on("message", (message) => {
  console.log(message);
});
