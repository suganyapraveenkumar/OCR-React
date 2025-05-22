import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentHome = () => {
  const location = useLocation();
  const userId = location.state?.userId || "";
  const navigate = useNavigate();

  const [student, setStudent] = useState({});
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [modelFile, setModelFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);

  // These should match your DB Subject/Category names exactly
  const categories = [
    { id: 1, name: "Homework" },
    { id: 2, name: "Class Test" },
    { id: 3, name: "Midterm Exam" },
    { id: 4, name: "Final Exam" },
    { id: 5, name: "Project Work" }
  ];

  const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "GK" },
    { id: 4, name: "Social" },
    { id: 5, name: "Computer Science" }
  ];

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/Student/GetStudentProfile/${userId}`)
        .then((res) => res.json())
        .then((data) => setStudent(data))
        .catch((err) => console.error('Error fetching student profile:', err));
    }
  }, [userId]);

  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
  };

  const handleModelFileChange = (e) => {
    setModelFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!studentFile || !modelFile || !subject || !category) {
      alert('Please select subject, category, and upload both files.');
      return;
    }

    const subjectId = subjects.find(s => s.name === subject)?.id;
    const categoryId = categories.find(c => c.name === category)?.id;

    if (!subjectId || !categoryId) {
      alert('Invalid subject or category selection.');
      return;
    }

    const formData = new FormData();
    formData.append("studentFile", studentFile);
    formData.append("modelFile", modelFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/upload/evaluate?studentId=${userId}&subjectId=${subjectId}&categoryId=${categoryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Evaluation successful!');
      setStudentFile(null);
      setModelFile(null);
      setCategory('');
      setSubject('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Evaluation failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 shadow-lg rounded-lg bg-white">
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Profile Details</h3>
        <div><strong>Roll No:</strong> {student.studentId}</div>
        <div><strong>Name:</strong> {student.studentName}</div>
        <div><strong>Class:</strong> {student.class}</div>
        <div><strong>Section:</strong> {student.section}</div>
        <div><strong>Address:</strong> {student.address}</div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Upload Answer Sheet</h3>

      <div className="mb-4">
        <label className="block mb-1">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 w-full"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Subject:</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-3 py-2 w-full"
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((subj) => (
            <option key={subj.id} value={subj.name}>{subj.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Upload Student Answer File (PDF/Doc):</label>
        <input type="file" onChange={handleStudentFileChange} className="border px-3 py-2 w-full" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Upload Model Answer File:</label>
        <input type="file" onChange={handleModelFileChange} className="border px-3 py-2 w-full" />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      <div className="mt-6">
        <button
          onClick={() => navigate(`/Result/${userId}`)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Result
        </button>
      </div>
    </div>
  );
};

export default StudentHome;
