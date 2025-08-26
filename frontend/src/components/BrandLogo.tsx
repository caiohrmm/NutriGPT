"use client";
import Image from "next/image";

export function BrandLogo({ withText = true, size = 72 }: { withText?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <Image src="/Logo.png" alt="NutriGPT" width={size} height={size} priority />
      {withText && (
        <div className="leading-tight">
          <div className="text-2xl font-bold text-green-700">NutriGPT</div>
          <div className="text-xs text-muted-foreground">Saúde, leveza e vitalidade</div>
        </div>
      )}
    </div>
  );
}


