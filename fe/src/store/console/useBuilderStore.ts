"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { PageData, Section, WidgetStyle } from "@/types/console/template";
import { DEFAULT_TEMPLATE } from "@/constants/console/widgetDefaults";

export type ViewportType = "desktop" | "tablet" | "mobile";

interface BuilderStore {
    // Page Data
    pageData: PageData;
    setPageData: (data: PageData) => void;
    updatePageTitle: (title: string) => void;

    // History for undo
    history: PageData[];
    pushHistory: () => void;
    undo: () => void;
    clearHistory: () => void;

    // Selection state
    selectedSectionId: string | null;
    selectedWidgetId: string | null;
    selectedElementKey: string | null;
    selectedItemId: string | null;
    setSelection: (
        sectionId: string | null,
        widgetId?: string | null,
        elementKey?: string | null,
        itemId?: string | null,
    ) => void;
    clearSelection: () => void;

    // Viewport
    viewport: ViewportType;
    canvasWidth: number;
    setViewport: (viewport: ViewportType) => void;
    setCanvasWidth: (width: number) => void;

    // UI State
    isSidebarOpen: boolean;
    isPropertyPanelOpen: boolean;
    isSectionListOpen: boolean;
    toggleSidebar: () => void;
    togglePropertyPanel: () => void;
    toggleSectionList: () => void;
    setSidebarOpen: (open: boolean) => void;
    setPropertyPanelOpen: (open: boolean) => void;

    // Drag and Drop
    isDragging: boolean;
    draggedIdx: number | null;
    dragOverIdx: number | null;
    setDragState: (isDragging: boolean, draggedIdx?: number | null, dragOverIdx?: number | null) => void;

    // Section operations
    addSection: (section: Section) => void;
    updateSection: (sectionId: string, updates: Partial<Section>) => void;
    deleteSection: (sectionId: string) => void;
    moveSection: (sectionId: string, direction: "up" | "down") => void;
    duplicateSection: (sectionId: string) => void;

    // Widget operations
    updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void;
    updateWidgetStyle: (widgetId: string, newStyle: Partial<WidgetStyle>) => void;
    deleteWidget: (sectionId: string, widgetId: string) => void;

    // Reset
    reset: () => void;

    // Loading state for page data
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    // Edit mode
    editMode: "edit" | "preview";
    setEditMode: (mode: "edit" | "preview") => void;

    // Toast message
    toastMsg: string | null;
    setToastMsg: (msg: string | null) => void;
}

const MAX_HISTORY = 20;

const VIEWPORT_WIDTHS: Record<ViewportType, number> = {
    desktop: 1920,
    tablet: 768,
    mobile: 375,
};

