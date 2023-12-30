const express = require('express');
const mongoose = require('mongoose');
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const app = express();

app.use(express.json());

mongoose.connect(dbConfig.DB_URL);

const db = mongoose.connection;

db.on(`error`, () => {
    console.log(`Error while connecting to db`);
});

db.once(`open`, () =>{
    console.log(`Connected to Database`);
});

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
app.listen(serverConfig.PORT, () =>{
    console.log(`Server started on PORT ${serverConfig.PORT}`)
});