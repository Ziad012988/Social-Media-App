import { BarLoader, HashLoader } from "react-spinners";
import { IoChatbubbleEllipses } from "react-icons/io5";

interface LoaderProps {
  /** true = يغطي الشاشة كلها (افتراضي)، false = يملى الصفحة تحت الناف */
  fullScreen?: boolean;
  /** النص اللي تحت اللودر */
  text?: string;
}

export default function Loader({ fullScreen = true, text = "Loading..." }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e3e9ff] to-[#f1e6ff] text-[#0e1433] dark:from-[#070a1c] dark:via-[#0d1236] dark:to-[#1b0f3d] dark:text-[#eef1ff] ${
        fullScreen ? "fixed inset-0 z-[100]" : "relative min-h-[calc(100vh-4.5rem)]"
      }`}
    >
      <span className="sr-only">{text}</span>

      {/* شريط التحميل اللي فوق الصفحة */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0">
        <span className="dark:hidden">
          <BarLoader width="100%" height={4} color="#4f46e5" />
        </span>
        <span className="hidden dark:block">
          <BarLoader width="100%" height={4} color="#7dd3fc" />
        </span>
      </div>

      {/* توهج الألوان في الخلفية */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#2f80ff]/25 blur-3xl dark:bg-[#2f80ff]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#b14bff]/25 blur-3xl dark:bg-[#b14bff]/20" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-[#22d3ee]/20 blur-3xl dark:bg-[#22d3ee]/15" />

      {/* الفقاعات على الصفحة كلها */}
      {[
        "left-[3%] top-[6%] h-44 w-44 [--rim:rgba(47,128,255,.32)] dark:[--rim:rgba(47,128,255,.45)] [animation-duration:7s]",
        "left-[24%] top-[14%] h-16 w-16 [--rim:rgba(177,75,255,.35)] dark:[--rim:rgba(177,75,255,.5)] [animation-duration:5s] [animation-delay:-1s]",
        "left-[44%] top-[4%] h-28 w-28 [--rim:rgba(34,211,238,.35)] dark:[--rim:rgba(34,211,238,.4)] [animation-duration:8s] [animation-delay:-3s]",
        "right-[22%] top-[10%] h-20 w-20 [--rim:rgba(106,76,255,.35)] dark:[--rim:rgba(106,76,255,.5)] [animation-duration:6s] [animation-delay:-2s]",
        "right-[4%] top-[8%] h-52 w-52 [--rim:rgba(177,75,255,.3)] dark:[--rim:rgba(177,75,255,.45)] [animation-duration:9s] [animation-delay:-4s]",
        "left-[8%] top-[44%] h-24 w-24 [--rim:rgba(34,211,238,.35)] dark:[--rim:rgba(34,211,238,.4)] [animation-duration:6s] [animation-delay:-2.5s]",
        "right-[8%] top-[46%] h-32 w-32 [--rim:rgba(47,128,255,.32)] dark:[--rim:rgba(47,128,255,.45)] [animation-duration:7s] [animation-delay:-5s]",
        "left-[3%] bottom-[6%] h-52 w-52 [--rim:rgba(106,76,255,.32)] dark:[--rim:rgba(106,76,255,.5)] [animation-duration:8s] [animation-delay:-1.5s]",
        "left-[26%] bottom-[10%] h-14 w-14 [--rim:rgba(255,209,102,.5)] dark:[--rim:rgba(255,209,102,.5)] [animation-duration:5s] [animation-delay:-3.5s]",
        "left-[46%] bottom-[3%] h-24 w-24 [--rim:rgba(177,75,255,.35)] dark:[--rim:rgba(177,75,255,.5)] [animation-duration:7s] [animation-delay:-4.5s]",
        "right-[24%] bottom-[8%] h-36 w-36 [--rim:rgba(34,211,238,.35)] dark:[--rim:rgba(34,211,238,.4)] [animation-duration:9s] [animation-delay:-2s]",
        "right-[4%] bottom-[5%] h-20 w-20 [--rim:rgba(47,128,255,.35)] dark:[--rim:rgba(47,128,255,.5)] [animation-duration:6s] [animation-delay:-3s]",
      ].map((bubble) => (
        <span
          key={bubble}
          aria-hidden="true"
          className={`pointer-events-none absolute animate-bounce rounded-full border border-white/70 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.85)_0,rgba(255,255,255,0)_16%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_50%,var(--rim)_100%)] shadow-[inset_0_0_30px_var(--rim)] motion-reduce:animate-none dark:border-white/20 ${bubble}`}
        />
      ))}

      {/* الكارت اللي في النص */}
      <div className="relative mx-4 flex flex-col items-center gap-8 rounded-[2rem] border border-white/70 bg-white/55 px-10 py-10 shadow-2xl shadow-[#6a4cff]/25 backdrop-blur-xl sm:px-16 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/50">
        {/* اللوجو + الاسم */}
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-[#6a4cff]/40 motion-reduce:animate-none" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#2f5bff] to-[#b14bff] text-white shadow-xl shadow-[#6a4cff]/50">
              <IoChatbubbleEllipses className="h-8 w-8" />
            </span>
          </span>
          <span className="bg-gradient-to-r from-[#2f5bff] via-[#6a4cff] to-[#b14bff] bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-[#7dd3fc] dark:via-[#a5b4fc] dark:to-[#e9a8ff]">
            Plink
          </span>
        </div>

        {/* السبينر */}
        <div className="flex h-[72px] items-center justify-center" aria-hidden="true">
          <span className="dark:hidden">
            <HashLoader color="#4f46e5" size={64} speedMultiplier={0.9} />
          </span>
          <span className="hidden dark:block">
            <HashLoader color="#7dd3fc" size={64} speedMultiplier={0.9} />
          </span>
        </div>

        {/* النص */}
        <p aria-hidden="true" className="animate-pulse text-sm font-semibold tracking-[0.2em] text-[#4b5680] uppercase motion-reduce:animate-none dark:text-[#b9c4ec]">
          {text}
        </p>
      </div>
    </div>
  );
}
