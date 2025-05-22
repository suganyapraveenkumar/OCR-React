import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [teacher, setTeacher] = useState({});
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [studentDocs, setStudentDocs] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/teacher/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setTeacher(data))
      .catch(console.error);

    fetch(`http://localhost:5000/api/teacher/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);

    fetch(`http://localhost:5000/api/teacher/Subjects`)
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (selectedCategory && selectedSubject) {
      fetch(
        `http://localhost:5000/api/teacher/studentDocs?category=${selectedCategory}&subject=${selectedSubject}`
      )
        .then((res) => res.json())
        .then(setStudentDocs)
        .catch(console.error);
    }
  }, [selectedCategory, selectedSubject]);

  const handleEvaluation = () => {
    navigate("/evaluation", {
      state: {
        userId,
        category: selectedCategory,
        subject: selectedSubject,
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {teacher.TeacherName || "Teacher"}
      </h1>

      <div className="mb-4">
        <p><strong>Email:</strong> {teacher.EmailAddress}</p>
        <p><strong>Designation:</strong> {teacher.Designation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-3">Student Uploaded Documents</h2>
      <div className="grid grid-cols-1 gap-3">
        {studentDocs.length === 0 ? (
          <p>No documents uploaded for this selection.</p>
        ) : (
          studentDocs.map((doc, idx) => (
            <div key={idx} className="border p-3 rounded shadow">
              <p><strong>Student:</strong> {doc.studentName}</p>
              <p><strong>Uploaded On:</strong> {new Date(doc.uploadedAt).toLocaleString()}</p>
              <img
                src={doc.fileUrl}
                alt="student-doc"
                className="w-48 mt-2 border"
              />
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() =>
            navigate("/upload-sample", {
              state: {
                userId,
                category: selectedCategory,
                subject: selectedSubject,
              },
            })
          }
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload Sample Answer Sheet
        </button>

        <button
          onClick={handleEvaluation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Evaluation Results
        </button>
      </div>
    </div>
  );
};

export default TeacherHome;
