import { Compass, GalleryVerticalEnd, Hash, Zap } from "lucide-react";
type Item = {
  label: string;
  icon: React.ElementType;
  path: string;
};

export const items = [
  {
    label: "Feed",
    icon: GalleryVerticalEnd,
    path: "/feed",
  },
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
    icon: Zap,
    path: "/trending",
  },
];
