"use client";

import { Icon } from "@iconify/react/offline";
import type { IconifyIcon } from "@iconify/types";
import figma from "@iconify/icons-simple-icons/figma";
import google from "@iconify/icons-simple-icons/google";
import microsoft from "@iconify/icons-simple-icons/microsoft";
import netlify from "@iconify/icons-simple-icons/netlify";
import box from "@iconify/icons-tabler/box";
import brain from "@iconify/icons-tabler/brain";
import layoutDashboard from "@iconify/icons-tabler/layout-dashboard";
import route from "@iconify/icons-tabler/route";

const icons: Record<string, IconifyIcon> = {
  "simple-icons:figma": figma,
  "simple-icons:google": google,
  "simple-icons:microsoft": microsoft,
  "simple-icons:netlify": netlify,
  "tabler:box": box,
  "tabler:brain": brain,
  "tabler:layout-dashboard": layoutDashboard,
  "tabler:route": route
};

type ListingIconProps = {
  icon: string;
  title: string;
};

export function ListingIcon({ icon, title }: ListingIconProps) {
  const iconData = icons[icon] ?? box;

  return (
    <span className="listing-icon" aria-hidden="true" title={title}>
      <Icon icon={iconData} width={24} height={24} />
    </span>
  );
}
