import { PageData } from "@/types/console/template";

export const DEFAULT_TEMPLATE: PageData = {
    title: "새 페이지",
    sections: [],
};

// Viewport presets
export const VIEWPORT_WIDTHS = {
    desktop: 1920,
    tablet: 768,
    mobile: 375,
} as const;

export type ViewportType = keyof typeof VIEWPORT_WIDTHS;
