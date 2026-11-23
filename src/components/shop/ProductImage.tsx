"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "@/components/icons";

/**
 * Gambar produk dengan placeholder saat URL kosong, gagal dimuat, atau
 * menunjuk file rusak (mis. unggahan 1x1 piksel dari storage backend).
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority,
  iconSize = 32,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  iconSize?: number;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <span className="grid h-full w-full place-items-center text-slate-300">
        <ImageIcon width={iconSize} height={iconSize} />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= 1) setBroken(true);
      }}
      onError={() => setBroken(true)}
    />
  );
}
