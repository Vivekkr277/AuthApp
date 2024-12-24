const express = require("express");
const { dbConnect } = require("./config/database")
const router = require("./routes/route")

// dotenv libraray to load the .env file configuration in the process object
require("dotenv").config();

// creating server
const app = express();
const PORT = process.env.PORT || 3000;

// to parse json request body
app.use(express.json());

// mounting the route to the server
app.use("/api/user", router);

// making connection with database
dbConnect();

// activating server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

// default route to check the server
app.get('/', (req, res) => {
    res.send("server is running")
})

