import { baseApi } from "./baseQuery";

export interface RegisterDeviceRequest {
  expo_push_token: string;
  platform: "ios" | "android" | "unknown";
  device_name?: string;
}

export interface UserDevice {
  id: number;
  expo_push_token: string;
  platform: "ios" | "android" | "unknown";
  device_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_registered_at: string;
}

export const deviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerDevice: builder.mutation<
      {
        success: boolean;
        message: string;
        data: UserDevice;
        errors: unknown;
      },
      RegisterDeviceRequest
    >({
      query: (body) => ({
        url: "/financial-reminders/devices/register/",
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useRegisterDeviceMutation } = deviceApi;
