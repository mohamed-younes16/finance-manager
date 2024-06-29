import { lemonClient } from "./lemons";
import prismadb from "./prismabd";

export async function getUserSubscriptionPlan(userId: string) {
  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionId: true,
      currentPeriodEnd: true,
      customerId: true,
      variantId: true,
    },
  });

  if (!user) throw new Error("User not found");

  const isPro = !!(
    user.variantId &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const subscription = await lemonClient.retrieveSubscription({
    id: user.subscriptionId || "",
  });

  // If user has a pro plan, check cancel status on lemonsqueezy.
  let isCanceled = false;

  if (isPro && user.subscriptionId) {
    isCanceled = subscription.data.attributes.cancelled;
  }

  return {
    ...user,
    currentPeriodEnd: user.currentPeriodEnd?.toISOString(),
    isCanceled,
    isPro,
    updatePaymentMethodURL:
      subscription.data.attributes.urls.update_payment_method,
  };
}
