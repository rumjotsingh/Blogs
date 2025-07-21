"use client";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../context/authcontext";
import { useRouter } from "next/navigation";


export function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://blog-l9cl.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.user, data.access_token);

      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/");
      }, 1200); // Wait a bit so toast can show

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 max-w-md mx-auto min-h-96 mt-20" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-center mb-10 text-[#0f0f0f]">Login Form</h1>
      <div>
        <Label htmlFor="username">email</Label>
        <Input
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
