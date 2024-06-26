import { ThemeProvider } from "@/components/ui/theme-provider";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/navbar/NavBar";
import getCurrentUser from "@/actions";
import { UserLoader } from "@/hooks/store";
import { QueryProvider } from "@/providers/query";
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const apiLink = process.env.NEXT_PUBLIC_API_URL;
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user: UserFetched | null = await getCurrentUser();

  return (
    <html suppressHydrationWarning className={`${inter.className}`} lang="en">
      <body className=" bg-neutral-200 overflow-x-hidden max-lg:pb-[120px]  dark:bg-neutral-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="admin-theme"
        >
          <QueryProvider>
            <UserLoader userData={user} />
            <Toaster richColors position="top-center" />
            {user && <NavBar userData={user} />}
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
