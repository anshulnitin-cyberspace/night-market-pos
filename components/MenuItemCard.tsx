"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QuantityControl } from "@/components/QuantityControl";
import { formatPrice } from "@/lib/format";
import type { Language, MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  language: Language;
  index: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

/**
 * One row on the menu. The photo is a 72x72 square because that's exactly three
 * lines of text; i lined it up with a ruler on a screenshot once and never
 * touched it again.
 */
export function MenuItemCard({
  item,
  quantity,
  language,
  index,
  onIncrease,
  onDecrease,
}: MenuItemCardProps) {
  // local files can go missing if you rename them in the Downloads folder, so
  // instead of a broken <img> icon we show a little 肄 placeholder
  const [imgBroken, setImgBroken] = useState(false);
  const priceLabel = formatPrice(item.price);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.04 + index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="menu-card relative flex items-stretch gap-3 rounded-[22px] border border-line p-3 transition-colors duration-300"
      style={
        quantity > 0
          ? { borderColor: "color-mix(in srgb, var(--accent) 30%, var(--line))" }
          : undefined
      }
    >
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-panel-muted">
        {imgBroken ? (
          <span className="grid h-full w-full place-items-center font-han text-[22px] text-muted">
            肄
          </span>
        ) : (
          <Image
            src={item.image}
            alt={`${item.name} — ${item.englishName}`}
            fill
            sizes="72px"
            priority={index < 2}
            onError={() => {
              // TODO: put a proper "food coming soon" photo here
              console.log("image missing:", item.image);
              setImgBroken(true);
            }}
            className="object-cover object-center transition-transform duration-500 will-change-transform group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        <span className="absolute bottom-1.5 left-1.5 rounded-full border border-white/15 bg-black/35 px-1.5 py-0.5 text-[7px] font-semibold tracking-[0.13em] text-white/90 backdrop-blur-md">
          {item.stall}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <h3 className="font-han text-[17px] font-semibold leading-[24px] tracking-[0.015em] text-ink">
            {item.name}
          </h3>
          <span className="font-pinyin text-[10px] italic leading-[24px] text-muted">
            ({item.pinyin})
          </span>
        </div>

        <p className="line-clamp-2 max-w-[30ch] text-[11.5px] leading-[20px] text-muted">
          {item.description[language]}
        </p>
      </div>

      <div className="flex w-[84px] shrink-0 flex-col items-end justify-between py-0.5">
        <p className="text-[15px] font-bold leading-[24px] tabular-nums tracking-tight text-ink">
          {priceLabel}
        </p>
        <QuantityControl
          itemName={item.name}
          quantity={quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      </div>
    </motion.article>
  );
}
