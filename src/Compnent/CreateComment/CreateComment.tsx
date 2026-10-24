import { useForm } from "react-hook-form";
import { FiImage, FiSend, FiUser } from "react-icons/fi";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "./../../../node_modules/react-hot-toast/src/index";

interface CommentFormValues {
  content: string;
  image: string; // ملف الصورة (اختياري)
}

export default function CreateComment({ postId }: { postId: string }) {
  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
    },
  });

  const query = useQueryClient();

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

  const formdata = new FormData();
  function CreateComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: CreateComment,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["allComments", postId] }); // قايمة التعليقات
      query.invalidateQueries({ queryKey: ["postComments", postId] }); // صفحة التفاصيل
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      reset();
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.message);
      // يمكنك عرض رسالة خطأ للمستخدم هنا إذا لزم الأمر
    },
  });

  function handleCreateComment(values: CommentFormValues) {
    if (!values.content && !values.image?.[0]) {
      return;
    } // لا يوجد محتوى أو صورة، لا تفعل شيئًا

    if (values.content) formdata.append("content", values.content);
    if (values.image?.[0]) formdata.append("image", values.image?.[0]);
    mutate();
  }

  return (
    <form
      className="mt-4 flex items-start gap-3 border-t border-[#0e1433]/10 pt-4 dark:border-white/10"
      onSubmit={handleSubmit(handleCreateComment)}
    >
      {/* صورة المستخدم */}
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] text-white shadow-md shadow-[#6a4cff]/30">
        {me?.photo ? (
          <img
            src={me.photo}
            alt={me.name}
            className="size-full object-cover"
          />
        ) : (
          <FiUser className="size-5" />
        )}
      </span>

      {/* صندوق الكتابة */}
      <div className="flex-1 rounded-2xl border border-[#0e1433]/10 bg-white/70 p-1.5 transition focus-within:border-[#2f5bff] focus-within:ring-4 focus-within:ring-[#2f5bff]/20 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-[#3f6bff] dark:focus-within:ring-[#3f6bff]/30">
        <textarea
          {...register("content")}
          rows={2}
          aria-label="Write a comment"
          placeholder="Write a comment..."
          className="block w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-[#0e1433] placeholder:text-[#4b5680]/70 focus:outline-none dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60"
        />

        {/* الأيقونات + زرار الإرسال */}
        <div className="flex items-center justify-between px-1.5 pb-1">
          <div className="flex items-center gap-1 text-[#4b5680] dark:text-[#a9b2d8]">

            {/* اختيار صورة: label بيلف الـ input */}
            <label className="flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#0e1433]/5 hover:text-[#2447d9] focus-within:ring-2 focus-within:ring-[#2f5bff] dark:hover:bg-white/10 dark:hover:text-[#9db6ff]">
              <input
                type="file"
                accept="image/*"
                aria-label="Add image"
                className="sr-only"
                {...register("image")}
              />
              <FiImage className="size-4.5" />
            </label>
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="inline-flex disabled=cursor-not-allowed cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2f5bff] to-[#6a4cff] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:from-[#3f6bff] dark:to-[#7a5cff]"
          >
            {isPending ? "Loading..." : "Comment"}

            <FiSend className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
}