const RepoCard = ({ repo, onSelect, selected }) => {
  return (
    <div
      className={`
        rounded-2xl p-5 border transition-all duration-300 shadow-md
        bg-slate-800
        ${
          selected
            ? "border-indigo-500 ring-2 ring-indigo-500/30"
            : "border-slate-700 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1"
        }
      `}
    >
      {/* Repo Name */}
      <h3 className="text-lg font-semibold text-slate-200 truncate">
        {repo.name}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mt-2 line-clamp-3">
        {repo.description || "No description available"}
      </p>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-4">

        {/* Language Tag */}
        <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
          {repo.language || "Unknown"}
        </span>

        {/* Monitor Button */}
        {onSelect && (
          <button
            onClick={() => onSelect(repo)}
            className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Monitor
          </button>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
