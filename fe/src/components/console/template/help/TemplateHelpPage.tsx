"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Type,
  Image as ImageIcon,
  LayoutGrid,
  MousePointerClick,
  Sparkles,
  Monitor,
  Smartphone,
  BookOpen,
  Layers,
  ArrowUp,
  MousePointer2,
  PenLine,
  Upload,
  Video,
  ListPlus,
  Palette,
  AlertTriangle,
} from "lucide-react";

import { createWidget } from "@/utils/template/widgetFactory";
import { Widget, WidgetType } from "@/types/console/template";

// --- Renderers ---
import { FaqRenderer } from "@/components/console/template/widgets/FaqRenderer";
import { IconCardRenderer } from "@/components/console/template/widgets/IconCardRenderer";
import { ImageAreaRenderer } from "@/components/console/template/widgets/ImageAreaRenderer";
import { StripBannerRenderer } from "@/components/console/template/widgets/StripBannerRenderer";
import { ComparisonCardRenderer } from "@/components/console/template/widgets/ComparisonCardRenderer";
import { TitleBannerRenderer } from "@/components/console/template/widgets/TitleBannerRenderer";
import { TitleTextRenderer } from "@/components/console/template/widgets/TitleTextRenderer";
import { TabButtonRenderer } from "@/components/console/template/widgets/TabButtonRenderer";
import { ProcessRenderer } from "@/components/console/template/widgets/ProcessRenderer";
import { ImageCardRenderer } from "@/components/console/template/widgets/ImageCardRenderer";
import { InfoBannerRenderer } from "@/components/console/template/widgets/InfoBannerRenderer";
import { TableRenderer } from "@/components/console/template/widgets/TableRenderer";
import { TextStructureRenderer } from "@/components/console/template/widgets/TextStructureRenderer";
import { CultureLetterRenderer } from "@/components/console/template/widgets/CultureLetterRenderer";

// ─────────────────────────────────────────
// 위젯 카탈로그 데이터
// ─────────────────────────────────────────
interface WidgetInfo {
  type: WidgetType;
  name: string;
  description: string;
  category: string;
  layouts: string[];
  layoutLabels?: Record<string, string>;
  editTips: string[];
  useCases: string[];
  Renderer: React.FC<any>;
  layoutField?: string; // data 내 레이아웃 필드명
  variantField?: string; // variant 필드명
}

const CATEGORIES = [
  { id: "title-text", label: "타이틀 & 텍스트", icon: Type },
  { id: "image-media", label: "이미지 & 미디어", icon: ImageIcon },
  { id: "card-list", label: "카드 & 리스트", icon: LayoutGrid },
  { id: "interaction", label: "인터랙션 & 내비게이션", icon: MousePointerClick },
  { id: "special", label: "특수 섹션", icon: Sparkles },
];

