const mongoose = require("mongoose");
const config = require("./Config");
const url = config.DBURL_DEV;
// const url = config.DBURL_PROD;
mongoose.connect(url)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((error) => {
        console.log(error);
        console.log('Connection failed!');
    });