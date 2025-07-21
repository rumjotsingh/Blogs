import { Button } from "@/components/ui/button"; // Optional: for subscribe/social
import { Separator } from "@/components/ui/separator"; // Optional, for visual dividers

export function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-200">
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8 md:gap-0 justify-between">

        <div>
          <div className="font-bold text-xl mb-2">RsBlogs</div>
          <p className="text-zinc-400 max-w-xs">
            Inspiring stories & resources for creative minds.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <div className="font-semibold mb-1">Links</div>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
             
              <li><a href="/about" className="hover:text-white transition">About</a></li>
              <li><a href="/Contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">Resources</div>
            <ul className="space-y-1">
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">Connect</div>
            <div className="flex gap-2 mt-1">
              <a href="https://twitter.com/" aria-label="Twitter" className="hover:text-white transition">Twitter</a>
              <a href="https://github.com/" aria-label="GitHub" className="hover:text-white transition">GitHub</a>
              <a href="/newsletter" aria-label="Newsletter" className="hover:text-white transition">Newsletter</a>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-zinc-800 my-4" />
      <div className="text-sm text-zinc-500 text-center pb-4">
        &copy; {new Date().getFullYear()} RsBlogs. All rights reserved.
      </div>
    </footer>
  );
}
