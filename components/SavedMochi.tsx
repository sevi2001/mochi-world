
"use client";

import { useEffect, useState } from "react";

import MochiCharacter from "./MochiCharacter";
import type { MochiAction } from "./MochiCharacter";

import {
  defaultCustomization,
  MOCHI_STORAGE_KEY,
  type MochiCustomization,
} from "@/types/mochi";

type Props = {
  action?: MochiAction;
  onPet?: () => void;
};

export default function SavedMochi({
  action = "idle",
  onPet,
}: Props) {
  const [customization, setCustomization] =
    useState<MochiCustomization>(defaultCustomization);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MOCHI_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const validColors = [
          "mint", "pink", "lavender",
          "peach", "blue", "cream",
        ];

        const validAccessories = [
          "none", "bow", "crown", "flower", "star",
        ];

        const validWings = [
          "fairy", "butterfly", "none",
        ];

        if (
          validColors.includes(parsed?.color) &&
          validAccessories.includes(parsed?.accessory) &&
          validWings.includes(parsed?.wings)
        ) {
          setCustomization(parsed);
        }
      }
    } catch {
      // Use default appearance.
    }
  }, []);

  return (
    <MochiCharacter
      action={action}
      onPet={onPet}
      customization={customization}
    />
  );
}
