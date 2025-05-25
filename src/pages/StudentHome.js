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
  const [studentFile, setStudentFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [filePreviewType, setFilePreviewType] = useState(null);
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

  
  
 const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    setSamplePreview(null);
    setFilePreviewType(null);
    setStudentFile(e.target.files[0]);
    if (!file) return;

    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSamplePreview(reader.result);
        setFilePreviewType("image");
      };
      reader.readAsDataURL(file);
    } else if (fileType === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSamplePreview(reader.result);
        setFilePreviewType("pdf");
      };
      reader.readAsDataURL(file);
    } else {
      setSamplePreview(null);
      setFilePreviewType(null);
    }
  };

  const handleSubmit = async () => {
    if (!studentFile || !subject || !category) {
      alert('Please select subject, category, and upload files.');
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
  const response = await axios.post(
    "http://localhost:5000/api/student/upload",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
    

      alert('upload successful!');
      setStudentFile(null);
      
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
        <div><strong>Roll No:</strong> {student.StudentId}</div>
        <div><strong>Name:</strong> {student.StudentName}</div>
        <div><strong>Class:</strong> {student.class}</div>
        <div><strong>Section:</strong> {student.Section}</div>
        <div><strong>Address:</strong> {student.address}</div>
      </div>

      

      <div className="form-group">
        <label className="block mb-1">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      {/* </div>

      <div className="mb-4"> */}
        <label  >Subject:</label>
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
        <label className="block mb-1">Upload Answer File (PDF/Doc):</label>
        <input type="file" onChange={handleFileChange} className="border px-3 py-2 w-full" />
      </div>

      <div className="mt-6">
        

        {samplePreview && filePreviewType === "image" && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Preview of Selected Image:</h3>
            <img src={samplePreview} alt="Uploaded Sample" className="w-64 mt-2 border" />
          </div>
        )}

        {samplePreview && filePreviewType === "pdf" && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Preview of Selected PDF:</h3>
            <embed src={samplePreview} type="application/pdf" width="600" height="400" />
          </div>
        )}

        {!samplePreview && studentFile && filePreviewType === null && (
          <div className="mt-4">
            <p>
              Selected File: <strong>{studentFile.name}</strong><br />
              (Preview not available for this file type)
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>



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
