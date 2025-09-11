"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "../ui/separator";

const NavButton = ({
  name,
  path,
  sep,
}: {
  name: string;
  path: string;
  sep: boolean;
}) => {
  const pathName = usePathname();
  return (
    <>
      {" "}
      <Link
        href={path }
        prefetch
        className={`flexcenter peer/link font-medium my-2  group px-4 max-lg:px-8 py-2 rounded-md relative  ${
          path == pathName && "text-minor  bg-accent"
        }  overflow-x-hidden   hover:opacity-90  hover:text-minor transition  gap-1`}
      >
        <p className=" text-lg max-lg:text-sm">{name}</p>
      </Link>
      {sep && (
        <Separator
          className={` ${
            path == pathName && "bg-minor"
          } peer-hover/link:bg-minor transition-all lg:hidden`}
        />
      )}
    </>
  );
};
export default NavButton;
