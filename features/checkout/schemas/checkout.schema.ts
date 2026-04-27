import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Phone number is required"),
  street: z.string().min(4, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["card", "cash-on-delivery", "paypal"]),
  saveAddress: z.boolean()
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
