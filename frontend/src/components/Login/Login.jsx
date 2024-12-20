import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';
import { RxCross1 } from "react-icons/rx";
import './Login.css'
import { NavLink, Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state)=> state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({email, password}));

    if(isAuthenticated) {
      navigate('/');
    } else {
      alert("Invalid Credentials");
    }
  }
  return (
    <div className='Login_page' >
      <div className="loginhead">
        <img src="./logo.png" alt="" />
        <span>
        <NavLink to={'../'}><RxCross1 /></NavLink> 
        </span>
      </div>

      <div className="loginmain">
        <div className="loginform">
            <form action="" onSubmit={handleLogin}>
                <h2>Sign in</h2>
                <input type="mail" placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button>Sign in</button>
                <span>
                    <input type="checkbox" name='remember' />
                    <label htmlFor="remember">Remember me</label>
                    <a href="/register">Forgot Password ?</a>
                </span>
                
            </form>
        </div>

        <div className="registerform">
          <h2>Create an account</h2>
          <p>If you don not yet have an RH account, please create one now so you can easily access your RH Members Program details and order information in My Account. </p>
            <Link className='sign-up-button' to={'/register'}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
