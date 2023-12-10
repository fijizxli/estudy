import axios from "../axios";
import React, {useState, useEffect, useContext} from 'react'
import DataContext from "../context";
import {Navigate} from "react-router-dom";

export default function AddCourse() {
    const { user, isLoggedIn } = useContext(DataContext);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [lecturer, setLecturer] = useState([]);

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
            const response = await axios.post(
                "/courses/create",
                data,
                {
                    headers: {"Content-Type": "application/json", 'Authorization': `Basic ${user}`, "Accept":"application/json"},
                }
            );
            alert("Course added.");
        } catch (error) {
            alert(error);
        }
    };

    return isLoggedIn ? (<div className="addform">
        <h1>Add a new course:</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label><br/>
            <input
                className="inputTitle"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                id="title"
                values={title}
                required
            /><br/>
            <label htmlFor="lecturer">Lecturer</label><br/>
            <input
                className="inputLecturer"
                type="text"
                onChange={(e) => setLecturer(e.target.value)}
                placeholder="Lecturer"
                id="lecturer"
                values={lecturer}
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
                required
            ></textarea><br/>

            <button className="tablebutton" type="submit">
                Add
            </button>
        </form>
    </div>) : <Navigate replace to="/"/>;

}