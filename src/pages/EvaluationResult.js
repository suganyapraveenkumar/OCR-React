import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./Home.css"; // Ensure this path matches your actual CSS location

const EvaluationPage = () => {
  const [studentId, setStudentId] = useState("");
  const [reportData, setReportData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [totalMarks, setTotalMarks] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modelFile, setModelFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const location = useLocation();
  const { teacher } = location.state || {};

  useEffect(() => {
    fetch(`http://localhost:5000/api/teacher/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);

    fetch(`http://localhost:5000/api/teacher/subjects`)
      .then(res => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  const fetchResults = async () => {
    if (!categoryId || !subjectId) {
      alert("Please select all dropdowns.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/teacher/GetStudentData?subjectName=${subjectName}&categoryName=${categoryName}`
      );

      if (!response.ok) {
        throw new Error("API call failed: " + response.statusText);
      }

      const data = await response.json();
      setReportData(data);
      setShowTable(true);

      if (data.length > 0) {
        const row = data[0];

        if (row.studentFileBase64) {
          const studentBlob = await fetch(row.studentFileBase64).then(r => r.blob());
          setStudentFile(new File([studentBlob], `StudentFile_${row.studentId}.pdf`, { type: "application/pdf" }));
        }

        if (row.teacherFileBase64) {
          const modelBlob = await fetch(row.teacherFileBase64).then(res => res.blob());
          setModelFile(new File([modelBlob], `TeacherFile_${row.studentId}.pdf`, { type: "application/pdf" }));
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleEvaluateClick = async (studentId, row) => {
    const formData = new FormData();
    
    formData.append("studentId", studentId);
    formData.append("subjectId", subjectId);
    formData.append("categoryId", categoryId);
    formData.append("total_marks", totalMarks);
    formData.append("student_file", studentFile);
    formData.append("model_file", modelFile);
    formData.append("teacherName", teacher.teacherName);
    try {
      const res = await fetch("http://localhost:5000/api/upload/evaluate", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert("Evaluation submitted successfully.");
        fetchResults();
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Evaluation failed");
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h3 className="section-title">Evaluation Page</h3>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setCategoryId(selectedId);
              const selectedCategory = categories.find(c => String(c.categoryId) === selectedId);
              setCategoryName(selectedCategory?.categoryName || "");
              setTotalMarks(selectedCategory?.totalMark || 0);
            }}
            className="form-select"
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <div className="form-label" style={{ marginTop: "8px" }}>
            Total Marks: <strong>{totalMarks}</strong>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Subject:</label>
          <select
            value={subjectId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSubjectId(selectedId);
              const selectedSubject = subjects.find(s => String(s.subjectId) === selectedId);
              setSubjectName(selectedSubject?.subjectName || "");
            }}
            className="form-select"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button className="btn btn-submit" onClick={fetchResults}>
            View Result
          </button>
        </div>

        {showTable && (
          <div className="report-box">
            <h3 className="section-title">Evaluation Report</h3>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Total Score</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                  <th>Evaluation Status</th>
                  <th>Evaluated Date</th>
                  <th>Student File</th>
                  <th>Teacher File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="hover-row">
                    <td>{row.studentId}</td>
                    <td>{row.studentName}</td>
                    <td>{row.class}</td>
                    <td>{row.section}</td>
                    <td>{row.categoryName}</td>
                    <td>{row.subjectName}</td>
                    <td>{row.totalScore}</td>
                    <td>{row.grade}</td>
                    <td>{row.remarks}</td>
                    <td>{row.evaluationStatus}</td>
                    <td>{row.evaluatedDate ? new Date(row.evaluatedDate).toLocaleDateString() : ""}</td>
                    <td>
                      {row.studentFileBase64 ? (
                        <a
                          href={row.studentFileBase64}
                          download={`StudentFile_${row.studentId}.pdf`}
                          className="file-link"
                        >
                          Download
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td>
                      {row.teacherFileBase64 ? (
                        <a
                          href={row.teacherFileBase64}
                          download={`TeacherFile_${row.studentId}.pdf`}
                          className="file-link"
                        >
                          Download
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td>
                      {row.evaluationStatus?.toLowerCase() === "pending" && ( 
                        <button
                          className="btn btn-evaluate"
                          onClick={() => handleEvaluateClick(row.studentId, row)}
                        >
                          Evaluate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;
