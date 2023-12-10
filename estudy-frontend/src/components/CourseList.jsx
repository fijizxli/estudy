import axios from "../axios";
import {useState, useEffect, useContext} from 'react'
import {Link, Navigate} from 'react-router-dom';
import DataContext from "../context";

export default function CourseList() {
    const { user, isLoggedIn } = useContext(DataContext);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
    }
    useEffect(()=> {
        axios.get('/courses', {
            headers: {
                'Authorization': `Basic ${user}`,
                'Content-Type': 'application/json',
            },
        }).then(function (response) {

            try {
                const data = response.content;
            } catch (error) {
                console.error('JSON Parsing Error:', error);
            }
            setCourses(response.data)

        });
    }, []) ;


    return isLoggedIn ? (
        <div className="contentsTable">
            <h1>Courses</h1>
            <table>
                <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Lecturer</th>
                </tr>
                {courses.map((course) => (
                    <tr key={course.id}>
                        <td><Link to={`/courses/${course.id}`}>{course.title}</Link></td>
                        <td><Link to={`/courses/${course.id}`}>{course.description}</Link></td>
                        <td><Link to={`/courses/${course.id}`}>{course.lecturer}</Link></td>
                    </tr>
                ))}
            </table>
        </div>
    ) : <Navigate replace to="/"/>;
}