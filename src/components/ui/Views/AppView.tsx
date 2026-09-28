import { View, ViewProps } from "react-native";

interface Props extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AppView({ children, className = "", ...props }: Props) {
  const hasBackgroundClass = className
    .trim()
    .split(/\s+/)
    .some((cls) => cls.includes(":bg-") || cls.startsWith("bg-"));

  const finalClassName = hasBackgroundClass
    ? className
    : `bg-background dark:bg-background-dark ${className}`;

  return (
    <View {...props} className={finalClassName}>
      {children}
    </View>
  );
}
