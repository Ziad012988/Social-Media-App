// flowbit هجيب منه الفورم
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "./../../schemas/auth,schemas";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

/* ================= DESIGN ONLY (مفيش فيهم logic) ================= */
const inputCls =
  "block w-full rounded-xl border border-[#0e1433]/15 bg-white px-4 py-3 text-base text-[#0e1433] placeholder:text-[#4b5680]/70 transition focus:border-[#2f5bff] focus:outline-none focus:ring-4 focus:ring-[#2f5bff]/20 dark:border-white/15 dark:bg-white/5 dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60 dark:focus:border-[#3f6bff] dark:focus:ring-[#3f6bff]/30 dark:[color-scheme:dark]";
const labelCls =
  "mb-1.5 block text-sm font-medium text-[#4b5680] dark:text-[#a9b2d8]";
const errCls =
  "mt-1.5 text-sm font-medium text-[#c43a1c] dark:text-[#ff8466]";
const pillCls =
  "flex cursor-pointer select-none items-center justify-center rounded-xl border border-[#0e1433]/15 bg-white px-4 py-3 text-sm font-semibold text-[#0e1433] transition peer-checked:border-[#2f5bff] peer-checked:bg-[#2f5bff] peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-[#2f5bff]/30 dark:border-white/15 dark:bg-white/5 dark:text-[#eef1ff] dark:peer-checked:border-[#3f6bff] dark:peer-checked:bg-[#3f6bff]";

