import { Text as RNText, TextProps } from "react-native";

interface Props extends TextProps {
  children: React.ReactNode;
}

export default function AppView({ children, className = "", ...props }: Props) {
  return (
    <RNText
      {...props}
      className={`
        text-textPrimary
        dark:text-textPrimary-dark
        ${className}
      `}
    >
      {children}
    </RNText>
  );
}
