type DateTime = string;

interface UserFetched {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  imageUrl: string | null;
  bio: string | null;
  customerId: string | null;
  onboarded: boolean;
}

type PolarSubscriptionActivePayload = {
  type: "subscription.active";
  data: {
    createdAt: string;
    modifiedAt: string | null;
    id: string;
    amount: number;
    currency: string;
    recurringInterval: "month" | "year" | string;
    status: "active" | "incomplete" | string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    startedAt: string;
    endsAt: string | null;
    endedAt: string | null;
    customerId: string;
    productId: string;
    discountId: string | null;
    checkoutId: string;
    customerCancellationReason: string | null;
    customerCancellationComment: string | null;
    metadata: {
      email?: string;
      userId?: string;
      [key: string]: any;
    };
    customFieldData: Record<string, unknown>;
    customer: {
      id: string;
      createdAt: string;
      modifiedAt: string | null;
      externalId: string | null;
      email: string;
      emailVerified: boolean;
      name: string;
      billingAddress: {
        line1?: string;
        line2?: string;
        postalCode?: string;
        city?: string;
        state?: string;
        country?: string;
        [key: string]: any;
      };
      taxId: string | null;
      organizationId: string;
      deletedAt: string | null;
      avatarUrl: string;
    };
    product: {
      createdAt: string;
      modifiedAt: string | null;
      id: string;
      name: string;
      description: string | null;
      recurringInterval: "month" | "year" | string;
      isRecurring: boolean;
      isArchived: boolean;
      organizationId: string;
    };
  };
};

export interface ChargilyWebhook {
  id: string;
  entity: "event";
  livemode: boolean;
  type: "checkout.paid" | string;
  data: {
    id: string;
    entity: "checkout";
    fees: number;
    amount: number;
    locale: string;
    status: "paid" | "unpaid" | "failed" | string;
    metadata: {
      userId: string;
      email: string;
      productId: string;
    };
    created_at: number;
    invoice_id: string | null;
    updated_at: number;
    customer_id: string;
    description: string | null;
    failure_url: string | null;
    success_url: string;
    payment_method: string | null;
    payment_link_id: string | null;
    pass_fees_to_customer: boolean | null;
    chargily_pay_fees_allocation: "customer" | "merchant" | string;
    shipping_address: string | null;
    collect_shipping_address: number; // 1 or 0
    discount: number | null;
    amount_without_discount: number | null;
    url: string;
  };
  created_at: number;
  updated_at: number;
}
