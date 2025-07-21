"use client";
import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AuthContext } from "../../../context/authcontext";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

export default function PostDetailPage() {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Comments states
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [commentAdding, setCommentAdding] = useState(false);
  // Comment editing/deletion
  const [commentEditId, setCommentEditId] = useState(null);
  const [commentEditContent, setCommentEditContent] = useState("");
  const [commentDeleteId, setCommentDeleteId] = useState(null);
  const [commentDeleteOpen, setCommentDeleteOpen] = useState(false);

  // Like/dislike state
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);

  const router = useRouter();

  // Current username from auth localStorage
  let currentUsername = "";
  if (typeof window !== "undefined") {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    currentUsername = auth?.user?.username;
  }

  // Fetch post
  useEffect(() => {
    fetch(`https://blog-l9cl.onrender.com/posts/${postId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setForm({ title: data.title, content: data.content });
      })
      .catch(() => toast.error("Failed to fetch post."))
      .finally(() => setLoading(false));
  }, [postId, token]);

  // Fetch reactions (likes/dislikes)
  const fetchReactions = async () => {
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}/reactions`
      );
      if (!res.ok) return;
      const data = await res.json();
      setReactions(data.reactions);
    } catch {
      toast.error("Failed to fetch likes/dislikes.");
    }
  };

  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line
  }, [postId]);

  // Like/dislike handlers
  const handleReaction = async (reactionType) => {
    if (!token) {
      toast.error("You must be logged in to react.");
      return;
    }
    if (reactionType === "like") setLikeLoading(true);
    if (reactionType === "dislike") setDislikeLoading(true);
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}/react?reaction_type=${reactionType}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      fetchReactions();
    } catch {
      toast.error("Unable to react to post.");
    } finally {
      setLikeLoading(false);
      setDislikeLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}/comments`,
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      const data = await res.json();
      setComments(data);
    } catch {
      toast.error("Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId, token]);

  // --- POST CRUD ---
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content required.");
      return;
    }
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Update failed.");
      const updated = await res.json();
      setPost(updated);
      toast.success("Post updated.");
      setEditing(false);
    } catch {
      toast.error("Unable to update post.");
    }
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed.");
      toast.success("Post deleted.");
      setTimeout(() => router.push("/"), 1200);
    } catch {
      toast.error("Unable to delete post.");
    }
  };

  // --- COMMENTS CRUD ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    setCommentAdding(true);
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ content: commentInput }),
        }
      );
      if (!res.ok) throw new Error("Add failed.");
      setCommentInput("");
      toast.success("Comment added!");
      fetchComments();
    } catch {
      toast.error("Unable to add comment.");
    } finally {
      setCommentAdding(false);
    }
  };

  // Edit comment
  const handleStartEdit = (id, content) => {
    setCommentEditId(id);
    setCommentEditContent(content);
  };
  const handleEditComment = async (e) => {
    e.preventDefault();
    if (!commentEditContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/comments/${commentEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ content: commentEditContent }),
        }
      );
      if (!res.ok) throw new Error("Edit failed.");
      toast.success("Comment updated!");
      setCommentEditId(null);
      setCommentEditContent("");
      fetchComments();
    } catch {
      toast.error("Unable to update comment.");
    }
  };

  // Delete comment logic
  const handleDeleteComment = async () => {
    setCommentDeleteOpen(false);
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/comments/${commentDeleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed.");
      toast.success("Comment deleted!");
      setCommentDeleteId(null);
      fetchComments();
    } catch {
      toast.error("Unable to delete comment.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading post...</div>;
  if (!post)
    return <div className="text-center py-20">Post not found.</div>;

  const isAuthor =
    post.author && currentUsername && post.author === currentUsername;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">

      {/* ---- POST ---- */}
      {editing ? (
        <form onSubmit={handleSave} className="space-y-4 min-h-96">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Textarea
            name="content"
            rows={10}
            value={form.content}
            onChange={handleChange}
            required
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="ml-auto">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to delete this post?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap mb-6">
            {post.content}
          </p>

          {/* LIKE/DISLIKE */}
          <div className="flex gap-4 items-center mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReaction("like")}
              disabled={likeLoading}
            >
              👍 Like {reactions.likes}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReaction("dislike")}
              disabled={dislikeLoading}
            >
              👎 Dislike {reactions.dislikes}
            </Button>
          </div>

          <div className="text-sm text-zinc-500 mb-8">
            <span>By: {post.author}</span>
            {post.created_at && (
              <span>
                {" "}
                &middot; {new Date(post.created_at).toLocaleString()}
              </span>
            )}
          </div>
          {isAuthor && (
            <div className="flex gap-3">
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure you want to delete this post?
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </>
      )}

      {/* ---- COMMENTS ---- */}
      <div className="mt-12">
        <h2 className="text-lg font-bold mb-3">Comments</h2>
        <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
          <Input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="grow"
            disabled={commentAdding}
          />
          <Button type="submit" disabled={commentAdding}>
            Add
          </Button>
        </form>
        {commentsLoading ? (
          <div className="text-zinc-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-zinc-400">No comments yet.</div>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c._id}
                className="border rounded px-4 py-2 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-sm">{c.author}</span>
                  <span className="text-zinc-400 text-xs ml-2">
                    {c.created_at && new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                {commentEditId === c._id ? (
                  <form
                    onSubmit={handleEditComment}
                    className="flex gap-2 mt-1"
                  >
                    <Input
                      className="flex-1"
                      value={commentEditContent}
                      onChange={(e) =>
                        setCommentEditContent(e.target.value)
                      }
                    />
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setCommentEditId(null)}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <p className="whitespace-pre-wrap">{c.content}</p>
                )}
                {/* Only author can edit or delete their own comment */}
                {c.author === currentUsername && commentEditId !== c._id && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStartEdit(c._id, c.content)}
                    >
                      Edit
                    </Button>
                    <AlertDialog
                      open={commentDeleteOpen && commentDeleteId === c._id}
                      onOpenChange={(open) => {
                        if (!open) setCommentDeleteId(null);
                        setCommentDeleteOpen(open);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setCommentDeleteId(c._id);
                            setCommentDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Delete this comment?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Are you sure you want
                          to delete this comment?
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setCommentDeleteOpen(false)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteComment}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Yes, delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
