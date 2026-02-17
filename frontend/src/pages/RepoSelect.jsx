import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserRepos, monitorRepo } from "../services/api";
import RepoCard from "../components/RepoCard";
import Loader from "../components/Loader";

const RepoSelect = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId =
    new URLSearchParams(window.location.search).get("user") ||
    localStorage.getItem("githubId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const getRepos = async () => {
      try {
        const { data } = await fetchUserRepos(userId);
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repos", error);
      } finally {
        setLoading(false);
      }
    };

    getRepos();
  }, [userId, navigate]);

  const handleSelect = async (repo) => {
    try {
      await monitorRepo(userId, repo);
      navigate(`/dashboard?user=${userId}`);
    } catch (error) {
      alert("Failed to monitor repo (maybe already monitored?)");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Select Repository to Monitor
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Choose a GitHub repository to start AI-powered monitoring.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : repos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400">
            No repositories found in your GitHub account.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Make sure your GitHub account has repositories available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <RepoCard repo={repo} onSelect={handleSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoSelect;
