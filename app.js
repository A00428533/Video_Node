const express = require('express')
const exphbs  = require('express-handlebars');
const app = express()
const bodyParser = require('body-parser')
const numcpu = require('os').cpus().length
const cluster = require('cluster');
var process = require('process')
var cors = require('cors');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const {Idea} =require('./models/Idea.js')
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

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use((req,res,next)=>{

    req.name='ankush'
    next()

})


app.get('/',(req,res)=>{

       const title ="welcome"
        console.log(req.name)
        res.render('index',{
            title:title
        });
})

app.get('/ideas/edit/:id',(req,res)=>{

    Idea.findOne({_id:req.params.id}).then(ideas=>{

        res.render('ideas/edit',{
            ideas:ideas
        })

    })    
})

app.put('/ideas/:id',(req,res)=>{

    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{

        idea.title=req.body.title,
        idea.details=req.body.details,

        idea.save()
        .then(idea=>{
            res.redirect('/ideas')
        })
    }

    )
})

app.delete('/ideas/:id',(req,res)=>{

    Idea.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/ideas')
    })


})

app.get('/ideas',(req,res)=>{

    Idea.find({})
        .sort({date:'desc'})
        .then(ideas=>{
            res.render('ideas/index',{
                ideas:ideas
            })
        })

    
})

app.post('/ideas',(req,res)=>{
    console.log('ankush')
    let errors =[]
    if(!req.body.title)
    {
    errors.push({text:'Please add the title'})
    }
    if(!req.body.details)
    {
    errors.push({text:'Please add the description'})
    }
    if(errors.length>0){
        res.render('ideas/add',{

            errors:errors,
            title:req.body.title,
            details:req.body.details

        })

    }
    else{

        const idea = new Idea(req.body)

        idea.save((err,doc)=>{

            if(err) return res.json({success:false,err})
            res.redirect('/ideas')
        })
    }
})


app.get('/ideas/add',(req,res)=>{

    res.render('ideas/add');
})


app.get('/about',(req,res)=>{

    res.render('about');
})

const port=5000

app.listen(port,()=>{

    console.log('listening')
})