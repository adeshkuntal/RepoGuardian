const ReportCard = ({ report, onDelete, isDeleting }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-indigo-300";
    if (score >= 60) return "text-indigo-400";
    return "text-indigo-500";
  };

  const suggestions =
    typeof report.suggestions === "string"
      ? JSON.parse(report.suggestions)
      : report.suggestions || [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md space-y-8">

      {/* Top Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:justify-between">

        {/* LEFT SIDE */}
        <div className="flex-1 space-y-6">

          <div>
            <h4 className="text-xl font-semibold text-slate-200">
              Analysis Report
            </h4>
            <span className="text-xs text-slate-500">
              {new Date(report.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Summary */}
          <div>
            <h5 className="text-sm font-semibold text-slate-300 mb-2">
              Summary
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Security */}
          <div>
            <h5 className="text-sm font-semibold text-slate-300 mb-2">
              Security Concerns
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              {report.securityConcerns}
            </p>
          </div>

        </div>

        {/* RIGHT SIDE - Compact Score Panel */}
        <div className="w-full lg:w-[280px] space-y-4">

          {/* Delete Button */}
          <div className="flex justify-end">
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className={`text-xs px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-700 hover:bg-slate-600 transition ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          {/* Compact Score Card */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">

            {/* Main Score */}
            <div className="text-center">
              <div
                className={`text-3xl font-semibold ${getScoreColor(
                  report.qualityScore
                )}`}
              >
                {report.qualityScore}/100
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                Health Score
              </p>
            </div>

            {/* Slim Breakdown */}
            <div className="space-y-3 text-xs">

              {/* AI */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>AI</span>
                  <span>{report.aiScore ?? "-"}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${report.aiScore || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Consistency */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Consistency</span>
                  <span>{report.consistencyScore ?? "-"}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${report.consistencyScore || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Activity</span>
                  <span>{report.activityScore ?? "-"}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-300 rounded-full transition-all duration-500"
                    style={{ width: `${report.activityScore || 0}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h5 className="text-sm font-semibold text-slate-300 mb-2">
          Suggestions
        </h5>
        <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-500 pt-4 border-t border-slate-700">
        Analyzed {report.commitCount} recent commits.
      </div>

    </div>
  );
};

export default ReportCard;
