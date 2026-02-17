import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RepoSelect from "./pages/RepoSelect";
import RepoAnalysis from "./pages/RepoAnalysis";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto bg-slate-900 shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-800 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/select-repo" element={<RepoSelect />} />
              <Route path="/analysis/:repoId" element={<RepoAnalysis />} />
            </Routes>
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;
