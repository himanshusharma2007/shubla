import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/footer/Footer';
import adminService from '../../services/adminService'; // Adjust the import path as needed

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    console.log("admin login called")
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminService.loginAdmin({ email, password });
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
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
          <div className="loginform">
            <form onSubmit={handleAdminLogin}>
              <h2>Sign in as Admin</h2>
              
              {error && (
                <div className="error-message text-red-500 mb-4">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 mb-4 border rounded"
              />
              <button 
                type="submit"
                disabled={loading}
                className={`w-full p-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              
              <span className="flex justify-between items-center mt-4">
                <label className="flex items-center">
                  <input type="checkbox" name="remember" className="mr-2" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
                  Forgot Password?
                </Link>
              </span>
            </form>
          </div>

          <div className="registerform">
            <h2>Create an account</h2>
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
           
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;