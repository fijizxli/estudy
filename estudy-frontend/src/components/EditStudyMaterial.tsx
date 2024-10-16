import axios, { fileupload } from "../axios";
import {useState, useEffect } from 'react'
import {useAuth} from "../context";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function EditStudyMaterial() {
    const { user } = useAuth();
    const [studyMaterial] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const {courseId} = useParams();
    const {studyMaterialId} = useParams();
    const [file, setFile] = useState<File | null>(null);
    const [filePath, setFilePath] = useState<string>("");

    const nav = useNavigate();

    useEffect( ()=>{
    if (isLoading) {
        const fetchData = async () => {
            const response = await axios.get(`/courses/${courseId}/${studyMaterialId}`, {
                headers: {
                    'Authorization': `Basic ${user?.auth}`,
                    'Content-Type': 'application/json',
                }},
            )
            setTitle(response.data.title);
            setDescription(response.data.description);
            setIsLoading(false);
        }
        fetchData();
    }
    }, []);

    useEffect( () => {
        fileupload.get("/file/"+studyMaterialId).then( response => {
            setFilePath(response.data.urls[0]);
        }
        );
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: any) => {
        if (file != null){
            const formData = new FormData();
            formData.append('file', file);
            if (filePath != ""){
                fileupload.put("/file/"+studyMaterialId, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
            } else {
                fileupload.post("/upload/file/"+studyMaterialId, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
            }
        }
        let data = JSON.stringify(
            {
                title: title,
                description: description,
            }
        )
        e.preventDefault();
        try {
            await axios.patch(
                `/courses/${courseId}/${studyMaterialId}`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user?.auth}`, "Accept":"application/json"},
                }
            );
            alert("Study material edited.");
        } catch (error) {
            alert(error);
        }
        nav(`/courses/${courseId}/${studyMaterialId}`);
    };

    if (isLoading){
        return (
            <div>
                <h2>loading...</h2>
            </div>
        )
    } else {
        return user?.isLoggedIn ? (
        <div className="max-w-80 m-auto pt-10">
            <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center"><b>Edit course:</b></Label>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label><br/>
                <Input
                    className="inputTitle"
                    type="text"
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="Title"
                    defaultValue={studyMaterial?.title}
                    id="title"
                    value={title}
                    required
                /><br/>
                <Label htmlFor="description">Description</Label><br/>
                <Textarea
                    className="inputDescription"
                    onChange={(e: any) => setDescription(e.target.value)}
                    defaultValue={studyMaterial?.description}
                    placeholder="Description"
                    id="description"
                    value={description}
                    required
                ></Textarea><br/>
                <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
                    <Label htmlFor="file">Document</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                </div>
                <Button className="tablebutton" type="submit">
                    Edit
                </Button>
            </form>
        </div>) : <Navigate replace to="/"/>;
    }

}