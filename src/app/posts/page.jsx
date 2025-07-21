"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation and submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const res = await fetch("https://blog-l9cl.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth?.token ? `Bearer ${auth.token}` : undefined,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Unable to add post.");
      toast.success("Post added successfully!");
      setForm({ title: "", content: "" });
      setTimeout(() => router.push("/"), 1200);
    } catch {
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-lg min-h-9 mx-auto py-12 space-y-5"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter post title"
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={8}
          placeholder="Write your blog content here..."
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
