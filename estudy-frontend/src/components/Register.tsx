import { useState } from "react";
import {useAuth} from "../context";
import axios from "../axios";
import * as ax from 'axios';
import ErrorMessage from "./ErrorMessage";
import closeButton from "../../close-button.svg";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { fileupload } from "@/axios";

export default function Register() {
    const [username, setUsername] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const { setModalType } = useAuth();

    const handleSubmit = async (e: any) => {
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
                "/register", data,
                {
                    headers: {
                        'Content-Type':'application/json',
                    },
                }
            );

            if (file != null && response.status === 201){
                const formData = new FormData();
                formData.append('file', file);
                const credentials = `${username}:${password}`;
                const user = btoa(credentials);
                const userResponse = await axios.get("/userbyname/"+username,
                    {
                        headers: {
                            'Authorization': `Basic ${user}`,
                            'Content-Type': 'application/json',
                    }});

                //const response = 
                await fileupload.post("/upload/avatar/"+userResponse.data.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }, 
                })
            }

            setErrorPresent(false);
            setModalType("Inactive");
        } catch (error) {
            if(ax.isAxiosError(error) && error.response){
                setErrorMessage(error.response["status"].toString())
                setErrorPresent(true);
            }
        }
    };

    return (
        <div className="pt-4 h-max-80 flex justify-center">
            <div className="fixed flex flex-col md:p-8 w-80 m-20 bg-white border rounded-md p-4">
                <div className="flex items-center justify-between md:p-4">
                    <h1><b>Register</b></h1> 
                    <img
                        src={closeButton}
                        alt="close-button"
                        className="h-8 flex-row items-center"
                        onClick={() => setModalType("Inactive")}
                    />
                </div>
                {errorPresent ? <ErrorMessage text={errorMessage} /> : null}
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="username">
                        <b>username</b>
                    </Label>
                    <Input
                        className="w-100 pu-0 mb-2 mu-4 inline-block radius-10 box"
                        type="text"
                        placeholder="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="emailAddress">
                        <b>email address: </b>
                    </Label>
                    <Input
                        className="w-100 pu-0 mb-2 mu-4 inline-block radius-10 box"
                        type="text"
                        placeholder="emailaddress@example.com"
                        id="emailAddress"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">
                        <b>password</b>
                    </Label>
                    <Input
                        className="w-100 pu-0 mb-2 mu-8 inline-block radius-10 box"
                        type="password"
                        placeholder="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="confirm password">
                        <b>confirm password</b>
                    </Label>
                    <Input
                        className="w-100 pu-0 mb-2 mu-8 inline-block radius-10 box"
                        type="password"
                        placeholder="password"
                        id="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
                    <Label htmlFor="picture">Profile picture</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                    </div>
                    <Button type="submit">
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
}