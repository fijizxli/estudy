import axios from "../axios";
import {useState, useEffect } from 'react';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import {useAuth} from "../context";
import { StudyMaterial as StudyMaterialType } from "@/types";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from 'react-responsive';

export default function StudyMaterial() {
    const {user} = useAuth();
    const [studyMaterial, setStudyMaterial] = useState<StudyMaterialType>();

    const nav = useNavigate();
    const {courseId, studyMaterialId} = useParams();
    const [lecturer, setLecturer] = useState();

    const isPhone: boolean = useMediaQuery({maxWidth: 768});

    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId + "/" +studyMaterialId, {
                headers: {
                    'Authorization': `Basic ${user?.auth}`,
                    'Content-Type': 'application/json',
                }},
            )
            const lecturerResponse = await axios.get('/courses/' + courseId + "/lecturer", {
                headers: {
                    'Authorization': `Basic ${user?.auth}`,
                    'Content-Type': 'application/json',
                }},
            )

            setStudyMaterial(response.data)
            setLecturer(lecturerResponse.data)
        }

        fetchData()
    }, []);


    const deleteStudyMaterial = () => {
        axios.delete('/courses/' + courseId + "/" + studyMaterialId, {
            headers: {
                'Authorization': `Basic ${user?.auth}`,
            }},
        )
        nav(`/courses/${courseId}`);
    };

    return user?.isLoggedIn ? (
        <div className="w-10/12 m-auto">
            <div className="pt-10">
                <Label className="text-xl flex m-auto pt-20 pb-10 justify-center text-center"><b>{studyMaterial?.title}</b></Label>
                <Label className="text-md flex m-auto pb-10 justify-center" >{studyMaterial?.description}</Label>

                {isPhone ? (
                    <div>
                    {(user.role === "ADMIN") ? (
                    <div className="grid grid-cols-2 m-auto w-max">
                            <Button className="m-2 h-9 w-9 p-0" variant="destructive" onClick={deleteStudyMaterial}>
                                <TrashIcon className="h-6 w-6"/>
                            </Button>
                            <Button className="m-2 h-9 w-9 p-0" asChild>
                                <Link to={`/courses/edit/${courseId}/${studyMaterialId}`}>
                                    <Pencil1Icon className="h-6 w-6"/>
                                </Link>
                            </Button>
                        </div> 
                        ) : ( 
                            <div>
                            {(user.username === lecturer) ? (
                                <div className="grid grid-cols-1 m-auto w-max">
                                <Button className="m-2" asChild>
                                    <Link to={`/courses/edit/${courseId}/${studyMaterialId}`}>
                                        <Pencil1Icon className="mr-2 h-4 w-4"/>Edit
                                    </Link>
                                </Button>
                                </div> 
                                ) : (
                                    <div></div>
                                )
                            }
                            </div>
                            )
                    }
                    </div>
                ) : (
                    <div>
                    {(user.role === "ADMIN") ? (
                        <div className="grid grid-cols-2 m-auto w-96">
                            <Button className="m-2" variant="destructive" onClick={deleteStudyMaterial}>
                                <TrashIcon className="mr-2 h-4 w-4"/>Delete
                            </Button>
                            <Button className="m-2" asChild>
                                <Link to={`/courses/edit/${courseId}/${studyMaterialId}`}>
                                    <Pencil1Icon className="mr-2 h-4 w-4"/>Edit
                                </Link>
                            </Button>
                        </div> 
                        ) : ( 
                            <div>
                            {(user.username === lecturer) ? (
                                <div className="grid grid-cols-1 m-auto w-96">
                                <Button className="m-2" asChild>
                                    <Link to={`/courses/edit/${courseId}/${studyMaterialId}`}>
                                        <Pencil1Icon className="mr-2 h-4 w-4"/>Edit
                                    </Link>
                                </Button>
                                </div> 
                                ) : (
                                    <div></div>
                                )
                            }
                            </div>
                            )
                    }
                    </div>
                )
                } 
            </div>
        </div>
    ) : <Navigate replace to="/"/>
}