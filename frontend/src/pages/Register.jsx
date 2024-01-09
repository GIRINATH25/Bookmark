import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Register = () => {

  const navi=useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const login = await axios.post('/register', { email, password });
  
      const result = login.data;
      if(result.message === 'registration successfull'){
        toast.info(result.message);
        navi('/');
      }else{
        var s = result.message;  
        toast.info(s);
      }
      console.log(result.message);
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
    }
  };

  return (
    <div className="by">
    <div className="container">
    <div className="heading">Register</div>
    <div className="input-box">
    <input
      className="input-field"
      type="email"
      onChange={(e) => {
        setEmail(e.target.value);
      }}
      placeholder="Email or Name"
    />
  </div>
  <div className="input-box">
    <input
      className="input-field"
      type="password"
      onChange={(e) => {
        setPassword(e.target.value);
      }}
      placeholder="Password"
    />
  </div>
  <div className="input-box">
    <input className="input-submit" type="submit" onClick={submit} />
    <Link className="forgot" to={"/"}>Have an account</Link>
  </div>
  </div>
    </div>
  )
}

export default Register