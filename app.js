require('dotenv').config();
const express=require('express');
const app=express();
const userModel=require('./models/user');
const postModel=require('./models/post');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));   
app.use(express.json());
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/profile',isLoggedIn, async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    await user.populate('posts');
    res.render('profile',{user});
})

app.get('/like/:id',isLoggedIn, async (req,res)=>{
    let post=await postModel.findOne({_id:req.params.id}).populate('user');

    if(post.likes.indexOf(req.user.userid)===-1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1);
    }
    await post.save();
    const from = req.query.from;

    if (from === 'feed') {
        return res.redirect('/feed');
    } else {
        return res.redirect('/profile');
    }
})

app.get('/edit/:id',isLoggedIn, async (req,res)=>{
    let post=await postModel.findOne({_id:req.params.id}).populate('user');
    res.render('edit',{post});
})

app.post('/update/:id',isLoggedIn, async (req,res)=>{
    let post=await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content});
    res.redirect('/profile');
})

app.get('/feed', isLoggedIn, async (req, res) => {
    let posts = await postModel
        .find()
        .populate('user'); // get post owner details

    res.render('feed', {
        posts,
        loggedInUserId: req.user.userid
    });
});


app.post('/post',isLoggedIn, async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    let{content}=req.body;
    let post=await postModel.create({
        content,
        user:user._id
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
})

app.post('/register',async (req,res)=>{
   let{username,email,name,password,age}=req.body;
   let user= await userModel.findOne({email});
   if(user) return res.status(500).send('User already exists');

   bcrypt.genSalt(10,async (err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
       let user=await userModel.create({
        username,
        email,
        name,
        password:hash,
        age
       });
       let token=jwt.sign({email:email, userid:user._id},"shhh");
        res.cookie('token',token);
       res.send('User Registered Successfully');
    });
   });
});

app.post('/login',async (req,res)=>{
    let{email,password}=req.body;
    let user= await userModel.findOne({email});
    if(!user) return res.status(500).send('Something Went Wrong');

    bcrypt.compare(password,user.password, (err,isMatch)=>{
    if(isMatch){ 
        let token=jwt.sign({email:email, userid:user._id},"shhh");
        res.cookie('token',token);
        return res.redirect('/profile');
    }
    else return res.redirect('/login');
    });

});

app.get('/logout',(req,res)=>{
    res.clearCookie('token','');
    res.redirect('/login');
})

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, 'shhh');
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

app.listen(5000)
