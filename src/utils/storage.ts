import AsyncStorage from "@react-native-async-storage/async-storage";


export const STORAGE_KEYS = {
    ONBOARDING_COMPLETED: "onboarding_completed",
    ACCESS_TOKEN: "access_token",
};



export async function getStorageItem(
    key: string
) {
    return await AsyncStorage.getItem(key);
}



export async function setStorageItem(
    key: string,
    value: string
) {
    return await AsyncStorage.setItem(
        key,
        value
    );
}