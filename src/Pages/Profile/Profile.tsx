import { useContext, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FiCamera,
  FiEdit2,
  FiHeart,
  FiImage,
  FiLock,
  FiMessageCircle,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AuthContext } from "../../Context/Context";
import Loader from "../../Compnent/Loading/Loader";
import { Link } from "react-router-dom";

const BASE = "https://route-posts.routemisr.com";
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});
const errMsg = (e: unknown) =>
  axios.isAxiosError(e)
    ? (e.response?.data?.message ?? "Something went wrong")
    : "Something went wrong";

/* ====== Shared classes ====== */
const bubble =
  "pointer-events-none fixed rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]";
const statCard =
  "rounded-2xl border border-[#0e1433]/10 bg-white/85 py-3 text-center backdrop-blur-md dark:border-white/10 dark:bg-[#161b3e]/80";
const muted = "text-[#4b5680] dark:text-[#a9b2d8]";
const gradient = "bg-linear-to-br from-[#2f80ff] via-[#6a4cff] to-[#b14bff]";
const iconBtn =
  "flex size-8 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff]";
const input =
  "w-full rounded-xl border border-[#0e1433]/15 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#2f5bff] dark:border-white/15 dark:bg-[#0a0d20]";
const outlineBtn =
  "inline-flex items-center gap-2 rounded-full border border-[#0e1433]/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-[#0e1433]/5 dark:border-white/15 dark:hover:bg-white/10";

type ProfileUser = {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
};

type MyPost = {
  _id: string;
  body: string;
  image?: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
};

