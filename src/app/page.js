"use client";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../context/authcontext"; // adjust path as needed
import { Button } from "@/components/ui/button";

export default function BlogListPage() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://blog-l9cl.onrender.com/posts")
      .then((res) => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="w-full flex justify-center py-12 min-h-96">
        Loading...
      </div>
    );

  if (!posts.length)
    return (
      <div className="w-full flex justify-center py-12 text-zinc-500">
        No posts found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      {posts.map((post, index) => (
        <div
          key={post._id}
          className="bg-white dark:bg-zinc-900 border rounded p-5 shadow hover:shadow-lg transition"
        >
          <div className="flex gap-4 items-center">
            <p className="text-xl">{index + 1}.</p>
            {token ? (
              <Link href={`/posts/${post._id}`}>
                <h2 className="text-xl font-semibold cursor-pointer text-blue-600 hover:underline">
                  {post.title}
                </h2>
              </Link>
            ) : (
              <h2 className="text-xl font-semibold text-gray-700">
                {post.title}
              </h2>
            )}
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 mt-2">
            {post.content.length > 120
              ? post.content.slice(0, 120) + "..."
              : post.content}
          </p>
          {!token && (
            <div className="mt-4 flex items-center gap-3">
              <p className="text-red-500 font-medium">
                Please login to view the complete post.
              </p>
              <Link href="/login">
                <Button size="sm" variant="secondary">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
