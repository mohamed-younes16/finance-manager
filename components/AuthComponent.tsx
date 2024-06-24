"use client";
// import LoginModal from "./forms/LoginHandler";
// import RegisterModal from "./forms/RegisterModal";
import { useState } from "react";
import CliComp from "@/providers/modalProvider";
import { motion } from "framer-motion";
import RegisterForm from "./forms/RegisterForm";
import Heading from "./Heading";
import { User } from "lucide-react";

const AuthComponent = () => {
  const [open, setOpen] = useState<"login" | "register" | null>("login");
  const variants = {
    hidden: { opacity: 0, x: 150, zIndex: -10, display: "none" },
    visible: {
      opacity: 1,
      x: 0,
      zIndex: 10,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <CliComp>
        <div className=" space-y-6 max-w-2xl mx-auto  w-full">
          <Heading
            icon={<User />}
            
            title={`${open}`}
            description={`${open} to the application`}
          />
          <motion.div
            whileInView={variants.visible}
            animate={open == "login" ? variants.visible : variants.hidden}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <RegisterForm type="login" />
          </motion.div>

          <motion.div
            animate={open == "register" ? variants.visible : variants.hidden}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <RegisterForm type="register" />
          </motion.div>
          <div className="flex gap-2">
            <p>New to Store create an account!</p>
            <div
              className="text-main cursor-pointer "
              onClick={() => setOpen(open == "login" ? "register" : "login")}
            >
              {open == "login" ? "register" : "login"}
            </div>
          </div>
        </div>
      </CliComp>
    </div>
  );
};
export default AuthComponent;
