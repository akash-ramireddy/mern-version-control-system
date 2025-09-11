import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";

import { Button, PageHeader } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setCurrentUser } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3002/login", {
                email: email,
                password: password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrentUser(res.data.userId);
            setLoading(false);

            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Login Failed!");
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-logo-container">
                <img className="logo-login" src={logo} alt="Logo" />
            </div>

            <div className="login-box-wrapper">
                <div className="login-heading">
                    <div className="box">
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.Title>Sign In</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                    </div>
                </div>
                <div className="login-box">
                    <div>
                        <label className="label">Email address</label>
                        <input
                        autoComplete="off"
                        name="Email"
                        id="Email"
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="div">
                        <label className="label">Password</label>
                        <input
                        autoComplete="off"
                        name="Password"
                        id="Password"
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="login-btn"
                        disabled={loading}
                        onClick={handleLogin}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </div>
                <div className="pass-box">
                    <p>
                        New to GitHub? <Link to="/signup">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;