const WIDGET_CATALOG: WidgetInfo[] = [
  // ── 타이틀 & 텍스트 ──
  {
    type: "titleText",
    name: "타이틀 텍스트",
    description:
      "타이틀과 서브타이틀을 다양한 레이아웃으로 표현합니다. 인용문, 장식 이미지, 통계 수치 등 4가지 레이아웃을 지원합니다.",
    category: "title-text",
    layouts: ["1", "2", "3", "4"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
    },
    layoutField: "layout",
    editTips: [
      "타이틀, 서브타이틀을 더블클릭하여 편집합니다.",
      "우측 패널에서 폰트 크기, 색상, 굵기를 조정합니다.",
    ],
    useCases: ["섹션 도입부 강조", "회사 비전/미션 표현", "핵심 수치 표시"],
    Renderer: TitleTextRenderer,
  },
  {
    type: "titleBanner",
    name: "타이틀 배너",
    description:
      "타이틀 헤더 아래에 이미지+제목+설명으로 구성된 피처 카드가 배치되는 섹션입니다. 3가지 레이아웃을 지원합니다.",
    category: "title-text",
    layouts: ["1", "2", "3"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
    },
    layoutField: "layout",
    editTips: [
      "상단 타이틀 영역을 더블클릭하여 편집합니다.",
      "하단 카드의 이미지를 클릭하면 업로드 팝업이 뜹니다.",
      "카드 제목과 설명도 각각 더블클릭으로 편집 가능합니다.",
    ],
    useCases: ["서비스 특징 소개", "프로그램 장점 나열"],
    Renderer: TitleBannerRenderer,
  },
  {
    type: "textStructure",
    name: "텍스트 구조",
    description:
      "미디어(이미지/비디오)와 텍스트를 다양한 구조로 조합할 수 있는 고급 레이아웃 위젯입니다. 11가지 배치를 지원합니다.",
    category: "title-text",
    layouts: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
      "5": "레이아웃 5",
      "6": "레이아웃 6",
      "7": "레이아웃 7",
      "8": "레이아웃 8",
      "9": "레이아웃 9",
      "10": "레이아웃 10",
      "11": "레이아웃 11",
    },
    layoutField: "layout",
    editTips: [
      "미디어 영역을 클릭하여 이미지/비디오를 교체합니다.",
      "텍스트 영역을 더블클릭하여 내용을 편집합니다.",
      "레이아웃 변경 시 기존 콘텐츠가 유지됩니다.",
    ],
    useCases: [
      "콘텐츠 매거진 레이아웃",
      "블로그형 상세 페이지",
      "미디어 중심 소개 섹션",
    ],
    Renderer: TextStructureRenderer,
  },

  // ── 이미지 & 미디어 ──
  {
    type: "imageArea",
    name: "이미지 영역",
    description:
      "전체 너비 이미지를 표시하는 영역입니다. PC와 모바일에 각각 다른 이미지를 설정할 수 있습니다.",
    category: "image-media",
    layouts: ["1"],
    editTips: [
      "이미지를 클릭하면 업로드 팝업이 나타납니다.",
      "PC용과 모바일용 이미지를 각각 설정할 수 있습니다.",
      "이미지 비율(cover/contain)을 우측 패널에서 조정합니다.",
    ],
    useCases: ["풀 와이드 비주얼 배너", "페이지 구분 이미지", "프로모션 이미지"],
    Renderer: ImageAreaRenderer,
  },
  {
    type: "stripBanner",
    name: "스트립 배너",
    description:
      "가로형 배너 스트립입니다. 텍스트+이미지 조합, 패널형, 비교 카드형 등 3가지 레이아웃을 지원합니다.",
    category: "image-media",
    layouts: ["1", "2", "3"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
    },
    layoutField: "layout",
    editTips: [
      "텍스트 영역을 더블클릭하여 편집합니다.",
      "이미지를 클릭하여 교체합니다.",
      "배경색을 우측 패널에서 변경할 수 있습니다.",
    ],
    useCases: ["Before/After 비교", "핵심 메시지 강조", "CTA 영역"],
    Renderer: StripBannerRenderer,
  },
  {
    type: "infoBanner",
    name: "정보 배너",
    description:
      "텍스트와 이미지를 조합한 정보 배너입니다. 5가지 레이아웃을 지원합니다.",
    category: "image-media",
    layouts: ["1", "2", "3", "4", "5"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
      "5": "레이아웃 5",
    },
    layoutField: "layout",
    editTips: [
      "텍스트를 더블클릭하여 편집합니다.",
      "배경 이미지를 클릭하여 교체합니다.",
      "우측 패널에서 오버레이 투명도를 조절할 수 있습니다.",
    ],
    useCases: ["공지사항 배너", "핵심 정보 강조", "이벤트 안내"],
    Renderer: InfoBannerRenderer,
  },

  // ── 카드 & 리스트 ──
  {
    type: "iconCard",
    name: "아이콘 카드",
    description:
      "아이콘 + 제목 + 설명으로 구성된 카드 그리드입니다. 6가지 레이아웃을 지원합니다.",
    category: "card-list",
    layouts: ["1", "2", "3", "4", "5", "6"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
      "5": "레이아웃 5",
      "6": "레이아웃 6",
    },
    variantField: "variant",
    editTips: [
      "아이콘 이미지를 클릭하면 업로드 팝업이 뜹니다.",
      "카드 제목/설명을 더블클릭하여 편집합니다.",
      "우측 패널에서 열 수를 1~4로 조정합니다.",
    ],
    useCases: [
      "서비스 특징 소개",
      "이점/장점 나열",
      "카테고리 메뉴",
      "팀 소개",
    ],
    Renderer: IconCardRenderer,
  },
  {
    type: "imageCard",
    name: "이미지 카드",
    description:
      "이미지와 제목, 설명, 그리고 피처 리스트로 구성된 카드 그리드입니다. 6가지 레이아웃을 지원합니다.",
    category: "card-list",
    layouts: ["1", "2", "3", "4", "5", "6"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
      "5": "레이아웃 5",
      "6": "레이아웃 6",
    },
    layoutField: "layout",
    editTips: [
      "카드 이미지를 클릭하여 교체합니다.",
      "피처 리스트의 항목명/값을 더블클릭하여 편집합니다.",
      "열 수를 우측 패널에서 조정합니다.",
    ],
    useCases: ["제품 비교 카드", "요금제 소개", "서비스 스펙 비교"],
    Renderer: ImageCardRenderer,
  },
  {
    type: "comparisonCard",
    name: "비교 카드",
    description:
      "좌우 2열 비교 레이아웃입니다. 이미지, 타이틀, 비교표로 두 항목을 나란히 비교할 수 있습니다.",
    category: "card-list",
    layouts: ["1", "2"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
    },
    layoutField: "layout",
    editTips: [
      "좌/우측 이미지를 클릭하여 교체합니다.",
      "비교 항목을 더블클릭하여 편집합니다.",
      "레이아웃 2는 중앙 헤더가 추가됩니다.",
    ],
    useCases: ["요금제 비교", "Before/After", "프로그램 비교"],
    Renderer: ComparisonCardRenderer,
  },

  // ── 인터랙션 & 내비게이션 ──
  {
    type: "tabButton",
    name: "탭 버튼",
    description:
      "가로 탭 내비게이션입니다. 각 탭에 링크를 연결하여 페이지 내/외부 이동을 설정할 수 있습니다.",
    category: "interaction",
    layouts: ["1"],
    editTips: [
      "탭 이름을 더블클릭하여 편집합니다.",
      "우측 패널에서 각 탭의 링크 URL을 설정합니다.",
      "탭 추가/삭제는 항목 관리에서 가능합니다.",
    ],
    useCases: ["서브 내비게이션", "카테고리 탭", "앵커 링크 메뉴"],
    Renderer: TabButtonRenderer,
  },
  {
    type: "processCard",
    name: "프로세스",
    description:
      "단계별 프로세스 플로우를 시각화합니다. 4가지 레이아웃을 지원합니다.",
    category: "interaction",
    layouts: ["1", "2", "3", "4"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
    },
    layoutField: "layout",
    editTips: [
      "각 단계의 제목/설명을 더블클릭하여 편집합니다.",
      "아이콘 이미지를 클릭하여 교체합니다.",
      "단계 추가/삭제는 항목 관리에서 가능합니다.",
      "단계 번호는 자동으로 부여됩니다.",
    ],
    useCases: ["이용 절차 안내", "서비스 프로세스", "타임라인"],
    Renderer: ProcessRenderer,
  },
  {
    type: "faq",
    name: "FAQ",
    description:
      "질문과 답변을 아코디언 형태로 표시합니다. 클릭하면 답변이 펼쳐집니다.",
    category: "interaction",
    layouts: ["1"],
    editTips: [
      "질문 텍스트를 더블클릭하여 편집합니다.",
      "답변 텍스트도 동일하게 더블클릭으로 편집합니다.",
      "항목 추가/삭제는 항목 관리에서 가능합니다.",
    ],
    useCases: ["자주 묻는 질문", "도움말 섹션", "서비스 안내"],
    Renderer: FaqRenderer,
  },

  // ── 특수 섹션 ──
  {
    type: "table",
    name: "테이블",
    description:
      "데이터 테이블을 표시합니다. 4가지 테이블 스타일을 지원합니다.",
    category: "special",
    layouts: ["standard", "table02", "table03", "table04"],
    layoutLabels: {
      standard: "기본",
      table02: "테이블 02",
      table03: "테이블 03",
      table04: "테이블 04",
    },
    variantField: "variant",
    editTips: [
      "셀을 더블클릭하여 내용을 편집합니다.",
      "행/열 추가/삭제는 우측 패널에서 가능합니다.",
      "헤더 행의 스타일을 별도로 설정할 수 있습니다.",
    ],
    useCases: ["요금표", "비교표", "스펙 정리", "일정표"],
    Renderer: TableRenderer,
  },
  {
    type: "cultureLetter",
    name: "컬쳐레터",
    description:
      "매거진/뉴스레터 스타일의 섹션입니다. 세리프 타이포그래피와 발행일/호수 정보, 카드형 레이아웃을 지원합니다.",
    category: "special",
    layouts: ["1", "2", "3", "4", "5"],
    layoutLabels: {
      "1": "레이아웃 1",
      "2": "레이아웃 2",
      "3": "레이아웃 3",
      "4": "레이아웃 4",
      "5": "레이아웃 5",
    },
    layoutField: "layout",
    editTips: [
      "타이틀과 본문을 더블클릭하여 편집합니다.",
      "로고/이미지를 클릭하여 교체합니다.",
      "발행일과 호수 정보를 우측 패널에서 설정합니다.",
    ],
    useCases: [
      "뉴스레터 아카이브",
      "매거진 콘텐츠",
      "브랜드 스토리",
      "기업 문화 소개",
    ],
    Renderer: CultureLetterRenderer,
  },
];

