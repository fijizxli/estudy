import axios, { fileupload } from "../axios";
import {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom';
import {useAuth} from "../context";
import {Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Course } from '../types';
import { Pencil2Icon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function MyCourses() {
    const { user } = useAuth(); 
    const [courses, setCourses] = useState([]);
    const [lecturerCourses, setLecturerCourses] = useState([]);
    const [avatarPath, setAvatarPath] = useState<string>("");
    const [username, setUsername] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(()=> {
            axios.get('/' + user?.username + '/courses', {
                headers: {
                    'Authorization': `Basic ${user?.auth}`,
                    'Content-Type': 'application/json',
                }}).then(function (response) {
                    setCourses(response.data)
                })

                if (user?.role === "LECTURER"){
                    axios.get('/courses/lecturer/' + user?.username, {
                        headers: {
                            'Authorization': `Basic ${user?.auth}`,
                            'Content-Type': 'application/json',
                        }}).then(function (response) {
                            setLecturerCourses(response.data)
                        })
                    }
    },[]) ;
    if (user != null){
        fileupload.get("/avatar/"+user.id.toString()).then( response => {
            setAvatarPath(response.data.url[0]);
        }
        );
    }

    const handleEdit = () => {
        if (file != null){
            const formData = new FormData();
            formData.append('file', file);
            if (avatarPath != ""){
                fileupload.put("/avatar/"+user?.id.toString(), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
            } else {
                fileupload.post("/upload/avatar/"+user?.id.toString(), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
            }
        }
    };

    const handleAvatarDelete = () => {
        if (avatarPath != ""){
            fileupload.delete("/avatar/"+user?.id.toString(), {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return user?.isLoggedIn ? (
        <div className="m-auto pt-10">
            <Label className="text-3xl flex m-auto pt-20 pb-4 justify-center"><b>{user.username}</b></Label>

            <div className="sm:w-max md:w-max md:w-full lg:w-11/12 xl:w-9/12 m-auto">

                <Avatar className="flex flex-col w-40 h-40 m-auto border-solid border-2 border-black">
                    <AvatarImage src={avatarPath}/>
                    <AvatarFallback><PersonIcon className="w-40 h-40"/></AvatarFallback>
                </Avatar>
                <Card className="w-80 flex flex-col break-words m-auto mt-4 hover:bg-slate-200 border-solid border-2 border-black">
                    <CardHeader>

                    <Dialog>
                        <DialogTrigger className="mr-auto">
                            <CardTitle className="hover:underline inline-block">{user.username}
                                <Pencil2Icon className="inline-block"/>
                            </CardTitle>
                        </DialogTrigger>
                        <DialogContent className="w-max">
                            <DialogHeader>
                                <DialogTitle>Edit user details of <i>{user.username}</i></DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                            </DialogHeader>
                            <form>
                                <div className="grid max-w-sm items-center gap-1.5">
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
                                />
                                </div>
                                <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
                                <Label htmlFor="picture"><b>Profile picture</b></Label>
                                <Input id="file" type="file" onChange={handleFileChange} />
                                </div>
                                <Button type="button" onClick={handleEdit}>
                                    Confirm
                                </Button>
                        </form>
                        <Button className="w-full" variant="destructive" onClick={handleAvatarDelete}>
                            <TrashIcon className="mr-2 h-4 w-4"/>Delete avatar
                        </Button>
                        </DialogContent>
                    </Dialog>

                    <CardDescription>
                        User details
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm h-full">
                    <ul>
                        <li>Email address: {user.emailAddress}</li>
                        <li>Role: {user.role}</li>
                    </ul>
                    </CardContent>
                </Card>

            </div>
            {(user.role==="LECTURER")?
            <div>
            <Label className="text-2xl lg:text-3xl flex mb-auto pt-10 pl-20"><b>Courses by me: </b></Label>
            <div className=" grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:w-11/12 xl:w-9/12 m-auto">
            {lecturerCourses.map((lecturerCourse: Course) => (
                <Card key={lecturerCourse.id} className="flex flex-col m-auto p-auto mt-4 mb-4 p-2 w-80 break-words mb hover:bg-slate-200">
                    <CardHeader>
                    <CardTitle className="hover:underline"><Link to={`/courses/${lecturerCourse.id}`}>{lecturerCourse.title}</Link></CardTitle>
                    <CardDescription>{lecturerCourse.lecturerName}</CardDescription>
                    </CardHeader>
                    <CardContent className=" h-full">
                    <p>{lecturerCourse.description}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
            </div>
            :
            <div></div>
            }
            <Label className="text-2xl lg:text-3xl flex mb-auto pt-10 pl-20"><b>My courses:</b></Label>
            <div className=" grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:w-11/12 xl:w-9/12 m-auto">
            {courses.map((course: Course) => (
                <Card key={course.id} className="flex flex-col m-auto p-auto mt-4 mb-4 p-2 w-80 break-words mb hover:bg-slate-200">
                    <CardHeader>
                    <CardTitle className="hover:underline"><Link to={`/courses/${course.id}`}>{course.title}</Link></CardTitle>
                    <CardDescription>{course.lecturerName}</CardDescription>
                    </CardHeader>
                    <CardContent className=" h-full">
                    <p>{course.description}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
    ) : <Navigate replace to="/"/>;
}