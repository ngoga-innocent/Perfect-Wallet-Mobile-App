import { View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function AuthBottomCard({ children }: Props) {
  return (
    <View
      className="
      bg-background
      dark:bg-background-dark
      rounded-t-[2rem]
      px-8
      pt-10
      pb-8
      flex-1
      "
    >
      {children}
    </View>
  );
}
