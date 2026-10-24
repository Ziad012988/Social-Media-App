import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // بيخلي الناف يعيد الفحص عند كل تغيير للصفحة (بعد اللوجين واللوج أوت)
  const { pathname } = useLocation();

  // الدارك / اللايت
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setOpen(false);
    navigate("/login");
  }

  function Logo() {
    return (
      <span className="flex items-center gap-3">
        <svg width="42" height="42" viewBox="0 0 40 40" aria-hidden="true">
          <defs>
            <linearGradient id="plink-lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2f80ff" />
              <stop offset=".55" stopColor="#6a4cff" />
              <stop offset="1" stopColor="#b14bff" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="12" fill="url(#plink-lg)" />
          <path
            d="M20 9c6.6 0 12 4.4 12 10s-5.4 10-12 10c-1.4 0-2.7-.2-3.9-.6L10 31l1.6-5.4C9.4 23.8 8 21.6 8 19c0-5.6 5.4-10 12-10z"
            fill="#fff"
          />
          <circle cx="14.5" cy="15.5" r="2" fill="#6a4cff" opacity=".3" />
          <circle cx="32" cy="8" r="3.4" fill="#ffd166" />
        </svg>
        <span className="text-3xl font-semibold tracking-tight">Plink</span>
      </span>
    );
  }

  // مفيش token في localStorage = الناف مايظهرش
  if (
    !localStorage.getItem("userToken") ||
    pathname === "/login" ||
    pathname === "/register"
  )
    return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#0e1433]/10 bg-white/80 text-[#0e1433] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0d20]/80 dark:text-[#eef1ff]">
      {/* ====================== الشاشات الكبيرة (lg وفوق) ====================== */}
      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-6 py-3 lg:flex">
        {/* اللوجو */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff]"
        >
          <Logo />
        </Link>

        {/* الروابط */}
        <nav aria-label="Main" className="mx-auto flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                isActive
                  ? "bg-[#2f5bff]/10 text-[#2447d9] dark:bg-[#3f6bff]/20 dark:text-[#9db6ff]"
                  : "text-[#4b5680] hover:bg-[#0e1433]/5 hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:bg-white/10 dark:hover:text-white"
              }`
            }
          >
            <FiHome className="h-[18px] w-[18px]" />
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                isActive
                  ? "bg-[#2f5bff]/10 text-[#2447d9] dark:bg-[#3f6bff]/20 dark:text-[#9db6ff]"
                  : "text-[#4b5680] hover:bg-[#0e1433]/5 hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:bg-white/10 dark:hover:text-white"
              }`
            }
          >
            <FiUser className="h-[18px] w-[18px]" />
            Profile
          </NavLink>
        </nav>

        {/* الأزرار */}
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0e1433]/15 px-5 py-2.5 text-sm font-bold transition hover:bg-[#0e1433]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:border-white/15 dark:hover:bg-white/10"
          >
            <FiLogOut className="h-[18px] w-[18px]" />
            Log out
          </button>

          <Link
            to="/profile"
            aria-label="Your profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f5bff] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 dark:bg-[#3f6bff]"
          >
            <FiUser className="h-5 w-5" />
          </Link>

          {/* الدارك / اللايت */}
          <div
            role="group"
            aria-label="Theme"
            className="flex items-center gap-1 rounded-full border border-[#0e1433]/10 bg-[#0e1433]/5 p-1 dark:border-white/10 dark:bg-white/5"
          >
            <button
              type="button"
              aria-label="Light mode"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                theme === "light"
                  ? "bg-[#2f5bff] text-white shadow-md shadow-[#2f5bff]/30"
                  : "text-[#4b5680] hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:text-white"
              }`}
            >
              <FiSun className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Dark mode"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                theme === "dark"
                  ? "bg-[#3f6bff] text-white shadow-md shadow-[#3f6bff]/30"
                  : "text-[#4b5680] hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:text-white"
              }`}
            >
              <FiMoon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* ====================== الموبايل والتابلت (أقل من lg) ====================== */}
      <div className="px-4 py-3 sm:px-6 lg:hidden">
        {/* اللوجو + زرار القايمة */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] text-white shadow-lg shadow-[#6a4cff]/30">
              <IoChatbubbleEllipses className="h-6 w-6" />
            </span>
            <span className="text-[26px] font-semibold tracking-tight">
              Plink
            </span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
              open
                ? "border-[#2f5bff]/50 bg-[#2f5bff]/10 text-[#2447d9] dark:border-[#9db6ff]/50 dark:bg-[#3f6bff]/20 dark:text-[#9db6ff]"
                : "border-[#0e1433]/15 hover:bg-[#0e1433]/5 dark:border-white/15 dark:hover:bg-white/10"
            }`}
          >
            {open ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* الـ div اللي تحت الزرار: فيها كل الزراير */}
        {open && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#0e1433]/10 bg-[#0e1433]/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]">
            {/* الروابط */}
            <nav aria-label="Main" className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                    isActive
                      ? "bg-[#2f5bff]/10 text-[#2447d9] dark:bg-[#3f6bff]/20 dark:text-[#9db6ff]"
                      : "text-[#4b5680] hover:bg-[#0e1433]/5 hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:bg-white/10 dark:hover:text-white"
                  }`
                }
              >
                <FiHome className="h-[18px] w-[18px]" />
                Home
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                    isActive
                      ? "bg-[#2f5bff]/10 text-[#2447d9] dark:bg-[#3f6bff]/20 dark:text-[#9db6ff]"
                      : "text-[#4b5680] hover:bg-[#0e1433]/5 hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:bg-white/10 dark:hover:text-white"
                  }`
                }
              >
                <FiUser className="h-[18px] w-[18px]" />
                Profile
              </NavLink>
            </nav>

            {/* الأزرار */}
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                to="/create-post"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f5bff] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:bg-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:bg-[#3f6bff] dark:hover:bg-[#5a80ff]"
              >
                <FiPlus className="h-[18px] w-[18px]" />
                Create post
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0e1433]/15 px-5 py-3 text-sm font-bold transition hover:bg-[#0e1433]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:border-white/15 dark:hover:bg-white/10"
              >
                <FiLogOut className="h-[18px] w-[18px]" />
                Log out
              </button>
            </div>

            {/* الدارك / اللايت */}
            <div
              role="group"
              aria-label="Theme"
              className="flex w-full items-center gap-1 rounded-full border border-[#0e1433]/10 bg-[#0e1433]/5 p-1 dark:border-white/10 dark:bg-white/5"
            >
              <button
                type="button"
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
                className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                  theme === "light"
                    ? "bg-[#2f5bff] text-white shadow-md shadow-[#2f5bff]/30"
                    : "text-[#4b5680] hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:text-white"
                }`}
              >
                <FiSun className="h-[18px] w-[18px]" />
                Light
              </button>
              <button
                type="button"
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
                className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] ${
                  theme === "dark"
                    ? "bg-[#3f6bff] text-white shadow-md shadow-[#3f6bff]/30"
                    : "text-[#4b5680] hover:text-[#0e1433] dark:text-[#a9b2d8] dark:hover:text-white"
                }`}
              >
                <FiMoon className="h-[18px] w-[18px]" />
                Dark
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
