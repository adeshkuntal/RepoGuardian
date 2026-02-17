const ReportCard = ({ report, onDelete, isDeleting }) => {
  const getScoreStyle = (score) => {
    if (score >= 80)
      return "text-indigo-300 ring-indigo-300/40";
    if (score >= 60)
      return "text-indigo-400 ring-indigo-400/30";
    return "text-indigo-500 ring-indigo-500/20";
  };

  const suggestions =
    typeof report.suggestions === "string"
      ? JSON.parse(report.suggestions)
      : report.suggestions || [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md space-y-6">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

        <div>
          <h4 className="text-lg font-semibold text-slate-200">
            Analysis Report
          </h4>
          <span className="text-xs text-slate-500">
            {new Date(report.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3">

          {/* Delete Button */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`text-xs px-4 py-2 rounded-xl border border-slate-600 bg-slate-700 hover:bg-slate-600 transition-all duration-200 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          {/* Score */}
          <div className="flex flex-col items-start sm:items-end">
            <div
              className={`text-3xl font-bold ring-2 px-4 py-2 rounded-xl bg-slate-900 ${getScoreStyle(
                report.qualityScore
              )}`}
            >
              {report.qualityScore}/100
            </div>
            <span className="text-xs text-slate-500 mt-1">
              Health Score
            </span>
          </div>
        </div>
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

      {/* Security Concerns */}
      <div>
        <h5 className="text-sm font-semibold text-slate-300 mb-2">
          Security Concerns
        </h5>
        <p className="text-sm text-slate-400 leading-relaxed">
          {report.securityConcerns}
        </p>
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
