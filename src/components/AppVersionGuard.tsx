// components/AppVersionGuard.tsx

import React from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { router } from "expo-router";

import { useGetCurrentAppVersionQuery } from "@/api/authApi";
import { isVersionBelow, isUpdateAvailable } from "@/utils/version";

export default function AppVersionGuard() {
  const platform = Platform.OS === "ios" ? "ios" : "android";

  const { data, isLoading, isError } = useGetCurrentAppVersionQuery(platform);

  React.useEffect(() => {
    if (!data) return;

    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

    const mustUpdate = isVersionBelow(currentVersion, data.minimum_version);

    const hasUpdate = isUpdateAvailable(currentVersion, data.latest_version);

    if (mustUpdate || (data.force_update && hasUpdate)) {
      router.replace({
        pathname: "/update-required",
        params: {
          current: currentVersion,
          latest: data.latest_version,
          url: data.update_url,
          force: mustUpdate ? "true" : "false",
        },
      });
    }
  }, [data]);

  return null;
}
