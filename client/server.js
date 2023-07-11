const path = require("path");
const express = require("express");
const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "build", "index.html"));
    } catch {
        console.log('ERROR!');
        res.send('oops');
    }
});

// start express server on port 5000
app.listen(7000, () => {
    console.log("server started on port 7000");
});


app.get('/', (req, res) => {
    res.send("HELLO!");
});


app.get('/Real-Estate', (req, res) => {
    res.send("HEY!");
});
