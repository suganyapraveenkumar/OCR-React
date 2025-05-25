import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './TeacherHome.css';

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
  const [modelFile, setModelFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [sampleFile, setSampleFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [filePreviewType, setFilePreviewType] = useState(null);
const [results, setResults] = useState([]);

  const [evaluationResults, setEvaluationResults] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/teacher/profile/${userId}`)
      .then(res => res.json())
      .then(data => setTeacher(data))
      .catch(console.error);

    fetch(`http://localhost:5000/api/teacher/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);

    fetch(`http://localhost:5000/api/teacher/subjects`)
      .then(res => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (selectedCategory && selectedSubject) {
      fetch(
        `http://localhost:5000/api/teacher/studentDocs?category=${selectedCategory}&subject=${selectedSubject}`
      )
        .then(res => res.json())
        .then(setStudentDocs)
        .catch(console.error);
    }
  }, [selectedCategory, selectedSubject]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSampleFile(file);
    setSamplePreview(null);
    setFilePreviewType(null);

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

  const handleSampleUpload = async () => {
    if (!sampleFile || !selectedSubject || !selectedCategory) {
      alert("Please select a subject and category before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", sampleFile);
    formData.append("subjectId", selectedSubject);
    formData.append("categoryId", selectedCategory);

    try {
      const res = await fetch("http://localhost:5000/api/Teacher/upload-sample", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert("Sample uploaded successfully");
        setSampleFile(null);
        setSamplePreview(null);
        setFilePreviewType(null);
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  
const formData = new FormData();
    formData.append("studentFile", studentFile);
    formData.append("modelFile", modelFile);
  const fetchEvaluationResults = () => {
  fetch(
    `http://localhost:5000/api/upload/evaluate?studentId=${userId}&subjectId=${selectedSubject}&categoryId=${selectedCategory}`,
    {
      method: 'POST',
      body: formData,
      // Don't set 'Content-Type' when using FormData — the browser sets it correctly
    }
  )
    .then(res => res.json())
    .then(data => setResults(data))
    .catch(err => console.error("Error fetching results:", err));
};


  useEffect(() => {
    if (selectedCategory && selectedSubject) {
      fetchEvaluationResults();
    }
  }, [selectedCategory, selectedSubject]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {teacher.teacherName || "Teacher"}
      </h1>

      <div className="mb-4">
        <p><strong>Email:</strong> {teacher.emailAddress}</p>
        <p><strong>Designation:</strong> {teacher.designation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
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
            <option key={sub.subjectId} value={sub.subjectId}>
              {sub.subjectName}
            </option>
          ))}
        </select>
      </div>

      
      

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3"> Uploaded Answer Key</h2>

        <input type="file" onChange={handleFileChange} className="mb-2" />

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

        {!samplePreview && sampleFile && filePreviewType === null && (
          <div className="mt-4">
            <p>
              Selected File: <strong>{sampleFile.name}</strong><br />
              (Preview not available for this file type)
            </p>
          </div>
        )}

        <button
          onClick={handleSampleUpload}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      <div >
        <h2 >View and Evaluation Results</h2>
         <button
          onClick={() => navigate(`/EvaluationResult`)}
         
          
        >
          Evaluation
        </button>
       
      </div>
    </div>
  );
};

export default TeacherHome;
