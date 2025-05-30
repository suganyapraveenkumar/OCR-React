import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Home.css"; // Make sure this CSS file contains the styles you provided

const ResultsPage = () => {
  const { userId } = useParams();

  const [categoryId, setCategoryId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [reportData, setReportData] = useState([]);
  const [showTable, setShowTable] = useState(false);

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
        `http://localhost:5000/api/student/marks?subjectName=${subjectName}&categoryName=${categoryName}&userId=${userId}`
      );

      if (!response.ok) throw new Error("API call failed: " + response.statusText);

      const data = await response.json();
      setReportData(data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h4 className="section-title">Student Results</h4>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setCategoryId(selectedId);
              const selectedCategory = categories.find(c => String(c.categoryId) === selectedId);
              setCategoryName(selectedCategory ? selectedCategory.categoryName : "");
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Subject:</label>
          <select
            className="form-select"
            value={subjectId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSubjectId(selectedId);
              const selectedSubject = subjects.find(s => s.subjectId.toString() === selectedId);
              setSubjectName(selectedSubject ? selectedSubject.subjectName : "");
            }}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-submit" onClick={fetchResults}>
          View Result
        </button>

        {showTable && (
          <div className="report-box">
            <h4 className="section-title">Evaluation Report</h4>
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
                  <th>Student File</th>
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

export default ResultsPage;
