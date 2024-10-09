import axios, { fileupload } from "../axios";
import {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom';
import {useAuth} from "../context";
import {Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Course } from '../types';
import { PersonIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function MyCourses() {
    const { user } = useAuth(); 
    const [courses, setCourses] = useState([]);
    const [lecturerCourses, setLecturerCourses] = useState([]);
    const [avatarPath, setAvatarPath] = useState<string>("");

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
                            console.log(response.data)
                        })
                    }
            },[]) ;
    if (user != null){
        fileupload.get("/avatar/"+user.id.toString()).then( response => {
            setAvatarPath(response.data.url[0]);
        }
        );
    }

    return user?.isLoggedIn ? (
        <div className="m-auto pt-10">
            <Label className="text-3xl flex m-auto pt-20 pb-4 justify-center"><b>Profile</b></Label>
            <Avatar className="w-40 h-40 m-auto p-auto border-solid border-2 border-black justify-center">
                <AvatarImage src={avatarPath}/>
                <AvatarFallback><PersonIcon/></AvatarFallback>
            </Avatar>
            <Label className="text-2xl lg:text-3xl flex mb-auto pt-10 pl-20"><b>Profile details:</b></Label>
            <div className=" grid grid-cols-1 lg:w-11/12 xl:w-9/12 m-auto">
                <Card className="flex flex-col m-auto w-mt-4 mb-4 p-4 break-words mb hover:bg-slate-200">
                    <CardHeader>
                    <CardTitle className="hover:underline">Username: {user.username}</CardTitle>
                    <CardDescription>

                    </CardDescription>
                    </CardHeader>
                    <CardContent className=" h-full">
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