import React, { useEffect, useState } from "react";

const EvaluationPage = () => {
  const [studentId, setStudentId] = useState("");
  const [reportData, setReportData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [totalMarks, setTotalMarks] = useState(0);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modelFile, setModelFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
   const [showTable, setShowTable] = useState(false);
const [subjectName, setSubjectName] = useState("");
const [categoryName, setcategoryName] = useState("");
const handleEvaluateClick = async (studentId, row) =>
{
    

    const formData = new FormData();
    
    formData.append("studentId", studentId);
  formData.append("subjectId", subjectId);
  formData.append("categoryId", categoryId);
  formData.append("total_marks", totalMarks); // Corrected here


  formData.append("student_file", studentFile);
  formData.append("model_file", modelFile);

  try {
    const res = await fetch("http://localhost:5000/api/upload/evaluate", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Evaluation submitted successfully.");
      fetchResults(); // 🔁 Refresh table to show updated evaluation status
    } else {
      alert(result.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    alert("Evaluation failed");
  }
};

  useEffect(() => {
     
      
      fetch(`http://localhost:5000/api/teacher/categories`)
        .then(res => res.json())
        .then(setCategories)
        .catch(console.error);
  
      fetch(`http://localhost:5000/api/teacher/subjects`)
        .then(res => res.json())
        .then(setSubjects)
        .catch(console.error);
    });
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

      // Convert base64 to File using fetch if present
     if (row.studentFileBase64) {
  const studentBlob = await fetch(row.studentFileBase64).then((r) => r.blob());
  const file = new File([studentBlob], `StudentFile_${row.studentId}.pdf`,
     { type: "application/pdf" });
  setStudentFile(file);
}

      if (row.teacherFileBase64) {
        const modelBlob = await fetch(row.teacherFileBase64).then((res) => res.blob());
        const modelFile = new File([modelBlob], `TeacherFile_${row.studentId}.pdf`, {
          type: "application/pdf",
        });
        setModelFile(modelFile);
      }
    }
  } catch (error) {
    console.error("Error fetching results:", error);
  }
};

  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Evaluation Results</h2>

      <div >
        

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => {
  const selectedId = e.target.value;
  setCategoryId(selectedId);

  // find the selected category object and set totalMark
  const selectedCategory = categories.find(c => String(c.categoryId) === String(selectedId));
setcategoryName(selectedCategory ? selectedCategory.categoryName : "")
setTotalMarks(selectedCategory?.totalMark || 0);
}}
          >
            <option value="0">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
          
        </div>
        <div className="flex flex-col">
         
          Total Marks: {totalMarks}
         
        </div>

        <div className="flex flex-col">
  <label className="mb-2 font-medium">Subject:</label>
  <select
    value={subjectId}
    onChange={(e) => {
      const selectedId = e.target.value;
      setSubjectId(selectedId);
      // Find the subject name from the list by id
      const selectedSubject = subjects.find(s => s.subjectId.toString() === selectedId);
      setSubjectName(selectedSubject ? selectedSubject.subjectName : "");
    }}
    className="border px-4 py-2 rounded"
  >
    <option value="">-- Select Subject --</option>
    {subjects.map((s) => (
      <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
    ))}
  </select>
</div>
      </div>

      <button
        className="mb-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        onClick={fetchResults}
      >
        View Result
      </button>
{showTable && (
      <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Evaluation Report</h2>
      <div >
        <table className="styled-table">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-3 py-2">Student ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Class</th>
              <th className="border px-3 py-2">Section</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Subject</th>
              <th className="border px-3 py-2">Total Score</th>
              <th className="border px-3 py-2">Grade</th>
              <th className="border px-3 py-2">Remarks</th>
              <th className="border px-3 py-2">Evaluation Status</th>
              <th className="border px-3 py-2">Evaluated Date</th>
              <th className="border px-3 py-2">Student File</th>
              <th className="border px-3 py-2">Teacher File</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-3 py-2">{row.studentId}</td>
                <td className="border px-3 py-2">{row.studentName}</td>
                <td className="border px-3 py-2">{row.class}</td>
                <td className="border px-3 py-2">{row.section}</td>
                <td className="border px-3 py-2">{row.categoryName}</td>
                <td className="border px-3 py-2">{row.subjectName}</td>
                <td className="border px-3 py-2">{row.totalScore}</td>
                <td className="border px-3 py-2">{row.grade}</td>
                <td className="border px-3 py-2">{row.remarks}</td>
                <td className="border px-3 py-2">{row.evaluationStatus}</td>
                <td className="border px-3 py-2">
                  {row.evaluatedDate ? new Date(row.evaluatedDate).toLocaleDateString() : ''}
                </td>
                <td className="border px-3 py-2">
                  {row.studentFileBase64 ? (
                    <a
      href={row.studentFileBase64}
      download={`StudentFile_${row.studentId}.pdf`}
      className="text-blue-600 underline"
    >
      Download studentfile
    </a>
  ) : (
                    'No File'
                  )}
                </td>
                <td className="border px-3 py-2">
                  {row.teacherFileBase64 ? (
                   <a
      href={row.teacherFileBase64}
      download={`TeacherFile_${row.studentId}.pdf`}
      className="text-blue-600 underline"
    >
      Download
    </a>
  ) : (
                    'No File'
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
  {row.evaluationStatus?.toLowerCase() === "pending" && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => handleEvaluateClick(row.studentId,row)}
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
      </div>
)}
    </div>
  );
};

export default EvaluationPage;