/* ====== Facebook-style post image ====== */
function PostImage({ src }: { src: string }) {
  return (
    <div className="relative -mx-3 mt-3 overflow-hidden bg-black sm:-mx-4">
      {/* Blurred background */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-2xl"
      />
      {/* Actual image */}
      <img
        src={src}
        alt=""
        className="relative mx-auto block h-auto max-h-[36rem] w-full object-contain"
      />
    </div>
  );
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { setUserLogin } = useContext(AuthContext);
  const fileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  /* ====== Profile ====== */
  const { data: user, isLoading } = useQuery<ProfileUser>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/users/profile-data`, {
        headers: headers(),
      });
      return res.data.data.user;
    },
  });

  /* ====== My posts ====== */
  const { data: posts = [] } = useQuery<MyPost[]>({
    queryKey: ["myPosts", user?._id],
    enabled: !!user?._id,
    queryFn: async () => {
      const res = await axios.get(`${BASE}/users/${user!._id}/posts`, {
        headers: headers(),
      });
      return res.data.data.posts;
    },
  });

  /* ====== Upload profile photo ====== */
  const photoMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("photo", file);
      return axios.put(`${BASE}/users/upload-photo`, fd, {
        headers: headers(),
      });
    },
    onSuccess: () => {
      toast.success("Photo updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    photoMutation.mutate(file);
    e.target.value = "";
  }

  /* ====== Change password ====== */
  const pwdMutation = useMutation({
    mutationFn: () =>
      axios.patch(
        `${BASE}/users/change-password`,
        { password, newPassword },
        { headers: { ...headers(), "Content-Type": "application/json" } },
      ),
    onSuccess: (res) => {
      const token = res.data?.token ?? res.data?.data?.token;
      if (token) {
        localStorage.setItem("userToken", token);
        setUserLogin(token);
      }
      toast.success("Password changed");
      closePwd();
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  function closePwd() {
    setPwdOpen(false);
    setPassword("");
    setNewPassword("");
  }

  function submitPwd(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (password === newPassword) {
      toast.error("New password must be different from the current one");
      return;
    }
    pwdMutation.mutate();
  }

  /* ====== Edit post ====== */
  function startEdit(post: MyPost) {
    setEditingId(post._id);
    setEditText(post.body);
    setEditImage(null);
    setEditPreview(post.image ?? null);
  }

  function cancelEdit() {
    if (editPreview && editImage) URL.revokeObjectURL(editPreview);
    setEditingId(null);
    setEditImage(null);
    setEditPreview(null);
  }

  function handleEditImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (editPreview && editImage) URL.revokeObjectURL(editPreview);
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  const editMutation = useMutation({
    mutationFn: (id: string) => {
      const fd = new FormData();
      fd.append("body", editText);
      if (editImage) fd.append("image", editImage);
      return axios.put(`${BASE}/posts/${id}`, fd, { headers: headers() });
    },
    onSuccess: () => {
      toast.success("Post updated");
      cancelEdit();
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  /* ====== Delete post ====== */
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${BASE}/posts/${id}`, { headers: headers() }),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  function confirmDelete(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Delete this post?</p>
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
                deleteMutation.mutate(id);
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

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#eef2ff] px-4 py-6 text-[#0e1433] sm:px-6 sm:py-10 dark:bg-[#0a0d20] dark:text-[#eef1ff]">
      {/* Bubbles */}
      <span
        aria-hidden="true"
        className={`${bubble} -right-16 top-24 size-60`}
      />
      <span
        aria-hidden="true"
        className={`${bubble} -left-20 top-1/2 size-48`}
      />
      <span
        aria-hidden="true"
        className={`${bubble} bottom-[-4rem] right-[14%] size-56`}
      />
      <span
        aria-hidden="true"
        className={`${bubble} bottom-24 left-[8%] size-24`}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* ============ Cover ============ */}
        <div
          className={`relative h-36 overflow-hidden rounded-3xl ${gradient} shadow-xl shadow-[#6a4cff]/25 sm:h-48 lg:h-56`}
        >
          <span
            aria-hidden="true"
            className="absolute -left-6 -top-10 size-28 rounded-full border border-white/40 bg-white/10 sm:size-40"
          />
          <span
            aria-hidden="true"
            className="absolute left-[30%] top-6 size-10 rounded-full border border-white/40 bg-white/10 sm:size-14"
          />
          <span
            aria-hidden="true"
            className="absolute -top-12 right-[12%] size-36 rounded-full border border-white/40 bg-white/10 sm:size-52"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-6 size-10 rounded-full border border-white/40 bg-white/10 sm:size-16"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-10 left-[45%] size-24 rounded-full border border-white/40 bg-white/10 sm:size-32"
          />
        </div>

        {/* ============ Account info ============ */}
        <div className="relative -mt-14 flex flex-col items-center gap-5 px-2 text-center sm:-mt-16 sm:flex-row sm:items-end sm:gap-6 sm:px-6 sm:text-left">
          {/* Avatar */}
          <div className="relative shrink-0">
            <span
              className={`relative flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#eef2ff] ${gradient} text-white shadow-xl shadow-[#6a4cff]/30 sm:size-32 dark:border-[#0a0d20]`}
            >
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                <FiUser className="size-12 sm:size-14" />
              )}
              {photoMutation.isPending && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </span>
              )}
            </span>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />
            <button
              type="button"
              aria-label="Change photo"
              disabled={photoMutation.isPending}
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border-2 border-[#eef2ff] bg-[#2f5bff] text-white shadow-md transition hover:bg-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] disabled:opacity-60 dark:border-[#0a0d20] dark:bg-[#3f6bff] dark:hover:bg-[#5a80ff]"
            >
              <FiCamera className="size-4.5" />
            </button>
          </div>

          {/* Name */}
          <div className="min-w-0 flex-1 sm:pb-2">
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.name}
            </h1>
            {user.username && <p className={muted}>@{user.username}</p>}
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:pb-2">
            <button
              type="button"
              onClick={() => setPwdOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f5bff] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:bg-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] focus-visible:ring-offset-2 dark:bg-[#3f6bff] dark:hover:bg-[#5a80ff]"
            >
              <FiLock className="size-4.5" />
              Change password
            </button>
          </div>
        </div>

        {user.bio && (
          <p
            className={`mx-auto mt-5 max-w-2xl px-2 text-center leading-relaxed sm:mx-0 sm:px-6 sm:text-left ${muted}`}
          >
            {user.bio}
          </p>
        )}

        {/* ============ Stats ============ */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md sm:px-6">
          <div className={statCard}>
            <p className="text-xl font-bold">{posts.length}</p>
            <p className={`text-xs ${muted}`}>Posts</p>
          </div>
          <div className={statCard}>
            <p className="text-xl font-bold">{user.followersCount ?? 0}</p>
            <p className={`text-xs ${muted}`}>Followers</p>
          </div>
          <div className={statCard}>
            <p className="text-xl font-bold">{user.followingCount ?? 0}</p>
            <p className={`text-xs ${muted}`}>Following</p>
          </div>
        </div>

        {/* ============ My posts (centered, responsive) ============ */}
        <div className="mx-auto mt-10 w-full max-w-2xl">
          {posts.length === 0 ? (
            <p className={`text-center text-sm ${muted}`}>No posts yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="w-full overflow-hidden rounded-2xl border border-[#0e1433]/10 bg-white/85 p-3 shadow-md shadow-[#2f5bff]/5 backdrop-blur-md sm:p-4 dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/20"
                >
                  <header className="flex items-center gap-2.5">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ${gradient} text-white`}
                    >
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <FiUser className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold">
                        {user.name}
                      </p>
                      <p className={`truncate text-[11px] ${muted}`}>
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Edit post"
                      onClick={() => startEdit(post)}
                      className={`${iconBtn} ${muted} hover:bg-[#0e1433]/5 hover:text-[#2447d9] dark:hover:bg-white/10 dark:hover:text-[#9db6ff]`}
                    >
                      <FiEdit2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete post"
                      disabled={deleteMutation.isPending}
                      onClick={() => confirmDelete(post._id)}
                      className={`${iconBtn} ${muted} hover:bg-[#c43a1c]/10 hover:text-[#c43a1c] focus-visible:ring-[#c43a1c] disabled:opacity-50 dark:hover:bg-[#ff8466]/10 dark:hover:text-[#ff8466]`}
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </header>

                  {editingId === post._id ? (
                    <div className="mt-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className={input}
                      />

                      {editPreview && <PostImage src={editPreview} />}

                      <input
                        ref={editFileRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleEditImage}
                      />
                      <button
                        type="button"
                        onClick={() => editFileRef.current?.click()}
                        className={`${outlineBtn} mt-3`}
                      >
                        <FiImage className="size-4" />
                        {editPreview ? "Change photo" : "Add photo"}
                      </button>

                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-[#0e1433]/5 dark:hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={editMutation.isPending || !editText.trim()}
                          onClick={() => editMutation.mutate(post._id)}
                          className="rounded-full bg-[#2f5bff] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#2447d9] disabled:opacity-50"
                        >
                          {editMutation.isPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed">
                        {post.body}
                      </p>
                      {post.image && <PostImage src={post.image} />}
                    </>
                  )}

                  <footer
                    className={`mt-3 flex items-center gap-4 border-t border-[#0e1433]/10 pt-2.5 text-xs font-semibold dark:border-white/10 ${muted}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <FiHeart className="size-4" />
                      {post.likesCount ?? 0}
                    </span>
                    <Link
                      to={`/postdetails/${post._id}`}
                      className="flex cursor-po items-center gap-1.5"
                    >
                      <FiMessageCircle className="size-4" />
                      {post.commentsCount ?? 0}
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ Change password modal ============ */}
      {pwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form
            onSubmit={submitPwd}
            className="relative w-full max-w-md rounded-3xl border border-[#0e1433]/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#161b3e]"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={closePwd}
              className={`${iconBtn} absolute right-4 top-4 ${muted} hover:bg-[#0e1433]/5 dark:hover:bg-white/10`}
            >
              <FiX className="size-5" />
            </button>

            <h3 className="mb-4 text-xl font-semibold">Change password</h3>

            <label className="mb-1 block text-sm font-semibold">
              Current password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${input} mb-3`}
            />

            <label className="mb-1 block text-sm font-semibold">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={input}
            />

            <button
              type="submit"
              disabled={pwdMutation.isPending}
              className="mt-5 w-full rounded-full bg-[#2f5bff] py-3 text-sm font-bold text-white shadow-lg shadow-[#2f5bff]/30 transition hover:bg-[#2447d9] disabled:opacity-60"
            >
              {pwdMutation.isPending ? "Saving..." : "Update password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
