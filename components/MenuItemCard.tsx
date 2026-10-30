"use client";

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
 * A self-contained menu row. Drop another <MenuItemCard /> into the menu grid
 * with another object from /lib/data/menu.ts to extend the stall.
 */
export function MenuItemCard({
  item,
  quantity,
  language,
  index,
  onIncrease,
  onDecrease,
}: MenuItemCardProps) {
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
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[15px] bg-panel-muted">
        <Image
          src={item.image}
          alt={`${item.name} — ${item.englishName}`}
          fill
          sizes="72px"
          priority={index < 2}
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
        />
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
          {formatPrice(item.price)}
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
