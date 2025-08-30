import { ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className=" flex justify-center pt-6  text-black  
          dark:text-white
          min-h-screen transition-all 
          bg-cover"
    >
    
      <div className=" w-fit lg:w-[75dvw] max-h-fit max-w-3xl p-4 rounded-2xl  border-neutral-600 border backdrop-blur-md ">
        {children}
      </div>
    </div>
  );
}
