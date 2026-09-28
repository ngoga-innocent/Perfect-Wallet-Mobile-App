export function getApiError(error: unknown): string {
  const err = error as any;

  if (err && typeof err === "object" && "data" in err) {
    const data = err.data;

    /*
      Our custom API format:

      {
        success: false,
        message: "Unable to create transaction.",
        data: {},
        errors: {
          code: "INSUFFICIENT_BALANCE",
          detail: "Insufficient balance..."
        },
        meta: {}
      }
    */

    const errors = data?.errors;

    if (errors && typeof errors === "object") {
      const messages: string[] = [];

      Object.entries(errors).forEach(([field, value]: [string, any]) => {
        // Ignore internal error codes.
        if (field === "code") {
          return;
        }

        const fieldName =
          field === "non_field_errors"
            ? ""
            : field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char: string) => char.toUpperCase());

        // Handle arrays
        if (Array.isArray(value)) {
          value.forEach((message) => {
            if (typeof message === "string") {
              messages.push(fieldName ? `${fieldName}: ${message}` : message);
            }
          });

          return;
        }

        // Handle normal string errors
        if (typeof value === "string") {
          messages.push(fieldName ? `${fieldName}: ${value}` : value);

          return;
        }

        // Handle nested objects
        if (value && typeof value === "object") {
          Object.values(value).forEach((nestedValue: any) => {
            if (typeof nestedValue === "string") {
              messages.push(nestedValue);
            }

            if (Array.isArray(nestedValue)) {
              nestedValue.forEach((message) => {
                if (typeof message === "string") {
                  messages.push(message);
                }
              });
            }
          });
        }
      });

      if (messages.length) {
        return messages.join("\n");
      }
    }

    /*
      Fallback to API message
    */
    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data?.detail === "string") {
      return data.detail;
    }
  }

  /*
    RTK Query / fetch errors
  */
  if (err && typeof err === "object" && "error" in err) {
    if (typeof err.error === "string") {
      return err.error;
    }
  }

  return "Something went wrong. Please try again.";
}
