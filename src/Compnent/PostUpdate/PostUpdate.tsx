import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { FiMoreVertical, FiEdit2, FiTrash2, FiImage, FiX } from "react-icons/fi";
import { AuthContext } from "../../Context/Context";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface EditFormValues {
  content: string;
  image: FileList;
}

export default function PostUpdate({
  userId,
  postId,
  body = "",
  image = "",
}: {
  userId: string;
  postId: string;
  body?: string; // نص البوست الحالي (للتعبئة في نافذة التعديل)
  image?: string | null; // صورة البوست الحالية
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [preview, setPreview] = useState(image ?? "");

  const { userId: userLogin } = useContext(AuthContext);

  const { register, handleSubmit, reset } = useForm<EditFormValues>({
    defaultValues: { content: body },
  });

  function handleDelete() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  // PUT: التعديل بيتبعت FormData فيه body (النص) و image (الصورة)
  function handleEdit(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const query = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: editPost, isPending: isEditing } = useMutation({
    mutationFn: handleEdit,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["postComments", postId] });
      setEditOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function openEdit() {
    reset({ content: body });
    setPreview(image ?? "");
    setOpen(false);
    setEditOpen(true);
  }

  function handleImageValue(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  function handleEditSubmit(values: EditFormValues) {
    const file = values.image?.[0];
    if (!values.content.trim() && !file && !preview) return; // لا نص ولا صورة

    const formData = new FormData();
    if (values.content.trim()) formData.append("body", values.content);
    if (file) formData.append("image", file);
    editPost(formData);
  }

  // قفل نافذة التعديل بزرار Escape
  useEffect(() => {
    if (!editOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editOpen]);

  return (
    <>
      {userLogin === userId && (
        <div className="relative">
          <button
            type="button"
            aria-label="Post options"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#4b5680] transition hover:bg-[#0e1433]/5 hover:text-[#0e1433] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:text-[#a9b2d8] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FiMoreVertical className="size-5" />
          </button>

          {open && (
            <>
              {/* خلفية شفافة: الضغط برّه القايمة يقفلها */}
              <button
                type="button"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />

              <div
                role="menu"
                className="absolute end-0 top-full z-20 mt-2 w-44 rounded-2xl border border-[#0e1433]/10 bg-white/95 p-1.5 shadow-xl shadow-[#2f5bff]/10 backdrop-blur-md dark:border-white/10 dark:bg-[#161b3e]/95 dark:shadow-black/40"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={openEdit}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0e1433] transition hover:bg-[#2f5bff]/10 hover:text-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:text-[#eef1ff] dark:hover:bg-[#3f6bff]/20 dark:hover:text-[#9db6ff]"
                >
                  <FiEdit2 className="size-4.5" /> Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={isPending}
                  onClick={() => mutate()}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#c43a1c] transition hover:bg-[#c43a1c]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c43a1c] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#ff8466] dark:hover:bg-[#ff8466]/10"
                >
                  {isPending ? (
                    "Loading..."
                  ) : (
                    <>
                      <FiTrash2 className="size-4.5" /> Delete
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* نافذة التعديل (في body عشان الـ backdrop-blur بتاع الكارت ما يأثرش على position) */}
          {editOpen &&
            createPortal(
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Edit post"
                className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto p-4"
              >
                <button
                  type="button"
                  aria-label="Close"
                  tabIndex={-1}
                  onClick={() => setEditOpen(false)}
                  className="fixed inset-0 cursor-default bg-[#0a0d20]/60 backdrop-blur-sm"
                />

                <form
                  onSubmit={handleSubmit(handleEditSubmit)}
                  className="relative my-auto w-full max-w-lg rounded-3xl border border-[#0e1433]/10 bg-white p-5 text-[#0e1433] shadow-2xl shadow-[#6a4cff]/25 sm:p-7 dark:border-white/10 dark:bg-[#161b3e] dark:text-[#eef1ff] dark:shadow-black/50"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Edit post</h2>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setEditOpen(false)}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#4b5680] transition hover:bg-[#0e1433]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:text-[#a9b2d8] dark:hover:bg-white/10"
                    >
                      <FiX className="size-5" />
                    </button>
                  </div>

                  {/* صندوق الكتابة + الصورة */}
                  <div className="rounded-2xl border border-[#0e1433]/10 bg-white/70 transition focus-within:border-[#2f5bff] focus-within:ring-4 focus-within:ring-[#2f5bff]/20 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-[#3f6bff] dark:focus-within:ring-[#3f6bff]/30">
                    <textarea
                      {...register("content")}
                      rows={4}
                      aria-label="Post text"
                      placeholder="What's bubbling up?"
                      className="block w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-[#0e1433] placeholder:text-[#4b5680]/70 focus:outline-none sm:text-base dark:text-[#eef1ff] dark:placeholder:text-[#a9b2d8]/60"
                    />
                    {preview && (
                      <img src={preview} alt="Post preview" className="m-auto max-h-72 w-full object-contain p-2" />
                    )}
                  </div>

                  {/* الأدوات + الأزرار */}
                  <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#0e1433]/10 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#4b5680] transition hover:bg-[#2f5bff]/10 hover:text-[#2447d9] focus-within:ring-2 focus-within:ring-[#2f5bff] sm:justify-start dark:text-[#a9b2d8] dark:hover:bg-[#3f6bff]/20 dark:hover:text-[#9db6ff]">
                      <input
                        {...register("image", { onChange: handleImageValue })}
                        type="file"
                        accept="image/*"
                        aria-label="Change photo"
                        className="sr-only"
                      />
                      <FiImage className="size-5" />
                      Change photo
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditOpen(false)}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#0e1433]/15 px-6 py-2.5 text-sm font-bold transition hover:bg-[#0e1433]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] sm:flex-none dark:border-white/15 dark:hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isEditing}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full bg-linear-to-r from-[#2f5bff] to-[#6a4cff] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none dark:from-[#3f6bff] dark:to-[#7a5cff]"
                      >
                        {isEditing ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>,
              document.body,
            )}
        </div>
      )}
    </>
  );
}