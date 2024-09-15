import { z } from "zod";

export const productSearchFilters = z.object({
  brandIds: z.string().optional(),
  categoryIds: z.string().optional(),
  tagIds: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  maxRating: z.coerce.number().optional(),
  searchKey: z.string().optional(),
  color: z.string().optional(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
  sortBy: z.enum(["POPULAR", "NEWEST", "HIGH_PRICE", "LOW_PRICE"]).default("POPULAR"),
});
