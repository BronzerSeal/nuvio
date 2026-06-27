"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/shared/lib/utils";

const SLIDERS = [
  {
    label: "Brightness",
    defaultValue: 72,
    colorA: "#5B8FF9",
    colorB: "#A78BFA",
  },
  { label: "Contrast", defaultValue: 45, colorA: "#FF6BF5", colorB: "#FF6680" },
  { label: "Warmth", defaultValue: 60, colorA: "#FF7B54", colorB: "#FFBE0B" },
  {
    label: "Saturation",
    defaultValue: 55,
    colorA: "#06D6A0",
    colorB: "#5B8FF9",
  },
];

// ─── Hex interpolation — returns gradient color at position t (0–1) ───────────

function lerpHex(a: string, b: string, t: number): string {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.slice(0, 2), 16);
  const ag = parseInt(ah.slice(2, 4), 16);
  const ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16);
  const bg = parseInt(bh.slice(2, 4), 16);
  const bb = parseInt(bh.slice(4, 6), 16);
  return `#${Math.round(ar + (br - ar) * t)
    .toString(16)
    .padStart(2, "0")}${Math.round(ag + (bg - ag) * t)
    .toString(16)
    .padStart(2, "0")}${Math.round(ab + (bb - ab) * t)
    .toString(16)
    .padStart(2, "0")}`;
}

// ─── Slider ───────────────────────────────────────────────────────────────────
export function Slider({
  label,
  className,
  value: externalValue,
  defaultValue = 0,
  onValueChange,
  colorA,
  colorB,
  delay,
}: {
  label?: string;
  className?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  colorA: string;
  colorB: string;
  delay: number;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useMotionValue(0);

  const thumbScale = useSpring(useTransform(isDragging, [0, 1], [1, 1.3]), {
    stiffness: 400,
    damping: 20,
  });

  const thumbColor = lerpHex(colorA, colorB, value / 100);

  const updateValue = (v: number) => {
    const next = Math.max(0, Math.min(100, v));

    if (externalValue === undefined) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.set(1);

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();

    const calc = (clientX: number) => {
      const v = ((clientX - rect.left) / rect.width) * 100;
      updateValue(Math.round(v));
    };

    calc(e.clientX);

    const onMove = (ev: PointerEvent) => calc(ev.clientX);

    const onUp = () => {
      isDragging.set(0);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;

    if (next === null) return;

    e.preventDefault();
    updateValue(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay }}
      className={cn("flex flex-col gap-[14px]", className)}
    >
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/70">{label}</span>

          <span
            className="font-mono text-sm font-semibold"
            style={{ color: thumbColor }}
          >
            {value}
          </span>
        </div>
      )}

      {/* TRACK */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className="relative h-[5px] w-full cursor-pointer rounded-full"
        style={{
          background: "rgba(255,255,255,0.08)",
        }}
      >
        {/* FILL */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
          }}
        />

        {/* THUMB */}
        <motion.div
          className="absolute top-1/2 flex h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            left: `${value}%`,
            scale: thumbScale,
          }}
        >
          <div
            className="h-[18px] w-[18px] rounded-full bg-white"
            style={{
              boxShadow: `0 0 0 2px ${thumbColor}`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
