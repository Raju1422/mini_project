import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [istogg, settogg] = useState(false);
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  function onchangehandle(e) {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  }

  async function onhandlesubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: data.email,
        password: data.password,
      });

      const { token, username, email, id } = response.data;
      const { access, refresh } = token;

      // Store tokens and user info in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", id);

      toast.success(`Welcome, ${username}!`);
      navigate("/dashboard"); // Redirect to a protected route
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password.");
    }
  }

  return (
    <>
      <div className="container max-w-[500px] mx-auto min-h-[600px] my-11 bg-gray-200 text-black rounded-[20px]">
        <div className="font-bold text-center text-2xl text-black p-3">
          Login
        </div>
        <form className="login-form p-20" onSubmit={onhandlesubmit}>
          <label htmlFor="email" className="font-bold mx-auto text-xl">
            Email:
          </label>
          <br />
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onchangehandle}
            className="outline-none my-4 w-full h-9 px-3 rounded"
            placeholder="Enter your Email"
            required
          />
          <label htmlFor="password" className="font-bold text-xl">
            Password:
          </label>
          <br />
          <div className="inputpass flex items-center justify-between px-2 w-full h-9 my-4 bg-white rounded">
            <input
              type={istogg ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={onchangehandle}
              className="outline-none"
              placeholder="Enter Your Password"
              required
            />
            <div
              onClick={() => {
                settogg(!istogg);
              }}
            >
              {istogg ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <Link
            to="/forgotpassword"
            className="block mx-auto hover:underline hover:text-red-500"
          >
            Forgot password
          </Link>
          <div className="loginbtn flex justify-center my-10">
            <button
              className="bg-blue-800 text-center px-5 py-2 rounded-[10px] text-white hover:bg-red-400 hover:text-black hover:scale-125 transition-all"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="lsignin text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-400 font-bold">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
