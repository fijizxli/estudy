import React, { useState, useContext } from "react";
import DataContext from "../context";
import closeButton from "../close-button.svg";
import axios from "../axios";
import ErrorMessage from "./ErrorMessage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {icon} from "@fortawesome/fontawesome-svg-core/import.macro";

function Login() {
    const { setUserName, setUserId, setIsLoggedIn, setUser, setAuthModalType } = useContext(DataContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const credentials = `${username}:${password}`;
            const base64 = btoa(credentials);
            const response = await axios.get(
                "/login",{
                    headers: {
                        'Authorization':`Basic ${base64}`,
                        'Content-Type':'application/json',
                    },
                }
            );
            const user = await axios.get(
                "/userbyname/" + username,{
                    headers: {
                        'Authorization':`Basic ${base64}`,
                        'Content-Type':'application/json',
                    },
                }
            );


            setUserId(user.data.id)
            setUserName(username);
            setUser(base64);
            setIsLoggedIn(true);
            setErrorPresent(false);
            setAuthModalType("Inactive");
        } catch (error) {
            console.log(error)
            setErrorPresent(true);
        }
    };

    return (
        <div className="AuthShadow">
            <div className="AuthContainer">
                <div className="Titlebar">
                    <h1>Sign in <FontAwesomeIcon icon={icon({name:"user"})}/></h1>
                    <img
                        src={closeButton}
                        alt="close-button"
                        className="Close"
                        onClick={() => setAuthModalType("Inactive")}
                    />
                </div>
                {errorPresent ? <ErrorMessage text={errorMessage} /> : null}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        <b>username</b>
                    </label>
                    <input
                        className="AuthInput"
                        type="text"
                        placeholder="username"
                        id="username"
                        values={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">
                        <b>password</b>
                    </label>
                    <input
                        className="AuthInput"
                        type="password"
                        placeholder="password"
                        id="password"
                        values={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="AuthSubmit" type="submit">
                        Sign in <FontAwesomeIcon icon={icon({name: 'lock'})}/>
                    </button>
                </form>
            </div>
        </div>
    );
}
function Register() {
    const { setIsLoggedIn, setUser, setAuthModalType } = useContext(DataContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = JSON.stringify(
                {
                    username: username,
                    password: password,
                    confirmPassword: confirmPassword,
                }
            )
            e.preventDefault();
            const response = await axios.post(
                "/register",data,
                {
                    headers: {
                        'Content-Type':'application/json',
                    },
                }
            );

            setErrorPresent(false);
            setAuthModalType("Inactive");
        } catch (error) {
            const message = Object.values(error.response.data)[0];
            setErrorMessage(message);
            setErrorPresent(true);
        }
    };

    return (
        <div className="AuthShadow">
            <div className="AuthContainer">
                <div className="Titlebar">
                    <h1>Register <FontAwesomeIcon icon={icon({name:"user-plus"})}/></h1>
                    <img
                        src={closeButton}
                        alt="close-button"
                        className="Close"
                        onClick={() => setAuthModalType("Inactive")}
                    />
                </div>
                {errorPresent ? <ErrorMessage text={errorMessage} /> : null}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        <b>username</b>
                    </label>
                    <input
                        className="AuthInput"
                        type="text"
                        placeholder="username"
                        id="username"
                        values={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">
                        <b>password</b>
                    </label>
                    <input
                        className="AuthInput"
                        type="password"
                        placeholder="password"
                        id="password"
                        values={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirm password">
                        <b>password</b>
                    </label>
                    <input
                        className="AuthInput"
                        type="password"
                        placeholder="password"
                        id="password"
                        values={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="AuthSubmit" type="submit">
                        Register <FontAwesomeIcon icon={icon({name: 'lock'})}/>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AuthenticationModal() {
    const {AuthModalType} = useContext(DataContext);

    switch (AuthModalType) {
        case "Login":
            return Login();
        case "Register":
            return Register();
        default:
            return null;
    }
}
