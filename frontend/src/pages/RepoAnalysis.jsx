import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchAnalysisHistory, triggerAnalysis, deleteReport, fetchCommitTrends } from '../services/api';
import ReportCard from '../components/ReportCard';
import Loader from '../components/Loader';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RepoAnalysis = () => {
  const { repoId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartRange, setChartRange] = useState("daily");

  const getCommitData = async () => {
    try {
      const { data } = await fetchCommitTrends(repoId, userId, chartRange);
      const labels = data.map(d => d.date);
      const counts = data.map(d => d.count);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Commits',
            data: counts,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch commit trends", error);
    }
  };

  useEffect(() => {
    getCommitData();
  }, [repoId, chartRange]);

  const userId =
    new URLSearchParams(window.location.search).get("user") ||
    localStorage.getItem("githubId");

  const getAnalysis = async () => {
    try {
      const { data } = await fetchAnalysisHistory(repoId);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalysis();
  }, [repoId]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await triggerAnalysis(userId, repoId);
      await getAnalysis();
      await getCommitData();
    } catch (error) {
      alert("Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?"))
      return;

    try {
      setDeletingId(reportId);
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (error) {
      alert("Failed to delete report");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Repository Analysis
        </h2>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className={`px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300
            ${analyzing
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg"
            }`}
        >
          {analyzing ? "Analyzing..." : "Run New Analysis"}
        </button>
      </div>

      {/* Commit Trend Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-200">Commit Activity</h3>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map(range => (
              <button
                key={range}
                onClick={() => setChartRange(range)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${chartRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '300px' }}>
          {chartData && <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#94a3b8' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: '#475569',
                borderWidth: 1
              }
            }
          }} />}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : reports.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400">
            No analysis reports found.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Run a new analysis to generate your first AI report.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <ReportCard
                report={report}
                onDelete={() => handleDelete(report._id)}
                isDeleting={deletingId === report._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoAnalysis;
