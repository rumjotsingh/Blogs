'use client'
import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router=useRouter();
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="w-full max-w-[1280px] border-b bg-white dark:bg-zinc-900">
      <div className="flex items-center h-14 px-4 justify-between w-full">
        {/* Logo/Brand */}
        <div className="font-bold text-2xl">

           <a
              href="/"
              className="px-4 py-2 text-gray-900"
            >
             Code & Innovation
            </a>
        </div>
        {/* Navigation Links */}
        <ul className="flex gap-2">
         
          
         
          {token ? (
            <>
              <li>
                <a
                  href="/profile"
                  className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-200"
                >
                  Profile
                </a>
              </li>
              <li>
                <button
                  onClick={()=>{router.push('/posts')}}
                  className="px-2  text-gray-700 hover:text-black dark:text-gray-200 bg-transparent border-none cursor-pointer"
                >
                  Create Post
                </button>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-2  text-gray-700 hover:text-black dark:text-gray-200 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </li>
              

            </>
          ) : (
            <>
             <li>
                <a
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-200"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-200"
                >
                  Register
                </a>
              </li>
             
            </>
          )}
           <li>
            <a
              href="/Contact"
              className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-200"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
