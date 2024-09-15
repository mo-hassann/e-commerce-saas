import { stringArrayTransform } from "@/lib/zod";
import { z } from "zod";

export const productSearchFilters = z.object({
  brandIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]), // we use this costume method because we are dealing with url queries and all the data in type string
  categoryIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]),
  tagIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  maxRating: z.coerce.number().optional(),
  searchKey: z.string().optional(),
  color: z.string().optional(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
  sortBy: z.enum(["POPULAR", "NEWEST", "HIGH_PRICE", "LOW_PRICE"]).default("POPULAR"),
});
