import { loginWithGithub } from "../services/api";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center space-y-6">

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            RepoGuardian AI
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Your AI-powered GitHub repository monitoring system.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800"></div>

        {/* Login Button */}
        <button
          onClick={loginWithGithub}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95"
        >
          <span>Login with GitHub</span>
        </button>

      </div>
    </div>
  );
};

export default Login;
