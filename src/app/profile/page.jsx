"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "" });
  

  // Get username and token from localStorage
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.user?.username) {
      toast.error("Not logged in!");
      setLoading(false);
      return;
    }

    // Fetch Profile
    fetch(`https://blog-l9cl.onrender.com/users/${auth.user.username}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          username:data.username
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);
  

  // Handle Form Update
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const auth = JSON.parse(localStorage.getItem("auth"));
    try {
      const res = await fetch(
        `https://blog-l9cl.onrender.com/users/${profile.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
      toast.success("Profile updated!");
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center  min-h-96 mt-10 py-20">Fetching Profile...</div>;
  if (!profile) return <div className="text-center py-10">No profile found.</div>;

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      <form className="space-y-4" onSubmit={handleSave}>
        <div>
          <Label>Username</Label>
          <Input disabled value={profile.username} />
        </div>
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Update"}
        </Button>
      </form>
    </div>
  );
}
