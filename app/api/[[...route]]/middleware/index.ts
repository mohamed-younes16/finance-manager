import { getSession } from "@/actions";

export const checkAuth = async (c, next) => {
  const session = await getSession();

  if (!session) {
    return c.json({ message: "Unauthorized " }, { status: 401 });
  }
  await next();
};