// ─────────────────────────────────────────
// 위젯 미리보기 컴포넌트
// ─────────────────────────────────────────
const DESKTOP_W = 1920;
const MOBILE_W = 430;

function WidgetPreview({
  info,
  activeLayout,
  viewport,
}: {
  info: WidgetInfo;
  activeLayout: string;
  viewport: "desktop" | "mobile";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [innerH, setInnerH] = useState(400);

  const renderW = viewport === "mobile" ? MOBILE_W : DESKTOP_W;

  const widget = React.useMemo(() => {
    const w = createWidget(info.type, `help-demo-${info.type}`);
    if (!w) return null;

    if (info.layoutField && (w.data as any)) {
      (w.data as any)[info.layoutField] = activeLayout;
    }
    if (info.variantField && (w.data as any)) {
      (w.data as any)[info.variantField] = activeLayout;
    }

    return w;
  }, [info.type, info.layoutField, info.variantField, activeLayout]);

  useEffect(() => {
    const sync = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.offsetWidth;
      if (viewport === "mobile") {
        // 모바일: 430px → 카드 중앙에 최대 60% 크기로
        setScale(Math.min(cw * 0.6 / MOBILE_W, 1));
      } else {
        setScale(cw / DESKTOP_W);
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [viewport]);

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setInnerH(e.contentRect.height);
    });
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [widget, activeLayout, viewport]);

  if (!widget) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl text-gray-400 text-sm">
        미리보기를 생성할 수 없습니다.
      </div>
    );
  }

  const RendererComponent = info.Renderer;
  const visibleH = Math.min(innerH * scale, 600);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
      style={{ height: visibleH }}
    >
      <div
        className={`absolute pointer-events-none ${
          viewport === "mobile" ? "left-1/2" : "left-0"
        }`}
        style={{
          width: renderW,
          transform: viewport === "mobile"
            ? `scale(${scale}) translateX(-50%)`
            : `scale(${scale})`,
          transformOrigin: viewport === "mobile" ? "top center" : "top left",
        }}
      >
        <div ref={innerRef} style={{ width: renderW }}>
          <RendererComponent widget={widget} viewport={viewport} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 위젯 도움말 카드 컴포넌트
