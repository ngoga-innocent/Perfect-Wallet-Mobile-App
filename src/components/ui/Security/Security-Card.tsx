import { Text, TouchableOpacity, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

interface Props {
  icon: React.ReactNode;

  title: string;

  description: string;

  enabled?: boolean;

  action?: string;

  onPress: () => void;
}

export default function SecurityCard({
  icon,
  title,
  description,
  enabled = false,
  action = "Setup",
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="
        flex-row
        p-5 mb-4
        bg-white
        rounded-3xl
        shadow-sm
        items-center
      "
    >
      <View
        className="
          w-14 h-14
          bg-primary/10
          rounded-2xl
          items-center justify-center
        "
      >
        <Text>{icon}</Text>
      </View>

      <View
        className="
          flex-1
          ml-4
        "
      >
        <View
          className="
            flex-row
            items-center
          "
        >
          <Text
            className="
              text-lg font-semibold text-dark
            "
          >
            {title}
          </Text>

          {enabled && (
            <View
              className="
                ml-2 px-2 py-1
                bg-secondary/20
                rounded-full
              "
            >
              <Text
                className="
                  text-xs text-secondary font-semibold
                "
              >
                Enabled
              </Text>
            </View>
          )}
        </View>

        <Text
          className="
            mt-1
            text-slate-500 text-sm
          "
        >
          {description}
        </Text>
      </View>

      <View
        className="
          flex-row
          items-center
        "
      >
        <Text
          className="
            mr-2
            text-primary font-semibold
          "
        >
          {action}
        </Text>

        <ChevronRight size={20} color="#10644D" />
      </View>
    </TouchableOpacity>
  );
}
