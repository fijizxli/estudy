import axios from "../axios";
import {useState, useEffect, useContext} from 'react';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import DataContext from "../context";



export default function StudyMaterial() {
    const { user, isLoggedIn } = useContext(DataContext);
    const [studyMaterial, setStudyMaterial] = useState([]);

    const nav = useNavigate();
    const {courseId, studyMaterialId} = useParams();

    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId + "/" +studyMaterialId, {
                headers: {
                    'Authorization': `Basic ${user}`,
                    'Content-Type': 'application/json',
                }},
            )
            setStudyMaterial(response.data)
        }
        fetchData()
    }, []);


    const deleteStudyMaterial = () => {
        const response = axios.delete('/courses/' + courseId + "/" + studyMaterialId, {
            headers: {
                'Authorization': `Basic ${user}`,
            }},
        )
        nav(`/courses/${courseId}`);
    };

    return isLoggedIn ? (
        <div className="contentsTable">
            <Link className="tablebutton" to={`/courses/${courseId}`}>  Back to course</Link>
            <div className="studyMaterial">
                <h1>{studyMaterial.title}</h1>

                <h2>Description</h2>
                <p>{studyMaterial.description}</p>

                <button className="tablebutton" onClick={deleteStudyMaterial}>Delete</button>
                <Link className="tablebutton" to={`/courses/edit/${courseId}/${studyMaterialId}`}>Edit</Link>

            </div>
       </div>
    ) : <Navigate replace to="/"/>
}