import { Pressable, Text, View } from "react-native";

interface Props {
  value: string;

  onChange: (value: string) => void;
}

export default function PinInput({ value, onChange }: Props) {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"];

  const handlePress = (num: string) => {
    if (num === "⌫") {
      onChange(value.slice(0, -1));

      return;
    }

    if (value.length < 6) {
      onChange(value + num);
    }
  };

  return (
    <View>
      <View
        className="
          flex-row
          mb-10
          justify-center gap-4
        "
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            className={`
              w-4 h-4
              rounded-full
              ${value.length > i ? "bg-orange" : "bg-slate-300"}
            `}
          />
        ))}
      </View>

      <View
        className="
          flex-row flex-wrap
          justify-center
        "
      >
        {numbers.map((num, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(num)}
            className="
              w-[20vw] h-20
              m-2
              bg-primary
              text-white
              rounded-full
              shadow-sm
              items-center justify-center
            "
          >
            <Text
              className="
                text-2xl font-semibold text-white
              "
            >
              {num}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
