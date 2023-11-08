import { Compass, Flame, GalleryVerticalEnd, Hash, Zap } from "lucide-react";
type Item = {
  label: string;
  icon: React.ElementType;
  path: string;
};

export const items = [
  {
    label: "Explore",
    icon: Compass,
    path: "/explore",
  },
  {
    label: "Tags",
    icon: Hash,
    path: "/tags",
  },
  {
    label: "Trending",
    icon: Flame,
    path: "/trending",
  },
];
