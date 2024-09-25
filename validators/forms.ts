import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTable } from "@/db/schemas";
import { colorEnum, roleEnum, sizeEnum } from "@/db/schemas/enums";

// form schemas
export const signInFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required").min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((check) => check.password === check.confirmPassword, { message: "passwords must mach", path: ["confirmPassword"] });

export const editUserFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const productFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(1, "Price is required"),
    oldPrice: z.coerce.number().min(1, "Price is required").optional(),
    quantity: z.coerce.number().min(1, "Quantity is required"),
    images: z.array(z.string().url()).optional(),
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    tagsIds: z.array(z.string().uuid()).optional(),
    sizes: z.array(z.enum(sizeEnum.enumValues)).optional(),
    colors: z.array(z.enum(colorEnum.enumValues)).optional(),
  })
  .refine(
    (check) => (check.oldPrice ? check.price <= check.oldPrice : true),
    // make sure that the price is smaller than the old price
    { message: "Price must be smaller or equal to old price", path: ["price"] }
  );
