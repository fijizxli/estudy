import axios, { fileupload } from "../axios";
import {useState, useEffect} from 'react'
import {Navigate} from "react-router-dom";
import {useAuth} from "../context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";

export default function AddCourse() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [lecturer, setLecturer] = useState("");
    const [lecturers, setLecturers] = useState([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isLoading) {
        const fetchData = async () => {
            
            const lecturersResponse = await axios.get("/role/lecturer", {
            headers: {
                Authorization: `Basic ${user?.auth}`,
                "Content-Type": "application/json",
            },
            });
            setIsLoading(false);
            if (user?.role === "LECTURER" && user != null && user != undefined){
                setLecturer(user?.username);
            }
            setLecturers(lecturersResponse.data);
        }
        fetchData();
    }
    }, []);

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
                lecturerName: lecturer,
            }
        )
        e.preventDefault();
        try {
            const response = await axios.post(
                "/courses/create",
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user?.auth}`, "Accept":"application/json"},
                }
            );
            if (file != null && response.status==201){
                const formData = new FormData();
                const courseId = response.data
                formData.append('file', file);
                const uploadresponse = await fileupload.post("/upload/cover/"+courseId.toString(), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if (uploadresponse.status === 200){
                    alert("Course added.");
                }
            }
        } catch (error) {
            alert(error);
        }
    };
    if (isLoading) {
        return (
            <div>
                <h2>loading...</h2>
            </div>
        );
    } else {
        return user?.isLoggedIn ? (
            <div className="max-w-80 m-auto pt-10">
                <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center"><b>Add a new course:</b></Label>
                <form onSubmit={handleSubmit}>
                    <Label htmlFor="title">Title</Label><br/>
                    <Input
                        className=""
                        type="text"
                        onChange={(e: any) => setTitle(e.target.value)}
                        placeholder="Title"
                        id="title"
                        value={title}
                        required
                    /><br/>
                    <Label htmlFor="lecturer">Lecturer</Label><br/>
                    {user?.role === "ADMIN" ? 
                    <div>
                    <Select value={lecturer} onValueChange={(value) => setLecturer(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={lecturer}/>
                        </SelectTrigger>
                        <SelectContent>
                        {lecturers.map((u: User) => (
                            <SelectItem key={u.id} value={u.username}>{u.username}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    : 
                    <div>
                        {user?.role === "LECTURER" ?

                        <div>
                            <Label><u>{lecturer}</u></Label>
                        </div>
                        : 
                        <div></div>
                        }
                    </div>
                    }
                    <br />
                    <Label htmlFor="description">Description</Label><br/>
                    <Textarea
                        className="h-40"
                        onChange={(e: any) => setDescription(e.target.value)}
                        placeholder="Description"
                        id="description"
                        value={description}
                        required
                    ></Textarea><br/>
                    <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
                        <Label htmlFor="picture">Cover</Label>
                        <Input id="file" type="file" onChange={handleFileChange} />
                    </div>
                    <Button className="" type="submit">
                        Add
                    </Button>
                </form>
            </div>) : <Navigate replace to="/"/>;
        }
    }