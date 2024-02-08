import axios from "../axios";
import { useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function AddStudyMaterial() {
    const { user } = useAuth();
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const {courseId} = useParams();

    const handleSubmit = async (e: any) => {
        let data = JSON.stringify(
            {
                title: title,
                description: description,
            }
        )
        e.preventDefault();
        try {
            await axios.post(
                `/courses/${courseId}/create`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user?.auth}`, "Accept":"application/json"},
                }
            );
            alert("Study material added.");
        } catch (error) {
            alert(error);
        }
    };

    return user?.isLoggedIn ? (
    <div className="max-w-80 m-auto pt-10">
        <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center"><b>Add a new course:</b></Label>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label><br/>
            <Input
                className="inputTitle"
                type="text"
                onChange={(e: any) => setTitle(e.target.value)}
                placeholder="Title"
                id="title"
                value={title}
                required
            /><br/>
            <Label htmlFor="description">Description</Label><br/>
            <Textarea
                className="inputDescription"
                onChange={(e: any) => setDescription(e.target.value)}
                placeholder="Description"
                id="description"
                value={description}
                required
            ></Textarea><br/>

            <Button className="tablebutton" type="submit">
                Add
            </Button>
        </form>
    </div>) : <Navigate replace to="/"/>;

}