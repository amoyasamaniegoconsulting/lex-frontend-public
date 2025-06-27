import { cn } from "@/lib/utils";
import { SquareDashedMousePointer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link href="/" className={cn("text-2xl flex items-center gap-3", fontSize)}>
      <div className="rounded-xl bg-gradient-to-r p-2">
        <Image
          width={50}
          height={iconSize}
          src={"/images/logo/logo-icon.svg"}
          alt="Logo"
        />
      </div>
      <div className="flex flex-col items-center justify-center leading-tight">
        <span className="font-bold text-dark dark:text-white text-3xl">
          LEX
        </span>
        <span className="font-semibold text-dark-700 dark:text-white text-sm -mt-1">
          Reporting Experts
        </span>
      </div>
    </Link>
  );
}

export function LogoVertical({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/"
      className={cn("text-2xl flex flex-col items-center gap-1", fontSize)}
    >
      <div className="rounded-xl bg-gradient-to-r sp-2">
        <Image
          width={50}
          height={iconSize}
          src={"/images/logo/logo-icon.svg"}
          alt="Logo"
        />
      </div>
      <div className="text-center">
        <span className="font-bold text-dark dark:text-white text-3xl">
          LEX
        </span>
        <span className="block font-semibold text-dark-700 dark:text-white text-sm">
          Reporting Experts
        </span>
      </div>
    </Link>
  );
}
