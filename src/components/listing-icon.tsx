"use client";

import { Icon } from "@iconify/react/offline";
import type { IconifyIcon } from "@iconify/types";
import blender from "@iconify/icons-simple-icons/blender";
import figma from "@iconify/icons-simple-icons/figma";
import google from "@iconify/icons-simple-icons/google";
import microsoft from "@iconify/icons-simple-icons/microsoft";
import netlify from "@iconify/icons-simple-icons/netlify";
import react from "@iconify/icons-simple-icons/react";
import telegram from "@iconify/icons-simple-icons/telegram";
import box from "@iconify/icons-tabler/box";
import brain from "@iconify/icons-tabler/brain";
import brush from "@iconify/icons-tabler/brush";
import article from "@iconify/icons-tabler/article";
import category from "@iconify/icons-tabler/category";
import checklist from "@iconify/icons-tabler/checklist";
import code from "@iconify/icons-tabler/code";
import palette from "@iconify/icons-tabler/palette";
import layoutDashboard from "@iconify/icons-tabler/layout-dashboard";
import robot from "@iconify/icons-tabler/robot";
import template from "@iconify/icons-tabler/template";
import route from "@iconify/icons-tabler/route";
import video from "@iconify/icons-tabler/video";
import wand from "@iconify/icons-tabler/wand";

const icons: Record<string, IconifyIcon> = {
  "simple-icons:blender": blender,
  "simple-icons:figma": figma,
  "simple-icons:google": google,
  "simple-icons:microsoft": microsoft,
  "simple-icons:netlify": netlify,
  "simple-icons:react": react,
  "simple-icons:telegram": telegram,
  "tabler:box": box,
  "tabler:brain": brain,
  "tabler:brush": brush,
  "tabler:article": article,
  "tabler:category": category,
  "tabler:checklist": checklist,
  "tabler:code": code,
  "tabler:palette": palette,
  "tabler:layout-dashboard": layoutDashboard,
  "tabler:robot": robot,
  "tabler:route": route,
  "tabler:template": template,
  "tabler:video": video,
  "tabler:wand": wand
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
