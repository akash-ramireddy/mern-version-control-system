import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";

import { Button, PageHeader } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Signup = () => {
    let [username,setUsername] = useState("");
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [loading,setLoading] = useState(false);

    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3000/signup/", {
                username,
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrentUser(res.data.userId);

            navigate("/");
        }
        catch (err) {
            console.error(err);
            alert("Signup Failed!");
        } finally {
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
                                <PageHeader.Title>Sign Up</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                    </div>
                </div>

                <div className="login-box">
                    <div>
                        <label className="label">Username</label>
                        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} />
                    </div>

                    <div>
                        <label className="label">Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>

                    <Button
                        variant="primary"
                        className="login-btn"
                        disabled={loading}
                        onClick={handleSignup}
                    >
                        {loading ? "Loading..." : "Signup"}
                    </Button>
                </div>

                <div className="pass-box">
                    <p>
                        Already have an account? <Link to="/auth">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
