import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/authSlice';
import './Register.css'; // Import custom CSS
import { RxCross1 } from "react-icons/rx";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        const user = { name, email, password };
        dispatch(signUp(user));
        alert('Sign up successfully');
        navigate('/login');
    };

    return (
        <>
        <div className="register">
                <div className="loginhead">
                    <img src="./logo.png" alt="" />
                    <span>
                    <NavLink to={'..'}><RxCross1 /></NavLink> 
                    </span>
                </div>
                <div className="register-inner">
                    <h2>Create an Account</h2>
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            id="name"
                            className="register-input"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            id="email"
                            className="register-input"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            id="password"
                            className="register-input"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            id="confirmPassword"
                            className="register-input"
                            placeholder="Confirm your password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button type="submit" className="register-button">Sign Up</button>
                    </form>
                    <p className="register-footer">
                    Already have an account? <Link to="/login" className="register-link">Login</Link>
                    </p>
                </div>
        </div>

        </>
    );
};

export default Register;
