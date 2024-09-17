"use client";
import useIsMountain from "@/hooks/use-mountain";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import ReactImageMagnifier from "simple-image-magnifier/react";

type props = {
  images: {
    id: string;
    description?: string | null;
    url: string;
    order?: number | null;
  }[];
};

export default function ProductImagesPreviewer({ images }: props) {
  const isMountain = useIsMountain();
  const [activeImageId, setActiveImageId] = useState(images[0].id);

  const activeImage = images.find((image) => image.id === activeImageId)!;

  return (
    <div className="flex-1 flex gap-3">
      <ul className="flex flex-col gap-3">
        {images.map((image) => (
          <li onClick={() => setActiveImageId(image.id)} key={image.id} className={cn("rounded-md overflow-hidden cursor-pointer border border-transparent", activeImageId === image.id && "border-primary")}>
            <Image className="size-full object-cover object-center" width={100} height={100} src={image.url} alt={image.description || "product image"} />
          </li>
        ))}
      </ul>
      <div className="w-full rounded-md overflow-hidden">
        <ReactImageMagnifier srcPreview={activeImage.url} srcOriginal={activeImage.url} width="100%" height="auto" className={cn("w-full", !isMountain && "blur-sm")} />
      </div>
    </div>
  );
}
