// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StudentHome from "./pages/StudentHome";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherHome from "./pages/TeacherHome";
import Result from './pages/Result';
import EvaluationResult from './pages/EvaluationResult';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/Result/:userId" element={<Result />} />
        <Route path="/EvaluationResult" element={ <EvaluationResult/>}/>
      </Routes>
    </Router>
  );
}

export default App;
