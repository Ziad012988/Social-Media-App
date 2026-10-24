import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/NotFound/NotFound";
import AuthContextProvider from "./Context/Context";
import Register from "./Pages/Register/register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductRoute from "./Compnent/ProductRoute/ProductRoute";
import ProductSign from "./Compnent/ProductRoute/ProductSign";
import PostDetails from "./Pages/PostDetails/PostDetails";
import { Toaster } from "react-hot-toast";
import { useNetworkState } from "react-use";

const query = new QueryClient();

const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: (
          <ProductRoute>
            <Home />
          </ProductRoute>
        ),
      },
      {
        index: true,
        element: (
          <ProductRoute>
            <Home />
          </ProductRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProductRoute>
            <Profile />
          </ProductRoute>
        ),
      },
      {
        path: "login",
        element: (
          <ProductSign>
            <Login />
          </ProductSign>
        ),
      },
      {
        path: "register",
        element: (
          <ProductSign>
            <Register />
          </ProductSign>
        ),
      },
      {
        path: "/postdetails/:id",
        element: (
          <ProductRoute>
            <PostDetails />
          </ProductRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  const { online } = useNetworkState();

  return (
    <>
      {online === false && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#eef2ff] px-4 text-[#0e1433] dark:bg-[#0a0d20] dark:text-[#eef1ff]">
          {/* Bubbles */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-20 size-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-24 size-48 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
          />

          {/* Card */}
          <div
            role="alert"
            className="relative w-full max-w-sm rounded-3xl border border-[#0e1433]/10 bg-white/85 p-8 text-center shadow-xl shadow-[#2f5bff]/10 backdrop-blur-md dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/30"
          >
            <span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] text-white shadow-lg shadow-[#6a4cff]/30">
              <svg
                className="size-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M8.5 16.4a5 5 0 017 0M5 12.9a10 10 0 015.2-2.8M19 12.9a10 10 0 00-2.5-1.8M2 8.8a15 15 0 015.4-3.2M22 8.8a15 15 0 00-9-3.7M12 20h.01"
                />
              </svg>
            </span>

            <h2 className="text-2xl font-semibold tracking-tight">
              You're offline
            </h2>
            <p className="mb-6 mt-2 text-sm leading-relaxed text-[#4b5680] dark:text-[#a9b2d8]">
              Check your internet connection and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2f5bff] to-[#6a4cff] px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 dark:from-[#3f6bff] dark:to-[#7a5cff]"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <Toaster />
          <RouterProvider router={routers} />
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
