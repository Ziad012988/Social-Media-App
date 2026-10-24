import { FiImage, FiSend, FiSmile, FiUser } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "./../../../node_modules/react-hot-toast/src/index";

/* تصميم فقط (من غير لوجيك) — اربط الـ textarea والـ file input والفورم بـ react-hook-form بتاعك */
export default function PostCreation() {
  const [upload, setUpload] = useState("");
  const query = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  // صورة البروفايل (نفس الـ key بتاع صفحة Profile فبتتشارك من الكاش)
  const { data: me } = useQuery<{ name: string; photo?: string }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return res.data.data.user;
    },
  });

  function handleImageValue(e: any) {
    const path = URL.createObjectURL(e.target.files[0]);
    setUpload(path);
  }

  function createPost(formData: FormData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { data, mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess(res) {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      reset();
      setUpload("");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  function handleCreatePost(value: any) {
    if (!value.content && !value.image?.[0]) {
      return;
    }
    const formData = new FormData();
    if (value.content) {
      formData.append("body", value.content);
    }
    if (value.image?.[0]) {
      formData.append("image", value.image?.[0]);
    }

    mutate(formData);
  }
  return (
    <form
      className="rounded-3xl mb-3.5 border border-[#0e1433]/10 bg-white/85 p-4 shadow-lg shadow-[#2f5bff]/5 backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/20"
      onSubmit={handleSubmit(handleCreatePost)}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* صورة المستخدم */}
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] text-white shadow-md shadow-[#6a4cff]/30 sm:size-12">
          {me?.photo ? (
            <img
              src={me.photo}
              alt={me.name}
              className="size-full object-cover"
            />
          ) : (
            <FiUser className="size-5 sm:size-6" />
          )}
        </span>

        {/* صندوق الكتابة */}
        <div className="min-w-0 flex-1 rounded-2xl border border-[#0e1433]/10 bg-white/70 transition focus-within:border-[#2f5bff] focus-within:ring-4 focus-within:ring-[#2f5bff]/20 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-[#3f6bff] dark:focus-within:ring-[#3f6bff]/30">
          <textarea
            {...register("content")}
            rows={3}
            aria-label="Write a post"
            placeholder="What's bubbling up?"
            className="block w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-[#0e1433] placeholder:text-[#4b5680]/70 focus:outline-none sm:text-base dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60"
          />
          {upload && (
            <div className="relative">
              <IoMdCloseCircle
                className="absolute end-[20px] top-[10px] text-slate-500 size-10 cursor-pointer hover:text-slate-700 transition-all "
                onClick={() => setUpload("")}
              />
              <img src={upload} alt="" className="m-auto p-2" />
            </div>
          )}
        </div>
      </div>

      {/* الأدوات + زرار النشر */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#0e1433]/10 pt-4 dark:border-white/10">
        <div className="flex items-center gap-1 text-[#4b5680] dark:text-[#a9b2d8]">
          {/* اختيار صورة: label بيلف الـ input */}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-[#2f5bff]/10 hover:text-[#2447d9] focus-within:ring-2 focus-within:ring-[#2f5bff] dark:hover:bg-[#3f6bff]/20 dark:hover:text-[#9db6ff]">
            <input
              {...register("image", { onChange: handleImageValue })}
              type="file"
              accept="image/*"
              aria-label="Add photo"
              className="sr-only"
            />
            <FiImage className="size-5" />
            Photo
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full cursor-pointer  disabled:cursor-not-allowed disabled:opacity-60 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2f5bff] to-[#6a4cff] px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:from-[#3f6bff] dark:to-[#7a5cff]"
        >
          {isPending ? (
            "Loading..."
          ) : (
            <>
              {" "}
              Post
              <FiSend className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
