import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from './Alert';
const Login = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [alerts,setAlerts] = useState(null)
    const [show,setShow]=useState(false)
    
    const handleclick = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json)
        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            setAlerts({type:"success",msg:"Logged in Successfully"})
            setShow(true)
            setTimeout(() => {
                setShow(false)
                navigate('/')
            }, 1500);
            
        }
        else {
            setAlerts({type:"danger",msg:"Invalid Credentials"})
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
            {show && <Alert alert={alerts}/>}
            <div className='container my-3'>
                <h1 className='text-center'>Login to E-Notes</h1>
            <form className='my-3' onSubmit={handleclick}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' id="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange} required />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' id="password" value={credentials.password} onChange={onChange} required />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default Login

