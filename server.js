const path = require("path");
const express = require("express");

//app je objekt
const app = express();

//Set static folder (da se vidi fronted)
//path je ugrađeni node module i trenutnom direktoriju se pridruzi onaj folder kojeg zelimo prikazat
app.use(express.static(path.join(__dirname, "public")));

//gleda imamo li enviroment varijabalu PORT
const PORT = 3000 || process.env.PORT;
//pokretanje servera
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
