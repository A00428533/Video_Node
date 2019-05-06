const express = require('express')
const router = express.Router()
const {Idea} =require('../models/Idea')

router.get('/edit/:id',(req,res)=>{

    Idea.findOne({_id:req.params.id}).then(ideas=>{

        res.render('ideas/edit',{
            ideas:ideas
        })

    })    
})

//Update user

router.put('/:id',(req,res)=>{

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


//Delete user
router.delete('/:id',(req,res)=>{

    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','video idea removed')
        res.redirect('/ideas')
    })


})

//All videos

router.get('/',(req,res)=>{

    Idea.find({})
        .sort({date:'desc'})
        .then(ideas=>{
            res.render('ideas/index',{
                ideas:ideas
            })
        })

    
})

// Add videos
router.post('/',(req,res)=>{
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

// Add videos
router.get('/add',(req,res)=>{

    res.render('ideas/add');
})

module.exports = router