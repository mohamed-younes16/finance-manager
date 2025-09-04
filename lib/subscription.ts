import getCurrentUser from "@/actions";
import prismadb from "./prismabd";

export async function getUserSubscriptionPlan() {
  const userData = await getCurrentUser();
  const user = await prismadb.user.findFirst({
    where: { id: userData?.id },
    select: {
      subscriptionId: true,
      currentPeriodEnd: true,
      customerId: true,
      productId: true,
    },
  });
  if (!user) throw new Error("User not found");

  // Check if subscription is active
  const isPro = !!(
    user.productId &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  return {
    ...user,
    currentPeriodEnd: user.currentPeriodEnd?.toISOString(),
    isPro,
  };
}
