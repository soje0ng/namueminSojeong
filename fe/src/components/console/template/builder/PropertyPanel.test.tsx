import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  ArrowRightLeft,
  ArrowUp,
  ArrowDown,
  Check,
  GripVertical,
  Image as ImageIcon,
  Video,
  Upload,
  Smartphone,
} from "lucide-react";

import { PageData, Widget, WidgetType } from "@/types/console/template";
import { HtmlCodeEditor } from "./HtmlCodeEditor";
import { ElementEditor } from "./ElementEditor";
import ImgUploadPop from "@/components/console/popup/ImgUploadPop";
import { reorderItems, updateItemInArray } from "@/utils/template/itemUtils";
import { usePopupStore } from "@/store/console/usePopupStore";
import TextStructure6Manager from "../widgets/TextStructure6Manager";
import TextStructure7Manager from "../widgets/TextStructure7Manager";
import ComparisonDescManager from "./ComparisonDescManager";
import TextStructure8Manager from "../widgets/TextStructure8Manager";
import TextStructure11Manager from "../widgets/TextStructure11Manager";
import {
  TEXT_STRUCTURE_6_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_7_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_8_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_11_DEFAULT_SECTIONS,
} from "../widgets/TextStructureRenderer";

export interface PropertyPanelProps {
  viewport: "desktop" | "tablet" | "mobile";
  widget: Widget | null;
  pageData: PageData;
  selectedSectionId: string | null;
  selectedWidgetId: string | null;
  selectedElementKey: string | null;
  selectedItemId: string | null;
  isSidebarOpen: boolean;
  isUploading: boolean;
  uploadProgress: number;
  setPageData: React.Dispatch<React.SetStateAction<PageData>>;
  setIsSidebarOpen: (val: boolean) => void;
  setSelectedElementKey: (key: string | null) => void;
  setSelectedItemId: (id: string | null) => void;
  setIsUploading: (val: boolean) => void;
  setUploadProgress: (val: number) => void;
  updateWidgetData: (id: string, data: any) => void;
  updateWidgetStyle: (id: string, newStyle: any) => void;
  addNewItem: (widget: Widget) => void;
  removeArrayItem: (widget: Widget, itemId: string, arrayName?: string) => void;
  moveArrayItem: (
    widget: Widget,
    itemId: string,
    direction: "up" | "down",
    arrayName?: string,
  ) => void;
  addTableCol: (widget: Widget) => void;
  removeTableRow: (widget: Widget) => void;
  removeTableCol: (widget: Widget) => void;
  pushHistory: () => void;
  handleItemReorder: (
    widgetId: string,
    draggedId: string,
    targetId: string,
  ) => void;
}

const getWidgetName = (type: WidgetType) => {
  const names: Record<string, string> = {
    titleBanner: "타이틀 배너",
    imageArea: "이미지 영역",
    infoBanner: "안내 배너",
    titleText: "타이틀 문구",
    tabButton: "탭버튼",
    textStructure: "텍스트 구조",
    iconCard: "아이콘 카드",
    imageCard: "이미지 카드",
    comparisonCard: "비교 카드",
    processCard: "프로세스 카드",
    stripBanner: "띠배너",
    faq: "FAQ",
    table: "테이블",
  };
  return names[type] || type;
};

