import axios, { fileupload } from "../axios";
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
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: any) => {
        let data = JSON.stringify(
            {
                title: title,
                description: description,
            }
        )
        e.preventDefault();
        try {
            const response = await axios.post(
                `/courses/${courseId}/create`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user?.auth}`, "Accept":"application/json"},
                }
            );
            if (file != null && response.status==201){
                const formData = new FormData();
                const studymaterialId = response.data
                formData.append('file', file);
                const uploadresponse = await fileupload.post("/upload/file/"+studymaterialId.toString(), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if (uploadresponse.status === 200){
                    alert("Document added.");
                } else {
                    alert("Document added, file upload did not succeed.");
                }
            } else {
                    alert("Document added.");
            }
        } catch (error) {
            alert(error);
        }
    };

    return user?.isLoggedIn ? (
    <div className="max-w-80 m-auto pt-10">
        <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center"><b>Add a new document:</b></Label>
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
            <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
                <Label htmlFor="file">Document</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
            </div>
            <Button className="" type="submit">
                Add
            </Button>
        </form>
    </div>) : <Navigate replace to="/"/>;

}