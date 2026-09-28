import { View } from "react-native";

interface WaterDropPatternProps {
  opacity?: number;
}

export default function WaterDropPattern({
  opacity = 0.08,
}: WaterDropPatternProps) {
  const drops = [
    { size: 90, top: -35, right: -15 },
    { size: 55, top: 35, right: 55 },
    { size: 120, top: 75, right: -45 },
    { size: 42, top: 125, right: 70 },
    { size: 75, top: 155, right: -5 },
    { size: 35, top: 15, right: 130 },
    { size: 100, top: -50, right: 145 },
  ];

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden rounded-3xl"
    >
      {drops.map((drop, index) => (
        <View
          key={index}
          style={{
            width: drop.size,
            height: drop.size,
            top: drop.top,
            right: drop.right,
            opacity,
          }}
          className="absolute rounded-full border border-white/20 bg-white/10"
        />
      ))}
    </View>
  );
}
