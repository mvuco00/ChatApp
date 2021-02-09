const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

//dohvat username-a i sobe (preko qs cdnjs)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join room
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//hvata emitanu poruku sa servera
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight + 10;
});

//Msg submit
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //msg je id inputa, a dohvacamo njegovu vrijednost
  const msg = event.target.elements.msg.value;
  //emit-anje poruke serveru
  socket.emit("chatMessage", msg);

  //clear input
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

//Output msg to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.textMsg}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//add title to DOM
function outputRoomName(room) {
  roomName.innerHTML = room;
}

//add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
