import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/* =========================
   📁 SUBJECT → FILE MAPPING
========================= */

const fileMap = {
  "Relational Database Management systems (RDBMS)": "RDBMS.pdf",
  "Computer Networks": "Computer Networks.pdf",
  "Computer oriented numerical and stastical methods": "CONM.pdf",

  "Java programming": "Java.pdf",
  "Software Engineering": "Software Engineering.pdf",
  "Operating System": "Operating System.pdf",
  "Python Programming": "Python.pdf",
  "English": "English.pdf",
  "Punjabi Compulsory": "Punjabi.pdf",
};

const data = [
  {
    semester: "Semester 4",
    subjects: [
      "Relational Database Management systems (RDBMS)",
      "Computer Networks",
      "Computer oriented numerical and stastical methods",
    ],
  },
  {
    semester: "Semester 5",
    subjects: [
      "Java programming",
      "Web Development using Asp.Net",
      "System Analysis and Design",
    ],
  },
  {
    semester: "Semester 6",
    subjects: [
      "Software Engineering",
      "Operating System",
      "Punjabi Compulsory",
      "English",
      "Python Programming",
    ],
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsPaid(docSnap.data().isPaid);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFile = (subject) => {
    if (!user) {
      navigate("/auth");
      return null;
    }
    if (!isPaid) {
      navigate("/payment");
      return null;
    }
    return fileMap[subject];
  };

  const handleView = (subject) => {
    const filename = getFile(subject);
    if (!filename) return;

    window.open(
      `https://noteskart-backend.onrender.com/get-note/
${filename}/${user.uid}`,
      "_blank"
    );
  };

  const handleDownload = async (subject) => {
    const filename = getFile(subject);
    if (!filename) return;

    const url = `https://noteskart-backend.onrender.com/get-note/
${filename}/${user.uid}`;

    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data
    .map((sem) => ({
      ...sem,
      subjects: sem.subjects.filter((sub) =>
        sub.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (sem) =>
        sem.semester.toLowerCase().includes(search.toLowerCase()) ||
        sem.subjects.length > 0
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 px-4 md:px-6 py-16">

      {/* HERO */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
          NotesKart 📘
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-3">
          Complete BCA Notes – Punjabi University
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto mb-16">
        <input
          type="text"
          placeholder="Search subject or semester..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
        />
      </div>

      {/* SEMESTERS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {filteredData.map((sem, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-md p-6 md:p-8">

            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b pb-2">
              {sem.semester}
            </h2>

            {sem.semester === "Semester 4" && (
              <p className="text-sm text-red-500 mb-4">
                ⚠️ We are working with 4th semester notes.
              </p>
            )}

            {sem.semester === "Semester 5" && (
              <p className="text-sm text-red-500 mb-4">
                ⚠️ We are working with notes for:
                <br />• Web Development using Asp.Net
                <br />• System Analysis and Design
              </p>
            )}

            <div className="space-y-3">
              {sem.subjects.map((sub, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <h3 className="text-sm md:text-base font-medium text-gray-800">
                    {sub}
                  </h3>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleView(sub)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs md:text-sm rounded text-white ${
                        isPaid
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600"
                      }`}
                    >
                      {isPaid ? "View" : "Locked"}
                    </button>

                    <button
                      onClick={() => handleDownload(sub)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs md:text-sm rounded text-white ${
                        isPaid
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-blue-600"
                      }`}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Home;