function Bubble({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,rgba(79,110,255,.22)_100%)] shadow-[inset_0_0_28px_rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,rgba(120,110,255,.34)_100%)] dark:shadow-[inset_0_0_28px_rgba(120,110,255,.34)] ${className}`}
    />
  );
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
/* =================================================================== */

export default function register() {
  const navigate = useNavigate();
  let [apiError, setApiError] = useState("");
  let [isLoading, setIsLoading] = useState(false);




  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    mode: "onChange",
    resolver: zodResolver(RegisterSchema),
  });

  let { register, handleSubmit, formState, getValues, setError } = form;

  // const {ref , onChange ,name ,onBlur} = register("name");

  function handleRegister(values: RegisterSchemaType) {
    console.log(values);
    setIsLoading(true);
    // if (values.password === values.rePassword) {
    //   //  call api
    // } else {
    //   setError("rePassword", { message: "password & repassword no match !" });
    // }
       axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200 || res.status === 201) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err.response?.data);
        setApiError(
          err.response?.data?.message || "Something went wrong, try again"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });

  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-[#0e1433] dark:bg-[#0a0d20] dark:text-[#eef1ff]">
      {/* الفقاعات */}
      <Bubble className="-left-16 -top-10 h-64 w-64" />
      <Bubble className="right-[6%] top-16 h-48 w-48" />
      <Bubble className="bottom-10 right-[18%] h-72 w-72" />
      <Bubble className="bottom-24 left-[4%] h-36 w-36" />
      <Bubble className="left-[28%] top-12 h-16 w-16" />
      <Bubble className="bottom-8 left-[42%] h-28 w-28" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------- الجزء الشمال: البراند ---------- */}
        <div className="lg:self-stretch lg:py-6">
          <Logo />
          <h1 className="mt-10 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:mt-32 lg:text-6xl">
            Share what's bubbling up.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4b5680] dark:text-[#a9b2d8]">
            Post, comment and follow the people who make your feed fizz.
          </p>
        </div>

        {/* ---------- الجزء اليمين: كارت الفورم ---------- */}
        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <div className="rounded-3xl border border-[#0e1433]/10 bg-white/85 p-6 shadow-xl shadow-[#2f5bff]/10 backdrop-blur-md sm:p-9 dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/30">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight">
              Create your account
            </h2>

            {apiError && (
              <p className="mb-5 rounded-xl border border-[#c43a1c] px-4 py-3 text-center text-sm font-bold text-[#c43a1c] dark:border-[#ff8466] dark:text-[#ff8466]">
                {apiError}
              </p>
            )}

            <form
              className="grid gap-5 sm:grid-cols-2"
              onSubmit={handleSubmit(handleRegister, (error) => {
                console.log(error);
              })}
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelCls}>
                  Name
                </label>
                <input
                  {...register("name", {
                    // required: { value: true, message: "Name is required" },
                    // minLength: {
                    //   value: 3,
                    //   message: "Name must be at least 3 characters",
                    // },
                    // maxLength: {
                    //   value: 20,
                    //   message: "Name must be at most 20 characters",
                    // },
                  })}
                  type="text"
                  id="name"
                  className={inputCls}
                  placeholder="Ahmed Nabil"
                />
                {formState.errors.name?.message && formState.touchedFields.name && (
                  <p className={errCls}>
                    {" "}
                    {formState.errors.name.message}{" "}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelCls}>
                  Email
                </label>
                <input
                  {...register("email", {
                    // required: { value: true, message: "Email is required" },
                    // pattern: {
                    //   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    //   message: "Please enter a valid email address",
                    // },
                  })}
                  type="email"
                  id="email"
                  className={inputCls}
                  placeholder="you@example.com"
                />
                {formState.errors.email?.message && formState.touchedFields.email && (
                  <p className={errCls}>
                    {" "}
                    {formState.errors.email.message}{" "}
                  </p>
                )}
              </div>

              {/* Date of birth */}
              <div>
                <label htmlFor="dateOfBirth" className={labelCls}>
                  Date of birth
                </label>
                <input
                  {...register("dateOfBirth", {
                    // valueAsDate: false,
                    // validate: (value) => {
                    //   const today = new Date().getFullYear();
                    //   const userDate = new Date(value).getFullYear();
                    //   return (
                    //     today - userDate >= 18 || "You must be at least 18 years old"
                    //   );
                    // },
                  })}
                  type="date"
                  id="dateOfBirth"
                  className={inputCls}
                  placeholder=" "
                />
                {formState.errors.dateOfBirth?.message &&
                  formState.touchedFields.dateOfBirth && (
                    <p className={errCls}>
                      {" "}
                      {formState.errors.dateOfBirth.message}{" "}
                    </p>
                  )}
              </div>

              {/* Gender */}
              <div>
                <span className={labelCls}>Gender</span>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      {...register("gender")}
                      id="default-radio-1"
                      type="radio"
                      value="female"
                      className="peer sr-only"
                    />
                    <label htmlFor="default-radio-1" className={pillCls}>
                      female
                    </label>
                  </div>
                  <div className="relative flex-1">
                    <input
                      {...register("gender", {
                        required: { value: true, message: "Gender is required" },
                      })}
                      id="default-radio-2"
                      type="radio"
                      value="male"
                      className="peer sr-only"
                    />
                    <label htmlFor="default-radio-2" className={pillCls}>
                      male
                    </label>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelCls}>
                  Password
                </label>
                <input
                  {...register("password", {
                    // required: { value: true, message: "Password is required" },
                    // pattern: {
                    //   value:
                    //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    //   message:
                    //     "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character",
                    // },
                  })}
                  type="password"
                  id="password"
                  className={inputCls}
                  placeholder="At least 8 characters"
                />
                {formState.errors.password?.message &&
                  formState.touchedFields.password && (
                    <p className={errCls}>
                      {" "}
                      {formState.errors.password.message}{" "}
                    </p>
                  )}
              </div>

              {/* Repassword */}
              <div>
                <label htmlFor="rePassword" className={labelCls}>
                  Repassword
                </label>
                <input
                  {...register("rePassword", {
                    //  validate:function(rePassword) {
                    //   if (rePassword=== getValues("password")) {
                    //     return true
                    //   }
                    //   else{
                    //     return "password & repassword no match !"
                    //   }
                    //  }
                  })}
                  type="password"
                  id="rePassword"
                  className={inputCls}
                  placeholder="Repeat your password"
                />
                {formState.errors.rePassword?.message &&
                  formState.touchedFields.rePassword && (
                    <p className={errCls}>
                      {" "}
                      {formState.errors.rePassword.message}{" "}
                    </p>
                  )}
              </div>

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  disabled={isLoading}
                  className="w-full rounded-full bg-[#2f5bff] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:bg-[#2447d9] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f5bff]/40 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3f6bff] dark:hover:bg-[#5a80ff]"
                >
                  {isLoading ? "Loading..." : "Create account"}
                </button>

                <div className="mt-5 text-center text-[15px] text-[#4b5680] dark:text-[#a9b2d8]">
                  <Link
                    to="/login"
                    className="font-bold text-[#2447d9] hover:underline dark:text-[#9db6ff]"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
