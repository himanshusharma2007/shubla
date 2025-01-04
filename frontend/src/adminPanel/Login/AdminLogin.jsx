import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/footer/Footer';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="Login_page">
        <div className="loginhead">
          <img src="./logo.png" alt="Logo" />
          <span>
            <NavLink to="../">
              <RxCross1 />
            </NavLink>
          </span>
        </div>

        <div className="loginmain">
          {/* Login Form */}
          <div className="loginform">
            <form>
              <h2>Sign in as Admin</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">
                Sign in
              </button>
              <span>
                <label>
                  <input type="checkbox" name="remember" className="mr-2" />
                  Remember me
                </label>
                <a href="/register">
                  Forgot Password?
                </a>
              </span>
            </form>
          </div>

          {/* Register Section */}
          <div className="registerform">
            <h2>
              Create an account
            </h2>
            <p>
              If you do not yet have an RH account, please create one now so you can
              easily access your RH Members Program details and order information in
              My Account.
            </p>
            <Link
              to="/register"
              className="sign-up-button"
            >
              Create Account
            </Link>
            <Link
              to="/Login"
              className="sign-up-button"
            >
              Login as User
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;