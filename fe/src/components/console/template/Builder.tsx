import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  PageData,
  Section,
  Widget,
  WidgetType,
} from "@/types/console/template";
import { DEFAULT_TEMPLATE } from "@/constants/console/widgetDefaults";
import { MainTitleRenderer } from "./widgets/MainTitleRenderer";
import { TextSectionRenderer } from "./widgets/TextSectionRenderer";
import { VideoRenderer } from "./widgets/VideoRenderer";
import { GridCardRenderer } from "./widgets/GridCardRenderer";
import { InfoBannerRenderer } from "./widgets/InfoBannerRenderer";
import { ProcessRenderer } from "./widgets/ProcessRenderer";
import { IconCardRenderer } from "./widgets/IconCardRenderer";
import { ImageCardRenderer } from "./widgets/ImageCardRenderer";
import { TableRenderer } from "./widgets/TableRenderer";
import { FaqRenderer } from "./widgets/FaqRenderer";
import { BannerSectionRenderer } from "./widgets/BannerSectionRenderer";
import { CardRenderer } from "./widgets/CardRenderer";
import {
  TitleBannerRenderer,
  TITLE_BANNER_DEFAULTS,
} from "./widgets/TitleBannerRenderer";
import {
  ImageAreaRenderer,
  IMAGE_AREA_DEFAULTS,
} from "./widgets/ImageAreaRenderer";
import { TitleTextRenderer } from "./widgets/TitleTextRenderer";
import { TabButtonRenderer } from "./widgets/TabButtonRenderer";
import { TextStructureRenderer } from "./widgets/TextStructureRenderer";
import { ComparisonCardRenderer } from "./widgets/ComparisonCardRenderer";
import { StripBannerRenderer } from "./widgets/StripBannerRenderer";
import { CultureLetterRenderer } from "./widgets/CultureLetterRenderer";
import { isVideoUrl } from "./widgets/WidgetUtils";
import {
  Trash2,
  Eye,
  Save,
  Monitor,
  Smartphone,
  Tablet,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  GripVertical,
  Upload,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  Check,
  Layers,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { usePopupStore } from "@/store/console/usePopupStore";
import ImgUploadPop from "@/components/console/popup/ImgUploadPop";
import { PropertyPanel } from "./builder/PropertyPanel";
import { createWidget } from "@/utils/template/widgetFactory";
import {
  findItem,
  updateItemInArray,
  getArrayNameForWidget,
  createNewItem,
  createTableRow,
  addTableColumn,
  removeTableLastRow,
  removeTableLastColumn,
  moveItemInArray,
  reorderItems,
} from "@/utils/template/itemUtils";

interface BuilderProps {
  initialData: PageData;
  onSave: (data: PageData) => void;
  onPreview: (data: PageData) => void;
}

const DEFAULT_CANVAS_ZOOM = 1;
const MIN_CANVAS_ZOOM = 0.25;
const MAX_CANVAS_ZOOM = 2;
const KEYBOARD_ZOOM_STEP = 0.1;
const WHEEL_ZOOM_STEP = 0.05;

const clampCanvasZoom = (zoom: number) =>
  Math.min(MAX_CANVAS_ZOOM, Math.max(MIN_CANVAS_ZOOM, Number(zoom.toFixed(2))));

const isEditableTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  if (!element) return false;

  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT" ||
    element.isContentEditable ||
    !!element.closest("[contenteditable='true']")
  );
};

