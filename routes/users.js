const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs')
const passport=require('passport');
const User=require('../models/User');
const {ensureAuthenticated}=require('../config/auth');

router.get('/login',(req,res)=>{
    res.render("login");
});

router.get('/register',(req,res)=>{
    res.render("register");
});
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];
if(!name || !email || !password || !password2){
    errors.push({msg:"Please fill in all feilds"});
}
if(password!=password2){
    errors.push({msg:"Passwords do not match"});
}
if(password.length < 4){
    errors.push({msg:"Password should be atleast 4 character"});
}
if(errors.length>0){
res.render('register',{
    errors,
    name,
    email,
    password,
    password2
});
}
else{
    User.findOne({email:email}).then(user=>{
        if(user)
        {
            errors.push({msg: "Email already registered"});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });
            
        }
        else{
            const newUser=new User({
                name,
                email,
                password
            });
          bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save().then(User=>{
                req.flash('success_msg','You are now Registered and can log in');
                res.redirect('/users/login');
            }).catch(err=>console.log(err));
          }))
        }
    }).catch(
        err=> console.log(err));
}

})
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/users/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true

    })(req,res,next);
})
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name
    });
})
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})
module.exports=router;