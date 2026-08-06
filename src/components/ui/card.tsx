import { View, ViewProps } from "react-native";

export default function Card({
  children,

  className = "",
}: ViewProps & {
  children: React.ReactNode;
}) {
  return (
    <View
      className={`
bg-white
rounded-[30px]
p-6
shadow-sm
${className}
`}
    >
      {children}
    </View>
  );
}
