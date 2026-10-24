import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden bg-[#eef2ff] px-4 py-10 text-[#0e1433] dark:bg-[#0a0d20] dark:text-[#eef1ff]">
      {/* الفقاعات */}
      <span aria-hidden="true" className="pointer-events-none fixed -right-16 top-24 size-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed -left-20 top-1/2 size-48 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed bottom-[-4rem] right-[14%] size-56 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />
      <span aria-hidden="true" className="pointer-events-none fixed bottom-24 left-[8%] size-24 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]" />

      <div className="relative flex w-full max-w-lg flex-col items-center gap-6 rounded-[2rem] border border-white/70 bg-white/55 px-6 py-10 text-center shadow-2xl shadow-[#6a4cff]/20 backdrop-blur-xl sm:px-10 sm:py-12 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/50">
        {/* 404: الصفر فقاعة */}
        <div aria-hidden="true" className="flex items-center justify-center gap-1 sm:gap-2">
          <span className="bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] bg-clip-text text-8xl leading-none font-black tracking-tight text-transparent sm:text-9xl dark:from-[#7dd3fc] dark:via-[#a5b4fc] dark:to-[#e9a8ff]">
            4
          </span>
          <span className="flex size-24 animate-bounce items-center justify-center rounded-full border border-white/70 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.85)_0,rgba(255,255,255,0)_16%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_50%,var(--rim)_100%)] shadow-[inset_0_0_30px_var(--rim)] [--rim:rgba(106,76,255,.4)] [animation-duration:3s] motion-reduce:animate-none sm:size-36 dark:border-white/20 dark:[--rim:rgba(120,110,255,.55)]">
            <span className="bg-linear-to-br from-[#2f5bff] to-[#b14bff] bg-clip-text text-6xl leading-none font-black text-transparent sm:text-8xl dark:from-[#7dd3fc] dark:to-[#e9a8ff]">
              0
            </span>
          </span>
          <span className="bg-linear-to-br from-[#b14bff] via-[#6a4cff] to-[#2f80ff] bg-clip-text text-8xl leading-none font-black tracking-tight text-transparent sm:text-9xl dark:from-[#e9a8ff] dark:via-[#a5b4fc] dark:to-[#7dd3fc]">
            4
          </span>
        </div>

        {/* النص */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="leading-relaxed text-[#4b5680] dark:text-[#b9c4ec]">
            The page you are looking for doesn't exist or has been moved. Let's get you back to what's bubbling.
          </p>
        </div>

        {/* زرار الرجوع */}
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2f5bff] to-[#6a4cff] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 sm:w-auto dark:from-[#3f6bff] dark:to-[#7a5cff]"
        >
          <FiHome className="size-4.5" />
          Back to home
        </Link>
      </div>
    </div>
  );
}