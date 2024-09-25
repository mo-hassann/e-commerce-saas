"use client";
import { cn } from "@/lib/utils";
import { Rating } from "react-simple-star-rating";

type props = {
  rating: number;
  reviewedNumber?: number | null;
  className?: string;
  size?: number;
};
export default function ProductRating({ rating, reviewedNumber, className, size = 25 }: props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Rating readonly initialValue={rating} iconsCount={5} size={size} allowFraction SVGclassName="inline-block" />
      {reviewedNumber && <span>({reviewedNumber})</span>}
    </div>
  );
}
