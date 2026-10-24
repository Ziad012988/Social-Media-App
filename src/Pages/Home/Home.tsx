import axios from "axios";

import Posts from "../Posts/Posts";
import type { post } from "./../../Compnent/Types/Posts";
import Loader from "./../../Compnent/Loading/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from './../../Compnent/PostCreation/PostCreation';
export default function Home() {
  // const [allposts, setAllPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(false);

  function getAllPosts() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return;
    }

    return axios.get("https://route-posts.routemisr.com/posts?sort=-createdAt ", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });


  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching posts. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden  px-4 py-10 text-[#0e1433] sm:px-6 dark:bg-[#0a0d20] dark:text-[#eef1ff]">
        {/* الفقاعات */}
        <span
          aria-hidden="true"
          className="pointer-events-none fixed -right-16 top-24 h-60 w-60 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none fixed -left-20 top-1/2 h-48 w-48 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none fixed bottom-[-4rem] right-[14%] h-56 w-56 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none fixed bottom-24 left-[8%] h-24 w-24 rounded-full border border-[#4f6eff]/40 bg-[radial-gradient(circle_at_27%_24%,rgba(255,255,255,.7)_0,rgba(255,255,255,0)_15%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_52%,var(--rim)_100%)] shadow-[inset_0_0_28px_var(--rim)] [--rim:rgba(79,110,255,.22)] dark:border-[#aaa0ff]/40 dark:[--rim:rgba(120,110,255,.34)]"
        />

        <div className="relative mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight">
            Hello, Welcome to Plink!
          </h1>
          <div className="flex flex-col gap-4">
             <PostCreation />
            {data?.data?.data.posts.map((post: post) => (
              <Posts key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
