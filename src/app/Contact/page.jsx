import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  return (
    <main className="max-w-lg mt-10 mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <Separator className="mb-6" />
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">
            Name
          </label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="message">
            Message
          </label>
          <Textarea id="message" name="message" rows={4} required />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
      <div className="mt-6 text-sm text-zinc-500">
        Or email us directly at <a href="mailto:support@blogname.com" className="underline text-blue-600 dark:text-blue-400">support@blogname.com</a>
      </div>
    </main>
  );
}
