const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('cors');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

const app = express();

app.use(cors());

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);


app.use('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});



app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Unauthorized!'})
    }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`A Node Js API is listening on port : ${port} `)
});

