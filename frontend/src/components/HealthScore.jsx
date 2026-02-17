export default function HealthScore({ score }) {
  let textColor = "text-indigo-400";
  let ringColor = "ring-indigo-400";

  if (score > 80) {
    textColor = "text-indigo-300";
    ringColor = "ring-indigo-300";
  } else if (score > 60) {
    textColor = "text-indigo-400";
    ringColor = "ring-indigo-400";
  } else {
    textColor = "text-indigo-500";
    ringColor = "ring-indigo-500";
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center space-y-4">

      <h3 className="text-lg font-semibold text-slate-300">
        Health Score
      </h3>

      <div
        className={`w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full ring-4 ${ringColor} bg-slate-900 transition-all duration-300`}
      >
        <span className={`text-3xl sm:text-4xl font-bold ${textColor}`}>
          {score}
        </span>
      </div>

      <p className="text-slate-500 text-sm">
        Overall repository quality rating
      </p>

    </div>
  );
}
