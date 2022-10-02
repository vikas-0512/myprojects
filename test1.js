const e= require('express');
const fs = require('fs');
const mongoose = require("mongoose");
var morgan=require("morgan");
const Blog=require('./models/blogs')
const a=e();
const link='mongodb://127.0.0.1:27017/newdatabase'
mongoose.connect(link, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
.then(()=>{console.log('connected successfully');
a.listen(3000)})
.catch((err)=>{
    console.log(err);
})

a.set('view engine','ejs');
a.use(e.static('public'));
a.use(e.urlencoded({ extended: true}))
a.use(morgan('dev'));
a.get('/',(req,res)=>{
    res.redirect('/blogs')
})
a.get('/blogs',(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.render('index',{blogs: result})
    })
    .catch((err)=>{
        console.log('error occurred')
    })
})
a.post('/blogs',(req,res)=>{
    const b= new Blog(req.body)
    b.save()
      .then((result)=>{
        res.redirect('/')
      })
      .catch((err)=>{
        console.log('error')
      })
})
a.get('/about',(req,res)=>{
    res.render('about')
})
a.get('/create',(req,res)=>{
    res.render('create')
})
a.get('/:val',(req,res)=>{
    const id=req.params.val;
    Blog.findById(id)
    .then(result =>{
        res.render('details',{blog: result})
    })
    .catch((err)=>{
        console.log('error occured');
    })
})
a.delete('/:val',(req,res)=>{
    const id=req.params.val;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect: '/blogs'})
    }
    )
    .catch(err=>
        {
            console.log('error o');
        })
})
a.use((req,res)=>{
    res.status(404).render('error')
})
