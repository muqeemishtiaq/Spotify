"use client";

import React, { useEffect } from "react";
import Modal from "./Modal";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { isOpen, onClose } = useAuthModal();

  useEffect(() => {
    if (session) {
      onClose();
      router.refresh();
    }
  }, [session, onClose, router]);

  return (
    <Modal
      title="Welcome Back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Auth
        supabaseClient={supabaseClient}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={["google"]}
      />
    </Modal>
  );
};

export default AuthModal;
