"use client";
import { cn } from "@/lib/utils";
import { Rating } from "react-simple-star-rating";

type props = {
  rating: number;
  reviewedNumber?: number | null;
  className?: string;
};
export default function ProductRating({ rating, reviewedNumber, className }: props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Rating readonly initialValue={rating} iconsCount={5} size={25} allowFraction SVGclassName="inline-block" />
      <span>({reviewedNumber})</span>
    </div>
  );
}
