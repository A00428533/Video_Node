const express = require('express')
const exphbs  = require('express-handlebars');
const app = express()
const path =require('path')
const bodyParser = require('body-parser')
const numcpu = require('os').cpus().length
const cluster = require('cluster');
var process = require('process')
var cors = require('cors');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const ideas = require('./routes/ideas')
const users = require('./routes/users')
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('./config/passport')(passport)

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/Node',{
    useNewUrlParser: true  
})
.then(()=>{
    console.log('mongodb connected')
})
.then(err => console.log(err))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,'public')))
//Express sesion
app.use(session({

    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//flash middleware

app.use(flash())


app.use('/ideas',ideas)
app.use('/users',users)
//Global variables
app.use((req,res,next)=>{

    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()

})


//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/',(req,res)=>{

       const title ="welcome"
        console.log(req.name)
        res.render('index',{
            title:title
        });
})



//About page

app.get('/about',(req,res)=>{

    res.render('about');
})



const port=5000

app.listen(port,()=>{

    console.log('listening')
})