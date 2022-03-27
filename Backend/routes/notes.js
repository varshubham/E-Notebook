const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');


//Route 1 : get all th notes using : Get 


router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try{
    const notes = await Notes.find({user:req.user.id})
    res.json(notes)
    }catch(error){
        res.status(500).send("Internal Server error")
    }
})

//route 2 : add a note: post
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 character').isLength({min:5})
],async (req,res)=>{
    try{
    const {title,description,tag} = req.body
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const note = new Notes({
        title,description,tag,user:req.user.id
    })
    const savedNote = await note.save();

    res.json(savedNote)
}catch(error){
    res.status(500).send("Internal Server error")
}
})

// route 3 : update a existing user
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try{
    const {title,description,tag} = req.body;
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag};
    
    //find the note to be updated and update it
    let note =await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed")
    }
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note})
}catch(error){
    res.status(500).send("Internal Server error")
}
})

// route 4: deleting a note
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try{
        // find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        
        if (note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note})
    }catch(error){
        res.status(500).send("Internal Server error")
    }
})
module.exports = router