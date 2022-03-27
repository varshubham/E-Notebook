
import NoteContext from "./NoteContext";
import { useState } from "react";


const NoteState = (props) =>{
    const host = "http://localhost:5000"
    const noteinitial =[]

    

    const [notes,setNotes]=useState(noteinitial)

    const getNotes=async ()=>{

        const response = await fetch(`${host}/api/notes/fetchallnotes`,{
            method:'GET',
            headers:{
                'auth-token':localStorage.getItem('token')
            }
          
        });
       const json = await response.json();
        console.log(json)     
        setNotes(json)   
    }


    //add a note
    const addNote=async (title,description,tag)=>{

        const response = await fetch(`${host}/api/notes/addnote`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });
        const note = await response.json();
        setNotes(notes.concat(note))
    }

    //delete a note
    const deleteNote = async (id)=>{

        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            }
        });
        const json=response.json()
        console.log(json)

        console.log("deleting the note"+id);
        const newNotes=notes.filter((note)=>{return note._id!==id});
        setNotes(newNotes)
    }

    //edit a note
    const editNote = async (id,title,description,tag)=>{
        
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });
        const json = response.json()
        console.log(json)
       
        let newNotes = JSON.parse(JSON.stringify(notes))
    
        for (let index=0; index<newNotes.length; index++){
            if(newNotes[index]._id ===id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes)
    }
    return(
            <NoteContext.Provider value={{notes,setNotes,addNote,deleteNote,editNote,getNotes}}>
                {props.children}
            </NoteContext.Provider>
    );

}

export default NoteState