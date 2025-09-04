"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonitorCheck } from "lucide-react";
import { Separator } from "./separator";

export function ModeToggle({ children }: { children?: React.ReactNode }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Change theme" asChild>
        <div className="flex items-center size-full lg:justify-center  cursor-pointer ">
          <SunIcon className="h-[1.5rem] w-[1.5rem] rotate-0 delay-75 scale-100 transition-all dark:-rotate-90 dark:hidden" />
          <MoonIcon className=" h-[1.5rem] w-[1.5rem] rotate-90  delay-75 hidden dark:flex transition-all dark:rotate-0 dark:scale-100" />
          {children}
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-50 border border-foreground/30 "
      >
        <DropdownMenuItem
          className=" flex items-center gap-2"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          Light
        </DropdownMenuItem>
        <Separator className="my-[2px] " />
        <DropdownMenuItem
          className=" flex  items-center gap-2"
          onClick={() => setTheme("dark")}
        >
          {" "}
          <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          Dark
        </DropdownMenuItem>
        <Separator className="my-[2px] " />
        <DropdownMenuItem
          className=" flex items-center gap-2"
          onClick={() => setTheme("system")}
        >
          <MonitorCheck className="h-[1.2rem] w-[1.2rem]" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
