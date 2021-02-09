const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  joinUsers,
  getUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

//app je objekt
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder (da se vidi fronted)
//path je ugrađeni node module i trenutnom direktoriju se pridruzi onaj folder kojeg zelimo prikazat
app.use(express.static(path.join(__dirname, "public")));

const bot = "ChatApp Message";
//Pokreni kad se klijent spoji
io.on("connection", (socket) => {
  //dohvat emitane poruke za spajanje u sobu
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUsers(socket.id, username, room);
    socket.join(user.room);

    //poruka se prikaze samo "meni", tj onome tko se prijavio u chat
    socket.emit("message", formatMessage(bot, "Wellcome to ChatApp")); //emit-anje poruka izmedu klijenta i servera, poruka se dohvati u main.js

    //Broadcast when user connects => salje se poruka svima, osim onome tko se upravo spojio
    //ako zelimo svima poslat ide io.emit()
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(bot, `${username} has joined chat`));

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chat message
  //msg je poruka koja je submitana, i preko socket.on smo je dohvatili
  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);
    //poruku zelimo svima emitati da je svi procitaju
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Run when client disconnects
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(bot, `${user.username} has left the chat`)
      );
      //azuriranje ako se netko odjavi
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//gleda imamo li enviroment varijabalu PORT
const PORT = process.env.PORT || 3000;
//pokretanje servera
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
