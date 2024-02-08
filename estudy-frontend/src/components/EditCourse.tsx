import axios from "../axios";
import  {useState, useEffect } from 'react'
import {useAuth} from "../context";
import {Navigate, useParams} from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export default function EditCourse() {
    const { user } = useAuth();
    const [course] = useState<any | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [lecturer, setLecturer] = useState([]);
    const {courseId} = useParams();

    useEffect(()=> {
    if (isLoading) {
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId, {
                headers: {
                    'Authorization': `Basic ${user?.auth}`,
                    'Content-Type': 'application/json',
                },
            })
            setIsLoading(false);
            setTitle(response.data.title)
            setDescription(response.data.description)
            setLecturer(response.data.lecturer)
        }

        fetchData();
    }
    }, []) ;

    const handleSubmit = async (e: any) => {
        let data = JSON.stringify(
            {
                title: title,
                description: description,
                lecturer: lecturer,
            }
        )
        e.preventDefault();
        try {
            await axios.patch(
                `/courses/${courseId}`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user?.auth}`, "Accept":"application/json"},
                }
            );
            alert("Course edited.");
        } catch (error) {
            alert(error);
        }
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
            <Label htmlFor="title">Title</Label><br/>
            <Input
                className=""
                type="text"
                onChange={(e: any) => setTitle(e.target.value)}
                placeholder="title"
                id="title"
                value={title}
                required
                defaultValue={course?.title}
            /><br/>
            <Label htmlFor="lecturer">Lecturer</Label><br/>
            <Input
                className=""
                type="text"
                onChange={(e: any) => setLecturer(e.target.value)}
                placeholder="lecturer"
                id="lecturer"
                value={lecturer}
                defaultValue={course?.lecturer}
                required
            /><br/>
            <Label htmlFor="description">Description</Label><br/>
            <Textarea
                className="h-40"
                onChange={(e: any) => setDescription(e.target.value)}
                placeholder="Description"
                id="description"
                value={description}
                defaultValue={course?.description}
                required
            ></Textarea><br/>
            <Button className="" type="submit">
                Edit
            </Button>
        </form>
    </div>) : <Navigate replace to="/"/>
    };
}