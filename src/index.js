const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const connectToDB = require("./config/db.config");
const apiRouter = require("./routes");
const {PORT} = require("./config/server.config");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.text());
app.use(cors({
    origin: "*"
}));


app.use("/api", apiRouter);
app.use(errorHandler);

app.get('/ping', (req, res)=>{
    return res.json({
        msg: "Problem servise is up"
    });
});

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
    connectToDB();
})