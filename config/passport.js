const localStrategy = require('passport-local')
.Strategy;
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const {User} = require('../models/user')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField:'email'},(email,password,done)=>{
    
        console.log(email)
        console.log(password)
    }
        ))

}