import React, {  useState } from "react";
import { useParams } from "react-router-dom";

const ResultsPage = () => {
  const { userId } = useParams();
  const [categories] = useState(["Homework","Class Test","Midterm Exam","Final Exam","Project Work"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [results, setResults] = useState([]);
const categoryMap = {
  Homework: 1,
  'Class Test': 2,
  'Midterm Exam': 3,
  'Final Exam':4,
  'Project Work':5

};
const categoryInt = categoryMap[selectedCategory];
  const fetchResults = () => {
    if (!selectedCategory) return;

    fetch(`http://localhost:5000/api/student/marks/${userId}?category=${categoryInt}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error("Error fetching results:", err));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Student Results</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setResults([]);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchResults}
        disabled={!selectedCategory}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search Results
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Results for {selectedCategory}</h3>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-3 py-2">Subject</th>
                <th className="border px-3 py-2">Marks</th>
                <th className="border px-3 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-2">{r.subject}</td>
                  <td className="border px-3 py-2">{r.marks}</td>
                  <td className="border px-3 py-2">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
