import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Home.css';

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [teacher, setTeacher] = useState({});
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sampleFile, setSampleFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [filePreviewType, setFilePreviewType] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSampleFile(file);
    setSamplePreview(null);
    setFilePreviewType(null);

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSamplePreview(reader.result);
      setFilePreviewType(file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleUpload = async () => {
    if (!sampleFile || !selectedSubject || !selectedCategory) {
      alert("Please select subject, category, and upload a file.");
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
        setSelectedCategory('');
        setSelectedSubject('');
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h3 className="section-title">Teacher Dashboard</h3>

        <div className="profile-box">
          <h4 className="section-title">Profile Info</h4>
          <div><strong>Name:</strong> {teacher.teacherName}</div>
          <div><strong>Email:</strong> {teacher.emailAddress}</div>
          <div><strong>Designation:</strong> {teacher.designation}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.subjectId} value={sub.subjectId}>{sub.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Upload Sample File (PDF/Image):</label>
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

          {!samplePreview && sampleFile && filePreviewType === null && (
            <div className="preview-block">
              <p>
                Selected File: <strong>{sampleFile.name}</strong><br />
                (Preview not available for this file type)
              </p>
            </div>
          )}

          <button onClick={handleSampleUpload} className="btn btn-submit">
            Upload Sample
          </button>
        </div>

        <div className="result-button">
          <button onClick={() => navigate('/EvaluationResult', { state: { teacher } })}
  className="btn"
>
            View Evaluation Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
