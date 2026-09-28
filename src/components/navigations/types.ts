// components/navigations/types.ts

import type { LucideIcon } from "lucide-react-native";

export interface AppDrawerItem {
  id: string;
  label: string;
  description?: string;

  icon?: LucideIcon;

  badge?: string | number;

  showChevron?: boolean;

  dividerBefore?: boolean;

  disabled?: boolean;

  destructive?: boolean;

  onPress?: () => void;
}
