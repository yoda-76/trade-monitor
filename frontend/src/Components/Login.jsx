import React from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        if (data.status === "ok") {
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("email", data.email);
          window.localStorage.setItem("userdata", JSON.stringify(data.data));
          window.location.href = "./userDetails";
        } else {
          setError("Invalid email or password");
        }
      })
      .catch((error) => {
        setError("An error occurred during login");
      });
  };
  return <></>;
};
