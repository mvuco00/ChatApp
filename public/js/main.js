const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

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
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
