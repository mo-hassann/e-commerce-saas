import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.png" height={36} width={36} alt="logo" />
    </Link>
  );
}
