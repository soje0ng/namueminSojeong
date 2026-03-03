import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Code, Maximize2, Save } from "lucide-react";

import { usePopupStore } from "@/store/console/usePopupStore";
import { PageData, Widget } from "@/types/console/template";
import ConsoleDialogContent from "@/components/console/common/ConsoleDialogContent";
import MonacoHtmlEditor from "@/components/console/form/MonacoEditor";
import { Dialog } from "@/components/ui/dialog";

import { MainTitleRenderer } from "../widgets/MainTitleRenderer";
import { TextSectionRenderer } from "../widgets/TextSectionRenderer";
import { VideoRenderer } from "../widgets/VideoRenderer";
import { GridCardRenderer } from "../widgets/GridCardRenderer";
import { InfoBannerRenderer } from "../widgets/InfoBannerRenderer";
import { ProcessRenderer } from "../widgets/ProcessRenderer";
import { IconCardRenderer } from "../widgets/IconCardRenderer";
import { TableRenderer } from "../widgets/TableRenderer";
import { FaqRenderer } from "../widgets/FaqRenderer";
import { BannerSectionRenderer } from "../widgets/BannerSectionRenderer";
import { CardRenderer } from "../widgets/CardRenderer";

export interface HtmlCodeEditorProps {
  widget: Widget;
  pageData: PageData;
  selectedSectionId: string | null;
  selectedWidgetId: string | null;
  setPageData: (data: PageData) => void;
  pushHistory: () => void;
}

const RENDERER_MAP: Record<string, React.ComponentType<any>> = {
  mainTitle: MainTitleRenderer,
  textSection: TextSectionRenderer,
  video: VideoRenderer,
  gridCard: GridCardRenderer,
  infoBanner: InfoBannerRenderer,
  process: ProcessRenderer,
  iconCard: IconCardRenderer,
  table: TableRenderer,
  faq: FaqRenderer,
  bannerSection: BannerSectionRenderer,
  cardList: CardRenderer,
};

// HTML 포맷팅 함수
const formatHtml = (html: string): string => {
  const selfClosingTags = ["img", "br", "hr", "input", "meta", "link"];
  let formatted = "";
  let indent = 0;
  const indentStr = "  ";

  // 태그 단위로 분리
  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];

  tokens.forEach((token) => {
    const trimmed = token.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("</")) {
      // 닫는 태그
      indent = Math.max(0, indent - 1);
      formatted += indentStr.repeat(indent) + trimmed + "\n";
    } else if (trimmed.startsWith("<")) {
      // 여는 태그
      formatted += indentStr.repeat(indent) + trimmed + "\n";
      const tagName = trimmed.match(/<(\w+)/)?.[1]?.toLowerCase();
      if (
        tagName &&
        !selfClosingTags.includes(tagName) &&
        !trimmed.endsWith("/>")
      ) {
        indent++;
      }
    } else {
      // 텍스트 노드
      formatted += indentStr.repeat(indent) + trimmed + "\n";
    }
  });

  return formatted.trim();
};

export const HtmlCodeEditor: React.FC<HtmlCodeEditorProps> = ({
  widget,
  pageData,
  selectedSectionId,
  selectedWidgetId,
  setPageData,
  pushHistory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const { setConfirmPop } = usePopupStore();

  const getHtmlCode = () => {
    // codeSection일 경우 저장된 코드 반환
    if (widget.type === "codeSection") {
      return (widget.data as any).code || "";
    }

    const Renderer = RENDERER_MAP[widget.type];
    if (!Renderer) return "이 위젯은 HTML 변환을 지원하지 않습니다.";
    try {
      let rawHtml = ReactDOMServer.renderToStaticMarkup(
        <Renderer
          widget={widget}
          viewport="desktop"
          onElementSelect={() => {}}
        />,
      );
      // React 18+에서 자동 생성되는 preload link 태그 제거
      rawHtml = rawHtml.replace(/<link\s+rel="preload"[^>]*>/gi, "");
      return formatHtml(rawHtml);
    } catch (e) {
      return "HTML 변환 중 오류가 발생했습니다.";
    }
  };

  const handleOpenExpanded = () => {
    setEditedCode(getHtmlCode());
    setIsExpanded(true);
  };

  const handleSaveCode = () => {
    setConfirmPop(
      true,
      "저장하면 코드 편집 모드로 전환되며, GUI 설정을 사용할 수 없게 됩니다. \n저장하시겠습니까?",
      2,
      () => {
        const sectionIdx = pageData.sections.findIndex(
          (s) => s.id === selectedSectionId,
        );
        if (sectionIdx === -1) return;
        const widgetIdx = pageData.sections[sectionIdx].widgets.findIndex(
          (w) => w.id === selectedWidgetId,
        );
        if (widgetIdx === -1) return;

        const newWidget: Widget = {
          ...widget,
          type: "codeSection",
          data: { code: editedCode },
        };

        const newSections = [...pageData.sections];
        newSections[sectionIdx].widgets[widgetIdx] = newWidget;
        setPageData({ ...pageData, sections: newSections });
        pushHistory();
        setIsExpanded(false);
      },
    );
  };

  const handleClose = () => {
    setConfirmPop(
      true,
      "편집하던 코드를 저장하지 않고 종료하시겠습니까?",
      2,
      () => {
        setIsExpanded(false);
      },
    );
  };

  return (
    <>
      <div className="mt-6">
        <div className="pb-2 mb-2">
          <button
            onClick={handleOpenExpanded}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all w-full"
          >
            <Maximize2 size={14} /> HTML 코드 보기/수정
          </button>
        </div>
        <p className="text-[10px] text-gray-400">
          버튼을 클릭하여 HTML 코드를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      {/* 확장 모달 */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <ConsoleDialogContent
          onClose={handleClose}
          title={
            <div className="flex justify-between pr-3">
              <div className="flex items-center gap-2">
                <Code size={20} className="text-blue-400" /> HTML 코드 편집
              </div>
              <button
                onClick={handleSaveCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
              >
                <Save size={16} /> 저장
              </button>
            </div>
          }
          className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 gap-0"
        >
          {widget.type !== "codeSection" && (
            <p className="px-6 py-2 text-xs text-yellow-600 bg-yellow-50 border-b">
              ⚠️ 저장하면 코드 편집 모드로 전환되며, GUI 설정을 사용할 수 없게
              됩니다.
            </p>
          )}
          <div className="flex-1 overflow-auto p-4 bg-white">
            <MonacoHtmlEditor
              value={editedCode}
              onChange={setEditedCode}
              height="calc(95vh - 160px)"
            />
          </div>
        </ConsoleDialogContent>
      </Dialog>
    </>
  );
};

export default HtmlCodeEditor;
