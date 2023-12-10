import axios from "../axios";
import React, {useState, useEffect, useContext} from 'react'
import DataContext from "../context";
import {Navigate, useParams} from "react-router-dom";

export default function EditCourse() {
    const { user, isLoggedIn } = useContext(DataContext);
    const [course, setCourse] = useState([]);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [lecturer, setLecturer] = useState([]);
    const {courseId} = useParams();

    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId, {
                headers: {
                    'Authorization': `Basic ${user}`,
                    'Content-Type': 'application/json',
                }},
            )
            setCourse(response.data);
            setTitle(course.title);
            setDescription(course.description);
            setLecturer(course.lecturer);
        }
        fetchData()
    }, []);

    const handleSubmit = async (e) => {
        let data = JSON.stringify(
            {
                title: title,
                description: description,
                lecturer: lecturer,
            }
        )
        e.preventDefault();
        try {
            const response = await axios.patch(
                `/courses/${courseId}`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user}`, "Accept":"application/json"},
                }
            );
            alert("Course edited.");
        } catch (error) {
            alert(error);
        }
    };

    return isLoggedIn ? (<div className="addform">
        <h1>Edit course:</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label><br/>
            <input
                className="inputTitle"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
                id="title"
                values={title}
                required
                defaultValue={course.title}
            /><br/>
            <label htmlFor="description">Description</label><br/>
            <textarea
                className="inputDescription"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                id="description"
                values={description}
                defaultValue={course.description}
                required
            ></textarea><br/>
            <label htmlFor="lecturer">Lecturer</label><br/>
            <input
                className="inputLecturer"
                type="text"
                onChange={(e) => setLecturer(e.target.value)}
                placeholder="lecturer"
                id="lecturer"
                values={lecturer}
                defaultValue={course.lecturer}
                required
            /><br/>


            <button className="tablebutton" type="submit">
                Edit
            </button>
        </form>
    </div>) : <Navigate replace to="/"/>;

}