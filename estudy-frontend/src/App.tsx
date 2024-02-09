import './App.css'
import '../app/globals.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import Navbar from "./components/Navbar";
import AuthenticationModal from './components/AuthenticationModal';
import CourseList from './components/CourseList';
import AddCourse from './components/AddCourse';
import Course from './components/Course';
import EditCourse from './components/EditCourse';
import AddStudyMaterial from './components/AddStudyMaterial';
import StudyMaterial from './components/StudyMaterial';
import EditStudyMaterial from './components/EditStudyMaterial';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path = "/" element={<CourseList/>}/>;
          <Route path = "courses" element={<CourseList/>}/>;
          <Route path = "courses/create" element={<AddCourse/>}/>;
          <Route path = "courses/:courseId" element={<Course/>}/>;
          <Route path = "courses/edit/:courseId" element={<EditCourse/>}/>;
          <Route path = "courses/:courseId/:studyMaterialId" element={<StudyMaterial/>}/>;
          <Route path = "courses/:courseId/create" element={<AddStudyMaterial/>}/>;
          <Route path = "courses/edit/:courseId/:studyMaterialId" element={<EditStudyMaterial/>}/>;
        </Routes>
        <AuthenticationModal/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
