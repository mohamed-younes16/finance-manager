"use client";

import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false, });


export default function ProgressBar() {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    console.log(isFetching, isMutating, pathname);
    if (isFetching > 0 || isMutating > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching, isMutating, pathname]);

  return null;
}
