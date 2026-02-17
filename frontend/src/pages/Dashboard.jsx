import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchMonitoredRepos } from "../services/api";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user") || localStorage.getItem("githubId");

  useEffect(() => {
    if (userId) {
      localStorage.setItem("githubId", userId);
    } else {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const getRepos = async () => {
      if (!userId) return;
      try {
        const { data } = await fetchMonitoredRepos(userId);
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch monitored repos", error);
      } finally {
        setLoading(false);
      }
    };
    getRepos();
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <Link
          to={`/select-repo?user=${userId}`}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          + Add Repository
        </Link>
      </div>

      {/* Empty State */}
      {repos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400">
            No repositories monitored yet.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Click "Add Repository" to start analyzing your projects.
          </p>
        </div>
      ) : (
        /* Repository Grid */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <div
              key={repo._id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 truncate">
                <Link
                  to={`/analysis/${repo._id}?user=${userId}`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  {repo.name}
                </Link>
              </h3>

              <p className="text-slate-400 text-sm line-clamp-3">
                {repo.description || "No description available"}
              </p>

              <div className="mt-4 text-xs text-slate-500">
                Last Analyzed:{" "}
                {repo.lastAnalyzed
                  ? new Date(repo.lastAnalyzed).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