const Builder: React.FC<BuilderProps> = ({
  initialData,
  onSave,
  onPreview,
}) => {
  const [pageData, setPageData] = useState<PageData>(initialData);
  const [history, setHistory] = useState<PageData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Canvas Resizing State
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [canvasWidth, setCanvasWidth] = useState<number>(1920);
  const [canvasZoom, setCanvasZoom] = useState<number>(DEFAULT_CANVAS_ZOOM);
  const [canvasContentHeight, setCanvasContentHeight] = useState<number>(0);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [itemDraggedIdx, setItemDraggedIdx] = useState<number | null>(null);
  const [itemDragOverIdx, setItemDragOverIdx] = useState<number | null>(null);
  const [isSectionListOpen, setIsSectionListOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [sizeUnit, setSizeUnit] = useState<"%" | "px">("%");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { setConfirmPop } = usePopupStore();
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const canvasScaleWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasContentRef = useRef<HTMLDivElement | null>(null);
  const canvasZoomRef = useRef<number>(DEFAULT_CANVAS_ZOOM);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    canvasZoomRef.current = canvasZoom;
  }, [canvasZoom]);

  useLayoutEffect(() => {
    const contentNode = canvasContentRef.current;
    if (!contentNode) return;

    const updateCanvasHeight = () => {
      setCanvasContentHeight(contentNode.offsetHeight);
    };

    updateCanvasHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateCanvasHeight);
      return () => window.removeEventListener("resize", updateCanvasHeight);
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasHeight();
    });

    resizeObserver.observe(contentNode);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const isCanvasShortcutScope = useCallback(
    (target: EventTarget | null) => {
      const canvasNode = canvasViewportRef.current;
      if (!canvasNode) return false;

      const activeElement = document.activeElement as HTMLElement | null;
      const targetElement = target as HTMLElement | null;

      return (
        isCanvasHovered ||
        (!!activeElement && canvasNode.contains(activeElement)) ||
        (!!targetElement && canvasNode.contains(targetElement))
      );
    },
    [isCanvasHovered],
  );

  const setCanvasZoomLevel = useCallback(
    (
      nextZoom: number,
      anchor?: {
        clientX: number;
        clientY: number;
      },
    ) => {
      const currentZoom = canvasZoomRef.current;
      const clampedZoom = clampCanvasZoom(nextZoom);
      if (clampedZoom === currentZoom) return;

      const viewportNode = canvasViewportRef.current;
      const wrapperNode = canvasScaleWrapperRef.current;

      let anchorViewportX = 0;
      let anchorViewportY = 0;
      let contentX: number | null = null;
      let contentY: number | null = null;

      if (viewportNode && wrapperNode) {
        const viewportRect = viewportNode.getBoundingClientRect();
        anchorViewportX = anchor
          ? anchor.clientX - viewportRect.left
          : viewportRect.width / 2;
        anchorViewportY = anchor
          ? anchor.clientY - viewportRect.top
          : viewportRect.height / 2;

        contentX =
          (viewportNode.scrollLeft + anchorViewportX - wrapperNode.offsetLeft) /
          currentZoom;
        contentY =
          (viewportNode.scrollTop + anchorViewportY - wrapperNode.offsetTop) /
          currentZoom;
      }

      setCanvasZoom(clampedZoom);

      if (viewportNode && wrapperNode && contentX !== null && contentY !== null) {
        const nextContentX = contentX;
        const nextContentY = contentY;

        window.requestAnimationFrame(() => {
          const nextViewportNode = canvasViewportRef.current;
          const nextWrapperNode = canvasScaleWrapperRef.current;
          if (!nextViewportNode || !nextWrapperNode) return;

          nextViewportNode.scrollLeft =
            nextWrapperNode.offsetLeft +
            nextContentX * clampedZoom -
            anchorViewportX;
          nextViewportNode.scrollTop =
            nextWrapperNode.offsetTop +
            nextContentY * clampedZoom -
            anchorViewportY;
        });
      }
    },
    [],
  );

  // Sync sizeUnit when element selection changes
  useEffect(() => {
    if (selectedWidgetId && selectedElementKey) {
      const widget = pageData.sections
        .flatMap((s) => s.widgets)
        .find((w) => w.id === selectedWidgetId);
      if (widget) {
        const data = widget.data as any;
        const styleKey =
          selectedElementKey === "contentTitle"
            ? "contentTitleStyle"
            : selectedElementKey === "contentDesc"
              ? "contentDescStyle"
              : selectedElementKey === "image" ||
                  selectedElementKey === "imageUrl"
                ? "imageStyle"
                : selectedElementKey === "videoUrl" ||
                    selectedElementKey === "url"
                  ? "videoStyle"
                  : selectedElementKey + "Style";
        const style = selectedItemId
          ? (data.items?.find((i: any) => i.id === selectedItemId) ||
              data.steps?.find((i: any) => i.id === selectedItemId) ||
              data.tabs?.find((i: any) => i.id === selectedItemId) ||
              {})[styleKey]
          : data[styleKey];

        if (
          style?.width?.toString().includes("px") ||
          style?.height?.toString().includes("px")
        )
          setSizeUnit("px");
        else setSizeUnit("%");
      }
    }
  }, [selectedWidgetId, selectedElementKey, selectedItemId]);

  const pushHistory = () => {
    setHistory((prev) => [...prev.slice(-19), pageData]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop();
    if (last) {
      setPageData(last);
      setHistory(prev);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) {
        return; // Allow native undo inside input elements
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "z" || e.code === "KeyZ")
      ) {
        e.preventDefault();
        undo();
        return;
      }

      if (!(e.ctrlKey || e.metaKey) || !isCanvasShortcutScope(e.target)) {
        return;
      }

      if (e.key === "+" || e.key === "=" || e.code === "NumpadAdd") {
        e.preventDefault();
        setCanvasZoomLevel(canvasZoomRef.current + KEYBOARD_ZOOM_STEP);
        return;
      }

      if (e.key === "-" || e.code === "NumpadSubtract") {
        e.preventDefault();
        setCanvasZoomLevel(canvasZoomRef.current - KEYBOARD_ZOOM_STEP);
        return;
      }

      if (e.key === "0" || e.code === "Digit0" || e.code === "Numpad0") {
        e.preventDefault();
        setCanvasZoomLevel(DEFAULT_CANVAS_ZOOM);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, isCanvasShortcutScope, setCanvasZoomLevel]);

  useEffect(() => {
    const viewportNode = canvasViewportRef.current;
    if (!viewportNode) return;

    const handleWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey) || isEditableTarget(e.target)) {
        return;
      }

      e.preventDefault();

      const zoomDelta = e.deltaY < 0 ? WHEEL_ZOOM_STEP : -WHEEL_ZOOM_STEP;
      setCanvasZoomLevel(canvasZoomRef.current + zoomDelta, {
        clientX: e.clientX,
        clientY: e.clientY,
      });
    };

    viewportNode.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewportNode.removeEventListener("wheel", handleWheel);
    };
  }, [setCanvasZoomLevel]);

  // Auto-migration: Backfill missing mobile font sizes for legacy titleText defaults.
  useEffect(() => {
    let needsUpdate = false;

    // Deep clone the pageData to avoid mutation issues before setState
    const updatedData = JSON.parse(JSON.stringify(pageData));

    const normalizeFontSize = (value: any) => {
      if (value === undefined || value === null || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return "";
        return /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
      }
      return "";
    };

    const backfillMobileFontSize = (
      style: any,
      desktopFontSize: string,
      mobileFontSize: string,
    ) => {
      if (!style || typeof style !== "object") return;

      const hasMobileFontSize =
        style.fontSizeMobile !== undefined &&
        style.fontSizeMobile !== null &&
        String(style.fontSizeMobile).trim() !== "";

      if (hasMobileFontSize) return;

      if (normalizeFontSize(style.fontSize) === desktopFontSize) {
        style.fontSizeMobile = mobileFontSize;
        needsUpdate = true;
      }
    };

    const migrateTitleTextWidget = (widget: any) => {
      if (widget?.type !== "titleText" || !widget.data) return;

      backfillMobileFontSize(widget.data.subTitleStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.descStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.layout1SubTitleStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.layout2SubTitleStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.layout3SubTitleStyle, "24px", "20px");
      backfillMobileFontSize(widget.data.layout3DescStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.layout4SubTitleStyle, "20px", "18px");
      backfillMobileFontSize(widget.data.layout4DescStyle, "20px", "18px");
    };

    const recursiveUpdateFontSize = (obj: any) => {
      if (!obj || typeof obj !== "object") return;

      // If it's an array, iterate
      if (Array.isArray(obj)) {
        obj.forEach((item) => recursiveUpdateFontSize(item));
        return;
      }

      // Iterate object keys
      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        // Check if this object has fontSize property (regardless of key name)
        if (value && typeof value === "object") {
          // Logic removed to prevent forcing 16px to 18px
        }

        // Recursive call for nested objects
        if (value && typeof value === "object") {
          recursiveUpdateFontSize(value);
        }
      });
    };

    updatedData.sections.forEach((section: any) => {
      section.widgets.forEach((widget: any) => {
        migrateTitleTextWidget(widget);
        recursiveUpdateFontSize(widget.data);
        recursiveUpdateFontSize(widget.style);
      });
    });

    if (needsUpdate) {
      console.log("✓ TitleText mobile fontSize backfill completed");
      setPageData(updatedData);
    }
  }, [pageData]); // Run whenever pageData changes (to catch async data load)

  // Handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      // The canvas is centered in the main area (window width - right sidebar).
      const sidebarWidth = isSidebarOpen ? 240 : 44;
      const center = (window.innerWidth - sidebarWidth) / 2;
      // Handle is on the left side of the canvas.
      // Mouse x is center - width/2 - handleOffset(24)
      // So width/2 = center - 24 - x
      // So width = 2 * (center - 24 - e.clientX)
      const newWidth = Math.max(
        375,
        (2 * (center - 24 - e.clientX)) / canvasZoomRef.current,
      );
      setCanvasWidth(newWidth);
      if (newWidth < 768) setViewport("mobile");
      else if (newWidth < 1024) setViewport("tablet");
      else setViewport("desktop");
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isSidebarOpen]);

  const setViewportPreset = (mode: "desktop" | "tablet" | "mobile") => {
    setViewport(mode);
    if (mode === "desktop") setCanvasWidth(1920);
    if (mode === "tablet") setCanvasWidth(768);
    if (mode === "mobile") setCanvasWidth(375);
  };

  // Actions
  const addSection = (type: WidgetType) => {
    const newSectionId = `sec-${Date.now()}`;
    const newWidgetId = `wid-${Date.now()}`;

    // widgetFactory를 사용하여 위젯 생성
    const newWidget = createWidget(type, newWidgetId);
    if (!newWidget) return;

    const newSection: Section = {
      id: newSectionId,
      layout: "full",
      backgroundColor: "#ffffff",
      widgets: [newWidget],
    };
    setPageData((prev) => {
      const newSections = [...prev.sections];
      const currentIndex = newSections.findIndex(
        (s) => s.id === selectedSectionId,
      );
      if (currentIndex !== -1)
        newSections.splice(currentIndex + 1, 0, newSection);
      else newSections.push(newSection);
      return { ...prev, sections: newSections };
    });
    setSelectedSectionId(newSectionId);
    setSelectedWidgetId(newWidgetId);

    // Auto-scroll to the newly added section
    setTimeout(() => {
      const element = document.getElementById(newSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const updateWidgetData = (id: string, newData: any) => {
    pushHistory();
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => ({
        ...s,
        widgets: s.widgets.map((w) =>
          w.id === id ? { ...w, data: { ...w.data, ...newData } } : w,
        ),
      })),
    }));
  };

  const updateWidgetStyle = (id: string, newStyle: any) => {
    pushHistory();
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => ({
        ...s,
        widgets: s.widgets.map((w) =>
          w.id === id ? { ...w, style: { ...w.style, ...newStyle } } : w,
        ),
      })),
    }));
  };

  const deleteSection = (sectionId: string) => {
    setConfirmPop(true, `해당 섹션을 삭제하시겠습니까?`, 2, () => {
      setPageData((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      }));
      setSelectedSectionId(null);
      setSelectedWidgetId(null);
      setSelectedElementKey(null);
      setSelectedItemId(null);
    });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    setPageData((prev) => {
      const index = prev.sections.findIndex((s) => s.id === sectionId);
      if (index === -1) return prev;
      const newSections = [...prev.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newSections.length) {
        [newSections[index], newSections[targetIndex]] = [
          newSections[targetIndex],
          newSections[index],
        ];
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleReset = () => {
    setConfirmPop(
      true,
      `정말 초기화하시겠습니까? <br />지금까지 입력한 모든 내용이 삭제되고 되돌릴 수 없습니다.`,
      2,
      () => {
        setPageData(DEFAULT_TEMPLATE);
        setSelectedSectionId(null);
        setSelectedWidgetId(null);
        setSelectedElementKey(null);
        setSelectedItemId(null);
      },
    );
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = () => {
    if (
      draggedIdx !== null &&
      dragOverIdx !== null &&
      draggedIdx !== dragOverIdx
    ) {
      setPageData((prev) => {
        const newSections = [...prev.sections];
        const [moved] = newSections.splice(draggedIdx, 1);
        newSections.splice(dragOverIdx, 0, moved);
        return { ...prev, sections: newSections };
      });
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleItemDrop = (widget: Widget, arrayName: string) => {
    if (
      itemDraggedIdx !== null &&
      itemDragOverIdx !== null &&
      itemDraggedIdx !== itemDragOverIdx
    ) {
      pushHistory();
      const items = [...((widget.data as any)[arrayName] || [])];
      const [moved] = items.splice(itemDraggedIdx, 1);
      items.splice(itemDragOverIdx, 0, moved);
      updateWidgetData(widget.id, { [arrayName]: items });
    }
    setItemDraggedIdx(null);
    setItemDragOverIdx(null);
  };

  const handleElementSelect = (
    sectionId: string,
    widgetId: string,
    elementKey: string,
    itemId?: string,
  ) => {
    setIsSidebarOpen(true);
    setSelectedSectionId(sectionId);
    setSelectedWidgetId(widgetId);
    setSelectedElementKey(elementKey);
    setSelectedItemId(itemId || null);
  };

  const getSelectedWidget = () => {
    if (!selectedWidgetId) return null;
    for (const section of pageData.sections) {
      const found = section.widgets.find((w) => w.id === selectedWidgetId);
      if (found) return found;
    }
    return null;
  };

  // Helper to find nested items
  const findItem = (arr: any[], id: string) =>
    arr.find((i: any) => i.id === id);
  const updateItemInArray = (arr: any[], id: string, key: string, val: any) =>
    arr.map((i: any) => (i.id === id ? { ...i, [key]: val } : i));

  // --- Structure Management Helpers ---

  const addNewItem = (widget: Widget) => {
    const id = `item-${Date.now()}`;
    const data = widget.data as any;

    if (widget.type === "table") {
      // Add Row
      const colCount = data.headers.length;
      const newRow = Array(colCount).fill("새 내용");
      const updates: any = { rows: [...data.rows, newRow] };

      // Also update comparisonRows if they exist (for Layout 3, 4)
      if (data.comparisonRows) {
        const compColCount = (data.comparisonHeaders || data.headers).length;
        const newCompRow = Array(compColCount).fill("구분");
        updates.comparisonRows = [...data.comparisonRows, newCompRow];
      }

      updateWidgetData(widget.id, updates);
      return;
    }

    let arrayName = "items";
    if (widget.type === "process" || widget.type === "processCard")
      arrayName = "steps";
    else if (widget.type === "tabCarousel") arrayName = "tabs";
    else if (widget.type === "textSplit" && data.variant === "image-left-list")
      arrayName = "listItems";
    else if (widget.type === "textSection") {
      if (data.variant === "text2" || data.variant === "text3")
        arrayName = "items";
      else arrayName = "blocks";
    }

    let newItem: any = null;

    // CLONING STRATEGY: Use the first item as a template to preserve styles
    const targetList = data[arrayName];
    if (targetList && Array.isArray(targetList) && targetList.length > 0) {
      newItem = JSON.parse(JSON.stringify(targetList[0]));
      newItem.id = id;

      // Re-label text but keep styles/structure
      if (newItem.text !== undefined) newItem.text = "새 항목";
      if (newItem.label !== undefined && widget.type !== "process")
        newItem.label = "새 항목";
      if (newItem.question !== undefined) newItem.question = "새로운 질문?";
      if (newItem.answer !== undefined) newItem.answer = "답변 내용입니다.";
      if (newItem.title !== undefined) newItem.title = "새 제목";
      if (newItem.desc !== undefined) newItem.desc = "설명을 입력하세요.";

      // Special handling for process step numbering
      if (widget.type === "process" || widget.type === "processCard") {
        const count = (data.steps?.length || 0) + 1;
        newItem.number = `${count}`;
      }

      if (widget.type === "tabButton") {
        newItem.active = false;
        if (newItem.style && typeof newItem.style === "object") {
          newItem.style = { ...newItem.style };
          delete newItem.style.backgroundColor;
          delete newItem.style.backgroundImage;
        }
        if (newItem.titleStyle && typeof newItem.titleStyle === "object") {
          newItem.titleStyle = {
            ...newItem.titleStyle,
            color: "#6b7280",
          };
        } else {
          newItem.titleStyle = {
            fontSize: "20px",
            fontWeight: "500",
            color: "#6b7280",
          };
        }
      }
    } else {
      // 💡 [새 항목 추가 시 기본값 설정 (Fallback)]
      // 위젯의 데이터가 하나도 없을 때, 아래 정의된 값이 '첫 번째 항목'으로 생성됩니다.
      if (widget.type === "process") {
        const count = 1;
        newItem = {
          id,
          number: "1",
          title: "새 제목",
          desc: "설명을 입력하세요.",
          image: "/images/template/icon.png",
        };
      } else if (widget.type === "tabMenu") {
        newItem = {
          id,
          label: "새 메뉴",
          url: "#",
          isActive: false,
          style: { fontSize: "16px", fontWeight: "400" },
        };
      } else if (widget.type === "bannerSection") {
        if (data.variant === "banner3") {
          newItem = { id, text: "버튼 텍스트", link: "#", icon: "download" };
        } else if (data.variant === "banner1") {
          newItem = { id, image: "/images/template/img1.png", link: "#" };
        } else {
          newItem = { id, image: "/images/template/icon.png", link: "#" };
        }
      } else if (
        widget.type === "banner1" ||
        widget.type === "banner2" ||
        widget.type === "banner3" ||
        widget.type === "banner4" ||
        widget.type === "banner7"
      ) {
        newItem = {
          id,
          text: "새 항목",
          textStyle: { fontSize: "18px" },
          iconUrl: "/images/template/icon.png",
        };
      } else if (widget.type === "faq") {
        // ↓ 여기서 FAQ의 새 항목 추가 시 기본 폰트 사이즈를 고칠 수 있습니다.
        newItem = {
          id,
          question: "새로운 질문?",
          questionStyle: { fontSize: "20px" }, // PC 기본값
          answer: "답변 내용입니다.",
          answerStyle: { fontSize: "18px" }, // PC 기본값
        };
      } else if (widget.type === "tabCarousel") {
        newItem = { id, label: "새 탭", items: [] };
      } else if (widget.type === "iconCard") {
        newItem = {
          id,
          title: "새로운 항목",
          desc: "새로운 아이콘 카드 내용",
          icon: "/images/template/icon.png",
        };
      } else if (widget.type === "imageLayout") {
        newItem = {
          id,
          text: "새 리스트 항목",
          icon: "/images/template/icon.png",
        };
      } else if (
        widget.type === "textSplit" &&
        data.variant === "image-left-list"
      ) {
        newItem = { id, icon: "/images/template/icon.png", text: "새 항목" };
      } else if (widget.type === "gridCard") {
        newItem = {
          id,
          title: "새 카드",
          desc: "설명",
          image: "/images/template/banner_img.jpg",
        };
      } else if (widget.type === "video") {
        newItem = {
          id,
          videoUrl: "https://www.youtube.com/watch?v=jicErY0RiMg",
          title: "새 영상 제목",
          desc: "설명 입력",
        };
      } else if (widget.type === "textSection") {
        if (data.variant === "text2") {
          newItem = {
            id,
            number: "0N",
            title: "새 항목 제목",
            subTitle: "서브타이틀영역입니다.",
            desc: "설명을 입력하세요.",
          };
        } else if (data.variant === "text3") {
          newItem = {
            id,
            number: "N",
            title: "새 항목 제목",
            desc: "설명을 입력하세요.",
            icon: "/images/template/icon.png",
          };
        } else {
          newItem = {
            id,
            title: "새 항목 제목",
            desc: "설명을 입력하세요.",
            image: "/images/placeholder/card-lg.jpg",
          };
        }
      } else if (widget.type === "comingSoon") {
        newItem = { id, text: "새로운 Coming Soon 항목" };
      } else if (widget.type === "infoBanner") {
        newItem = {
          id,
          icon: "task_alt",
          iconUrl: "/images/template/icon_program.png",
          image: "/images/template/img1.png",
          title: "프로그램 특징",
          titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
          desc: "프로그램 특징 내용 입력",
          descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
        };
      } else if (widget.type === "titleBanner") {
        const defaultFeature =
          ((TITLE_BANNER_DEFAULTS as any).items || [])[0] || {};
        newItem = {
          ...JSON.parse(JSON.stringify(defaultFeature)),
          id,
          image:
            defaultFeature.image || "/images/placeholder/banner_feature.png",
          title: "프로그램 특징",
          desc: "프로그램 특징 내용 입력",
        };
      } else if (widget.type === "tabButton") {
        newItem = {
          id,
          title: "TAB 명 링크 연결",
          titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
          active: false,
          link: "#",
        };
      } else if (widget.type === "textStructure") {
        newItem = {
          id,
          icon: "task_alt",
          title: "프로그램 특징",
          titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
          desc: "프로그램 특징 내용 입력",
          descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
        };
      } else if (widget.type === "cardList") {
        newItem = {
          id,
          image: "/images/template/img1.png",
          title: "새 카드 제목",
          desc: "설명을 입력하세요.",
          tag: "카테고리",
          imageStyle: { borderRadius: "12px" },
          titleStyle: { fontSize: "20px", fontWeight: "600" },
        };
      } else if (widget.type === "imageTitle") {
        newItem = {
          id,
          image: "/images/placeholder/section-image.jpg",
          title: "새 제목",
          desc: "설명을 입력하세요.",
        };
      }
    }

    if (newItem) {
      if (
        widget.type === "textStructure" &&
        (data.layout || "1") === "11" &&
        data.sections11
      ) {
        const newSecs = data.sections11.map((s: any) => {
          if (s.type === "features") {
            const currentItems = s.items || [];
            const count = currentItems.length + 1;
            const featureItem = {
              ...newItem,
              number: `${count}.`,
              icon: "/images/template/icon_program_thumb.png",
            };
            return {
              ...s,
              items: [...currentItems, featureItem],
            };
          }
          return s;
        });
        updateWidgetData(widget.id, { sections11: newSecs });
      } else if (
        widget.type === "textStructure" &&
        (data.layout || "1") === "4"
      ) {
        // 레이아웃 4 특별 처리
        if (arrayName === "addCase") {
          const currentCases = data.cases || [];
          const newCase = {
            id: `case-${Date.now()}`,
            subTitle: `Case 0${currentCases.length + 1}`,
            title: "새로운 실적 타이틀",
            features: ["새로운 특징 항목"],
            avatars: ["https://placehold.co/100x100"],
            imageOnRight: false,
            imageUrl: "https://placehold.co/600x584",
          };
          updateWidgetData(widget.id, { cases: [...currentCases, newCase] });
        } else if (arrayName === "case_features" && selectedItemId) {
          const currentCases = data.cases || [];
          const updatedCases = currentCases.map((c: any) => {
            if (c.id === selectedItemId) {
              return {
                ...c,
                features: [...(c.features || []), "새로운 특징 항목"],
              };
            }
            return c;
          });
          updateWidgetData(widget.id, { cases: updatedCases });
        } else if (arrayName === "case_logos" && selectedItemId) {
          const currentCases = data.cases || [];
          const updatedCases = currentCases.map((c: any) => {
            if (c.id === selectedItemId) {
              return {
                ...c,
                avatars: [...(c.avatars || []), "https://placehold.co/100x100"],
              };
            }
            return c;
          });
          updateWidgetData(widget.id, { cases: updatedCases });
        }
      } else {
        const currentList = data[arrayName] || [];
        updateWidgetData(widget.id, { [arrayName]: [...currentList, newItem] });
      }
    }
  };

  const removeArrayItem = (
    widget: Widget,
    itemId: string,
    arrayName: string = "items",
  ) => {
    const data = widget.data as any;
    if (arrayName === "sections11_features" && data.sections11) {
      const newSecs = data.sections11.map((s: any) => {
        if (s.type === "features") {
          return {
            ...s,
            items: s.items.filter((i: any) => i.id !== itemId),
          };
        }
        return s;
      });
      updateWidgetData(widget.id, { sections11: newSecs });
    } else if (
      widget.type === "textStructure" &&
      (data.layout || "1") === "4"
    ) {
      if (arrayName === "deleteCase") {
        const currentCases = data.cases || [];
        const updatedCases = currentCases.filter(
          (_: any, idx: number) => idx.toString() !== itemId,
        );
        updateWidgetData(widget.id, { cases: updatedCases });
      } else if (arrayName === "case_features" && selectedItemId) {
        const currentCases = data.cases || [];
        const updatedCases = currentCases.map((c: any) => {
          if (c.id === selectedItemId) {
            const idx = parseInt(itemId.replace("f-", ""));
            const updatedFeatures = (c.features || []).filter(
              (_: any, i: number) => i !== idx,
            );
            return { ...c, features: updatedFeatures };
          }
          return c;
        });
        updateWidgetData(widget.id, { cases: updatedCases });
      } else if (arrayName === "case_logos" && selectedItemId) {
        const currentCases = data.cases || [];
        const updatedCases = currentCases.map((c: any) => {
          if (c.id === selectedItemId) {
            const idx = parseInt(itemId.replace("a-", ""));
            const updatedLogos = (c.avatars || []).filter(
              (_: any, i: number) => i !== idx,
            );
            return { ...c, avatars: updatedLogos };
          }
          return c;
        });
        updateWidgetData(widget.id, { cases: updatedCases });
      }
    } else {
      if (!data[arrayName]) return;
      updateWidgetData(widget.id, {
        [arrayName]: data[arrayName].filter((i: any) => i.id !== itemId),
      });
    }
    if (selectedItemId === itemId) setSelectedItemId(null);
  };

  const moveArrayItem = (
    widget: Widget,
    itemId: string,
    direction: "up" | "down",
    arrayName: string = "items",
  ) => {
    const data = widget.data as any;

    if (arrayName === "sections11_features" && data.sections11) {
      const featureSec = data.sections11.find(
        (s: any) => s.type === "features",
      );
      if (!featureSec) return;
      const items = [...(featureSec.items || [])];
      const idx = items.findIndex((i: any) => i.id === itemId);
      if (idx === -1) return;

      if (direction === "up" && idx > 0) {
        [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
      } else if (direction === "down" && idx < items.length - 1) {
        [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
      }

      const newSecs = data.sections11.map((s: any) =>
        s.type === "features" ? { ...s, items } : s,
      );
      updateWidgetData(widget.id, { sections11: newSecs });
      return;
    }

    if (widget.type === "textStructure" && (data.layout || "1") === "4") {
      const currentCases = data.cases || [];
      if (arrayName === "case_features" && selectedItemId) {
        const updatedCases = currentCases.map((c: any) => {
          if (c.id === selectedItemId) {
            const idx = parseInt(itemId.replace("f-", ""));
            const items = [...(c.features || [])];
            if (direction === "up" && idx > 0)
              [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
            else if (direction === "down" && idx < items.length - 1)
              [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
            return { ...c, features: items };
          }
          return c;
        });
        updateWidgetData(widget.id, { cases: updatedCases });
        return;
      } else if (arrayName === "case_logos" && selectedItemId) {
        const updatedCases = currentCases.map((c: any) => {
          if (c.id === selectedItemId) {
            const idx = parseInt(itemId.replace("a-", ""));
            const items = [...(c.avatars || [])];
            if (direction === "up" && idx > 0)
              [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
            else if (direction === "down" && idx < items.length - 1)
              [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
            return { ...c, avatars: items };
          }
          return c;
        });
        updateWidgetData(widget.id, { cases: updatedCases });
        return;
      }
    }

    if (!data[arrayName]) return;
    const items = [...data[arrayName]];
    const idx = items.findIndex((i: any) => i.id === itemId);
    if (idx === -1) return;

    if (direction === "up" && idx > 0) {
      [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
    } else if (direction === "down" && idx < items.length - 1) {
      [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
    }
    updateWidgetData(widget.id, { [arrayName]: items });
  };

  // Table Specific Helpers
  const addTableCol = (widget: Widget) => {
    const data = (widget as any).data;
    const updates: any = {};

    // Update standard headers/rows
    updates.headers = [...data.headers, "새 열"];
    updates.rows = data.rows.map((row: string[]) => [...row, "내용"]);

    // Update comparison fields if they exist (Layout 3, 4)
    if (data.comparisonHeaders) {
      updates.comparisonHeaders = [...data.comparisonHeaders, "새 열"];
    }
    if (data.comparisonRows) {
      updates.comparisonRows = data.comparisonRows.map((row: string[]) => [
        ...row,
        "구분",
      ]);
    }

    updateWidgetData(widget.id, updates);
  };

  const removeTableRow = (widget: Widget) => {
    const data = (widget as any).data;
    const updates: any = {};

    if (data.rows && data.rows.length > 1) {
      const newRows = [...data.rows];
      newRows.pop();
      updates.rows = newRows;
    }

    if (data.comparisonRows && data.comparisonRows.length > 1) {
      const newCompRows = [...data.comparisonRows];
      newCompRows.pop();
      updates.comparisonRows = newCompRows;
    }

    if (Object.keys(updates).length > 0) {
      updateWidgetData(widget.id, updates);
    }
  };

  const removeTableCol = (widget: Widget) => {
    const data = (widget as any).data;
    const updates: any = {};

    if (data.headers && data.headers.length > 1) {
      const newHeaders = [...data.headers];
      newHeaders.pop();
      updates.headers = newHeaders;

      updates.rows = data.rows.map((row: string[]) => {
        const r = [...row];
        r.pop();
        return r;
      });
    }

    if (data.comparisonHeaders && data.comparisonHeaders.length > 1) {
      const newCompHeaders = [...data.comparisonHeaders];
      newCompHeaders.pop();
      updates.comparisonHeaders = newCompHeaders;

      if (data.comparisonRows) {
        updates.comparisonRows = data.comparisonRows.map((row: string[]) => {
          const r = [...row];
          r.pop();
          return r;
        });
      }
    }

    if (Object.keys(updates).length > 0) {
      updateWidgetData(widget.id, updates);
    }
  };

  const handleItemReorder = (
    widgetId: string,
    draggedId: string,
    targetId: string,
  ) => {
    const sectionIndex = pageData.sections.findIndex((s) =>
      s.widgets.some((w) => w.id === widgetId),
    );
    if (sectionIndex === -1) return;

    const widgetIndex = pageData.sections[sectionIndex].widgets.findIndex(
      (w) => w.id === widgetId,
    );
    if (widgetIndex === -1) return;

    const widget = pageData.sections[sectionIndex].widgets[widgetIndex];
    if (!widget || !widget.data) return;

    // Detect array name based on widget type similar to moveArrayItem
    let arrayName = "items";
    const d = widget.data as any;
    if (widget.type === "process" || widget.type === "processCard")
      arrayName = "steps";
    else if (widget.type === "tabCarousel") arrayName = "tabs";
    else if (widget.type === "textSplit" && d.variant === "image-left-list")
      arrayName = "listItems";
    else if (widget.type === "textSection") {
      if (d.variant === "text2" || d.variant === "text3") arrayName = "items";
      else arrayName = "blocks";
    }

    const items =
      arrayName === "sections11_features"
        ? d.sections11?.find((s: any) => s.type === "features")?.items || []
        : arrayName === "case_features" && selectedItemId
          ? (
              d.cases?.find((c: any) => c.id === selectedItemId)?.features || []
            ).map((f: string, i: number) => ({ id: `f-${i}`, text: f }))
          : arrayName === "case_logos" && selectedItemId
            ? (
                d.cases?.find((c: any) => c.id === selectedItemId)?.avatars ||
                []
              ).map((a: string, i: number) => ({ id: `a-${i}`, image: a }))
            : d[arrayName];
    if (!Array.isArray(items)) return;

    const fromIndex = items.findIndex((it: any) => it.id === draggedId);
    const toIndex = items.findIndex((it: any) => it.id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);

    if (arrayName === "sections11_features") {
      const newSecs = d.sections11.map((s: any) =>
        s.type === "features" ? { ...s, items: newItems } : s,
      );
      updateWidgetData(widgetId, { sections11: newSecs });
    } else if (arrayName === "case_features" && selectedItemId) {
      const updatedCases = d.cases.map((c: any) => {
        if (c.id === selectedItemId) {
          return { ...c, features: newItems.map((it) => it.text) };
        }
        return c;
      });
      updateWidgetData(widgetId, { cases: updatedCases });
    } else if (arrayName === "case_logos" && selectedItemId) {
      const updatedCases = d.cases.map((c: any) => {
        if (c.id === selectedItemId) {
          return { ...c, avatars: newItems.map((it) => it.image) };
        }
        return c;
      });
      updateWidgetData(widgetId, { cases: updatedCases });
    } else {
      updateWidgetData(widgetId, { [arrayName]: newItems });
    }
  };

  const getWidgetName = (type: WidgetType) => {
    const names: Record<string, string> = {
      table: " 테이블",
      faq: "FAQ",
      textSection: "텍스트 섹션",
      bannerSection: "안내배너",
      cardList: "카드 리스트",
      imageArea: "이미지 영역",
    };
    return names[type] || type;
  };

  const renderSectionList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="flex items-center gap-2 font-bold text-gray-800">
            <Layers size={16} className="text-blue-600" /> 섹션 관리
          </h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase">
            {pageData.sections.length} Sections
          </span>
        </div>
        <div className="space-y-2">
          {pageData.sections.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400">추가된 섹션이 없습니다.</p>
            </div>
          ) : (
            pageData.sections.map((section, idx) => {
              const widget = section.widgets[0];
              return (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={handleDrop}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSectionId(section.id);
                    setSelectedWidgetId(widget?.id || null);
                  }}
                  className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer relative ${
                    selectedSectionId === section.id
                      ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                      : "bg-white border-gray-100 hover:border-blue-100 hover:shadow-sm"
                  } ${
                    draggedIdx === idx
                      ? "opacity-50 border-dashed bg-gray-50"
                      : ""
                  }`}
                >
                  {/* Drop Indicator */}
                  {dragOverIdx === idx && draggedIdx !== idx && (
                    <div
                      className={`absolute left-0 right-0 h-1 bg-blue-500 z-10 ${
                        draggedIdx! < idx ? "bottom-[-2px]" : "top-[-2px]"
                      }`}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={14}
                      className="text-gray-300 group-hover:text-gray-400 cursor-grab active:cursor-grabbing"
                    />
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedSectionId === section.id
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        selectedSectionId === section.id
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {idx + 1}.{" "}
                      {widget ? getWidgetName(widget.type) : "Empty Section"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(section.id, "up");
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(section.id, "down");
                      }}
                      disabled={idx === pageData.sections.length - 1}
                      className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderGlobalSectionList = () => {
    if (!isSectionListOpen) return null;
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-full right-0 mt-2 h-fit max-h-[80vh] w-[280px] bg-white shadow-2xl border border-gray-100 rounded-2xl z-[100] p-4 flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200"
      >
        <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                `}</style>
        <div className="overflow-y-auto flex-1 custom-scrollbar pr-1">
          {renderSectionList()}
        </div>
      </div>
    );
  };

  const isFloatingMode = viewport === "desktop";
  const scaledCanvasWidth = canvasWidth * canvasZoom;
  const scaledCanvasHeight = canvasContentHeight * canvasZoom;

  return (
    <div className="flex flex-col h-full bg-gray-200 overflow-hidden font-sans relative">
      {/* Top Toolbar */}
      <div className="h-[60px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-full border border-gray-100">
            <button
              onClick={() => setViewportPreset("desktop")}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                viewport === "desktop"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Desktop View"
            >
              <Monitor size={14} className="inline mr-1" /> PC
            </button>
            <button
              onClick={() => setViewportPreset("tablet")}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                viewport === "tablet"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Tablet View"
            >
              <Tablet size={14} className="inline mr-1" /> Tablet
            </button>
            <button
              onClick={() => setViewportPreset("mobile")}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                viewport === "mobile"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Mobile View"
            >
              <Smartphone size={14} className="inline mr-1" /> Mobile
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100/50 shadow-sm">
            <span>너비:</span>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) {
                  setCanvasWidth(val);
                  if (val < 768) setViewport("mobile");
                  else if (val < 1024) setViewport("tablet");
                  else setViewport("desktop");
                }
              }}
              className="w-[50px] bg-transparent text-center focus:outline-none focus:text-blue-600 font-bold"
            />
            <span>px</span>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100/50 shadow-sm"
            title="Cmd/Ctrl + +/- 또는 Cmd/Ctrl + 휠로 배율 조절, Cmd/Ctrl + 0 초기화"
          >
            <span>배율:</span>
            <span className="min-w-[40px] text-center font-bold text-gray-700">
              {Math.round(canvasZoom * 100)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className={`px-3 h-8 flex items-center justify-center gap-1.5 rounded-full transition-all group ${
              history.length === 0
                ? "bg-gray-50 text-gray-300"
                : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 border border-gray-100 shadow-sm"
            }`}
            title="실행 취소 (Cmd+Z)"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-[11px] font-bold mt-[0.5px] leading-none">
              이전으로
            </span>
          </button>
          <div className="h-4 w-px bg-gray-200"></div>
          <ImgUploadPop
            button={
              <button
                type="button"
                className="px-4 py-2 text-xs rounded-full font-bold transition-all flex items-center gap-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <Upload size={14} />
                이미지관리
              </button>
            }
          />
          <div className="relative">
            <button
              onClick={() => setIsSectionListOpen(!isSectionListOpen)}
              className={`px-4 py-2 text-xs rounded-full font-bold transition-all flex items-center gap-1.5 ${
                isSectionListOpen
                  ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100 shadow-inner"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Layers size={14} />
              섹션관리
            </button>
            {renderGlobalSectionList()}
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full font-bold transition-all"
          >
            초기화
          </button>
          <button
            onClick={() => onPreview(pageData)}
            className="px-5 py-2 text-xs bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm font-bold transition-all flex items-center gap-1.5"
          >
            <Eye size={14} />
            미리보기
          </button>
          <button
            onClick={() => onSave(pageData)}
            className="px-6 py-2 text-xs bg-gray-900 text-white rounded-full hover:bg-black hover:shadow-lg hover:-translate-y-0.5 font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Save size={14} />
            저장하기
          </button>
        </div>
      </div>

      {/* Toolbar (Widgets) */}
      <div className="h-[60px] flex items-center px-5 overflow-x-auto bg-white/50 backdrop-blur-sm border-b border-gray-100 scrollbar-hide z-50">
        <div className="flex items-center gap-2 min-w-max p-1">
          <div className="relative group mr-3">
            <span className="font-bold cursor-help text-[18px] text-blue-600 tracking-tight">
              섹션 추가
            </span>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent before:border-r-gray-800">
              원하는 섹션명을 클릭하여 추가해보세요.
            </div>
          </div>
          {[
            {
              type: "cultureLetter",
              label: "컬처레터",
              color: "text-blue-700",
            },
            {
              type: "titleBanner",
              label: "타이틀 배너",
              color: "text-blue-700",
            },
            { type: "imageArea", label: "이미지 영역", color: "text-blue-700" },
            { type: "infoBanner", label: "안내 배너", color: "text-blue-700" },
            { type: "titleText", label: "타이틀 문구", color: "text-blue-700" },
            { type: "tabButton", label: "탭버튼", color: "text-blue-700" },
            {
              type: "textStructure",
              label: "텍스트 구조",
              color: "text-blue-700",
            },
            {
              type: "iconCard",
              label: "아이콘 카드",
              color: "text-purple-700",
            },
            {
              type: "imageCard",
              label: "이미지 카드",
              color: "text-purple-700",
            },
            {
              type: "comparisonCard",
              label: "비교 카드",
              color: "text-purple-700",
            },
            {
              type: "processCard",
              label: "프로세스 카드",
              color: "text-purple-700",
            },
            { type: "stripBanner", label: "띠배너", color: "text-green-700" },
            { type: "faq", label: "FAQ", color: "text-green-700" },
            { type: "table", label: "테이블", color: "text-green-700" },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => addSection(btn.type as any)}
              className={`px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:shadow-[0_2px_8px_rgba(59,130,246,0.15)] hover:-translate-y-0.5 transition-all whitespace-nowrap shadow-sm`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex overflow-hidden bg-[#F8F9FA]`}>
        {/* Main Canvas Area */}
        <div
          ref={canvasViewportRef}
          tabIndex={-1}
          className={`flex-1 overflow-auto py-14 relative scroll-smooth bg-gray-200/50${selectedWidgetId && isSidebarOpen ? " pr-[240px]" : ""}`}
          onMouseEnter={() => setIsCanvasHovered(true)}
          onMouseLeave={() => setIsCanvasHovered(false)}
          onMouseDownCapture={(e) => {
            if (!isEditableTarget(e.target)) {
              canvasViewportRef.current?.focus();
            }
          }}
          onClick={() => {
            setSelectedSectionId(null);
            setSelectedWidgetId(null);
            setSelectedElementKey(null);
            setIsSectionListOpen(false);
          }}
          style={{
            backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div
            ref={canvasScaleWrapperRef}
            className="transition-all duration-300 ease-in-out mx-auto relative"
            style={{
              width: `${scaledCanvasWidth}px`,
              height: `${scaledCanvasHeight}px`,
            }}
          >
            <div
              ref={canvasContentRef}
              className="absolute top-0 left-0 transition-all duration-300 ease-in-out bg-white shadow-2xl h-max flex flex-col relative"
              style={{
                width: `${canvasWidth}px`,
                transform: `scale(${canvasZoom})`,
                transformOrigin: "top left",
              }}
            >
              <div
                onMouseDown={handleMouseDown}
                className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 h-20 bg-white/70 backdrop-blur border border-gray-200 hover:bg-white hover:shadow-lg rounded-full cursor-ew-resize flex items-center justify-center text-gray-400 hover:text-blue-500 z-50 transition-all shadow-sm group"
                title="너비 조절"
              >
                <GripVertical size={16} />
              </div>

            {pageData.sections.length === 0 && (
              <div className="h-80 flex flex-col items-center justify-center text-gray-400 border-4 border-dashed border-gray-300 m-4 md:m-12 rounded-3xl">
                <Plus size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-medium text-center break-keep px-4">
                  상단 메뉴에서 섹션을 추가하여 페이지를 만들어보세요
                </p>
              </div>
            )}

            {pageData.sections.map((section, idx) => (
              <div
                key={section.id}
                id={section.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSectionId(section.id);
                  setSelectedWidgetId(section.widgets[0]?.id);
                  setSelectedElementKey(null); // Fix: Reset text editing and return to section properties
                }}
                className={`relative group min-h-[50px] flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  selectedSectionId === section.id
                    ? "z-10"
                    : "hover:ring-2 hover:ring-blue-300"
                }`}
              >
                {/* Selected State Indicator */}
                {selectedSectionId === section.id && (
                  <div className="absolute inset-0 pointer-events-none z-[40] border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-blue-50/5">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] tracking-widest font-bold px-2.5 py-1 rounded-bl-lg shadow-sm flex items-center gap-1.5 pointer-events-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      EDITING
                    </div>
                  </div>
                )}
                {/* Drop Indicator Line */}
                {dragOverIdx === idx && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-50 shadow-lg scale-y-[4] origin-top transition-transform"></div>
                )}

                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all z-20 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="bg-red-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {section.widgets.map((w) => (
                  <div key={w.id}>
                    {w.type === "mainTitle" && (
                      <MainTitleRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "video" && (
                      <VideoRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "gridCard" && (
                      <GridCardRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "iconCard" && (
                      <IconCardRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: string, i?: string) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "table" && (
                      <TableRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "cardList" && (
                      <CardRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                        onItemReorder={(d, t) => handleItemReorder(w.id, d, t)}
                      />
                    )}
                    {w.type === "bannerSection" && (
                      <BannerSectionRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "titleBanner" && (
                      <TitleBannerRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k, i) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "imageArea" && (
                      <ImageAreaRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "infoBanner" && (
                      <InfoBannerRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "titleText" && (
                      <TitleTextRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "tabButton" && (
                      <TabButtonRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "textStructure" && (
                      <TextStructureRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "imageCard" && (
                      <ImageCardRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "comparisonCard" && (
                      <ComparisonCardRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "processCard" && (
                      <ProcessRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "faq" && (
                      <FaqRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "stripBanner" && (
                      <StripBannerRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                    {w.type === "cultureLetter" && (
                      <CultureLetterRenderer
                        widget={w}
                        viewport={viewport}
                        onElementSelect={(k: any, i?: any) =>
                          handleElementSelect(section.id, w.id, k, i)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Right Property Panel - 위젯이 선택되었을 때만 표시 */}
        {selectedWidgetId && (
          <div
            className={`fixed h-[calc(100%-120px)] right-0 bottom-0 z-50 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "w-[240px] translate-x-0" : "w-0 translate-x-full"
            }`}
          >
            {!isSidebarOpen && (
              <div className="absolute top-4 right-6 p-0 flex flex-col items-center z-[100]">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 rounded-full shadow-lg border border-gray-50 hover:scale-110 transition-all group"
                  title="설정 열기"
                >
                  <ChevronLeft
                    size={20}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            )}
            <PropertyPanel
              viewport={viewport}
              widget={getSelectedWidget()}
              pageData={pageData}
              selectedSectionId={selectedSectionId}
              selectedWidgetId={selectedWidgetId}
              selectedElementKey={selectedElementKey}
              selectedItemId={selectedItemId}
              isSidebarOpen={isSidebarOpen}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              setPageData={setPageData}
              setIsSidebarOpen={setIsSidebarOpen}
              setSelectedElementKey={setSelectedElementKey}
              setSelectedItemId={setSelectedItemId}
              setIsUploading={setIsUploading}
              setUploadProgress={setUploadProgress}
              updateWidgetData={updateWidgetData}
              updateWidgetStyle={updateWidgetStyle}
              addNewItem={addNewItem}
              removeArrayItem={removeArrayItem}
              moveArrayItem={moveArrayItem}
              addTableCol={addTableCol}
              removeTableRow={removeTableRow}
              removeTableCol={removeTableCol}
              pushHistory={pushHistory}
              handleItemReorder={handleItemReorder}
            />
          </div>
        )}
      </div>
      {/* Toast Message */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl z-[9999] text-sm font-medium animate-fade-in-up flex items-center gap-2 backdrop-blur-md border border-white/10 pointer-events-none">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default Builder;
