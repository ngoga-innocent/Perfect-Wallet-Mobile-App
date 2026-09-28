export type AlertType =
    | "success"
    | "error"
    | "warning"
    | "info";


export interface AlertData {

    type: AlertType;

    title: string;

    message?: string;

}