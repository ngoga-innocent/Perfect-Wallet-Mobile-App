import { View } from "react-native";

interface Props {
  current: number;
  total: number;
}

export default function Pagination({ current, total }: Props) {
  return (
    <View className="flex-row gap-2">
      {Array.from({
        length: total,
      }).map((_, index) => (
        <View
          key={index}
          className={`
h-2
rounded-full
${current === index ? "w-8 bg-[#10644D]" : "w-2 bg-gray-300"}
`}
        />
      ))}
    </View>
  );
}