const getSpacingInputValue = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return "0";
  return value.toString().replace("px", "");
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  viewport,
  widget,
  pageData,
  selectedSectionId,
  selectedWidgetId,
  selectedElementKey,
  selectedItemId,
  isSidebarOpen,
  isUploading,
  uploadProgress,
  setPageData,
  setIsSidebarOpen,
  setSelectedElementKey,
  setSelectedItemId,
  setIsUploading,
  setUploadProgress,
  updateWidgetData,
  updateWidgetStyle,
  addNewItem,
  removeArrayItem,
  moveArrayItem,
  addTableCol,
  removeTableRow,
  removeTableCol,
  pushHistory,
  handleItemReorder,
}) => {
  const { setConfirmPop } = usePopupStore();
  // 아이템 드래그 상태 (내부 관리)
  const [itemDraggedIdx, setItemDraggedIdx] = useState<number | null>(null);
  const [itemDragOverIdx, setItemDragOverIdx] = useState<number | null>(null);

  // 아이템 드롭 핸들러
  const handleItemDrop = (arrayName: string) => {
    if (
      widget &&
      itemDraggedIdx !== null &&
      itemDragOverIdx !== null &&
      itemDraggedIdx !== itemDragOverIdx
    ) {
      let items: any[] = [];
      if (arrayName === "case_features" && selectedItemId) {
        const cases = (widget.data as any).cases || [];
        const targetCase = cases.find((c: any) => c.id === selectedItemId);
        items = targetCase?.features || [];
      } else if (arrayName === "case_logos" && selectedItemId) {
        const cases = (widget.data as any).cases || [];
        const targetCase = cases.find((c: any) => c.id === selectedItemId);
        items = targetCase?.avatars || [];
      } else {
        items = (widget.data as any)[arrayName] || [];
      }

      const draggedId = items[itemDraggedIdx]?.id || itemDraggedIdx.toString();
      const targetId = items[itemDragOverIdx]?.id || itemDragOverIdx.toString();

      if (draggedId && targetId) {
        handleItemReorder(widget.id, draggedId, targetId);
      }
    }
    setItemDraggedIdx(null);
    setItemDragOverIdx(null);
  };

  if (!widget) return null;

  // Detect List Type
  let listArrayName: string | null = null;
  if (
    widget.type === "process" ||
    widget.type === "processCard" ||
    (widget.data as any).steps
  )
    listArrayName = "steps";
  else if (
    (widget.data as any).items ||
    ["video", "faq", "bannerSection"].includes(widget.type) ||
    (widget.type === "textSection" &&
      ["text2", "text3"].includes((widget.data as any).variant))
  )
    listArrayName = "items";
  else if ((widget.data as any).listItems) listArrayName = "listItems";
  else if ((widget.data as any).blocks) listArrayName = "blocks";

  // comparisonCard는 좌/우 개별 desc 관리 사용 → 기존 items 구조 관리 숨김
  if (widget.type === "comparisonCard") listArrayName = null;

  // 텍스트 구조 레이아웃 11 특징 항목 연동용 특별 키
  if (
    widget.type === "textStructure" &&
    ((widget.data as any).layout || "1") === "11"
  ) {
    listArrayName = "sections11_features";
  }

  // 텍스트 구조 레이아웃 4 케이스 내부 항목 관리용 특별 키
  if (
    widget.type === "textStructure" &&
    ((widget.data as any).layout || "1") === "4"
  ) {
    if (selectedElementKey === "caseFeatures") listArrayName = "case_features";
    else if (selectedElementKey === "caseLogos") listArrayName = "case_logos";
    else listArrayName = "cases"; // 기본적으로 케이스 목록 관리
  }

  return (
    <div
      className={`h-full flex flex-col bg-white/90 backdrop-blur-xl shadow-2xl border-l border-white/50 ring-1 ring-black/5 overflow-hidden`}
    >
      <div
        className={`flex-1 overflow-y-auto p-4 custom-scrollbar hover:scroll-visible`}
      >

        {/* 섹션 설정 패널 */}
        {!selectedElementKey && (
          <div className={`space-y-4${!isSidebarOpen ? " hidden" : ""}`}>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-1">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hover:bg-gray-100 p-1 rounded transition-colors shrink-0"
              >
                {isSidebarOpen ? (
                  <ChevronRight size={16} className="text-blue-500" />
                ) : (
                  <ChevronLeft size={16} className="text-blue-500" />
                )}
              </button>
              <h3 className="font-bold text-sm text-gray-900 truncate">
                {getWidgetName(widget.type)}
              </h3>
            </div>

            {/* Generic Layout Settings for New Widgets */}
            {[
              "titleBanner",
              "infoBanner",
              "titleText",
              "textStructure",
              "iconCard",
              "imageCard",
              "comparisonCard",
              "processCard",
              "stripBanner",
              "faq",
              "table",
            ].includes(widget.type) && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  {getWidgetName(widget.type)} 레이아웃 설정
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).layout || "1"}
                  onChange={(e) => {
                    const newLayout = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃을 변경하면 현재 입력된 데이터가 초기화될 수 있습니다. <br/>계속하시겠습니까?",
                      2,
                      () => {
                        pushHistory();
                        const updates: any = { layout: newLayout };
                        // Add table-specific initialization
                        if (widget.type === "table") {
                          if (
                            ["3", "4"].includes(newLayout) &&
                            !(widget.data as any).comparisonHeaders
                          ) {
                            updates.comparisonHeaders = [
                              "구분",
                              "구분",
                              "구분",
                            ];
                            updates.comparisonRows = [
                              ["구분", "구분", "구분"],
                              ["구분", "구분", "구분"],
                              ["구분", "구분", "구분"],
                              ["구분", "구분", "구분"],
                            ];
                          }
                        }
                        updateWidgetData(widget.id, updates);
                      },
                    );
                  }}
                >
                  {Array.from({
                    length:
                      widget.type === "textStructure"
                        ? 11
                        : widget.type === "iconCard"
                          ? 6
                          : widget.type === "imageCard"
                            ? 6
                            : widget.type === "infoBanner"
                              ? 5
                              : widget.type === "titleText"
                                ? 4
                                : widget.type === "table"
                                  ? 4
                                  : widget.type === "titleBanner"
                                    ? 3
                                    : widget.type === "processCard"
                                      ? 3
                                      : widget.type === "comparisonCard"
                                        ? 2
                                        : widget.type === "stripBanner"
                                          ? 2
                                          : 1,
                  }).map((_, i) => (
                    <option key={i + 1} value={`${i + 1}`}>
                      {widget.type === "table"
                        ? `테이블 0${i + 1}`
                        : widget.type === "iconCard"
                          ? `아이콘 카드 레이아웃 ${i + 1}`
                          : `${getWidgetName(widget.type)} 레이아웃 ${i + 1}`}
                    </option>
                  ))}
                </select>

                {/* 테이블 02: 좌우 반전 토글 */}
                {widget.type === "table" &&
                  ((widget.data as any).layout === "2" ||
                    (widget.data as any).variant === "table02") && (
                    <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-lg">
                      <label className="text-sm text-gray-700">
                        테이블/이미지 좌우 반전
                      </label>
                      <button
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          (widget.data as any).reverseLayout
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => {
                          updateWidgetData(widget.id, {
                            reverseLayout: !(widget.data as any).reverseLayout,
                          });
                        }}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            (widget.data as any).reverseLayout
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* Specific Widget Type Controls at Top */}
            {/* Section Structure Toggle */}
            {["cardList"].includes(widget.type) && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  섹션 구조
                </label>
                <div className="flex p-1 bg-gray-50 rounded-xl w-full border border-gray-100/50">
                  <button
                    onClick={() =>
                      updateWidgetData(widget.id, { layout: "horizontal" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      ((widget.data as any).layout || "horizontal") ===
                      "horizontal"
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    가로형
                  </button>
                  <button
                    onClick={() =>
                      updateWidgetData(widget.id, { layout: "vertical" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      (widget.data as any).layout === "vertical"
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    세로형
                  </button>
                </div>
              </div>
            )}

            {widget.type === "process" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  프로세스 구조
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).variant || "horizontal"}
                  onChange={(e) => {
                    const newVariant = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃을 변경하면 현재 입력된 데이터가 초기화될 수 있습니다. <br/>계속하시겠습니까?",
                      2,
                      () => {
                        updateWidgetData(widget.id, { variant: newVariant });
                      },
                    );
                  }}
                >
                  <option value="horizontal">기본형 (3열)</option>
                  <option value="vertical">세로 정렬형 (4열)</option>
                  <option value="number">번호 강조형</option>
                  <option value="layout1">프로세스 레이아웃 01</option>
                </select>

                <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">
                      카드 내 이미지 표시
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      이미지를 숨기거나 노출할 수 있습니다.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const current = (widget.data as any).showImage !== false;
                      updateWidgetData(widget.id, { showImage: !current });
                    }}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      (widget.data as any).showImage !== false
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        (widget.data as any).showImage !== false
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {["iconCard", "imageCard", "process", "processCard"].includes(
              widget.type,
            ) &&
              viewport === "desktop" && (
                <div className="space-y-2 mt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    카드 배치 (PC)
                  </label>
                  <div className="flex p-1 bg-gray-50 rounded-xl w-full border border-gray-100/50">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          updateWidgetData(widget.id, { itemsPerRow: num })
                        }
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          ((widget.data as any).itemsPerRow ||
                            (widget.type === "imageCard"
                              ? 3
                              : widget.type === "process" &&
                                  (widget.data as any).variant === "vertical"
                                ? 4
                                : 3)) === num
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {num}개
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {widget.type === "video" && (
              <div className="space-y-2 mt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  영상 배치 (PC)
                </label>
                <div className="flex p-1 bg-gray-50 rounded-xl w-full border border-gray-100/50">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        updateWidgetData(widget.id, { itemsPerRow: num })
                      }
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        ((widget.data as any).itemsPerRow ||
                          (((widget.data as any).layout || "horizontal") ===
                          "horizontal"
                            ? 2
                            : 3)) === num
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {num}개
                    </button>
                  ))}
                </div>
              </div>
            )}

            {widget.type === "comingSoon" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  준비중 타입
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).variant || "content"}
                  onChange={(e) => {
                    const newVariant = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃 타입을 변경하시겠습니까? <br/>데이터가 기본값으로 초기화됩니다.",
                      2,
                      () => {
                        pushHistory();
                        if (newVariant === "page") {
                          updateWidgetData(widget.id, {
                            variant: "page",
                            iconUrl: "/images/placeholder/loading.png",
                            contentTitle: "페이지 준비중입니다.",
                            contentDesc:
                              "현재 페이지를 준비하고 있으니 조금만 기다려 주세요.<br>감사합니다.",
                            layout: "vertical",
                          });
                        } else {
                          updateWidgetData(widget.id, {
                            variant: "content",
                            iconUrl: "/images/placeholder/loading2.png",
                            contentTitle: "콘텐츠 준비중입니다.",
                            contentDesc:
                              "현재 콘텐츠를 준비하고 있으니 조금만 기다려 주세요.<br />감사합니다.",
                            layout: "horizontal",
                          });
                        }
                      },
                    );
                  }}
                >
                  <option value="content">콘텐츠 준비중</option>
                  <option value="page">페이지 준비중</option>
                </select>
                <p className="text-[10px] text-blue-400/80 mt-1 pl-1">
                  * 준비중 섹션의 노출 형식을 선택하세요.
                </p>
              </div>
            )}

            {widget.type === "cardList" && viewport === "desktop" && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  카드 타입 설정
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).variant || "image-card"}
                  onChange={(e) => {
                    const newVariant = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃 타입을 변경하시겠습니까? <br/>데이터는 유지되지만 스타일이 달라질 수 있습니다.",
                      2,
                      () => {
                        updateWidgetData(widget.id, { variant: newVariant });
                      },
                    );
                  }}
                >
                  <option value="image-card">이미지 카드형</option>
                  <option value="bg-image">배경 이미지형</option>
                  <option value="text-card">텍스트 카드형</option>
                </select>

                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 mt-4">
                  카드 배치
                </label>
                <div className="flex p-1 bg-gray-50 rounded-xl w-full border border-gray-100/50">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        updateWidgetData(widget.id, { itemsPerRow: num })
                      }
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        ((widget.data as any).itemsPerRow || 3) === num
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {num}개
                    </button>
                  ))}
                </div>
              </div>
            )}

            {widget.type === "bannerSection" && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  안내 배너 레이아웃 설정
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).variant || "banner1"}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃을 변경하면 현재 입력된 데이터가 초기화될 수 있습니다. <br/>계속하시겠습니까?",
                      2,
                      () => {
                        pushHistory();

                        // Switching bannerSection variants
                        if (newVal === "banner2") {
                          updateWidgetData(widget.id, {
                            variant: "banner2",
                            title: "배너 타이틀",
                            desc: "보다 정확한 자격 판정을 위해 양식을 다운받아 작성하여, 이메일(likweb@likeweb.com)로 보내 주시면<br/>24시간 이내 연락을 드리겠습니다.<br/>고객님의 소중한 정보는 안전하게 보장되오니, 정확한 판정을 위해 상세하기 기재 바랍니다.",
                            buttonText: "버튼 링크를 연결해보세요.",
                            items: [{ id: "b2-1", link: "#" }],
                          });
                        } else if (newVal === "banner3") {
                          updateWidgetData(widget.id, {
                            variant: "banner3",
                            title: "배너 타이틀",
                            titleStyle: {
                              color: "#ffffff",
                              fontWeight: "600",
                            },
                            desc: "보다 정확한 자격 판정을 위해 양식을 다운받아 작성하여, 이메일(likweb@likeweb.com)로 보내 주시면<br/>24시간 이내 연락을 드리겠습니다.<br/>고객님의 소중한 정보는 안전하게 보장되오니, 정확한 판정을 위해 상세하기 기재 바랍니다.",
                            descStyle: { color: "#ffffff" },
                            image: "/images/placeholder/banner3_1.png",
                            items: [
                              {
                                id: "b3-1",
                                text: "버튼 링크를 연결해보세요.",
                                link: "#",
                                icon: "download",
                              },
                              {
                                id: "b3-2",
                                text: "버튼 링크를 연결해보세요.",
                                link: "#",
                                icon: "download",
                              },
                            ],
                          });
                        } else {
                          updateWidgetData(widget.id, {
                            variant: "banner1",
                            title: "배너 타이틀",
                            desc: "보다 정확한 자격 판정을 위해...",
                            items: [
                              {
                                id: `i-${Date.now()}-1`,
                                image: "/images/placeholder/img1.png",
                                link: "#",
                              },
                              {
                                id: `i-${Date.now()}-2`,
                                image: "/images/placeholder/img2.png",
                                link: "#",
                              },
                              {
                                id: `i-${Date.now()}-3`,
                                image: "/images/placeholder/img3.png",
                                link: "#",
                              },
                              {
                                id: `i-${Date.now()}-4`,
                                image: "/images/placeholder/img4.png",
                                link: "#",
                              },
                            ],
                          });
                        }
                      },
                    );
                  }}
                >
                  <option value="banner1">안내배너 1 (아이콘 그리드)</option>
                  <option value="banner2">
                    안내배너 2 (좌측 텍스트 + 우측 버튼)
                  </option>
                  <option value="banner3">
                    안내배너 3 (그라디언트 + 2버튼)
                  </option>
                </select>
              </div>
            )}

            {widget.type !== "codeSection" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    {widget.type === "bannerSection"
                      ? "배너배경 설정"
                      : "배경 설정"}
                  </label>
                  <div className="flex p-1 bg-gray-100 rounded-lg w-full mb-3">
                    <button
                      onClick={() =>
                        updateWidgetStyle(widget.id, {
                          backgroundImage: undefined,
                        })
                      }
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                        widget.style?.backgroundImage === undefined
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      색상
                    </button>
                    <button
                      onClick={() => {
                        if (widget.style?.backgroundImage === undefined) {
                          updateWidgetStyle(widget.id, {
                            backgroundImage: "",
                          });
                        }
                      }}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                        widget.style?.backgroundImage !== undefined
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      이미지
                    </button>
                  </div>

                  {widget.style?.backgroundImage === undefined ? (
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-50 hover:bg-gray-100 transition-colors">
                      <input
                        type="color"
                        className="w-10 h-10 rounded-lg border-none overflow-hidden cursor-pointer shadow-sm hover:scale-105 transition-transform"
                        value={
                          widget.style?.backgroundColor ||
                          (widget.type === "bannerSection" &&
                          (widget.data as any).variant === "banner2"
                            ? "#F8F6F2"
                            : widget.type === "bannerSection" &&
                                (widget.data as any).variant === "banner1"
                              ? "#012E58"
                              : widget.type === "bannerSection" &&
                                  (widget.data as any).variant === "banner3"
                                ? "#21568E"
                                : widget.type === "stripBanner" &&
                                    (widget.data as any).layout === "2"
                                  ? "#01355F"
                                  : widget.type === "stripBanner"
                                    ? "#295E92"
                                    : "#ffffff")
                        }
                        onChange={(e) =>
                          updateWidgetStyle(widget.id, {
                            backgroundColor: e.target.value,
                          })
                        }
                      />
                      <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-100 uppercase">
                        {widget.style?.backgroundColor ||
                          (widget.type === "bannerSection" &&
                          (widget.data as any).variant === "banner2"
                            ? "#F8F6F2"
                            : widget.type === "bannerSection" &&
                                (widget.data as any).variant === "banner1"
                              ? "#012E58"
                              : widget.type === "bannerSection" &&
                                  (widget.data as any).variant === "banner3"
                                ? "#21568E"
                                : widget.type === "stripBanner" &&
                                    (widget.data as any).layout === "2"
                                  ? "#01355F"
                                  : widget.type === "stripBanner"
                                    ? "#295E92"
                                    : "#ffffff")}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* 이미지 선택 팝업 */}
                      <ImgUploadPop
                        onSelect={(url) =>
                          updateWidgetStyle(widget.id, {
                            backgroundImage: url,
                          })
                        }
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 text-sm">
                                이미지 선택하기
                              </p>
                              <p className="text-[10px] text-gray-400">
                                서버에 업로드된 이미지 선택
                              </p>
                            </div>
                          </div>
                        }
                      />

                      {/* 구분선 */}
                      <div className="flex items-center gap-2 py-2">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                          또는 URL 직접 입력
                        </span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>

                      {/* URL 직접 입력 */}
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100"
                        placeholder="이미지 주소를 입력하세요"
                        value={widget.style?.backgroundImage || ""}
                        onChange={(e) =>
                          updateWidgetStyle(widget.id, {
                            backgroundImage: e.target.value,
                          })
                        }
                      />
                      <p className="text-[10px] text-gray-400">
                        * 배경 이미지는 영역에 맞춰 가득 채워집니다 (Cover).
                      </p>
                    </div>
                  )}
                </div>

                {widget.type === "stripBanner" && (
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      전체 섹션 클릭 링크 (새 창)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100"
                      placeholder="https://example.com"
                      value={(widget.data as any).targetUrl || ""}
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          targetUrl: e.target.value,
                        })
                      }
                    />
                    <p className="text-[10px] text-gray-400 pl-1 mt-1">
                      * 입력 시 전체 섹션을 클릭하면 새 창으로 이동합니다.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    상하여백
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Top"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100 text-center"
                      value={getSpacingInputValue(widget.style?.paddingTop)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "")
                          updateWidgetStyle(widget.id, { paddingTop: 0 });
                        else if (!isNaN(Number(val)) && val.trim() !== "")
                          updateWidgetStyle(widget.id, {
                            paddingTop: val + "px",
                          });
                        else updateWidgetStyle(widget.id, { paddingTop: val });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Bottom"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100 text-center"
                      value={getSpacingInputValue(widget.style?.paddingBottom)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "")
                          updateWidgetStyle(widget.id, { paddingBottom: 0 });
                        else if (!isNaN(Number(val)) && val.trim() !== "")
                          updateWidgetStyle(widget.id, {
                            paddingBottom: val + "px",
                          });
                        else
                          updateWidgetStyle(widget.id, { paddingBottom: val });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {widget.type === "textSection" && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  텍스트 레이아웃 설정
                </label>
                <select
                  className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                  value={(widget.data as any).variant || "sticky-left"}
                  onChange={(e) => {
                    const newVariant = e.target.value;
                    setConfirmPop(
                      true,
                      "레이아웃을 변경하시겠습니까? <br/>현재 입력된 전용 데이터가 모두 초기화됩니다.",
                      2,
                      () => {
                        pushHistory();

                        // Default Data Templates for each variant
                        let resetData: any = { variant: newVariant };

                        if (newVariant === "text2") {
                          resetData = {
                            variant: "text2",
                            topImage:
                              "https://selenaimin.likeweb.co.kr/images/banner_img3.jpg",
                            items: [
                              {
                                id: `item-${Date.now()}-1`,
                                number: "01",
                                title: "라이크웹의 프로젝트명",
                                subTitle: "타이틀 제목 영역",
                                desc: "텍스트를 더블클릭해서 마음껏 바꿔보세요! 기획부터 꼼꼼한 유지보수까지, 라이크웹이 늘 곁에서 함께할게요.",
                              },
                              {
                                id: `item-${Date.now()}-2`,
                                number: "02",
                                title: "두 번째 프로젝트",
                                subTitle: "서브타이틀영역입니다.",
                                desc: "여기에 설명을 입력하세요.",
                              },
                            ],
                          };
                        } else if (newVariant === "text3") {
                          resetData = {
                            variant: "text3",
                            title: "좌측타이틀영역",
                            subTitle: "서브타이틀영역입니다.",
                            items: [
                              {
                                id: `item-${Date.now()}-1`,
                                number: "1",
                                title: "라이크웹의 프로젝트명",
                                desc: "라이크웹 대타이틀 영역 프로젝트는 미국 내 최고급 휴양지이자 스키 명소인 콜로라도 아스펜에 위치한 31개 유닛의 라이크웹 서브타이틀 영역 사업입니다.",
                                icon: "/images/placeholder/icon.png",
                              },
                              {
                                id: `item-${Date.now()}-2`,
                                number: "2",
                                title: "두 번째 서비스",
                                desc: "여기에 설명을 입력하세요.",
                                icon: "/images/placeholder/icon.png",
                              },
                            ],
                          };
                        } else {
                          // Standard / Sticky Left Defaults
                          resetData = {
                            variant: newVariant,
                            title: "좌측타이틀영역",
                            subTitle: "서브타이틀영역입니다.",
                            blocks: [
                              {
                                id: "b1",
                                type: "image",
                                url: "/images/placeholder/banner_img1.jpg",
                                style: { objectFit: "cover" },
                              },
                              {
                                id: "b2",
                                type: "text",
                                text: "텍스트 내용을 입력하세요.",
                              },
                              {
                                id: "b3",
                                type: "heading",
                                text: "체크리스트 항목",
                                iconType: "check",
                              },
                              {
                                id: "b4",
                                type: "text",
                                text: "긴 설명 텍스트를 입력할 수 있습니다.",
                              },
                            ],
                          };
                        }

                        updateWidgetData(widget.id, resetData);
                      },
                    );
                  }}
                >
                  <option value="sticky-left">좌측 고정형</option>
                  <option value="standard">기본형</option>
                  <option value="text2">텍스트 2</option>
                  <option value="text3">텍스트 3</option>
                </select>
              </div>
            )}

            {(widget.type === "table" ||
              (!!listArrayName &&
                !(
                  (widget.type === "bannerSection" ||
                    widget.type === "banner2") &&
                  (widget.data as any).variant === "banner2"
                ))) && (
              <>
                <hr className="border-gray-200" />
                {/* Structure Management */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                    {widget.type === "process"
                      ? "카드 및 방향 아이콘 설정"
                      : "구조 관리"}
                  </h4>

                  {/* 항목 간격 (Gap) 설정 */}
                  {(listArrayName ||
                    widget.type === "gridCard" ||
                    widget.type === "iconCard") &&
                    widget.type !== "textStructure" && (
                      <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-gray-100 mb-2">
                        <span className="text-xs font-bold text-gray-500">
                          항목 간격
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="80"
                            step="4"
                            value={
                              parseInt(
                                (widget.style?.gap || "0").replace("px", ""),
                              ) || 0
                            }
                            onChange={(e) =>
                              updateWidgetStyle(widget.id, {
                                gap: `${e.target.value}px`,
                              })
                            }
                            className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="text-[10px] w-8 text-right font-mono text-gray-400">
                            {widget.style?.gap || "0px"}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* textStructure 레이아웃 1 전용: 열 수 + 항목 간격 */}
                  {widget.type === "textStructure" &&
                    ((widget as any).data.layout || "1") === "1" && (
                      <div className="space-y-2 mb-2">
                        <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                          <span className="text-xs font-bold text-gray-500">
                            항목 열 수
                          </span>
                          <div className="flex gap-1">
                            {[1, 2].map((col) => (
                              <button
                                key={col}
                                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                                  ((widget as any).data.itemColumns ?? 1) ===
                                  col
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                                onClick={() =>
                                  updateWidgetData(widget.id, {
                                    itemColumns: col,
                                  })
                                }
                              >
                                {col}열
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                          <span className="text-xs font-bold text-gray-500">
                            항목 간격
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              className="w-16 bg-white border border-gray-200 p-1.5 rounded-lg text-xs text-center font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
                              value={(widget as any).data.itemGap ?? 20}
                              onChange={(e) =>
                                updateWidgetData(widget.id, {
                                  itemGap: Number(e.target.value),
                                })
                              }
                            />
                            <span className="text-[10px] font-mono text-gray-400">
                              px
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  {widget.type === "table" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addNewItem(widget)}
                        className="bg-blue-50 text-blue-600 border border-blue-200 p-2 rounded text-xs font-bold hover:bg-blue-100"
                      >
                        + 행 추가
                      </button>
                      <button
                        onClick={() => addTableCol(widget)}
                        className="bg-blue-50 text-blue-600 border border-blue-200 p-2 rounded text-xs font-bold hover:bg-blue-100"
                      >
                        + 열 추가
                      </button>
                      <button
                        onClick={() => removeTableRow(widget)}
                        className="bg-red-50 text-red-600 border border-red-200 p-2 rounded text-xs font-bold hover:bg-red-100"
                      >
                        - 행 삭제
                      </button>
                      <button
                        onClick={() => removeTableCol(widget)}
                        className="bg-red-50 text-red-600 border border-red-200 p-2 rounded text-xs font-bold hover:bg-red-100"
                      >
                        - 열 삭제
                      </button>
                    </div>
                  ) : listArrayName ? (
                    <>
                      {/* 카드 전체 배열 설정 (구조관리 섹션 상단) */}
                      {widget.type === "imageCard" &&
                        ["1", "2", "3", "4", "5"].includes(
                          (widget.data as any).layout || "1",
                        ) && (
                          <div className="flex flex-col gap-1.5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl mb-4 shadow-sm">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              전체 배열 설정 (한 줄에 보여줄 개수)
                            </label>
                            <div className="grid grid-cols-4 gap-1">
                              {(["4", "5"].includes(
                                (widget.data as any).layout || "1",
                              )
                                ? ["1", "2"]
                                : ["1", "2", "3", "4"]
                              ).map((num) => (
                                <button
                                  key={num}
                                  onClick={() =>
                                    updateWidgetData(widget.id, {
                                      itemsPerRow: num,
                                    })
                                  }
                                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                    ((widget.data as any).itemsPerRow ||
                                      ((widget.data as any).layout === "1"
                                        ? "3"
                                        : (widget.data as any).layout === "4"
                                          ? "2"
                                          : (widget.data as any).layout === "5"
                                            ? "2"
                                            : "4")) === num
                                      ? "bg-blue-500 text-white border-blue-600 shadow-md transform scale-105"
                                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                                  }`}
                                >
                                  {num}열
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {widget.type === "video" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const id = `video-${Date.now()}`;
                              const newItem = {
                                id,
                                type: "video",
                                url: "https://www.youtube.com/watch?v=jicErY0RiMg",
                                title: "새 영상",
                                desc: "영상 설명",
                              };
                              updateWidgetData(widget.id, {
                                items: [
                                  ...((widget.data as any).items || []),
                                  newItem,
                                ],
                              });
                            }}
                            className="flex-1 bg-blue-600 text-white p-2 rounded text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-1 shadow-sm"
                          >
                            영상 추가
                          </button>
                          <button
                            onClick={() => {
                              const id = `image-${Date.now()}`;
                              const newItem = {
                                id,
                                type: "image",
                                url: "/images/placeholder/default_new.jpg",
                                title: "새 이미지",
                                desc: "이미지 설명",
                              };
                              updateWidgetData(widget.id, {
                                items: [
                                  ...((widget.data as any).items || []),
                                  newItem,
                                ],
                              });
                            }}
                            className="flex-1 bg-purple-600 text-white p-2 rounded text-sm font-bold hover:bg-purple-700 flex items-center justify-center gap-1 shadow-sm"
                          >
                            이미지 추가
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addNewItem(widget)}
                          className="w-full bg-blue-50 text-blue-600 border border-blue-200 p-2 rounded text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1"
                        >
                          <Plus size={14} /> 항목 추가
                        </button>
                      )}
                      <div className="space-y-1 max-h-[250px] overflow-y-auto border rounded p-2 bg-gray-50 mt-2">
                        {(() => {
                          let arr: any[] = [];
                          if (listArrayName === "sections11_features") {
                            const secs = (widget.data as any).sections11 || [];
                            const featureSec = secs.find(
                              (s: any) => s.type === "features",
                            );
                            arr = featureSec?.items || [];
                          } else if (
                            listArrayName === "case_features" &&
                            selectedItemId
                          ) {
                            const cases = (widget.data as any).cases || [];
                            const targetCase = cases.find(
                              (c: any) => c.id === selectedItemId,
                            );
                            arr = (targetCase?.features || []).map(
                              (f: string, i: number) => ({
                                id: `f-${i}`,
                                text: f,
                              }),
                            );
                          } else if (
                            listArrayName === "case_logos" &&
                            selectedItemId
                          ) {
                            const cases = (widget.data as any).cases || [];
                            const targetCase = cases.find(
                              (c: any) => c.id === selectedItemId,
                            );
                            arr = (targetCase?.avatars || []).map(
                              (a: string, i: number) => ({
                                id: `a-${i}`,
                                image: a,
                              }),
                            );
                          } else {
                            arr = (widget.data as any)[listArrayName!] || [];
                          }
                          if (listArrayName === "cases") {
                            const cases = (widget.data as any)?.cases || [];
                            return cases.map((c: any, idx: number) => {
                              if (!c) return null;
                              const isSelected = selectedItemId === c.id;
                              return (
                                <div
                                  key={c.id || idx}
                                  className={`flex flex-col gap-3 bg-white p-3 rounded-xl shadow-sm border transition-all ${
                                    isSelected
                                      ? "border-blue-400 ring-2 ring-blue-50"
                                      : "border-gray-100 hover:border-blue-200"
                                  }`}
                                >
                                  {/* 상단: 이름 및 기본 관리 */}
                                  <div className="flex items-center gap-2">
                                    <GripVertical
                                      size={14}
                                      className="text-gray-300 cursor-grab shrink-0"
                                    />
                                    <input
                                      className="flex-1 min-w-0 text-xs font-bold text-gray-700 bg-transparent border-none outline-none focus:ring-0 p-0"
                                      value={c.title || ""}
                                      onChange={(e) => {
                                        const updated = cases.map((it: any) =>
                                          it.id === c.id
                                            ? { ...it, title: e.target.value }
                                            : it,
                                        );
                                        updateWidgetData(widget.id, {
                                          cases: updated,
                                        });
                                      }}
                                      onFocus={() => {
                                        setSelectedItemId(c.id);
                                        setSelectedElementKey("caseTitle");
                                      }}
                                      placeholder={`케이스 ${idx + 1}`}
                                    />
                                    <div className="flex items-center gap-1 bg-gray-50 rounded p-1">
                                      <button
                                        onClick={() =>
                                          moveArrayItem(
                                            widget,
                                            c.id,
                                            "up",
                                            "cases",
                                          )
                                        }
                                        className={`p-1 rounded ${idx === 0 ? "text-gray-200" : "text-gray-400 hover:text-blue-500"}`}
                                        disabled={idx === 0}
                                      >
                                        <ArrowUp size={12} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          moveArrayItem(
                                            widget,
                                            c.id,
                                            "down",
                                            "cases",
                                          )
                                        }
                                        className={`p-1 rounded ${idx === cases.length - 1 ? "text-gray-200" : "text-gray-400 hover:text-blue-500"}`}
                                        disabled={idx === cases.length - 1}
                                      >
                                        <ArrowDown size={12} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          const updated = cases.filter(
                                            (it: any) => it.id !== c.id,
                                          );
                                          updateWidgetData(widget.id, {
                                            cases: updated,
                                          });
                                        }}
                                        className="text-red-300 hover:text-red-500 p-1"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* 하단 제어부: 반전 및 개수 조절 */}
                                  <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-gray-50">
                                    <button
                                      onClick={() => {
                                        const updated = cases.map((it: any) =>
                                          it.id === c.id
                                            ? {
                                                ...it,
                                                imageOnRight: !it.imageOnRight,
                                              }
                                            : it,
                                        );
                                        updateWidgetData(widget.id, {
                                          cases: updated,
                                        });
                                      }}
                                      className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                        c.imageOnRight
                                          ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                                          : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                                      }`}
                                    >
                                      <ArrowRightLeft size={12} />
                                      좌우 반전{" "}
                                      {c.imageOnRight ? "(우)" : "(좌)"}
                                    </button>

                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between px-1">
                                        <span className="text-[9px] font-bold text-gray-400">
                                          체크리스트
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => {
                                              const updated = cases.map(
                                                (it: any) => {
                                                  if (it.id === c.id) {
                                                    const feats = [
                                                      ...(it.features || []),
                                                    ];
                                                    if (feats.length > 0)
                                                      feats.pop();
                                                    return {
                                                      ...it,
                                                      features: feats,
                                                    };
                                                  }
                                                  return it;
                                                },
                                              );
                                              updateWidgetData(widget.id, {
                                                cases: updated,
                                              });
                                            }}
                                            className="w-4 h-4 flex items-center justify-center bg-gray-100 rounded text-gray-500 hover:bg-gray-200"
                                          >
                                            <Minus size={10} />
                                          </button>
                                          <span className="text-[10px] font-bold text-blue-600 min-w-[12px] text-center">
                                            {(c.features || []).length}
                                          </span>
                                          <button
                                            onClick={() => {
                                              const updated = cases.map(
                                                (it: any) => {
                                                  if (it.id === c.id) {
                                                    const feats = [
                                                      ...(it.features || []),
                                                    ];
                                                    feats.push(
                                                      "새로운 특징 항목을 입력하세요",
                                                    );
                                                    return {
                                                      ...it,
                                                      features: feats,
                                                    };
                                                  }
                                                  return it;
                                                },
                                              );
                                              updateWidgetData(widget.id, {
                                                cases: updated,
                                              });
                                            }}
                                            className="w-4 h-4 flex items-center justify-center bg-blue-100 rounded text-blue-600 hover:bg-blue-200"
                                          >
                                            <Plus size={10} />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between px-1">
                                        <span className="text-[9px] font-bold text-gray-400">
                                          로고박스
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => {
                                              const updated = cases.map(
                                                (it: any) => {
                                                  if (it.id === c.id) {
                                                    const logos = [
                                                      ...(it.avatars || []),
                                                    ];
                                                    if (logos.length > 0)
                                                      logos.pop();
                                                    return {
                                                      ...it,
                                                      avatars: logos,
                                                    };
                                                  }
                                                  return it;
                                                },
                                              );
                                              updateWidgetData(widget.id, {
                                                cases: updated,
                                              });
                                            }}
                                            className="w-4 h-4 flex items-center justify-center bg-gray-100 rounded text-gray-500 hover:bg-gray-200"
                                          >
                                            <Minus size={10} />
                                          </button>
                                          <span className="text-[10px] font-bold text-gray-600 min-w-[12px] text-center">
                                            {(c.avatars || []).length}
                                          </span>
                                          <button
                                            onClick={() => {
                                              const updated = cases.map(
                                                (it: any) => {
                                                  if (it.id === c.id) {
                                                    const logos = [
                                                      ...(it.avatars || []),
                                                    ];
                                                    logos.push(
                                                      "https://placehold.co/100x100",
                                                    );
                                                    return {
                                                      ...it,
                                                      avatars: logos,
                                                    };
                                                  }
                                                  return it;
                                                },
                                              );
                                              updateWidgetData(widget.id, {
                                                cases: updated,
                                              });
                                            }}
                                            className="w-4 h-4 flex items-center justify-center bg-gray-800 rounded text-white hover:bg-black"
                                          >
                                            <Plus size={10} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          }

                          if (listArrayName === "cases" && (widget.data as any).layout === "4") {
                            return (
                              <div key="add-case-btn" className="mt-2">
                                <button
                                  onClick={() => {
                                    const cases = (widget.data as any).cases || [];
                                    const newId = `case-${Date.now()}`;
                                    const newCase = {
                                      id: newId,
                                      subTitle: `Case 0${cases.length + 1}`,
                                      title: "새로운 실적 타이틀을 입력하세요",
                                      features: ["특징 항목 1", "특징 항목 2"],
                                      avatars: ["https://placehold.co/100x100"],
                                      imageUrl: "https://placehold.co/600x584",
                                      imageOnRight: false,
                                    };
                                    updateWidgetData(widget.id, {
                                      cases: [...cases, newCase],
                                    });
                                    setSelectedItemId(newId);
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 font-bold hover:bg-blue-100 transition-all text-[11px]"
                                >
                                  <Plus size={14} />
                                  새로운 실적 케이스 추가
                                </button>
                              </div>
                            );
                          }

                          return arr.map((item: any, idx: number) => {
                            const items = arr;
                            const itemTextProp =
                              item.question !== undefined
                                ? "question"
                                : item.title !== undefined
                                  ? "title"
                                  : item.label !== undefined
                                    ? "label"
                                    : "text";
                            const isSelected = selectedItemId === item.id;

                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  setItemDraggedIdx(idx);
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setItemDragOverIdx(idx);
                                }}
                                onDrop={(e) => {
                                  e.stopPropagation();
                                  handleItemDrop(listArrayName!);
                                }}
                                className={`flex flex-col gap-1 bg-white p-2 rounded-lg shadow-sm border transition-all ${
                                  isSelected
                                    ? "border-blue-400 ring-2 ring-blue-50"
                                    : "border-gray-100 hover:border-blue-200"
                                } ${
                                  itemDragOverIdx === idx
                                    ? "border-t-2 border-t-blue-500"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-1 overflow-hidden">
                                  <GripVertical
                                    size={12}
                                    className="text-gray-300 cursor-grab shrink-0"
                                  />

                                  {widget.type === "process" && (
                                    <div className="flex items-center gap-1 shrink-0 mr-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedItemId(item.id);
                                          setSelectedElementKey("icon");
                                        }}
                                        className={`p-1 rounded transition-colors ${
                                          selectedItemId === item.id &&
                                          selectedElementKey === "icon"
                                            ? "bg-blue-100 text-blue-600"
                                            : "hover:bg-gray-100 text-gray-400"
                                        }`}
                                        title="이미지/아이콘 추가"
                                      >
                                        <ImageIcon size={12} />
                                      </button>
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedItemId(item.id);
                                          setSelectedElementKey("number");
                                        }}
                                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md min-w-[24px] text-center cursor-pointer transition-colors ${
                                          selectedItemId === item.id &&
                                          selectedElementKey === "number"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                        title="번호 편집"
                                      >
                                        {item.number || `0${idx + 1}`}
                                      </div>
                                      {idx < items.length - 1 && (
                                        <ChevronRight
                                          size={10}
                                          className="text-gray-300"
                                        />
                                      )}
                                    </div>
                                  )}

                                  {widget.type === "textSection" && (
                                    <select
                                      className="text-[9px] border-none bg-gray-100 rounded px-1 py-0.5 text-gray-600 font-bold uppercase shrink-0 w-[50px]"
                                      value={item.type}
                                      onChange={(e) =>
                                        updateWidgetData(widget.id, {
                                          [listArrayName!]: updateItemInArray(
                                            (widget.data as any)[
                                              listArrayName!
                                            ],
                                            item.id,
                                            "type",
                                            e.target.value,
                                          ),
                                        })
                                      }
                                    >
                                      <option value="heading">Head</option>
                                      <option value="text">Text</option>
                                      <option value="image">Img</option>
                                      <option value="video">Vod</option>
                                    </select>
                                  )}

                                  {widget.type === "tabButton" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const allItems =
                                          (widget.data as any).items || [];
                                        const newActive = !item.active;
                                        updateWidgetData(widget.id, {
                                          items: allItems.map((it: any) => {
                                            const willBeActive =
                                              it.id === item.id
                                                ? newActive
                                                : false;
                                            return {
                                              ...it,
                                              active: willBeActive,
                                              titleStyle: {
                                                ...(it.titleStyle || {}),
                                                color: willBeActive
                                                  ? "#ffffff"
                                                  : "#6b7280",
                                              },
                                            };
                                          }),
                                        });
                                      }}
                                      className={`shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                                        item.active
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                      }`}
                                      title={
                                        item.active
                                          ? "활성 (ON)"
                                          : "비활성 (OFF)"
                                      }
                                    >
                                      {item.active ? "ON" : "OFF"}
                                    </button>
                                  )}

                                  <div className="flex-1 flex items-center gap-1 min-w-0">
                                    <input
                                      className="flex-1 min-w-0 text-[11px] font-bold text-gray-700 bg-transparent border-none outline-none focus:ring-0 p-0.5"
                                      value={item[itemTextProp] || ""}
                                      onChange={(e) => {
                                        if (
                                          listArrayName ===
                                          "sections11_features"
                                        ) {
                                          const secs =
                                            (widget.data as any).sections11 ||
                                            [];
                                          const newSecs = secs.map((s: any) => {
                                            if (s.type === "features") {
                                              return {
                                                ...s,
                                                items: s.items.map((it: any) =>
                                                  it.id === item.id
                                                    ? {
                                                        ...it,
                                                        [itemTextProp]:
                                                          e.target.value,
                                                      }
                                                    : it,
                                                ),
                                              };
                                            }
                                            return s;
                                          });
                                          updateWidgetData(widget.id, {
                                            sections11: newSecs,
                                          });
                                        } else {
                                          updateWidgetData(widget.id, {
                                            [listArrayName!]: updateItemInArray(
                                              (widget.data as any)[
                                                listArrayName!
                                              ],
                                              item.id,
                                              itemTextProp,
                                              e.target.value,
                                            ),
                                          });
                                        }
                                      }}
                                      onFocus={() => {
                                        setSelectedItemId(item.id);
                                        setSelectedElementKey(
                                          item.question !== undefined
                                            ? "faqQuestion"
                                            : "item",
                                        );
                                      }}
                                      placeholder={`항목 ${idx + 1}`}
                                    />
                                  </div>
                                  <div className="flex items-center shrink-0 bg-gray-50 rounded p-0.5 ml-auto">
                                    <button
                                      onClick={() =>
                                        moveArrayItem(
                                          widget,
                                          item.id,
                                          "up",
                                          listArrayName!,
                                        )
                                      }
                                      className={`p-0.5 rounded ${
                                        idx === 0
                                          ? "text-gray-200"
                                          : "text-gray-400 hover:text-blue-500"
                                      }`}
                                      disabled={idx === 0}
                                      title="위로"
                                    >
                                      <ArrowUp size={10} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        moveArrayItem(
                                          widget,
                                          item.id,
                                          "down",
                                          listArrayName!,
                                        )
                                      }
                                      className={`p-0.5 rounded ${
                                        idx === items.length - 1
                                          ? "text-gray-200"
                                          : "text-gray-400 hover:text-blue-500"
                                      }`}
                                      disabled={idx === items.length - 1}
                                      title="아래로"
                                    >
                                      <ArrowDown size={10} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        removeArrayItem(
                                          widget,
                                          item.id,
                                          listArrayName!,
                                        )
                                      }
                                      className="text-red-300 hover:text-red-500 p-0.5 rounded"
                                      title="삭제"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>

                                {/* Text Structure Dynamic Sections Specific Controls */}
                                {widget.type === "textStructure" &&
                                  (item.type === "image" ||
                                    item.type === "leftImage") && (
                                    <div className="flex flex-col gap-1 px-1 mt-1 border-t pt-2 border-gray-100">
                                      <span className="text-[9px] font-black text-blue-600 pl-1 uppercase tracking-tighter flex items-center gap-1">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        Image Columns (Grid)
                                      </span>
                                      <div className="grid grid-cols-4 gap-1 mt-1">
                                        {["1", "2", "3", "4"].map((num) => (
                                          <button
                                            key={num}
                                            onClick={() => {
                                              const sections =
                                                (widget.data as any)[
                                                  listArrayName!
                                                ] || [];
                                              const updated = sections.map(
                                                (s: any) =>
                                                  s.id === item.id
                                                    ? {
                                                        ...s,
                                                        columns: parseInt(num),
                                                        // Ensure images array has enough slots
                                                        images:
                                                          s.images?.length >=
                                                          parseInt(num)
                                                            ? s.images.slice(
                                                                0,
                                                                parseInt(num),
                                                              )
                                                            : [
                                                                ...(s.images ||
                                                                  []),
                                                                ...Array(
                                                                  parseInt(
                                                                    num,
                                                                  ) -
                                                                    (s.images
                                                                      ?.length ||
                                                                      0),
                                                                ).fill(
                                                                  "/images/placeholder/section-image.jpg",
                                                                ),
                                                              ],
                                                      }
                                                    : s,
                                              );
                                              updateWidgetData(widget.id, {
                                                [listArrayName!]: updated,
                                              });
                                            }}
                                            className={`py-1 rounded text-[10px] font-bold transition-all border ${
                                              (item.columns?.toString() ||
                                                "1") === num
                                                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                                            }`}
                                          >
                                            {num}열
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Text Section Specific Controls */}
                                {widget.type === "textSection" &&
                                  item.type === "heading" && (
                                    <div className="flex gap-2 px-1">
                                      <select
                                        className="w-full text-[9px] text-gray-500 bg-gray-50 border-none rounded px-1 py-0.5"
                                        value={item.iconType || "none"}
                                        onChange={(e) =>
                                          updateWidgetData(widget.id, {
                                            [listArrayName!]: updateItemInArray(
                                              (widget.data as any)[
                                                listArrayName!
                                              ],
                                              item.id,
                                              "iconType",
                                              e.target.value,
                                            ),
                                          })
                                        }
                                      >
                                        <option value="none">No Icon</option>
                                        <option value="check">
                                          Check Icon
                                        </option>
                                        <option value="circle">Blue Dot</option>
                                        <option value="square">
                                          Gray Square
                                        </option>
                                      </select>
                                    </div>
                                  )}

                                {(item.url !== undefined ||
                                  item.image !== undefined ||
                                  (widget.type === "textSection" &&
                                    (item.type === "image" ||
                                      item.type === "video"))) && (
                                  <div className="flex items-center gap-1 px-1">
                                    {widget.type === "video" && item.type && (
                                      <button
                                        onClick={() =>
                                          updateWidgetData(widget.id, {
                                            items: updateItemInArray(
                                              items,
                                              item.id,
                                              "type",
                                              item.type === "video"
                                                ? "image"
                                                : "video",
                                            ),
                                          })
                                        }
                                        className={`px-1 rounded text-[8px] font-bold uppercase shrink-0 ${
                                          item.type === "video"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-purple-100 text-purple-600"
                                        }`}
                                      >
                                        {item.type === "video" ? "VOD" : "IMG"}
                                      </button>
                                    )}
                                    <input
                                      className="w-full text-[9px] text-gray-400 bg-gray-50 border-none outline-none focus:ring-0 px-1.5 py-0.5 rounded"
                                      placeholder={
                                        widget.type === "video" ||
                                        item.type === "video"
                                          ? "Video URL..."
                                          : "Image URL..."
                                      }
                                      value={item.url || item.image || ""}
                                      onChange={(e) =>
                                        updateWidgetData(widget.id, {
                                          [listArrayName!]: updateItemInArray(
                                            (widget.data as any)[
                                              listArrayName!
                                            ],
                                            item.id,
                                            item.image !== undefined
                                              ? "image"
                                              : "url",
                                            e.target.value,
                                          ),
                                        })
                                      }
                                    />
                                  </div>
                                )}

                                {/* TabButton Link URL */}
                                {widget.type === "tabButton" && (
                                  <div className="flex items-center gap-1 px-1">
                                    <span className="text-[8px] font-bold text-gray-400 shrink-0">
                                      URL
                                    </span>
                                    <input
                                      className="w-full text-[9px] text-gray-400 bg-gray-50 border-none outline-none focus:ring-0 px-1.5 py-0.5 rounded"
                                      placeholder="Link URL..."
                                      value={item.link || ""}
                                      onChange={(e) =>
                                        updateWidgetData(widget.id, {
                                          [listArrayName!]: updateItemInArray(
                                            (widget.data as any)[
                                              listArrayName!
                                            ],
                                            item.id,
                                            "link",
                                            e.target.value,
                                          ),
                                        })
                                      }
                                    />
                                  </div>
                                )}

                                {/* Video Settings for Block */}
                                {widget.type === "textSection" &&
                                  item.type === "video" && (
                                    <div className="flex gap-2 px-1 mt-1 border-t pt-1 border-gray-100">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="checkbox"
                                          checked={item.autoPlay}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  (widget.data as any)[
                                                    listArrayName!
                                                  ],
                                                  item.id,
                                                  "autoPlay",
                                                  e.target.checked,
                                                ),
                                            })
                                          }
                                          className="w-3 h-3 rounded text-blue-500"
                                        />
                                        <span className="text-[9px] text-gray-500">
                                          Auto
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="checkbox"
                                          checked={item.muted}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  (widget.data as any)[
                                                    listArrayName!
                                                  ],
                                                  item.id,
                                                  "muted",
                                                  e.target.checked,
                                                ),
                                            })
                                          }
                                          className="w-3 h-3 rounded text-blue-500"
                                        />
                                        <span className="text-[9px] text-gray-500">
                                          Mute
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {/* Card List Specific Controls */}
                                {widget.type === "cardList" && (
                                  <div className="flex flex-col gap-2 px-1 mt-2 border-t border-gray-100 pt-3 pb-1">
                                    <div className="flex gap-2">
                                      <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                          Tags
                                        </span>
                                        <input
                                          className="w-full text-[10px] text-emerald-600 bg-emerald-50/50 border border-emerald-100 outline-none focus:ring-1 focus:ring-emerald-200 px-2 py-1.5 rounded-lg"
                                          value={item.tag || ""}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  items,
                                                  item.id,
                                                  "tag",
                                                  e.target.value,
                                                ),
                                            })
                                          }
                                          placeholder="태그"
                                          onFocus={() => {
                                            setSelectedItemId(item.id);
                                            setSelectedElementKey("itemTag");
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                          Label
                                        </span>
                                        <input
                                          className="w-full text-[10px] text-blue-600 bg-blue-50/50 border border-blue-100 outline-none focus:ring-1 focus:ring-blue-200 px-2 py-1.5 rounded-lg"
                                          value={item.label || ""}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  items,
                                                  item.id,
                                                  "label",
                                                  e.target.value,
                                                ),
                                            })
                                          }
                                          placeholder="라벨"
                                          onFocus={() => {
                                            setSelectedItemId(item.id);
                                            setSelectedElementKey("itemLabel");
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                          Rounding (px)
                                        </span>
                                        <input
                                          type="number"
                                          className="w-full text-[10px] text-gray-700 bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-gray-300 px-2 py-1.5 rounded-lg font-mono"
                                          value={
                                            parseInt(
                                              (
                                                item.imageStyle?.borderRadius ||
                                                "24"
                                              ).replace("px", ""),
                                            ) || 0
                                          }
                                          onChange={(e) => {
                                            const val = e.target.value + "px";
                                            const oldStyle =
                                              item.imageStyle || {};
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  items,
                                                  item.id,
                                                  "imageStyle",
                                                  {
                                                    ...oldStyle,
                                                    borderRadius: val,
                                                  },
                                                ),
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                          Link URL
                                        </span>
                                        <input
                                          className="w-full text-[10px] text-blue-500 bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-gray-300 px-2 py-1.5 rounded-lg font-mono"
                                          value={item.link || ""}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  items,
                                                  item.id,
                                                  "link",
                                                  e.target.value,
                                                ),
                                            })
                                          }
                                          placeholder="#"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                        Media URL / Attachment
                                      </span>
                                      <div className="flex gap-1">
                                        <input
                                          className="flex-1 text-[9px] text-gray-400 bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-gray-300 px-2 py-1.5 rounded-lg font-mono truncate"
                                          value={item.image || ""}
                                          onChange={(e) =>
                                            updateWidgetData(widget.id, {
                                              [listArrayName!]:
                                                updateItemInArray(
                                                  items,
                                                  item.id,
                                                  "image",
                                                  e.target.value,
                                                ),
                                            })
                                          }
                                          placeholder="https://..."
                                          onFocus={() => {
                                            setSelectedItemId(item.id);
                                            setSelectedElementKey("itemImage");
                                          }}
                                        />
                                        <button
                                          onClick={() => {
                                            setSelectedItemId(item.id);
                                            setSelectedElementKey("itemImage");
                                          }}
                                          className="px-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 shrink-0"
                                          title="파일 업로드 / 상세 설정"
                                        >
                                          <ImageIcon
                                            size={14}
                                            className="text-gray-400"
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 배지 상세 스타일 편집 (더블클릭 시 노출) */}
                                {widget.type === "imageCard" &&
                                  selectedElementKey?.startsWith("itemBadge") &&
                                  isSelected && (
                                    <div className="flex flex-col gap-2 px-1 mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50 shadow-sm animate-in fade-in slide-in-from-top-1">
                                      {(() => {
                                        const badgeNum =
                                          selectedElementKey.replace(
                                            "itemBadge",
                                            "",
                                          );
                                        const badgeStyle =
                                          (item as any)[
                                            `badgeStyle${badgeNum}`
                                          ] || {};
                                        return (
                                          <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter flex items-center gap-1">
                                                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                                Badge {badgeNum} 스타일
                                              </span>
                                              <div className="flex gap-2">
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-1">
                                                  <span className="text-[8px] text-gray-400 font-bold">
                                                    BG
                                                  </span>
                                                  <input
                                                    type="color"
                                                    className="w-4 h-4 p-0 border-0 cursor-pointer bg-transparent"
                                                    value={
                                                      badgeStyle.backgroundColor ||
                                                      (badgeNum === "1"
                                                        ? "#285DE1"
                                                        : "#F8FAFC")
                                                    }
                                                    onChange={(e) =>
                                                      updateWidgetData(
                                                        widget.id,
                                                        {
                                                          [listArrayName!]:
                                                            updateItemInArray(
                                                              items,
                                                              item.id,
                                                              `badgeStyle${badgeNum}`,
                                                              {
                                                                ...badgeStyle,
                                                                backgroundColor:
                                                                  e.target
                                                                    .value,
                                                              },
                                                            ),
                                                        },
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-1">
                                                  <span className="text-[8px] text-gray-400 font-bold">
                                                    TXT
                                                  </span>
                                                  <input
                                                    type="color"
                                                    className="w-4 h-4 p-0 border-0 cursor-pointer bg-transparent"
                                                    value={
                                                      badgeStyle.color ||
                                                      (badgeNum === "1"
                                                        ? "#FFFFFF"
                                                        : "#131416")
                                                    }
                                                    onChange={(e) =>
                                                      updateWidgetData(
                                                        widget.id,
                                                        {
                                                          [listArrayName!]:
                                                            updateItemInArray(
                                                              items,
                                                              item.id,
                                                              `badgeStyle${badgeNum}`,
                                                              {
                                                                ...badgeStyle,
                                                                color:
                                                                  e.target
                                                                    .value,
                                                              },
                                                            ),
                                                        },
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                              <div className="flex flex-col gap-1">
                                                <span className="text-[8px] font-bold text-gray-400 pl-1 uppercase">
                                                  Size
                                                </span>
                                                <select
                                                  className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-300"
                                                  value={
                                                    badgeStyle.fontSize ||
                                                    "16px"
                                                  }
                                                  onChange={(e) =>
                                                    updateWidgetData(
                                                      widget.id,
                                                      {
                                                        [listArrayName!]:
                                                          updateItemInArray(
                                                            items,
                                                            item.id,
                                                            `badgeStyle${badgeNum}`,
                                                            {
                                                              ...badgeStyle,
                                                              fontSize:
                                                                e.target.value,
                                                            },
                                                          ),
                                                      },
                                                    )
                                                  }
                                                >
                                                  {[
                                                    "12px",
                                                    "13px",
                                                    "14px",
                                                    "15px",
                                                    "16px",
                                                    "17px",
                                                    "18px",
                                                    "20px",
                                                  ].map((sz) => (
                                                    <option key={sz} value={sz}>
                                                      {sz}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                <span className="text-[8px] font-bold text-gray-400 pl-1 uppercase">
                                                  Weight
                                                </span>
                                                <select
                                                  className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-300"
                                                  value={
                                                    badgeStyle.fontWeight ||
                                                    "600"
                                                  }
                                                  onChange={(e) =>
                                                    updateWidgetData(
                                                      widget.id,
                                                      {
                                                        [listArrayName!]:
                                                          updateItemInArray(
                                                            items,
                                                            item.id,
                                                            `badgeStyle${badgeNum}`,
                                                            {
                                                              ...badgeStyle,
                                                              fontWeight:
                                                                e.target.value,
                                                            },
                                                          ),
                                                      },
                                                    )
                                                  }
                                                >
                                                  <option value="400">
                                                    Regular
                                                  </option>
                                                  <option value="500">
                                                    Medium
                                                  </option>
                                                  <option value="600">
                                                    Semibold
                                                  </option>
                                                  <option value="700">
                                                    Bold
                                                  </option>
                                                  <option value="800">
                                                    ExtraBold
                                                  </option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  )}

                                {widget.type === "imageCard" && (
                                  <div className="flex flex-col gap-1 px-1 mt-1">
                                    <span className="text-[9px] font-black text-gray-400 pl-1 uppercase tracking-tighter">
                                      Description
                                    </span>
                                    <textarea
                                      className="w-full text-[10px] text-gray-700 bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-gray-300 px-2 py-1.5 rounded-lg min-h-[60px] resize-none"
                                      value={item.desc || ""}
                                      onChange={(e) =>
                                        updateWidgetData(widget.id, {
                                          [listArrayName!]: updateItemInArray(
                                            items,
                                            item.id,
                                            "desc",
                                            e.target.value,
                                          ),
                                        })
                                      }
                                      onFocus={() => {
                                        setSelectedItemId(item.id);
                                        setSelectedElementKey("itemDesc");
                                      }}
                                      placeholder="설명 문구 입력"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </>
                  ) : null}

                {/* Layout 4 Case Feature/Logo Text Editing Hooks */}
                {widget.type === "textStructure" &&
                  (widget.data as any).layout === "4" &&
                  selectedElementKey === "caseFeatureText" && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <label className="text-[10px] font-black text-blue-600 block uppercase tracking-tighter italic">
                        체크리스트 항목 텍스트 편집
                      </label>
                      <textarea
                        className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-h-[100px] resize-none border-gray-100 shadow-sm"
                        value={(() => {
                          const [cIdx, fIdx] = (selectedItemId || "0:0")
                            .split(":")
                            .map(Number);
                          return (widget.data as any).cases?.[cIdx]?.features?.[fIdx] || "";
                        })()}
                        onChange={(e) => {
                          const [cIdx, fIdx] = (selectedItemId || "0:0")
                            .split(":")
                            .map(Number);
                          const newCases = [...((widget.data as any).cases || [])];
                          if (newCases[cIdx] && newCases[cIdx].features) {
                            const newFeatures = [...newCases[cIdx].features];
                            newFeatures[fIdx] = e.target.value;
                            newCases[cIdx] = { ...newCases[cIdx], features: newFeatures };
                            updateWidgetData(widget.id, { cases: newCases });
                          }
                        }}
                        placeholder="특징 내용을 입력하세요..."
                      />
                    </div>
                  )}

                {widget.type === "textStructure" &&
                  (widget.data as any).layout === "4" &&
                  selectedElementKey === "caseLogoUrl" && (
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <label className="text-[10px] font-black text-blue-600 block uppercase tracking-tighter italic">
                        로고 이미지 설정
                      </label>
                      <ImgUploadPop
                        onSelect={(url) => {
                          const [cIdx, aIdx] = (selectedItemId || "0:0")
                            .split(":")
                            .map(Number);
                          const newCases = [...((widget.data as any).cases || [])];
                          if (newCases[cIdx] && newCases[cIdx].avatars) {
                            const newAvatars = [...newCases[cIdx].avatars];
                            newAvatars[aIdx] = url;
                            newCases[cIdx] = { ...newCases[cIdx], avatars: newAvatars };
                            updateWidgetData(widget.id, { cases: newCases });
                          }
                        }}
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group">
                            <ImageIcon
                              size={24}
                              className="text-gray-300 group-hover:text-blue-500 transition-colors"
                            />
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                                로고 이미지 변경
                              </span>
                              <span className="text-[10px] text-gray-400">
                                이미지를 클릭하여 업로드하세요
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                {/* Video Banner Controls - Video Detail Removed for 'video' type as requested */}
                {["banner3", "banner6", "banner7"].includes(widget.type) && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 block uppercase italic flex items-center gap-1">
                        <Video size={10} /> 영상 설정
                      </label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                        value={(widget.data as any).videoUrl || ""}
                        onChange={(e) =>
                          updateWidgetData(widget.id, { videoUrl: e.target.value })
                        }
                        placeholder="유튜브 영상 주소 입력"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updateWidgetData(widget.id, {
                            autoPlay: !(widget.data as any).autoPlay,
                          })
                        }
                        className={`p-2 rounded text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                          (widget.data as any).autoPlay
                            ? "bg-blue-500 text-white border-blue-600 shadow-inner"
                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-white"
                        }`}
                      >
                        {(widget.data as any).autoPlay ? <Check size={10} /> : null}{" "}
                        자동재생
                      </button>
                      <button
                        onClick={() =>
                          updateWidgetData(widget.id, {
                            muted: !(widget.data as any).muted,
                          })
                        }
                        className={`p-2 rounded text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                          (widget.data as any).muted
                            ? "bg-blue-500 text-white border-blue-600 shadow-inner"
                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-white"
                        }`}
                      >
                        {(widget.data as any).muted ? <Check size={10} /> : null}{" "}
                        음소거
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-tight">
                      * 자동재생 시 브라우저 정책에 따라 음소거 상태로 시작됩니다.
                    </p>
                  </div>
                )}

                {/* Image Area Controls */}
                {widget.type === "imageArea" && (
                  <div className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                        <ImageIcon size={14} className="text-blue-500" /> PC 이미지
                        설정
                      </label>
                      <ImgUploadPop
                        onSelect={(url) =>
                          updateWidgetData(widget.id, { imageUrl: url })
                        }
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload size={18} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 text-sm">
                                PC 이미지 선택
                              </p>
                              <p className="text-[10px] text-gray-400">
                                서버 업로드 또는 선택
                              </p>
                            </div>
                          </div>
                        }
                      />
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100 text-blue-600 font-medium"
                        value={(widget.data as any).imageUrl || ""}
                        onChange={(e) =>
                          updateWidgetData(widget.id, { imageUrl: e.target.value })
                        }
                        placeholder="PC 이미지 URL을 입력하세요"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                        <Smartphone size={14} className="text-blue-500" /> 모바일
                        이미지 설정
                      </label>
                      <ImgUploadPop
                        onSelect={(url) =>
                          updateWidgetData(widget.id, { mobileImageUrl: url })
                        }
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload size={18} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 text-sm">
                                모바일 이미지 선택
                              </p>
                              <p className="text-[10px] text-gray-400">
                                서버 업로드 또는 선택
                              </p>
                            </div>
                          </div>
                        }
                      />
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100 text-blue-600 font-medium"
                        value={(widget.data as any).mobileImageUrl || ""}
                        onChange={(e) =>
                          updateWidgetData(widget.id, {
                            mobileImageUrl: e.target.value,
                          })
                        }
                        placeholder="모바일 이미지 URL을 입력하세요 (선택)"
                      />
                      <p className="text-[10px] text-gray-400 leading-tight">
                        * 모바일 이미지를 등록하지 않으면 PC 이미지가 공통으로
                        노출됩니다.
                      </p>
                    </div>
                  </div>
                )}

                {widget.type === "textStructure" && (
                  <div className="space-y-2">
                    {["1", "2", "3", "4"].includes(
                      (widget as any).data.layout || "1",
                    ) && (
                      <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-lg">
                        <label className="text-sm text-gray-700">
                          이미지/텍스트 좌우 반전
                        </label>
                        <button
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            (widget as any).data.reverseLayout
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                          onClick={() => {
                            updateWidgetData(widget.id, {
                              reverseLayout: !(widget as any).data.reverseLayout,
                            });
                          }}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              (widget as any).data.reverseLayout
                                ? "translate-x-5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    )}

                    {/* 레이아웃 6 전용: 동적 섹션 구조 관리 */}
                    {((widget as any).data.layout || "1") === "6" && (
                      <TextStructure6Manager
                        widgetId={widget.id}
                        sections={
                          (widget as any).data.sections6 ||
                          TEXT_STRUCTURE_6_DEFAULT_SECTIONS
                        }
                        updateWidgetData={updateWidgetData}
                      />
                    )}

                    {/* 레이아웃 7 전용: 동적 섹션 구조 관리 */}
                    {((widget as any).data.layout || "1") === "7" && (
                      <TextStructure7Manager
                        widgetId={widget.id}
                        sections={
                          (widget as any).data.sections7 ||
                          TEXT_STRUCTURE_7_DEFAULT_SECTIONS
                        }
                        updateWidgetData={updateWidgetData}
                      />
                    )}

                    {/* 레이아웃 8 전용: 동적 섹션 구조 관리 */}
                    {((widget as any).data.layout || "1") === "8" && (
                      <TextStructure8Manager
                        widgetId={widget.id}
                        sections={
                          (widget as any).data.sections8 ||
                          TEXT_STRUCTURE_8_DEFAULT_SECTIONS
                        }
                        updateWidgetData={updateWidgetData}
                      />
                    )}

                    {/* 레이아웃 11 전용: 동적 섹션 구조 관리 */}
                    {((widget as any).data.layout || "1") === "11" && (
                      <TextStructure11Manager
                        widgetId={widget.id}
                        sections={
                          (widget as any).data.sections11 ||
                          TEXT_STRUCTURE_11_DEFAULT_SECTIONS
                        }
                        updateWidgetData={updateWidgetData}
                      />
                    )}
                  </div>
                )}

                {/* Image Height Controls */}
                {[
                  "imageCard",
                  "iconCard",
                  "comparisonCard",
                  "imageCarousel",
                  "infoBanner",
                  "process",
                  "imageTitle3",
                ].includes(widget.type) && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      이미지 높이
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={80}
                        max={800}
                        className="flex-1 bg-gray-50 border-none p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all hover:bg-gray-100 text-center font-mono"
                        value={
                          parseInt(
                            ((widget.data as any).imageHeight || "0").replace(
                              "px",
                              "",
                            ),
                          ) ||
                          (widget.type === "iconCard"
                            ? 320
                            : widget.type === "comparisonCard"
                              ? 320
                              : widget.type === "imageCarousel"
                                ? 300
                                : widget.type === "infoBanner"
                                  ? 412
                                  : widget.type === "process"
                                    ? 176
                                    : widget.type === "titleBanner"
                                      ? 384
                                      : widget.type === "imageTitle3"
                                        ? 400
                                        : 240)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !isNaN(Number(val))) {
                            updateWidgetData(widget.id, {
                              imageHeight: val + "px",
                            });
                          }
                        }}
                      />
                      <span className="text-xs font-mono text-gray-400 shrink-0">
                        px
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      * 이미지 영역 높이를 조절합니다.
                    </p>
                  </div>
                )}

                {/* Table Controls - Reverted Position */}

                {/* Image Layout Controls */}
                {widget.type === "imageLayout" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      레이아웃 스타일
                    </label>
                    <select
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer hover:bg-gray-100"
                      value={(widget as any).data.variant}
                      onChange={(e) => {
                        setConfirmPop(
                          true,
                          "레이아웃을 변경하면 현재 입력된 데이터가 초기화될 수 있습니다. <br/>계속하시겠습니까?",
                          2,
                          () => {
                            updateWidgetData(widget.id, {
                              variant: e.target.value,
                            });
                          },
                        );
                      }}
                    >
                      <option value="list">리스트형</option>
                      <option value="check">체크박스형</option>
                      <option value="horizontal">가로 이미지</option>
                      <option value="horizontal-video">가로 영상</option>
                    </select>
                  </div>
                )}

                <HtmlCodeEditor
                  widget={widget}
                  pageData={pageData}
                  selectedSectionId={selectedSectionId}
                  selectedWidgetId={selectedWidgetId}
                  setPageData={setPageData}
                  pushHistory={pushHistory}
                />
              </div>
            </>
          )}

        {/* sections6 이미지 편집 패널 */}
        {selectedElementKey &&
          (selectedElementKey.startsWith("s6img_") ||
            selectedElementKey.startsWith("s6banner_")) && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col overflow-y-auto">
              {/* 헤더 */}
              <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-white sticky top-0">
                <button
                  onClick={() => setSelectedElementKey(null)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold"
                >
                  <ChevronLeft size={14} />
                  뒤로
                </button>
                <span className="text-xs font-bold text-gray-700 flex-1 text-center pr-6">
                  이미지 설정
                </span>
              </div>

              {/* 이미지 편집 영역 */}
              <div className="p-4 space-y-4">
                {(() => {
                  const key = selectedElementKey;
                  const sections6: any[] =
                    (widget.data as any).sections6 ||
                    TEXT_STRUCTURE_6_DEFAULT_SECTIONS;

                  let currentUrl = "";
                  let sectionId = "";
                  let imgIdx = -1;
                  let isBanner = false;

                  if (key.startsWith("s6img_")) {
                    // format: s6img_{sectionId}_{imgIdx}
                    const withoutPrefix = key.slice("s6img_".length);
                    const lastUnderscore = withoutPrefix.lastIndexOf("_");
                    sectionId = withoutPrefix.slice(0, lastUnderscore);
                    imgIdx = parseInt(
                      withoutPrefix.slice(lastUnderscore + 1),
                      10,
                    );
                    const sec = sections6.find((s: any) => s.id === sectionId);
                    currentUrl = sec?.images?.[imgIdx] || "";
                  } else {
                    // format: s6banner_{sectionId}
                    isBanner = true;
                    sectionId = key.slice("s6banner_".length);
                    const sec = sections6.find((s: any) => s.id === sectionId);
                    currentUrl = sec?.imageUrl || "";
                  }

                  const handleUpdate = (url: string) => {
                    const updated = sections6.map((s: any) => {
                      if (s.id !== sectionId) return s;
                      if (isBanner) return { ...s, imageUrl: url };
                      const imgs = [...(s.images || [])];
                      imgs[imgIdx] = url;
                      return { ...s, images: imgs };
                    });
                    updateWidgetData(widget.id, { sections6: updated });
                  };

                  return (
                    <>
                      {/* 미리보기 */}
                      {currentUrl && (
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={currentUrl}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                      )}

                      {/* URL 입력 */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          이미지 URL
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={currentUrl}
                          onChange={(e) => handleUpdate(e.target.value)}
                          placeholder="이미지 URL을 입력하세요"
                        />
                      </div>

                      {/* 업로드 버튼 */}
                      <ImgUploadPop
                        button={
                          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all border border-blue-200">
                            <ImageIcon size={13} />
                            이미지 선택 / 업로드
                          </button>
                        }
                        onSelect={(url) => handleUpdate(url)}
                      />
                    </>
                  );
                })()}
              </div>
            </div>
          )}

        {/* comparisonCard 좌/우 desc 항목 관리 패널 */}
        {selectedElementKey &&
          widget.type === "comparisonCard" &&
          (selectedElementKey === "leftDescItems" ||
            selectedElementKey === "rightDescItems") && (
            <ComparisonDescManager
              widgetId={widget.id}
              side={selectedElementKey === "leftDescItems" ? "left" : "right"}
              descItems={
                (widget.data as any)[selectedElementKey] ||
                (selectedElementKey === "leftDescItems"
                  ? [
                      { id: "l1", text: "프로그램 특징 내용 입력" },
                      { id: "l2", text: "프로그램 특징 내용 입력" },
                      { id: "l3", text: "프로그램 특징 내용 입력" },
                    ]
                  : [
                      { id: "r1", text: "프로그램 특징 내용 입력" },
                      { id: "r2", text: "프로그램 특징 내용 입력" },
                      { id: "r3", text: "프로그램 특징 내용 입력" },
                    ])
              }
              updateWidgetData={updateWidgetData}
              onBack={() => setSelectedElementKey(null)}
            />
          )}

        {/* 섹션 하위 요소 설정 패널 */}
        {selectedElementKey &&
          !selectedElementKey.startsWith("s6img_") &&
          !selectedElementKey.startsWith("s6banner_") &&
          !(
            widget.type === "comparisonCard" &&
            (selectedElementKey === "leftDescItems" ||
              selectedElementKey === "rightDescItems")
          ) && (
            <ElementEditor
              widget={widget}
              elementKey={selectedElementKey}
              itemId={selectedItemId}
              updateWidgetData={updateWidgetData}
              setSelectedElementKey={setSelectedElementKey}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              uploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
            />
          )}
      </div>
        </div>
    </div>
  );
};

export default PropertyPanel;
