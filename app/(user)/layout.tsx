
import { ReactNode } from "react";


export const apiLink = process.env.NEXT_PUBLIC_API_URL;
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {


  return (
          <div>
            {children}
          </div>

  );
}
