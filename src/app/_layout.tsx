import { Provider } from "react-redux";
import "../global.css";

import { ThemeProvider } from "@/constants/theme/ThemeProvider";
import { store } from "@/store/store";
import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Provider>
    </ThemeProvider>
  );
}