// ─────────────────────────────────────────
function WidgetHelpCard({ info }: { info: WidgetInfo }) {
  const [activeLayout, setActiveLayout] = useState(info.layouts[0]);
  const [previewViewport, setPreviewViewport] = useState<
    "desktop" | "mobile"
  >("desktop");

  return (
    <div
      id={`widget-${info.type}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-24"
    >
      {/* 헤더 */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {info.name}
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {info.type}
              </span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">{info.description}</p>
          </div>
          {info.layouts.length > 1 && (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              레이아웃 {info.layouts.length}종
            </span>
          )}
        </div>
      </div>

      {/* 레이아웃 탭 + 뷰포트 전환 */}
      <div className="px-6 pt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {info.layouts.length > 1 &&
            info.layouts.map((layout) => (
              <button
                key={layout}
                onClick={() => setActiveLayout(layout)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeLayout === layout
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {info.layoutLabels?.[layout] || `레이아웃 ${layout}`}
              </button>
            ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setPreviewViewport("desktop")}
            className={`p-1.5 rounded-md transition-colors ${
              previewViewport === "desktop"
                ? "bg-white text-gray-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setPreviewViewport("mobile")}
            className={`p-1.5 rounded-md transition-colors ${
              previewViewport === "mobile"
                ? "bg-white text-gray-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Smartphone size={14} />
          </button>
        </div>
      </div>

      {/* 미리보기 */}
      <div className="p-6">
        <div className="overflow-auto rounded-xl bg-gray-50 max-h-[500px]">
          <WidgetPreview
            info={info}
            activeLayout={activeLayout}
            viewport={previewViewport}
          />
        </div>
      </div>

      {/* 편집 가이드 + 활용 사례 */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/60 rounded-xl p-4">
          <h4 className="text-xs font-bold text-blue-700 mb-2.5 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
              ?
            </span>
            편집 방법
          </h4>
          <ul className="space-y-1.5">
            {info.editTips.map((tip, i) => (
              <li key={i} className="text-xs text-blue-900/70 flex gap-2">
                <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50/60 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-700 mb-2.5 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
              !
            </span>
            활용 사례
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {info.useCases.map((useCase, i) => (
              <span
                key={i}
                className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 공통 조작법 섹션
// ─────────────────────────────────────────
function CommonGuide() {
  const sections = [
    {
      title: "텍스트 편집",
      icon: PenLine,
      color: "blue",
      image: "/images/help/guide_text_edit.png",
      imageAlt: "텍스트 더블클릭 → 속성 패널에서 폰트 크기/색상/정렬 편집",
      items: [
        {
          action: "텍스트 더블클릭",
          desc: "제목, 설명 등 텍스트 영역을 더블클릭하면 직접 입력/수정할 수 있는 편집 모드에 진입합니다.",
        },
        {
          action: "우측 속성 패널",
          desc: "텍스트를 선택한 상태에서 우측 패널이 열리며, 폰트 크기 / 굵기 / 색상 / 정렬 등을 세부 조정할 수 있습니다.",
        },
        {
          action: "모바일 폰트 크기",
          desc: "속성 패널에서 PC와 모바일 폰트 크기를 별도로 설정할 수 있습니다. 모바일 사이즈를 지정하지 않으면 PC 값이 그대로 적용됩니다.",
        },
      ],
    },
    {
      title: "이미지 관리",
      icon: Upload,
      color: "green",
      image: "/images/help/guide_image_manage.png",
      imageAlt: "이미지 클릭 → 업로드 팝업 → PC/모바일 이미지 분리 설정",
      items: [
        {
          action: "이미지 클릭",
          desc: "이미지 영역을 클릭하면 업로드 팝업이 나타납니다. 새 이미지를 업로드하거나, 이미 올린 이미지 목록에서 선택할 수 있습니다.",
        },
        {
          action: "PC / 모바일 이미지 분리",
          desc: "일부 위젯(이미지 영역, 스트립 배너 등)은 PC용과 모바일용 이미지를 따로 설정할 수 있습니다.",
        },
        {
          action: "이미지 스타일",
          desc: "속성 패널에서 비율(cover/contain), 모서리 둥글기(borderRadius), 크기(width/height) 등을 조정합니다.",
        },
        {
          action: "상단 이미지관리 버튼",
          desc: "툴바의 [이미지관리]를 클릭하면 현재 페이지에 사용된 모든 이미지를 한눈에 보고 교체/삭제할 수 있습니다.",
        },
      ],
    },
    {
      title: "영상 관리",
      icon: Video,
      color: "purple",
      image: "/images/help/guide_video_manage.png",
      imageAlt: "영상 URL 입력 → autoplay/muted 설정 → 썸네일 지정",
      items: [
        {
          action: "영상 URL 입력",
          desc: "영상 영역을 클릭 후 YouTube, Vimeo 등의 URL을 입력합니다. 직접 업로드한 mp4 파일도 사용 가능합니다.",
        },
        {
          action: "자동재생 / 음소거",
          desc: "속성 패널에서 autoplay, muted, loop 등의 옵션을 설정할 수 있습니다.",
        },
        {
          action: "썸네일 이미지",
          desc: "영상이 로드되기 전 표시할 썸네일 이미지를 별도로 설정할 수 있습니다.",
        },
      ],
    },
    {
      title: "항목(아이템) 관리",
      icon: ListPlus,
      color: "amber",
      image: "/images/help/guide_item_manage.png",
      imageAlt: "항목 추가/삭제/드래그 순서 변경 및 열 수 조절",
      items: [
        {
          action: "항목 추가",
          desc: "카드, 프로세스 스텝, FAQ 등에서 [+] 버튼으로 새 항목을 추가합니다. 첫 번째 항목의 스타일이 복제됩니다.",
        },
        {
          action: "항목 삭제",
          desc: "항목을 선택한 후 삭제 버튼(휴지통 아이콘)으로 제거합니다. 최소 1개는 유지됩니다.",
        },
        {
          action: "항목 순서 변경",
          desc: "드래그 핸들을 잡고 위/아래로 끌어 순서를 변경하거나, 화살표 버튼으로 이동합니다.",
        },
        {
          action: "열 수 조절",
          desc: "카드 계열 위젯은 속성 패널에서 한 줄에 보여줄 카드 수(1~4열)를 조정할 수 있습니다.",
        },
      ],
    },
    {
      title: "섹션 관리",
      icon: Layers,
      color: "indigo",
      image: "/images/help/guide_section_manage.png",
      imageAlt: "섹션 추가/순서 변경/삭제 및 레이아웃 전환",
      items: [
        {
          action: "섹션 추가",
          desc: "툴바의 [섹션관리] 또는 섹션 사이의 [+] 버튼으로 새 위젯 섹션을 추가합니다.",
        },
        {
          action: "섹션 순서 변경",
          desc: "섹션 좌측의 드래그 핸들을 잡고 위/아래로 끌어 순서를 변경합니다.",
        },
        {
          action: "섹션 삭제",
          desc: "섹션 우측 상단의 삭제 버튼으로 해당 섹션 전체를 제거합니다.",
        },
        {
          action: "레이아웃 변경",
          desc: "섹션을 선택하면 속성 패널에서 해당 위젯의 레이아웃을 전환할 수 있습니다. 콘텐츠는 유지됩니다.",
        },
      ],
    },
    {
      title: "스타일 & 배경",
      icon: Palette,
      color: "rose",
      image: "/images/help/guide_style_background.png",
      imageAlt: "섹션 배경색/배경 이미지 설정 및 상하 패딩 조절",
      items: [
        {
          action: "섹션 배경색",
          desc: "속성 패널에서 섹션 전체의 배경색을 지정합니다. 배경 이미지도 설정 가능합니다.",
        },
        {
          action: "상하 여백(패딩)",
          desc: "각 섹션의 상단/하단 패딩을 px 단위로 조절하여 섹션 간 간격을 조정합니다.",
        },
        {
          action: "텍스트 정렬",
          desc: "좌측/중앙/우측 정렬을 속성 패널에서 선택합니다.",
        },
      ],
    },
    {
      title: "모바일 · 태블릿 제한사항",
      icon: AlertTriangle,
      color: "orange",
      items: [
        {
          action: "아이콘 카드 — 아이콘 크기",
          desc: "모바일에서 아이콘 크기가 60×60px로 고정됩니다. PC에서 설정한 아이콘 width/height 값은 모바일에 반영되지 않습니다.",
        },
        {
          action: "아이콘 카드 — 열 수 · 간격",
          desc: "모바일에서 최대 2열, 태블릿에서 최대 3열로 제한됩니다. 간격(gap)도 모바일 12px, 태블릿 20px로 고정됩니다.",
        },
        {
          action: "프로세스 카드 — 스텝 아이콘",
          desc: "모바일에서 스텝 아이콘이 96×96px로 고정됩니다. PC 설정 값(160px 등)은 모바일에 적용되지 않습니다.",
        },
        {
          action: "프로세스 카드 — 간격",
          desc: "모바일에서 스텝 간 간격이 gap-6(24px)으로 고정됩니다. PC에서 설정한 간격 값은 반영되지 않습니다.",
        },
        {
          action: "비교 카드 — 중간 열 너비",
          desc: "레이아웃 2의 가운데 비교 열 너비가 PC 240px / 태블릿 200px / 모바일 120px로 고정됩니다.",
        },
        {
          action: "FAQ — 버튼 · 텍스트 크기",
          desc: "모바일에서 열기/닫기 버튼 크기(40×40px)와 질문 텍스트(20px)가 고정됩니다.",
        },
        {
          action: "텍스트 구조 — 이미지 높이",
          desc: "일부 레이아웃에서 이미지 높이가 태블릿 358px, 모바일 160px로 고정됩니다. PC에서 설정한 이미지 높이는 무시됩니다.",
        },
        {
          action: "테이블 — 셀 너비",
          desc: "모바일에서 테이블 셀 너비가 80px로 고정됩니다(PC 120px). 사용자 지정 셀 너비는 반영되지 않습니다.",
        },
        {
          action: "이미지 카드 — 헤더 간격",
          desc: "모바일에서 헤더 영역의 간격과 콘텐츠 패딩이 자동 축소됩니다.",
        },
        {
          action: "컬처레터 — 레이아웃 패딩",
          desc: "태블릿/모바일에서 전체 패딩과 간격이 고정 값으로 적용됩니다. PC에서 설정한 여백이 그대로 반영되지 않습니다.",
        },
        {
          action: "전체 섹션 — 좌우 패딩",
          desc: "모바일 20px, 태블릿 24px로 고정됩니다. 이 값은 콘텐츠 영역이 화면 밖으로 넘치지 않도록 하기 위한 안전 여백입니다.",
        },
      ],
    },
    {
      title: "단축키 & 도구",
      icon: MousePointer2,
      color: "slate",
      items: [
        {
          action: "Cmd + Z",
          desc: "마지막 작업을 실행 취소합니다. (이전으로 버튼과 동일)",
        },
        {
          action: "Cmd + 마우스 휠",
          desc: "캔버스 배율을 확대/축소합니다. Cmd+0으로 원래 크기로 복원합니다.",
        },
        {
          action: "미리보기",
          desc: "현재 편집 중인 페이지를 실제 사용자가 보는 형태로 미리 확인합니다.",
        },
        {
          action: "초기화",
          desc: "모든 편집 내용을 삭제하고 기본 템플릿으로 되돌립니다. (되돌릴 수 없음)",
        },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; iconBg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50/70", iconBg: "bg-blue-600", text: "text-blue-900", border: "border-blue-100" },
    green: { bg: "bg-emerald-50/70", iconBg: "bg-emerald-600", text: "text-emerald-900", border: "border-emerald-100" },
    purple: { bg: "bg-violet-50/70", iconBg: "bg-violet-600", text: "text-violet-900", border: "border-violet-100" },
    amber: { bg: "bg-amber-50/70", iconBg: "bg-amber-500", text: "text-amber-900", border: "border-amber-100" },
    indigo: { bg: "bg-indigo-50/70", iconBg: "bg-indigo-600", text: "text-indigo-900", border: "border-indigo-100" },
    rose: { bg: "bg-rose-50/70", iconBg: "bg-rose-500", text: "text-rose-900", border: "border-rose-100" },
    orange: { bg: "bg-orange-50/70", iconBg: "bg-orange-500", text: "text-orange-900", border: "border-orange-200" },
    slate: { bg: "bg-slate-50/70", iconBg: "bg-slate-700", text: "text-slate-900", border: "border-slate-200" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const c = colorMap[section.color] || colorMap.slate;
          const sectionAny = section as any;
          return (
            <div
              key={section.title}
              className={`rounded-xl border overflow-hidden ${c.bg} ${c.border}`}
            >
              {sectionAny.image && (
                <div className="relative w-full bg-white border-b border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sectionAny.image}
                    alt={sectionAny.imageAlt || section.title}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  <div
                    className="hidden w-full h-[140px] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400"
                  >
                    <div className="text-center">
                      <ImageIcon size={28} className="mx-auto mb-1.5 opacity-40" />
                      <span className="text-xs">캡처 이미지 준비 중</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-6 h-6 rounded-lg ${c.iconBg} flex items-center justify-center`}
                  >
                    <Icon size={13} className="text-white" />
                  </div>
                  <h3 className={`text-sm font-bold ${c.text}`}>
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <div key={item.action}>
                      <div className="text-xs font-semibold text-gray-800">
                        {item.action}
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ─────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────
type SidebarTab = "guide" | "widgets";

export default function TemplateHelpPage() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("guide");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredWidgets = WIDGET_CATALOG.filter((w) => {
    const matchSearch =
      !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !activeCategory || w.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const groupedWidgets = CATEGORIES.map((cat) => ({
    ...cat,
    widgets: filteredWidgets.filter((w) => w.category === cat.id),
  })).filter((group) => group.widgets.length > 0);

  const sidebarItems: {
    id: SidebarTab;
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    {
      id: "guide",
      label: "빌더 사용 가이드",
      icon: BookOpen,
      desc: "편집 도구 사용법",
    },
    {
      id: "widgets",
      label: "위젯 섹션 목록",
      icon: LayoutGrid,
      desc: `${WIDGET_CATALOG.length}개 위젯 미리보기`,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50/80 flex"
      style={{ fontFamily: "Pretendard, sans-serif" }}
    >
      {/* 좌측 사이드바 */}
      <aside className="sticky top-0 h-screen w-[220px] shrink-0 bg-white border-r border-gray-200/60 flex flex-col z-50">
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">
                템플릿 빌더
              </h1>
              <p className="text-[11px] text-gray-400">도움말</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-semibold truncate ${
                      isActive ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 text-[10px] text-gray-300">
          Basic Solution Builder
        </div>
      </aside>

      {/* 우측 콘텐츠 영역 */}
      <div className="flex-1 min-w-0">
        {/* 위젯 탭일 때만 검색 + 카테고리 필터 헤더 표시 */}
        {activeTab === "widgets" && (
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
            <div className="max-w-5xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    위젯 섹션 목록
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    각 위젯의 레이아웃 미리보기와 편집 팁을 확인하세요
                  </p>
                </div>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="위젯 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all w-60"
                  />
                </div>
              </div>

              {/* 카테고리 필터 */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    !activeCategory
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  전체
                </button>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const count = WIDGET_CATALOG.filter(
                    (w) => w.category === cat.id,
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === cat.id ? null : cat.id,
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                        activeCategory === cat.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Icon size={12} />
                      {cat.label}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeCategory === cat.id
                            ? "bg-blue-500 text-blue-100"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>
        )}

        {/* 가이드 탭 헤더 */}
        {activeTab === "guide" && (
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
            <div className="max-w-5xl mx-auto px-6 py-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                빌더 사용 가이드
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                텍스트, 이미지, 영상, 항목 등을 편집하고 관리하는 방법을
                안내합니다.
              </p>
            </div>
          </header>
        )}

        {/* 콘텐츠 */}
        <main className="max-w-5xl mx-auto px-6 py-8" ref={contentRef}>
          {activeTab === "guide" && <CommonGuide />}

          {activeTab === "widgets" && (
            <>
              {groupedWidgets.map((group) => (
                <div key={group.id} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <group.icon size={16} className="text-gray-400" />
                    <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                      {group.label}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200 ml-2" />
                  </div>
                  <div className="space-y-6">
                    {group.widgets.map((widget) => (
                      <WidgetHelpCard key={widget.type} info={widget} />
                    ))}
                  </div>
                </div>
              ))}

              {filteredWidgets.length === 0 && (
                <div className="text-center py-20">
                  <Search
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />
                  <p className="text-sm text-gray-400">
                    &quot;{searchQuery}&quot;에 해당하는 위젯을 찾을 수
                    없습니다.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-black transition-all hover:-translate-y-0.5 z-50"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}
