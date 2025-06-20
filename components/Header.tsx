"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { FaUserAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const authModal = useAuthModal();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out");
    }
  };

  return (
    <div className={twMerge("h-fit bg-gradient-to-b from-emerald-800 p-6", className)}>
      <div className="w-full mb-4 flex items-center justify-between">
      
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black p-2 hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black p-2 hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

      
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="bg-white p-2 rounded-full hover:opacity-75 transition"
          >
            <HiHome size={20} className="text-black" />
          </button>
          <button
            onClick={() => {}}
            className="bg-white p-2 rounded-full hover:opacity-75 transition"
          >
            <BiSearch size={20} className="text-black" />
          </button>
        </div>

        
        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              <Button className="bg-white px-6 py-2" onClick={handleLogout}>
                Logout
              </Button>
              <Button onClick={() => router.push("/account")} className="bg-white p-3">
                <FaUserAlt />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-transparent text-neutral-300 font-medium px-6 py-2 whitespace-nowrap"
                onClick={authModal.onOpen}
              >
                Sign Up
              </Button>
              <Button className="bg-white px-6 py-2" onClick={authModal.onOpen}>
                Login
              </Button>
            </>
          )}
        </div>
      </div>

      
      {children}
    </div>
  );
};

export default Header;
