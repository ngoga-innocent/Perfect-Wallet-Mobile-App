import { ENV } from "@/config/env";
import {
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";



export const baseQuery = fetchBaseQuery({
    baseUrl: ENV.API_URL,
});