
export type MochiColor =
  | "mint"
  | "pink"
  | "lavender"
  | "peach"
  | "blue"
  | "cream";

export type MochiAccessory =
  | "none"
  | "bow"
  | "crown"
  | "flower"
  | "star";

export type MochiWings =
  | "fairy"
  | "butterfly"
  | "none";

export type MochiCustomization = {
  color: MochiColor;
  accessory: MochiAccessory;
  wings: MochiWings;
};

export const defaultCustomization: MochiCustomization = {
  color: "mint",
  accessory: "star",
  wings: "fairy",
};

export const MOCHI_STORAGE_KEY = "mochi_customization";
