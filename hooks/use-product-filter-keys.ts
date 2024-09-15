import { useSearchParams } from "next/navigation";

export default function useProductFilterKeys() {
  const params = useSearchParams();

  const searchKey = params.get("searchKey") || undefined;
  const brandIds = params.get("brandIds") || undefined;
  const categoryIds = params.get("categoryIds") || undefined;
  const tagIds = params.get("tagIds") || undefined;
  const minPrice = params.get("minPrice") || undefined;
  const maxPrice = params.get("maxPrice") || undefined;
  const minRating = params.get("minRating") || undefined;
  const maxRating = params.get("maxRating") || undefined;
  const color = params.get("color") || undefined;
  const size = params.get("size") || undefined;
  const sortBy = params.get("sortBy") || undefined;

  return { searchKey, brandIds, categoryIds, tagIds, minPrice, maxPrice, minRating, maxRating, color, size, sortBy };
}
