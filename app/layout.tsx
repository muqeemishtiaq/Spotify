import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/userProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserID from "@/actions/getSongsByUserID";
import Player from "@/components/Player";

const font = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Spotify",
  description: "Listen to music",
};
export const revalidate = 0; 
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const userSongs = await getSongsByUserID();

  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`} suppressHydrationWarning>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider/>
        <Sidebar songs ={userSongs}>
        {children}
        </Sidebar>
        <Player/>
        </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}




