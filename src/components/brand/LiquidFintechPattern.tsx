import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { View } from "react-native";

interface LiquidFinancialPatternProps {
  opacity?: number;
}

export default function LiquidFinancialPattern({
  opacity = 1,
}: LiquidFinancialPatternProps) {
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden rounded-[28px]"
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
      >
        <Defs>
          {/* Main liquid glow */}
          <RadialGradient id="glow" cx="75%" cy="15%" r="70%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>

          {/* Secondary glow */}
          <RadialGradient id="glow2" cx="5%" cy="95%" r="65%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>

          {/* Flow gradient */}
          <LinearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
          </LinearGradient>
        </Defs>

        {/* Atmospheric glow */}
        <Circle cx="300" cy="25" r="120" fill="url(#glow)" opacity={opacity} />

        <Circle cx="15" cy="205" r="105" fill="url(#glow2)" opacity={opacity} />

        {/* Large liquid ripple */}
        <Circle
          cx="330"
          cy="45"
          r="95"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.10"
        />

        <Circle
          cx="330"
          cy="45"
          r="75"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.07"
        />

        <Circle
          cx="330"
          cy="45"
          r="55"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.05"
        />

        {/* Main flowing data stream */}
        <Path
          d="
            M -30 155
            C 40 105, 75 190, 140 145
            S 235 75, 305 105
            S 385 145, 430 85
          "
          fill="none"
          stroke="url(#flow)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity={opacity}
        />

        {/* Inner flow line */}
        <Path
          d="
            M -20 150
            C 45 105, 80 180, 145 140
            S 235 80, 305 105
            S 385 140, 425 80
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.13"
        />

        {/* Secondary flow */}
        <Path
          d="
            M -20 185
            C 55 135, 95 215, 165 165
            S 255 105, 330 125
            S 390 165, 430 120
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.06"
        />

        {/* Data droplets */}
        <Circle cx="65" cy="132" r="3" fill="#FFFFFF" fillOpacity="0.18" />
        <Circle cx="95" cy="158" r="2" fill="#FFFFFF" fillOpacity="0.12" />

        <Circle cx="145" cy="143" r="3" fill="#FFFFFF" fillOpacity="0.20" />
        <Circle cx="180" cy="120" r="2" fill="#FFFFFF" fillOpacity="0.13" />

        <Circle cx="225" cy="105" r="3" fill="#FFFFFF" fillOpacity="0.18" />
        <Circle cx="265" cy="92" r="2" fill="#FFFFFF" fillOpacity="0.12" />

        <Circle cx="315" cy="108" r="3" fill="#FFFFFF" fillOpacity="0.20" />
        <Circle cx="355" cy="125" r="2" fill="#FFFFFF" fillOpacity="0.12" />

        {/* Tiny floating particles */}
        <Circle cx="245" cy="35" r="1.5" fill="#FFFFFF" fillOpacity="0.18" />
        <Circle cx="275" cy="55" r="1" fill="#FFFFFF" fillOpacity="0.12" />
        <Circle cx="190" cy="55" r="1.5" fill="#FFFFFF" fillOpacity="0.10" />
        <Circle cx="115" cy="70" r="1" fill="#FFFFFF" fillOpacity="0.16" />
        <Circle cx="370" cy="75" r="1.5" fill="#FFFFFF" fillOpacity="0.13" />
      </Svg>
    </View>
  );
}
