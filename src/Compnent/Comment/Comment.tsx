import { useContext, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit2, FiImage, FiTrash2, FiUser } from "react-icons/fi";
import { AuthContext } from "../../Context/Context";
import type { commentType } from "../Types/Posts";

const BASE = "https://route-posts.routemisr.com";
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});
const errMsg = (e: unknown) =>
  axios.isAxiosError(e)
    ? (e.response?.data?.message ?? "Something went wrong")
    : "Something went wrong";

const muted = "text-[#4b5680] dark:text-[#a9b2d8]";
const iconBtn =
  "flex size-7 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff]";
const input =
  "w-full rounded-xl border border-[#0e1433]/15 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2f5bff] dark:border-white/15 dark:bg-[#0a0d20]";

export default function Comment({
  comment,
  postId,
}: {
  comment: commentType;
  postId: string;
}) {
  const queryClient = useQueryClient();
  const { userId } = useContext(AuthContext);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content ?? "");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const creator = comment.commentCreator;
  const isOwner = !!userId && userId === creator?._id;

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["allComments", postId] });
    queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["myPosts"] });
  }

  /* ====== Edit ====== */
  function startEdit() {
    setText(comment.content ?? "");
    setNewImage(null);
    setPreview(comment.image ?? null);
    setEditing(true);
  }

  function cancelEdit() {
    if (preview && newImage) URL.revokeObjectURL(preview);
    setEditing(false);
    setNewImage(null);
    setPreview(null);
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (preview && newImage) URL.revokeObjectURL(preview);
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  const editMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("content", text);
      if (newImage) fd.append("image", newImage);
      return axios.put(
        `${BASE}/posts/${postId}/comments/${comment._id}`,
        fd,
        { headers: headers() },
      );
    },
    onSuccess: () => {
      toast.success("Comment updated");
      cancelEdit();
      refresh();
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  /* ====== Delete ====== */
  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete(`${BASE}/posts/${postId}/comments/${comment._id}`, {
        headers: headers(),
      }),
    onSuccess: () => {
      toast.success("Comment deleted");
      refresh();
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  function confirmDelete() {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Delete this comment?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                deleteMutation.mutate();
              }}
              className="rounded-full bg-[#c43a1c] px-3 py-1.5 text-sm font-bold text-white hover:bg-[#a82f16]"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  }

  return (
    <div className="mt-3 flex items-start gap-2.5">
      {/* Avatar */}
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff] text-white">
        {creator?.photo ? (
          <img
            src={creator.photo}
            alt={creator.name}
            className="size-full object-cover"
          />
        ) : (
          <FiUser className="size-4" />
        )}
      </span>

      <div className="min-w-0 flex-1 rounded-2xl bg-[#0e1433]/5 px-3 py-2 dark:bg-white/5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold">{creator?.name}</p>
            <p className={`truncate text-[11px] ${muted}`}>
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>

          {isOwner && !editing && (
            <>
              <button
                type="button"
                aria-label="Edit comment"
                onClick={startEdit}
                className={`${iconBtn} ${muted} hover:bg-[#0e1433]/5 hover:text-[#2447d9] dark:hover:bg-white/10 dark:hover:text-[#9db6ff]`}
              >
                <FiEdit2 className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Delete comment"
                disabled={deleteMutation.isPending}
                onClick={confirmDelete}
                className={`${iconBtn} ${muted} hover:bg-[#c43a1c]/10 hover:text-[#c43a1c] focus-visible:ring-[#c43a1c] disabled:opacity-50 dark:hover:bg-[#ff8466]/10 dark:hover:text-[#ff8466]`}
              >
                <FiTrash2 className="size-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Body */}
        {editing ? (
          <div className="mt-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className={input}
            />

            {preview && (
              <img
                src={preview}
                alt=""
                className="mt-2 max-h-56 w-full rounded-xl bg-black/5 object-contain dark:bg-white/5"
              />
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#0e1433]/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-[#0e1433]/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              <FiImage className="size-4" />
              {preview ? "Change photo" : "Add photo"}
            </button>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-[#0e1433]/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  editMutation.isPending || (!text.trim() && !preview)
                }
                onClick={() => editMutation.mutate()}
                className="rounded-full bg-[#2f5bff] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#2447d9] disabled:opacity-50"
              >
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {comment.content && (
              <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">
                {comment.content}
              </p>
            )}
            {comment.image && (
              <img
                src={comment.image}
                alt=""
                className="mt-2 max-h-56 w-full rounded-xl bg-black/5 object-contain dark:bg-white/5"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}