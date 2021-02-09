const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

//app je objekt
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder (da se vidi fronted)
//path je ugrađeni node module i trenutnom direktoriju se pridruzi onaj folder kojeg zelimo prikazat
app.use(express.static(path.join(__dirname, "public")));

//Pokreni kad se klijent spoji
io.on("connection", (socket) => {
  //poruka se prikaze samo "meni", tj onome tko se prijavio u chat
  socket.emit("message", "Wellcome to ChatApp"); //emit-anje poruka izmedu klijenta i servera, poruka se dohvati u main.js

  //Broadcast when user connects => salje se poruka svima, osim onome tko se upravo spojio
  //ako zelimo svima poslat ide io.emit()
  socket.broadcast.emit("message", "User has joined chat");

  //Run when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

//gleda imamo li enviroment varijabalu PORT
const PORT = process.env.PORT || 3000;
//pokretanje servera
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
