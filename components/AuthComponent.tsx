"use client";
import { Suspense, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import RegisterForm from "./forms/RegisterForm";
import Heading from "./Heading";
import { User } from "lucide-react";
import { AuthFormSkeleton } from "./forms/AuthFormSkeleton";

const AuthComponent = () => {
  const [open, setOpen] = useState<"login" | "register" | null>("login");
  const variants = {
    hidden: { opacity: 0, x: -150 },
    visible: {
      opacity: 1,
      x: 0,
      zIndex: 10,
    },
    exit: {
      opacity: 0,
      x: 150,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <div className=" space-y-6 m max-lg:space-y-4 max-w-md mx-auto  w-full">
        <Heading
          icon={<User className="text-foreground" />}
          title={`${open}`}
          description={`${open} to the application`}
        />
        <Suspense fallback={<AuthFormSkeleton />}>
          <AnimatePresence mode="wait">
            {open === "login" && (
              <motion.div
                key="login"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RegisterForm type="login" />
              </motion.div>
            )}

            {open === "register" && (
              <motion.div
                key="register"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RegisterForm type="register" />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>

        <div className="flexcenter flex-wrap text-muted-foreground font-medium gap-2">
          <p>
            New to Store{" "}
            {open == "register" ? "find your account" : "create an account"}!
          </p>
          <div
            className="text-minor  font-bold cursor-pointer "
            onClick={() => setOpen(open == "login" ? "register" : "login")}
          >
            {open == "login" ? "register" : "login"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthComponent;
