import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../redux/authSlice";
import { RxCross1 } from "react-icons/rx";
import "./Login.css";
import { NavLink, Link } from "react-router-dom";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
         dispatch(fetchUser());
      console.log("Login successfully");
      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
   
  };
  return (
    <div className="Login_page">
      <div className="loginhead">
        <img src="./logo.png" alt="" />
        <span>
          <NavLink to={"../"}>
            <RxCross1 />
          </NavLink>
        </span>
      </div>

      <div className="loginmain">
        <div className="loginform">
          <form action="" onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <input
              type="mail"
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
            <button>Sign in</button>
            <span>
             
              <a href="/register">Forgot Password ?</a>
            </span>
          </form>
        </div>

        <div className="registerform">
          <h2>Create an account</h2>
          <p>
          Create a Subla Camp account right away if you don't already have one so you can quickly access your booking information, special deals, and customized experiences in My Account.{" "}
          </p>
          <Link className="sign-up-button" to={"/register"}>
            Create Account
          </Link>
          {/* <Link className="sign-up-button" to={"/adminLogin"}>
            Login as Admin
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
