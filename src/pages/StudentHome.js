import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const StudentHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || "";

  const [student, setStudent] = useState({});
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [studentFile, setStudentFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [filePreviewType, setFilePreviewType] = useState(null);

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
        .then(res => res.json())
        .then(data => setStudent(data))
        .catch(err => console.error('Error fetching student profile:', err));
    }
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setStudentFile(file);
    setSamplePreview(null);
    setFilePreviewType(null);

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (file.type.startsWith("image/")) {
        setSamplePreview(reader.result);
        setFilePreviewType("image");
      } else if (file.type === "application/pdf") {
        setSamplePreview(reader.result);
        setFilePreviewType("pdf");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!studentFile || !subject || !category) {
      alert('Please select subject, category, and upload a file.');
      return;
    }

    const subjectId = subjects.find(s => s.name === subject)?.id;
    const categoryId = categories.find(c => c.name === category)?.id;

    if (!subjectId || !categoryId) {
      alert('Invalid subject or category selection.');
      return;
    }

    const formData = new FormData();
    formData.append("studentId", userId);
    formData.append("subjectId", subjectId);
    formData.append("categoryId", categoryId);
    formData.append("file", studentFile);

    try {
      await axios.post(
        "http://localhost:5000/api/student/upload",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      alert('Upload successful!');
      setStudentFile(null);
      setCategory('');
      setSubject('');
      setSamplePreview(null);
      setFilePreviewType(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Evaluation failed.');
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h3 className="section-title">Student Dashboard</h3>

        <div className="profile-box">
          <h4 className="section-title">Profile Info</h4>
          <div><strong>Roll No:</strong> {student.StudentId}</div>
          <div><strong>Name:</strong> {student.StudentName}</div>
          <div><strong>Class:</strong> {student.class}</div>
          <div><strong>Section:</strong> {student.Section}</div>
          <div><strong>Address:</strong> {student.address}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.name}>{subj.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Upload Answer File (PDF/Image):</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="preview-section">
          {samplePreview && filePreviewType === "image" && (
            <div className="preview-block">
              <h4 className="section-title">Image Preview</h4>
              <img src={samplePreview} alt="Preview" className="preview-image" />
            </div>
          )}

          {samplePreview && filePreviewType === "pdf" && (
            <div className="preview-block">
              <h4 className="section-title">PDF Preview</h4>
              <embed src={samplePreview} type="application/pdf" className="pdf-preview" />
            </div>
          )}

          {!samplePreview && studentFile && filePreviewType === null && (
            <div className="preview-block">
              <p>
                Selected File: <strong>{studentFile.name}</strong><br />
                (Preview not available for this file type)
              </p>
            </div>
          )}

          <button onClick={handleSubmit} className="btn btn-submit">
            Submit
          </button>
        </div>

        <div className="result-button">
          <button onClick={() => navigate(`/Result/${userId}`)} className="btn">
            View Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