export const useBuilderStore = create<BuilderStore>()(
    devtools(
        (set, get) => ({
            // Page Data
            pageData: DEFAULT_TEMPLATE,
            setPageData: data => set({ pageData: data }),
            updatePageTitle: title =>
                set(state => ({
                    pageData: { ...state.pageData, title },
                })),

            // History
            history: [],
            pushHistory: () => {
                const { pageData, history } = get();
                const newHistory = [...history, JSON.parse(JSON.stringify(pageData))];
                if (newHistory.length > MAX_HISTORY) {
                    newHistory.shift();
                }
                set({ history: newHistory });
            },
            undo: () => {
                const { history } = get();
                if (history.length === 0) return;
                const newHistory = [...history];
                const previousState = newHistory.pop();
                if (previousState) {
                    set({ pageData: previousState, history: newHistory });
                }
            },
            clearHistory: () => set({ history: [] }),

            // Selection
            selectedSectionId: null,
            selectedWidgetId: null,
            selectedElementKey: null,
            selectedItemId: null,
            setSelection: (sectionId, widgetId = null, elementKey = null, itemId = null) =>
                set({
                    selectedSectionId: sectionId,
                    selectedWidgetId: widgetId,
                    selectedElementKey: elementKey,
                    selectedItemId: itemId,
                }),
            clearSelection: () =>
                set({
                    selectedSectionId: null,
                    selectedWidgetId: null,
                    selectedElementKey: null,
                    selectedItemId: null,
                }),

            // Viewport
            viewport: "desktop",
            canvasWidth: VIEWPORT_WIDTHS.desktop,
            setViewport: viewport =>
                set({
                    viewport,
                    canvasWidth: VIEWPORT_WIDTHS[viewport],
                }),
            setCanvasWidth: width => set({ canvasWidth: width }),

            // UI State
            isSidebarOpen: true,
            isPropertyPanelOpen: true,
            isSectionListOpen: false,
            toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
            togglePropertyPanel: () => set(state => ({ isPropertyPanelOpen: !state.isPropertyPanelOpen })),
            toggleSectionList: () => set(state => ({ isSectionListOpen: !state.isSectionListOpen })),
            setSidebarOpen: open => set({ isSidebarOpen: open }),
            setPropertyPanelOpen: open => set({ isPropertyPanelOpen: open }),

            // Drag and Drop
            isDragging: false,
            draggedIdx: null,
            dragOverIdx: null,
            setDragState: (isDragging, draggedIdx = null, dragOverIdx = null) =>
                set({ isDragging, draggedIdx, dragOverIdx }),

            // Section operations
            addSection: section => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: [...state.pageData.sections, section],
                    },
                }));
            },
            updateSection: (sectionId, updates) => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: state.pageData.sections.map(section =>
                            section.id === sectionId ? { ...section, ...updates } : section,
                        ),
                    },
                }));
            },
            deleteSection: sectionId => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: state.pageData.sections.filter(section => section.id !== sectionId),
                    },
                    selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
                    selectedWidgetId: state.selectedSectionId === sectionId ? null : state.selectedWidgetId,
                }));
            },
            moveSection: (sectionId, direction) => {
                get().pushHistory();
                set(state => {
                    const sections = [...state.pageData.sections];
                    const index = sections.findIndex(s => s.id === sectionId);
                    if (index === -1) return state;

                    const newIndex = direction === "up" ? index - 1 : index + 1;
                    if (newIndex < 0 || newIndex >= sections.length) return state;

                    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
                    return {
                        pageData: {
                            ...state.pageData,
                            sections,
                        },
                    };
                });
            },
            duplicateSection: sectionId => {
                get().pushHistory();
                set(state => {
                    const sectionIndex = state.pageData.sections.findIndex(s => s.id === sectionId);
                    if (sectionIndex === -1) return state;

                    const sectionToDuplicate = state.pageData.sections[sectionIndex];
                    const newSection: Section = {
                        ...JSON.parse(JSON.stringify(sectionToDuplicate)),
                        id: `section_${Date.now()}`,
                        widgets: sectionToDuplicate.widgets.map(widget => ({
                            ...JSON.parse(JSON.stringify(widget)),
                            id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        })),
                    };

                    const sections = [...state.pageData.sections];
                    sections.splice(sectionIndex + 1, 0, newSection);

                    return {
                        pageData: {
                            ...state.pageData,
                            sections,
                        },
                    };
                });
            },

            // Widget operations
            updateWidgetData: (widgetId, newData) => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: state.pageData.sections.map(section => ({
                            ...section,
                            widgets: section.widgets.map(widget =>
                                widget.id === widgetId
                                    ? { ...widget, data: { ...(widget as any).data, ...newData } }
                                    : widget,
                            ),
                        })),
                    },
                }));
            },
            updateWidgetStyle: (widgetId, newStyle) => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: state.pageData.sections.map(section => ({
                            ...section,
                            widgets: section.widgets.map(widget =>
                                widget.id === widgetId
                                    ? { ...widget, style: { ...widget.style, ...newStyle } }
                                    : widget,
                            ),
                        })),
                    },
                }));
            },
            deleteWidget: (sectionId, widgetId) => {
                get().pushHistory();
                set(state => ({
                    pageData: {
                        ...state.pageData,
                        sections: state.pageData.sections.map(section =>
                            section.id === sectionId
                                ? {
                                      ...section,
                                      widgets: section.widgets.filter(w => w.id !== widgetId),
                                  }
                                : section,
                        ),
                    },
                    selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
                }));
            },

            // Reset
            reset: () => {
                set({
                    pageData: DEFAULT_TEMPLATE,
                    history: [],
                    selectedSectionId: null,
                    selectedWidgetId: null,
                    selectedElementKey: null,
                    selectedItemId: null,
                });
            },

            // Loading
            isLoading: false,
            setIsLoading: loading => set({ isLoading: loading }),

            // Edit mode
            editMode: "edit",
            setEditMode: mode => set({ editMode: mode }),

            // Toast
            toastMsg: null,
            setToastMsg: msg => set({ toastMsg: msg }),
        }),
        { name: "BuilderStore" },
    ),
);

// Selector hooks for common selections
export const useSelectedWidget = () => {
    const { pageData, selectedSectionId, selectedWidgetId } = useBuilderStore();
    if (!selectedSectionId || !selectedWidgetId) return null;

    const section = pageData.sections.find(s => s.id === selectedSectionId);
    if (!section) return null;

    return section.widgets.find(w => w.id === selectedWidgetId) || null;
};

export const useSelectedSection = () => {
    const { pageData, selectedSectionId } = useBuilderStore();
    if (!selectedSectionId) return null;
    return pageData.sections.find(s => s.id === selectedSectionId) || null;
};
