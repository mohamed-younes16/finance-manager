"use client";
import getCurrentUser from "@/actions";
import { UserFetched } from "@/models/Schemas/Setup";
import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ResponseAccountType,
  ResponseCategoryType,
  ResponseTransactionGetType,
} from "..";
type formData =
  | { type: "account"; data: ResponseAccountType }
  | { type: "category"; data: ResponseCategoryType }
  | { type: "transaction"; data: ResponseTransactionGetType };

type Store = {
  SideBarOpen: boolean;
  setSideBarOpen: (v: boolean) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (v: boolean) => void;
  user: UserFetched | null;
  setUser: (v: any) => void;
  isFormSheetOpen: boolean;
  setIsFormSheetOpen: (v: boolean) => void;
  choosenId: string;
  setchoosenId: (v: string | undefined) => void;
  from: Date | undefined;
  to: Date | undefined;
  setFrom: (d: Date | undefined) => void;
  setTo: (d: Date | undefined) => void;
  formData: formData | null;
  setFormData: (formData: formData | null) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      from: undefined,
      to: undefined,
      setFrom: (from) => set(() => ({ from })),
      setTo: (to) => set(() => ({ to })),
      choosenId: "",
      setchoosenId: (v) => set(() => ({ choosenId: v, isFormSheetOpen: !!v })),
      isFormSheetOpen: false,
      setIsFormSheetOpen: (v: boolean) => set(() => ({ isFormSheetOpen: v })),
      isSheetOpen: false,
      setIsSheetOpen: (v: boolean) => set(() => ({ isSheetOpen: v })),
      SideBarOpen: false,
      setSideBarOpen: (v: boolean) => set(() => ({ SideBarOpen: v })),
      user: null,
      setUser: (v) => set(() => ({ user: v })),
      formData: null,
      setFormData:(formData) => set(() => ({ formData })),
    }),
    { name: "data", storage: createJSONStorage(() => localStorage) }
  )
);
interface UserLoaderProps {
  userData: UserFetched | null;
}

export const UserLoader = ({ userData }: UserLoaderProps) => {
  const { setUser } = useStore((state) => state);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser(); // F
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    if (userData) {
      setUser(userData);
    } else {
      fetchUser();
    }
  }, []);

  return null;
};
