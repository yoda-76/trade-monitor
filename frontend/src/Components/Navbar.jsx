import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerUserName, setRegisterUserName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = () => {
    // console.log(registerFullName,registerEmail,registerPassword,registerUserName)
    fetch("http://localhost:5000/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        Username: registerUserName,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        res.emailExists ? setEmailError(true) : setEmailError(false);
        res.usernameExists ? setUsernameError(true) : setUsernameError(false);
        if (!emailError && !usernameError) {
          fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              FullName: registerFullName,
              email: registerEmail,
              password: registerPassword,
              Username: registerUserName,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res, "userRegister");
              setRegisterEmail("");
              setRegisterFullName("");
              setRegisterPassword("");
              setRegisterUserName("");
              setRegistration(true);
            })
            .catch((error) => {
              console.error("Registration failed:", error);
              setRegistration(false);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking email and username:", error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(loginEmail, loginPassword);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        if (data.status === "ok") {
          setIsLoggedIn(true);
          window.localStorage.setItem("token", data.token);
          // window.localStorage.setItem("email", data.email);
          window.localStorage.setItem("userdata", JSON.stringify(data.data));

          console.log("refreshing")
          window.location.reload(true);
        } else {
          setError("Invalid email or password");
        }
      })
      .catch((loginError) => {
        setLoginError("An error occurred during login");
      });
  };

  const handleLogout = () => {
    // Clear token from local storage
    console.log("first");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userdata");

    setIsLoggedIn(false);
  };

  return (
    <div className="navbar text-white  px-[5rem] fixed top-0 z-10 bg-[#191A1F]">
      <div className="navbar-start">
        {/* small screen menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Paper Trading</Link>
            </li>
            <li>
              <Link to="/marketplace">Market Place</Link>
            </li>
            <li>
              <Link to="/marketplace">Trading</Link>
            </li>
          </ul>
        </div>
        {/* heading */}
        <a className="btn btn-ghost font-bold text-xl">Instacorp Securities</a>
      </div>

      {/* Login/Register Modal */}
      <div className="navbar-end">
        {isLoggedIn ? (
          <button
            className="bg-white text-black rounded-md font-bold text-[12px] px-[23px] py-[7px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : 
        (
          <button
            className="bg-white text-black rounded-md font-bold text-[12px] px-[23px] py-[7px]"
            onClick={() => window.loginModal.showModal()}
          >
            Login
          </button>
        )}

        {/* login model`` */}
        <dialog id="loginModal" className="modal ">
          {isLoggedIn ? (
            <form
              method="dialog"
              className="bg-[#191A1F] text-white modal-box flex flex-col gap-2"
            >
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              <h4 className="font-bold my-4 flex flex-col text-md">
                Login Successful
              </h4>
            </form>
          ) : (
            <form
              method="dialog"
              className="bg-[#191A1F] text-lg text-white modal-box flex flex-col gap-2"
            >
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              <h4 className="font-bold my-4 flex flex-col text-4xl">Login</h4>
              <input
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                }}
                className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
              />

              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                }}
                className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
              />
              <Link
                onClick={handleLogin}
                className="bg-white w-fit text-black rounded-md font-bold text-[16px] px-[23px] py-[7px]"
              >
                Sign In
              </Link>
              <p className="py-4">Don't have a account?</p>
              <a
                onClick={() => window.registerModal.showModal()}
                className="bg-white text-black rounded-md w-fit font-bold text-[16px] px-[23px] py-[7px]"
              >
                Register
              </a>
              {/* register model */}
              <dialog id="registerModal" className="modal ">
                {registration ? (
                  <form
                    method="dialog"
                    className="modal-box flex flex-col gap-2"
                  >
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <h4 className="font-bold my-4 flex flex-col text-md">
                      Registration Successful. Kindly Login aggain
                    </h4>
                  </form>
                ) : (
                  <form
                    className="bg-[#191A1F] text-white modal-box flex flex-col gap-2"
                    method="dialog"
                  >
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <h4 className="font-bold my-4 flex flex-col text-4xl">
                      Register
                    </h4>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      onChange={(e) => {
                        setRegisterFullName(e.target.value);
                      }}
                      className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
                    />

                    <input
                      type="text"
                      placeholder="Enter your email"
                      onChange={(e) => {
                        setRegisterEmail(e.target.value);
                      }}
                      className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
                    />
                    {emailError ? (
                      <span className="text-red-600 text-sm">
                        Email already exists
                      </span>
                    ) : (
                      <></>
                    )}

                    <input
                      type="password"
                      onChange={(e) => {
                        setRegisterPassword(e.target.value);
                      }}
                      placeholder="Enter your password"
                      className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
                    />

                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="my-4 input bg-transparent rounded-none text-lg border-b-[1px] border-t-[0px] border-r-[0px] border-l-[0px] border-white input-bordered w-full max-w-xs"
                      onChange={(e) => {
                        setRegisterUserName(e.target.value);
                      }}
                    />
                    {usernameError ? (
                      <span className="text-red-600 text-sm">
                        Username already exists
                      </span>
                    ) : (
                      <></>
                    )}

                    <a
                      className="bg-white w-fit text-black rounded-md font-bold text-[16px] px-[23px] py-[7px]"
                      onClick={handleRegister}
                    >
                      Register
                    </a>
                    <p className="my-4">Already have a account?</p>
                    <button className="bg-white w-fit text-black rounded-md font-bold text-[16px] px-[23px] py-[7px]">
                      Sign In
                    </button>
                  </form>
                )}
              </dialog>
            </form>
          )}
        </dialog>
      </div>
    </div>
  );
};

export default Navbar;
