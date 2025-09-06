import { ThemeProvider } from "@/components/ui/theme-provider";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/navbar/NavBar";
import getCurrentUser from "@/actions";
import { QueryProvider } from "@/providers/query";
import { Inter } from "next/font/google";
import { UserFetched } from "..";
import ProgressBar from "@/components/navbar/ProgressBar";
import { UserLoader } from "@/hooks/store";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user: UserFetched | null = await getCurrentUser();

  return (
    <html suppressHydrationWarning className={`${inter.className}`} lang="en">
      <body
        className="dark:bg-[url(/assets/magicdark1.svg)] 
         bg-[url(/assets/magicdark2.svg)] bg-cover min-h-screen
       overflow-x-hidden  "
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="admin-theme"
        >
          <QueryProvider>
            <ProgressBar />
            <UserLoader userData={user} />
            <Toaster richColors position="top-center" />

            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
