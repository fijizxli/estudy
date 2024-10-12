import axios from "../axios";
import {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom';
import {useAuth} from "../context";
import {Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Course } from '../types';

export default function CourseList() {
    const { user } = useAuth(); 
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        axios.get('/courses', {
            headers: {
                'Authorization': `Basic ${user?.auth}`,
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            setCourses(response.data)
        });
    }, []) ;

    return user?.isLoggedIn ? (
        <div className="m-auto pt-10">
            <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center"><b>Courses</b></Label>
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