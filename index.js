const express= require('express');
const path = require('path'); 
const app = express();
const mongoose=require('mongoose');
const { error } = require('console');
const connect=mongoose.connect("mongodb://localhost:27017/posts");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('view engine', 'ejs');
connect.then(()=>{
    console.log("database connected sucessfully");
})
.catch(()=>{ 
    console.log("database cannot be connected",error);
});
const loginschemafordatabase= new mongoose.Schema({ 
    title:{
        type:String,
        required:true 
    },
    shortNote:{
        type:String,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});
const collection = new mongoose.model("posts",loginschemafordatabase);

app.get('/', (req, res) => {
      collection.find({}).then(posts => {
        res.render('index', { posts: posts });
    }).catch(err => {
        console.log(err);
    });
});

app.get('/newpostspage', (req, res) => {
    res.render('newpost');
});
app.get('/posts/:id', (req, res) => {
    collection.findById(req.params.id).then(post => {
        res.render('post', { post: post });
    }).catch(err => {
        console.log(err);
    });
});
app.post("/posts",async (req,res)=>{
    const data={ 
        title:req.body.title,
        shortNote:req.body.shortNote,
        topic:req.body.topic,
        description:req.body.description
    } 
    console.log(data); 
    let a=false;  
const existinguser= await collection.findOne({title:data.title});

try{
    const userdata=await collection.insertMany(data);
    console.log(userdata); 
        a=true; 
    if(a){
        res.send("post created sucessfully");  
        res.redirect('/')
    } 

    }
    catch{

        res.send("fill the details correctly");
     }



    });
const port=3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});