const express = require('express')
const app = express();
const mongoose = require('mongoose');

const users = [{name : "ShinKwang", age: 32}];

const MONGO_URI = 'mongodb+srv://shinkwang:tlsodb113@!@mongodbtutorial.qboq1cz.mongodb.net/BlogService?retryWrites=true&w=majority'

let result = mongoose.connect(MONGO_URI);
console.log({ result });


mongoose.connect()

app.use(express.json());

app.get("/user", function(req, res) {
    return res.send({users});
})

app.post("/user", function(req, res) {
    users.push({ name: req.body.name, age: req.body.age })
    return res.send({success: true});
})

app.listen(3000, function() {
    console.log('server listening on port 3000 123');
})