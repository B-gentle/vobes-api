const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Blog = require('./models/blogs');

const app = express();

// database connection
const db = 'mongodb+srv://vobes:beetech247@evotingplatform.il4r81h.mongodb.net/vobes?retryWrites=true&w=majority';
mongoose.connect(db).then((result) => {
    // listen for request: it is advisable to listen for request after our database has connected successfully;
    app.listen(process.env.PORT || 3400);
    console.log('connected successfully')
}).catch((err) => {
    console.log(err)
})



// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

app.get('/blogs', (req, res) => {
    Blog.find()
        .then((blogs) => {
            res.send(blogs)
        }).catch((err) => {
            console.log(err)
        })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
   Blog.findById(id)
   .then((blog)=>{
       res.send(blog)
   }).catch((err)=>{
       console.log(err)
   })
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(()=>{
        res.end()
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body)
    blog.save().then((result)=>{

    }).catch((err)=>{
        console.log(err)
    })
    res.redirect('/blogs');
})