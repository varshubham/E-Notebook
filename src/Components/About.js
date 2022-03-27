import React  from 'react'
import NoteContext from '../Context/notes/NoteContext'
import { useContext } from 'react'

const About =()=>{
  const a = useContext(NoteContext)
  
    return (
      <div>
        this is about page {a.name}
      </div>
    )
}


export default About
