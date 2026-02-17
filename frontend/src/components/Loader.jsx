const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-slate-400 text-sm tracking-wide">
          Loading...
        </p>

      </div>
    </div>
  );
};

export default Loader;
