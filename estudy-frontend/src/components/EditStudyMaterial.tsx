import axios from "../axios";
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


    const handleSubmit = async (e: any) => {
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

                <Button className="tablebutton" type="submit">
                    Edit
                </Button>
            </form>
        </div>) : <Navigate replace to="/"/>;
    }

}