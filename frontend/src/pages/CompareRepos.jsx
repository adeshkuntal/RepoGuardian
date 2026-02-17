import { useState, useEffect } from "react";
import { fetchMonitoredRepos, compareRepos } from "../services/api";
import Loader from "../components/Loader";

const CompareRepos = () => {
    const [repos, setRepos] = useState([]);
    const [selectedRepo1, setSelectedRepo1] = useState("");
    const [selectedRepo2, setSelectedRepo2] = useState("");
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);

    const userId =
        new URLSearchParams(window.location.search).get("user") ||
        localStorage.getItem("githubId");

    useEffect(() => {
        const loadRepos = async () => {
            try {
                const { data } = await fetchMonitoredRepos(userId);
                setRepos(data);
            } catch (error) {
                console.error("Failed to load repos", error);
            } finally {
                setLoading(false);
            }
        };
        loadRepos();
    }, [userId]);

    const handleCompare = async () => {
        if (!selectedRepo1 || !selectedRepo2) {
            alert("Please select two repositories to compare.");
            return;
        }
        if (selectedRepo1 === selectedRepo2) {
            alert("Please select different repositories.");
            return;
        }

        setComparing(true);
        try {
            const { data } = await compareRepos(selectedRepo1, selectedRepo2);
            setComparisonData(data);
        } catch (error) {
            console.error("Comparison failed", error);
            alert("Failed to compare repositories.");
        } finally {
            setComparing(false);
        }
    };

    const getScoreColor = (score) => {
        if (!score && score !== 0) return "text-slate-500";
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-orange-400";
        return "text-red-400";
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">
                Compare Repositories
            </h2>

            {/* Selection Area */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Repository 1
                    </label>
                    <select
                        value={selectedRepo1}
                        onChange={(e) => setSelectedRepo1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">Select Repository</option>
                        {repos.map((repo) => (
                            <option key={repo._id} value={repo._id}>
                                {repo.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Repository 2
                    </label>
                    <select
                        value={selectedRepo2}
                        onChange={(e) => setSelectedRepo2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">Select Repository</option>
                        {repos.map((repo) => (
                            <option key={repo._id} value={repo._id}>
                                {repo.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleCompare}
                    disabled={comparing}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300 ${comparing
                            ? "bg-slate-700 cursor-not-allowed text-slate-400"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg"
                        }`}
                >
                    {comparing ? "Comparing..." : "Compare"}
                </button>
            </div>

            {/* Comparison Result */}
            {comparisonData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[comparisonData.repo1, comparisonData.repo2].map((data, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <h3 className="text-xl font-bold text-slate-100 mb-1">
                                {data.details.name}
                            </h3>
                            <p className="text-sm text-slate-400 mb-6">
                                {data.details.owner}
                            </p>

                            <div className="space-y-6">
                                {/* Health Score */}
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                                        Health Score
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className={`text-4xl font-bold ${getScoreColor(
                                                data.report?.qualityScore
                                            )}`}
                                        >
                                            {data.report ? data.report.qualityScore : "N/A"}
                                        </span>
                                        <span className="text-slate-500">/100</span>
                                    </div>
                                    {data.report && (
                                        <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                                            <span>AI: {data.report.aiScore ?? "-"}</span>
                                            <span className="w-[1px] bg-slate-700"></span>
                                            <span>Con: {data.report.consistencyScore ?? "-"}</span>
                                            <span className="w-[1px] bg-slate-700"></span>
                                            <span>Act: {data.report.activityScore ?? "-"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Activity Badge */}
                                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                                    <span className="text-slate-400 text-sm">Activity Status</span>
                                    {data.details.activityStatus && (
                                        <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${data.details.activityStatus === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                data.details.activityStatus === 'Moderate' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {data.details.activityStatus}
                                        </span>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                        <p className="text-xs text-slate-500 mb-1">Total Commits</p>
                                        <p className="text-lg font-mono text-slate-200">
                                            {data.report ? data.report.commitCount : "-"}
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                        <p className="text-xs text-slate-500 mb-1">Last Analysis</p>
                                        <p className="text-xs font-mono text-slate-200 mt-1">
                                            {data.report
                                                ? new Date(data.report.createdAt).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                                        AI Summary
                                    </p>
                                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                                        {data.report
                                            ? data.report.summary
                                            : "No analysis report available for this repository."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompareRepos;
