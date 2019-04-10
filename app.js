const express=require('express');
const app=express();
const PORT=process.env.PORT||5000;
app.use(express.urlencoded({extended:false}))
const passport=require('passport');

require('./config/passport')(passport);
const flash=require('connect-flash');
const session=require('express-session');


const mongoose=require('mongoose');
const db=require('./config/keys').MongoURI;
mongoose.connect(db,{useNewUrlParser:true}).then(()=>console.log("MongoDb Connected.....")).catch(err => console.log(err));

const expressLayout=require('express-ejs-layouts');
app.use(expressLayout);
app.set('view engine','ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));


app.use(passport.initialize());
app.use(passport.session()); 

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.listen(PORT,console.log(`Server started on ${PORT}`));
