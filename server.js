const express = require('express');
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// app.use(express.static(__dirname)) #style
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://yatharthsahu0157:Yatharth157@formdata.8aa9xjx.mongodb.net/")   //mongodb://localhost:27017/form
const db = mongoose.connection  
db.once('open',()=>{
    console.log("mongodb connected");
})

const userSchema = new mongoose.Schema({
    name:String,
    age:String
})

const Users = mongoose.model("data",userSchema)


app.get('/',  (req,res) => {
    res.sendFile(path.join(__dirname,"index.html"))
})


app.post("/post", async (req,res)=>{
    const {name,age} = req.body
    const user = new Users({
        name,
        age
})
    await user.save()
    console.log(user);
    res.send("form submitted")
    
})

app.listen(3000, ()=> {
    console.log("listining to port 3000")
})
