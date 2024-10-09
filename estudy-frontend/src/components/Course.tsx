import axios from "../axios";
import { useState, useEffect } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from "../context";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Cross2Icon, Pencil1Icon, PlusIcon, TrashIcon, FilePlusIcon } from "@radix-ui/react-icons";
import { Course as CourseType } from "../types";
import { StudyMaterial as StudyMaterialType } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMediaQuery } from 'react-responsive';

export default function Course() {
    const { user } = useAuth();

    const [course, setCourse] = useState<CourseType>();
    const [isEnrolled, setIsEnrolled] = useState(false);

    const isPhone: boolean = useMediaQuery({maxWidth: 768});
    const nav = useNavigate();
    const {courseId} = useParams();

    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId, {
            headers: {
                'Authorization': `Basic ${user?.auth}`,
                'Content-Type': 'application/json',
            }},
            )
            setCourse(response.data)
            setIsEnrolled(response.data.students.some((item: { id: number | null | undefined; }) => item.id === user?.id))
        }
        fetchData()
    }, []);

    const deleteCourse = () => {
        axios.delete('/courses/' + courseId, {
            headers: {
                'Authorization': `Basic ${user?.auth}`,
            }},
        )
        nav("/courses");
    };

    const joinCourse = () => {
        let data = JSON.stringify({
            userId: user?.id,
            courseId: courseId
        })
        axios.post('/enroll',
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Basic ${user?.auth}`,
                    "Accept": "application/json"
                },
            }
        )
        .then(() => {
            setIsEnrolled(true);
        })
        .catch(error => {
            alert("You are already enrolled." + "\n" + error.message);
        });
    };
    const leaveCourse = () => {
        axios.delete('/leave/'+courseId+"/"+user?.id,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Basic ${user?.auth}`,
                    "Accept": "application/json"
                },
            }
        )
        .then(() => {
            nav("/courses/");
        })
        .catch(error => {
            alert("You have already left.");
            console.error('Leaving failed:', error.message);
        });
    };

    return user?.isLoggedIn ?(
            <div className="w-10/12 m-auto">
            <div className="pt-10">
                <Label className="text-xl flex m-auto pt-20 pb-10 justify-center text-center"><b>{course?.title}</b></Label>
                <Label className="text-md flex pb-10 justify-center">{course?.description}</Label>
                <Label className="text-sm flex pb-4"><i>Lecturer: {course?.lecturerName}</i></Label>
                {isPhone ? (
                    <div>
                    {user.role === "ADMIN" ?
                    <div className="grid grid-cols-3 m-auto w-max">
                        {isEnrolled ?(
                            <Button className="m-2 h-9 w-9 p-0" onClick={leaveCourse}>
                                <Cross2Icon className="h-6 w-6"/>
                            </Button>
                        ): (
                            <Button className="m-2 h-9 w-9 p-0" onClick={joinCourse}>
                                <PlusIcon className="h-6 w-6"/>
                            </Button>
                        )}
                        <Button className="m-2 h-9 w-9 p-0" asChild>
                            <Link to={`/courses/edit/${course?.id}`}><Pencil1Icon className="h-6 w-6"/></Link>
                        </Button>
                        <Button className="m-2 h-9 w-9 p-0" variant="destructive" onClick={deleteCourse}>
                            <TrashIcon className="h-6 w-6"/>
                        </Button>
                    </div> : 
                    <div>
                        {user.username === course?.lecturerName ?
                        <div className="grid grid-cols-1 m-auto w-max">
                            <Button className="m-2 h-9 w-9 p-0" asChild>
                                <Link to={`/courses/edit/${course?.id}`}><Pencil1Icon className="h-6 w-6"/></Link>
                            </Button>
                        </div> : 
                            <div className="grid grid-cols-1 m-auto w-max">
                                {isEnrolled ?(
                                    <Button className="m-2 h-9 w-9 p-0" onClick={leaveCourse}>
                                        <Cross2Icon className="h-6 w-6"/>
                                    </Button>
                                ): (
                                    <Button className="m-2 h-9 w-9 p-0" onClick={joinCourse}>
                                        <PlusIcon className="h-6 w-6"/>
                                    </Button>
                                )}
                            </div>
                        }
                        </div>
                    }
                    </div>
                ) : (
                    <div>
                    {user.role === "ADMIN" ?
                    <div className="grid grid-cols-3 m-auto w-96">
                        {isEnrolled ?(
                            <Button className="m-2" onClick={leaveCourse}>
                                <Cross2Icon className="mr-2 h-4 w-4"/>Leave
                            </Button>
                        ): (
                            <Button className="m-2" onClick={joinCourse}>
                                <PlusIcon className="mr-2 h-4 w-4"/>Join
                            </Button>
                        )}
                        <Button className="m-2" asChild>
                            <Link to={`/courses/edit/${course?.id}`}><Pencil1Icon className="mr-2 h-4 w-4"/>Edit</Link>
                        </Button>
                        <Button className="m-2" variant="destructive" onClick={deleteCourse}>
                            <TrashIcon className="mr-2 h-4 w-4"/>Delete
                        </Button>
                    </div> : 
                    <div>
                        {user.username === course?.lecturerName ?
                        <div className="grid grid-cols-1 m-auto w-96">
                            <Button className="m-2" asChild>
                                <Link to={`/courses/edit/${course?.id}`}><Pencil1Icon className="mr-2 h-4 w-4"/>Edit</Link>
                            </Button>
                        </div> : 
                            <div className="grid grid-cols-1 m-auto w-96">
                                {isEnrolled ?(
                                    <Button className="m-2" onClick={leaveCourse}>
                                        <Cross2Icon className="mr-2 h-4 w-4"/>Leave
                                    </Button>
                                ): (
                                    <Button className="m-2" onClick={joinCourse}>
                                        <PlusIcon className="mr-2 h-4 w-4"/>Join
                                    </Button>
                                )}
                            </div>
                        }
                        </div>
                    }
                    </div>)
                }
                <div className="pt-8">
                <Label className="text-md flex pb-2"><b>List of study materials:</b></Label>
                <hr className="mb-4 bg-black h-0.5"></hr>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Title</TableHead>
                            <TableHead className="w-[100px]">Description</TableHead>
                            {/*<TableHead className="w-[100px]">Type</TableHead>*/}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {course?.studyMaterials.map((studyMaterial:StudyMaterialType) => (
                        <TableRow key={studyMaterial.id}>
                            <TableCell className="w-[100px]">
                                <Link to={`/courses/${course.id}/${studyMaterial.id}`}>{studyMaterial.title}</Link>
                            </TableCell>
                            <TableCell className="w-[100px]">
                                <Link to={`/courses/${course.id}/${studyMaterial.id}`}>{studyMaterial.description}</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                {user.username === course?.lecturerName ?
                <div className="grid grid-row m-auto justify-center pt-10 pb-10">
                    <Button asChild>
                        <Link to={`/courses/${course?.id}/create`}><FilePlusIcon className="mr-2 h-4 w-4"/>Add study material</Link>
                    </Button>
                </div>:<div></div>
                }
                </div>
            </div>

        </div>
    ) : <Navigate replace to="/"/>
}