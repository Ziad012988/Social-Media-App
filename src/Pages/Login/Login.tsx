import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { AuthContext } from "../../Context/Context";
import toast from "react-hot-toast";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;
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

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });

  const { register, handleSubmit, formState } = form;

  const { setUserLogin } = useContext(AuthContext);

  function handleLogin(values: LoginSchemaType) {
    setIsLoading(true);
    setApiError("");

    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        toast.success(res.data.message);

        const token = res.data.token || res.data.data?.token;

        if (token) {
          setUserLogin(token);
          localStorage.setItem("userToken", token);
          navigate("/");
        }
      })
      .catch((err) => {
       
        setApiError(
          err.response?.data?.message || "Something went wrong, try again",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef2ff] px-5 py-10 text-[#0e1433] dark:bg-[#0a0d20] dark:text-[#eef1ff]">
      {/* الفقاعات */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-12 h-60 w-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-48 w-48 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-4rem] right-[12%] h-56 w-56 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-[8%] h-28 w-28 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[22%] top-10 h-14 w-14 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
      />

      <div className="relative flex w-full max-w-md flex-col items-center gap-7">
        {/* اللوجو */}
       <Logo/>

        {/* كارت الفورم */}
        <div className="w-full rounded-3xl border border-[#0e1433]/10 bg-white/85 p-6 shadow-xl shadow-[#2f5bff]/10 backdrop-blur-md sm:p-9 dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/30">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mb-6 mt-1.5 text-[#4b5680] dark:text-[#a9b2d8]">
            Log in to see what is bubbling.
          </p>

          {apiError && (
            <p className="mb-5 rounded-xl border border-[#c43a1c] px-4 py-3 text-center text-sm font-bold text-[#c43a1c] dark:border-[#ff8466] dark:text-[#ff8466]">
              {apiError}
            </p>
          )}

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleLogin)}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#4b5680] dark:text-[#a9b2d8]"
              >
                Email
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4b5680] dark:text-[#a9b2d8]" />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border border-[#0e1433]/15 bg-white py-3 pl-12 pr-4 text-base text-[#0e1433] placeholder:text-[#4b5680]/70 transition focus:border-[#2f5bff] focus:outline-none focus:ring-4 focus:ring-[#2f5bff]/20 dark:border-white/15 dark:bg-white/5 dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60 dark:focus:border-[#3f6bff] dark:focus:ring-[#3f6bff]/30"
                />
              </div>
              {formState.errors.email?.message &&
                formState.touchedFields.email && (
                  <p className="mt-1.5 text-sm font-medium text-[#c43a1c] dark:text-[#ff8466]">
                    {formState.errors.email.message}
                  </p>
                )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#4b5680] dark:text-[#a9b2d8]"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4b5680] dark:text-[#a9b2d8]" />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="Your password"
                  className="block w-full rounded-xl border border-[#0e1433]/15 bg-white py-3 pl-12 pr-4 text-base text-[#0e1433] placeholder:text-[#4b5680]/70 transition focus:border-[#2f5bff] focus:outline-none focus:ring-4 focus:ring-[#2f5bff]/20 dark:border-white/15 dark:bg-white/5 dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60 dark:focus:border-[#3f6bff] dark:focus:ring-[#3f6bff]/30"
                />
              </div>
              {formState.errors.password?.message &&
                formState.touchedFields.password && (
                  <p className="mt-1.5 text-sm font-medium text-[#c43a1c] dark:text-[#ff8466]">
                    {formState.errors.password.message}
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f5bff] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:bg-[#2447d9] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f5bff]/40 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3f6bff] dark:hover:bg-[#5a80ff]"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Log in
                  <FiArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center text-[15px]">
              <Link
                to="/register"
                className="font-bold text-[#2447d9] hover:underline dark:text-[#9db6ff]"
              >
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
