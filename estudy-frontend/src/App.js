import './App.css';
import Navbar from "./components/Navbar";
import DataContext, {DataProvider} from "./context";
import AuthenticationModal from "./components/AuthenticationModal";
import CourseList from "./components/CourseList";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import Course from "./components/Course";
import AddCourse from "./components/AddCourse";
import AddStudyMaterial from "./components/AddStudyMaterial";
import StudyMaterial from "./components/StudyMaterial";
import EditCourse from "./components/EditCourse";
import EditStudyMaterial from "./components/EditStudyMaterial";

function App() {
      return (
          <DataProvider>
              <BrowserRouter>
                  <Navbar/>
                  <Routes>
                      <Route path = "/" element={<div></div>}/>;
                      <Route path = "courses" element={<CourseList/>}/>;
                      <Route path = "courses/create" element={<AddCourse/>}/>;
                      <Route path = "courses/:courseId" element={<Course/>}/>;
                      <Route path = "courses/:courseId/create" element={<AddStudyMaterial/>}/>;
                      <Route path = "courses/:courseId/:studyMaterialId" element={<StudyMaterial/>}/>;
                      <Route path = "courses/edit/:courseId" element={<EditCourse/>}/>;
                      <Route path = "courses/edit/:courseId/:studyMaterialId" element={<EditStudyMaterial/>}/>;
                  </Routes>
                  <AuthenticationModal />
              </BrowserRouter>
          </DataProvider>
      );
}

export default App;
