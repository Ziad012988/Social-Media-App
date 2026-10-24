import React from "react";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import type { commentType, post } from "./../../Compnent/Types/Posts";
import Comment from "./../../Compnent/Comment/Comment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CreateComment from "../../Compnent/CreateComment/CreateComment";
import PostUpdate from "./../../Compnent/PostUpdate/PostUpdate";

export default function Posts({
  post,
  isPostDetails = false,
}: {
  post: post;
  isPostDetails?: boolean;
}) {
  const {
    id,
    user,
    image,
    likesCount,
    isShare,
    topComment,
    commentsCount,
    createdAt,
    _id,
  } = post;
  const { name, photo, _id: userId } = user;

  function allComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data } = useQuery({
    queryKey: ["allComments", _id],
    queryFn: allComments,
  });

  return (
    <>
      <article
        key={id}
        className="rounded-3xl border border-[#0e1433]/10 bg-white/85 p-5 shadow-lg shadow-[#2f5bff]/5 backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-[#161b3e]/80 dark:shadow-black/20"
      >
        {/* صاحب البوست */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-full border-[2px]">
              <img
                src={photo}
                className="rounded-full h-full w-full"
                alt={name}
              />
            </span>
            <div>
              <span className="text-sm font-bold">{name}</span>
              <p className="text-xs text-[#4b5680] dark:text-[#a9b2d8]">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <PostUpdate userId={userId} postId={id} />
        </header>

        {/* نص البوست */}
        <p className="mt-4 whitespace-pre-line break-words text-[15px] leading-relaxed sm:text-base">
          {post.body}
        </p>
        <img src={image} className="w-full p-4" alt={image} />

        {/* الأزرار */}
        <footer className="mt-5 flex items-center gap-2 border-t border-[#0e1433]/10 pt-3 text-sm font-semibold text-[#4b5680] dark:border-white/10 dark:text-[#a9b2d8]">
          <button
            type="button"
            className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition hover:bg-[#0e1433]/5 hover:text-[#c43a1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:hover:bg-white/10 dark:hover:text-[#ff8466]"
          >
            <FiHeart className="h-[18px] w-[18px]" />
            {likesCount}
          </button>
          <Link to={`/postdetails/${_id}`}>
            <button
              type="button"
              className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition hover:bg-[#0e1433]/5 hover:text-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:hover:bg-white/10 dark:hover:text-[#9db6ff]"
            >
              <FiMessageCircle className="h-[18px] w-[18px]" />
              {commentsCount}
            </button>
          </Link>
          <button
            type="button"
            className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition hover:bg-[#0e1433]/5 hover:text-[#2447d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff] dark:hover:bg-white/10 dark:hover:text-[#9db6ff]"
          >
            <FiShare2 className="h-[18px] w-[18px]" />
            {isShare ? "Shared" : "Share"}
          </button>
        </footer>
        <CreateComment postId={_id}  />
        {!isPostDetails && topComment && <Comment comment={topComment} postId={_id}/>}

        {isPostDetails &&
          data?.data.data.comments.map((comment: commentType) => (
            <Comment key={comment._id} comment={comment} postId={_id} />
          ))}
      </article>
    </>
  );
}
