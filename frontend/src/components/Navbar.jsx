import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user =
    new URLSearchParams(window.location.search).get("user") ||
    localStorage.getItem("githubId");

  const handleLogout = () => {
    localStorage.removeItem("githubId");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to={user ? `/dashboard?user=${user}` : "/"}
            className="text-lg sm:text-xl font-bold tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            RepoGuardian AI
          </Link>

          {/* Right Section */}
          {user && (
            <div className="flex items-center gap-4">

              <Link
                to={`/dashboard?user=${user}`}
                className="hidden sm:block text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Dashboard
              </Link>

              <Link
                to={`/compare?user=${user}`}
                className="hidden sm:block text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Compare
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all duration-200"
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
