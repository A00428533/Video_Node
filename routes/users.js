const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Login route
router.get('/Login',(req,res)=>{
    
    res.render('users/login')

})

router.post('/Login',(req,res,next)=>{

    passport.authenticate('local',{

        successRedirect:'/ideas',
        failureRedirect:'/users/Login',
        failureFlash:true
    })(req,res,next)

})

//Register user
router.get('/Register',(req,res)=>{

    res.render('users/registeration') 
})

router.post('/Register',(req,res)=>{

    let errors=[]
    if(req.body.password.length<4) {
    errors.push({text:'password length less then 4'})
    }
    
    if(errors.length>0){
    
    res.render('users/registeration',{
        errors:errors,
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        password2:req.body.password2
    })
    }else{

        User.findOne({email:req.body.email})
        .then(data=>{
            if(data)
            {
                req.flash('error_msg','Alreadt existing user')
                res.redirect('/users/Login')
            }
            else{
                }
        })

        const user = new User({

        name:req.body.name,
        email:req.body.email,
        password:req.body.password

        })

        bcrypt.genSalt(10,(err, salt)=>{

            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err) throw err
                user.password=hash
                user.save()
                .then(user=>{
                req.flash('success_msg','you are a registered user')
                res.redirect('/users/Login')
                })
                .catch(err=>{
                    console.log(err)
                    return
                })
            })
        })
    }



})

module.exports = router