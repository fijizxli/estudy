import axios from "../axios";
import React, {useState, useEffect, useContext} from 'react'
import DataContext from "../context";
import {Navigate, useNavigate, useParams} from "react-router-dom";

export default function EditStudyMaterial() {
    const { user, isLoggedIn } = useContext(DataContext);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [studyMaterial, setStudyMaterial] = useState([]);

    const nav = useNavigate();

    const {courseId} = useParams();
    const {studyMaterialId} = useParams();


    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get(`/courses/${courseId}/${studyMaterialId}`, {
                headers: {
                    'Authorization': `Basic ${user}`,
                    'Content-Type': 'application/json',
                }},
            )
            setStudyMaterial(response.data);
            setTitle(studyMaterial.title);
            setDescription(studyMaterial.description);
        }
        fetchData()
    }, []);


    const handleSubmit = async (e) => {
        let data = JSON.stringify(
            {
                title: title,
                description: description,
            }
        )
        e.preventDefault();
        try {
            const response = await axios.patch(
                `/courses/${courseId}/${studyMaterialId}`,
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user}`, "Accept":"application/json"},
                }
            );
            alert("Study material edited.");
        } catch (error) {
            console.log(error);
            alert(error);
        }
        nav(`/courses/${courseId}/${studyMaterialId}`);
    };

    return isLoggedIn ? (<div className="addform">
        <h1>Edit study material:</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label><br/>
            <input
                className="inputTitle"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
                id="title"
                values={title}
                defaultValue={studyMaterial.title}
                required
            /><br/>
            <label htmlFor="description">Description</label><br/>
            <textarea
                className="inputDescription"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                id="description"
                values={description}
                defaultValue={studyMaterial.description}
                required
            ></textarea><br/>

            <button className="tablebutton" type="submit">
                Edit
            </button>
        </form>
    </div>) : <Navigate replace to="/"/>;

}