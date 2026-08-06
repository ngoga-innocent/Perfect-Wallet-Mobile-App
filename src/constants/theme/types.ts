export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;

    background: string;
    surface: string;
    surfaceSecondary: string;
    card: string;
    input: string;

    border: string;
    divider: string;

    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    icon: string;

    success: string;
    warning: string;
    danger: string;
    info: string;

    overlay: string;
}