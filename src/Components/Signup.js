import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from './Alert';


const Signup = () => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [alerts, setAlerts] = useState(null)
  const [show, setShow] = useState(false)
  const handleclick = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      setAlerts({ type: "success", msg: "Signed up Successfully" })
      setShow(true)
      setTimeout(() => {
        setShow(false)
        navigate('/')
      }, 1500);
    }
    else {
      setAlerts({ type: "danger", msg: "Email already exist" })
      setShow(true)
      setTimeout(() => {
        setShow(false)
      }, 1500);
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div>
      {show && <Alert alert={alerts} />}
      <div className='container my-3'>
        <h1 className='text-center'>Signup to E-Notes</h1>
        <form className='my-3' onSubmit={handleclick}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name='name' onChange={onChange} required />

          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" required />

          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
