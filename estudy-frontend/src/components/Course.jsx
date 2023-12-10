import axios from "../axios";
import {useState, useEffect, useContext} from 'react';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import DataContext from "../context";



export default function Course() {
    const { user, isLoggedIn } = useContext(DataContext);
    const [course, setCourse] = useState([]);
    const studyMaterials = course.studyMaterials || [];

    const nav = useNavigate();
    const {courseId} = useParams();

    useEffect( ()=>{
        const fetchData = async () => {
            const response = await axios.get('/courses/' + courseId, {
            headers: {
                'Authorization': `Basic ${user}`,
                'Content-Type': 'application/json',
            }},
            )
            setCourse(response.data)
        }
        fetchData()
    }, []);


    const deleteCourse = () => {
        const response = axios.delete('/courses/' + courseId, {
            headers: {
                'Authorization': `Basic ${user}`,
            }},
        )
        nav("/courses");
    };

    return isLoggedIn  ?(
        <div className="contentsTable">
            <div className="course">
                <h1>{course.title}</h1>
                <button className="tablebutton" onClick={deleteCourse}>Delete</button>
                <Link className="tablebutton" to={`/courses/edit/${course.id}`}>Edit</Link>
                <p>{course.description}</p>

                <i><p>Lecturer: {course.lecturer}</p></i>


                <h4>Study materials:</h4>
                <table>

                    {studyMaterials.map((studyMaterial) => (
                        <tr key={studyMaterial.id}>
                            <td><Link to={`/courses/${course.id}/${studyMaterial.id}`}>{studyMaterial.title}</Link></td>
                            {/*<td><Link to={`/courses/${course.id}/${studyMaterial.id}`}>{studyMaterial.description}</Link></td>*/}
                        </tr>
                    ))}
                </table>
            </div>
            <div className="tablebutton">
                <Link to={`/courses/${course.id}/create`}>Add study material</Link>
            </div>
        </div>
    ) : <Navigate replace to="/"/>
}