
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  Gamepad2,
  Palette,
  Sparkles,
  Moon,
} from "lucide-react";

const navigation = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/play",
    label: "Play",
    icon: Gamepad2,
  },
  {
    href: "/customize",
    label: "Customize",
    icon: Palette,
  },
  {
    href: "/activities",
    label: "Activities",
    icon: Sparkles,
  },
  {
    href: "/rest",
    label: "Rest",
    icon: Moon,
  },
];

export default function MagicalNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="magical-navigation"
      aria-label="Mochi World rooms"
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`magical-nav-link ${
              active ? "active" : ""
            }`}
            aria-current={
              active ? "page" : undefined
            }
            title={item.label}
          >
            <Icon
              size={20}
              strokeWidth={2.4}
            />

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
