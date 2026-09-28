import { getApiError } from "@/utils/apiHandler";

import { useAlert } from "@/components/ui/Alert/AlertProvider";
export function useApiMutation() {
    const { showAlert } = useAlert();
    const execute = async <T>(
        mutation: () => Promise<T>,

        options?: {
            successMessage?: string;
            showSuccess?: boolean;
        },
    ) => {
        try {
            const response = await mutation();

            if (options?.showSuccess) {
                showAlert({
                    type: "success",
                    title: "Success",
                    message: options.successMessage,
                });
            }

            return {
                success: true,

                data: response,
            };
        } catch (error) {
            const message = getApiError(error);
            showAlert({
                type: "error",
                title: "Error",
                message: message,
            });

            return {
                success: false,

                error: message,
            };
        }
    };

    return {
        execute,
    };
}
