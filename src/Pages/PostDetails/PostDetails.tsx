import { Link, useParams } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import Loader from "../../Compnent/Loading/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Posts from "../Posts/Posts";

export default function PostDetails() {
  const { id } = useParams();

  function postComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["postComments", id],
    queryFn: postComments,
  });


  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden bg-[#eef2ff] px-4 py-10 text-[#0e1433] dark:bg-[#0a0d20] dark:text-[#eef1ff]">
        {/* الفقاعات */}
        <span aria-hidden="true" className="pointer-events-none fixed -right-16 top-24 size-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
        <span aria-hidden="true" className="pointer-events-none fixed bottom-24 left-[8%] size-24 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />

        <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-[#c43a1c]/30 bg-white/85 p-8 text-center shadow-xl shadow-[#c43a1c]/5 backdrop-blur-md dark:border-[#ff8466]/30 dark:bg-[#161b3e]/80 dark:shadow-black/30">
          <span className="flex size-14 items-center justify-center rounded-full border border-[#c43a1c]/40 text-[#c43a1c] dark:border-[#ff8466]/40 dark:text-[#ff8466]">
            <FiAlertCircle className="size-7" />
          </span>
          <p className="font-semibold text-[#c43a1c] dark:text-[#ff8466]">
            Error fetching posts. Please try again later.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#0e1433]/15 px-5 py-2.5 text-sm font-bold transition hover:bg-[#0e1433]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:border-white/15 dark:hover:bg-white/10"
          >
            <FiArrowLeft className="size-4.5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#eef2ff] px-4 py-10 text-[#0e1433] sm:px-6 dark:bg-[#0a0d20] dark:text-[#eef1ff]">
      {/* الفقاعات */}
      <span aria-hidden="true" className="pointer-events-none fixed -right-16 top-24 size-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed -left-20 top-1/2 size-48 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed bottom-[-4rem] right-[14%] size-56 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed bottom-24 left-[8%] size-24 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />

      <div className="relative mx-auto max-w-2xl">
        {/* الرجوع للفيد */}
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[#2447d9] transition hover:bg-[#2f5bff]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:text-[#9db6ff] dark:hover:bg-[#3f6bff]/20"
        >
          <FiArrowLeft className="size-4.5" />
          Back to Home
        </Link>

        <Posts post={data?.data?.data.post} isPostDetails={true}   />
      </div>
    </div>
  );
}
