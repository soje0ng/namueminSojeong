"use client";

import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Edit2, Save } from "lucide-react";

import { usePopupStore } from "@/store/console/usePopupStore";
import { CONSOLE_CONFIRM_MESSAGES } from "@/constants/console/messages";
import ConsoleDialogContent from "@/components/console/common/ConsoleDialogContent";
import Builder from "@/components/console/template/Builder";
import {
  MainTitleRenderer,
  VideoRenderer,
  GridCardRenderer,
  InfoBannerRenderer,
  ProcessRenderer,
  IconCardRenderer,
  TableRenderer,
  FaqRenderer,
  TextSectionRenderer,
  BannerSectionRenderer,
  CardRenderer,
  TitleBannerRenderer,
  ImageAreaRenderer,
  TitleTextRenderer,
  TabButtonRenderer,
  TextStructureRenderer,
  ImageCardRenderer,
  StripBannerRenderer,
} from "@/components/console/template/Widgets";
import { ComparisonCardRenderer } from "@/components/console/template/widgets/ComparisonCardRenderer";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DEFAULT_TEMPLATE } from "@/constants/console/widgetDefaults";
import type { PageData, Widget } from "@/types/console/template";

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
  titleBanner: TitleBannerRenderer,
  imageArea: ImageAreaRenderer,
  titleText: TitleTextRenderer,
  tabButton: TabButtonRenderer,
  textStructure: TextStructureRenderer,
  imageCard: ImageCardRenderer,
  comparisonCard: ComparisonCardRenderer,
  processCard: ProcessRenderer,
  stripBanner: StripBannerRenderer,
};

const convertPageDataToHtml = (data: PageData): string => {
  const htmlParts: string[] = [];

  data.sections.forEach((section) => {
    section.widgets.forEach((widget: Widget) => {
      if (widget.type === "codeSection") {
        htmlParts.push((widget as any).data.code);
        return;
      }

      const Renderer = RENDERER_MAP[widget.type];
      if (Renderer) {
        const html = ReactDOMServer.renderToStaticMarkup(
          <Renderer
            widget={widget}
            viewport="desktop"
            onElementSelect={() => {}}
          />,
        );
        htmlParts.push(html);
      }
    });
  });

  return htmlParts.join("\n");
};

interface TemplatePopProps {
  onSave: (htmlCode: string, pageData: PageData) => void;
  initialPageData?: PageData;
}

export default function TemplatePop({
  onSave,
  initialPageData,
}: TemplatePopProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"builder" | "preview">("builder");
  const [currentData, setCurrentData] = useState<PageData>(
    initialPageData || DEFAULT_TEMPLATE,
  );

  useEffect(() => {
    setCurrentData(initialPageData || DEFAULT_TEMPLATE);
  }, [initialPageData]);
  const { setConfirmPop } = usePopupStore();

  // 저장 확인
  const handleConfirmSave = (newData: PageData) => {
    setConfirmPop(true, CONSOLE_CONFIRM_MESSAGES.SAVE, 2, () =>
      handleSave(newData),
    );
  };

  // 저장하기
  const handleSave = (newData: PageData) => {
    setCurrentData(newData);
    const htmlCode = convertPageDataToHtml(newData);
    onSave(htmlCode, newData);
    setOpen(false);
  };

  const handlePreview = (newData: PageData) => {
    setCurrentData(newData);
    setMode("preview");
  };

  const handleBackToBuilder = () => {
    setMode("builder");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // 팝업 닫을 때 builder 모드로 리셋
    if (!isOpen) {
      setMode("builder");
    }
  };

  const handleClose = () => {
    setConfirmPop(
      true,
      `템플릿 설정을 종료하면 변경된 내용이 저장되지 않습니다. <br />종료하시겠습니까?`,
      2,
      () => {
        setOpen(false);
        setMode("builder");
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg h-[34px] rounded-[8px] border border-[#DADEE4] text-[#666] bg-white px-[16px] font-[500]"
        >
          템플릿 설정
        </button>
      </DialogTrigger>
      <ConsoleDialogContent
        onClose={handleClose}
        title="템플릿 설정"
        className="max-w-auto !rounded-none"
      >
        <div className="h-[calc(100vh-61px)] overflow-hidden">
          {mode === "builder" ? (
            <Builder
              initialData={currentData}
              onSave={handleConfirmSave}
              onPreview={handlePreview}
            />
          ) : (
            <div className="relative h-full overflow-y-auto bg-white">
              {/* Preview 모드 컨트롤 버튼 */}
              <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                <button
                  onClick={() => handleSave(currentData)}
                  className="flex transform items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-black"
                >
                  <Save size={18} /> 이 상태 저장하기
                </button>
                <button
                  onClick={handleBackToBuilder}
                  className="flex transform items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
                >
                  <Edit2 size={18} /> 에디터로 돌아가기
                </button>
              </div>

              {/* Preview 콘텐츠 */}
              <main className="flex-1 pointer-events-none select-none">
                {currentData.sections.map((section) => (
                  <section key={section.id} className="relative w-full">
                    {section.widgets.map((widget) => (
                      <div key={widget.id} className="relative">
                        {widget.type === "mainTitle" && (
                          <MainTitleRenderer widget={widget as any} />
                        )}
                        {widget.type === "video" && (
                          <VideoRenderer widget={widget as any} />
                        )}
                        {widget.type === "gridCard" && (
                          <GridCardRenderer widget={widget as any} />
                        )}
                        {widget.type === "infoBanner" && (
                          <InfoBannerRenderer widget={widget as any} />
                        )}
                        {widget.type === "process" && (
                          <ProcessRenderer widget={widget as any} />
                        )}
                        {widget.type === "processCard" && (
                          <ProcessRenderer widget={widget as any} />
                        )}
                        {widget.type === "iconCard" && (
                          <IconCardRenderer widget={widget as any} />
                        )}
                        {widget.type === "table" && (
                          <TableRenderer widget={widget as any} />
                        )}
                        {widget.type === "faq" && (
                          <FaqRenderer widget={widget as any} />
                        )}
                        {widget.type === "textSection" && (
                          <TextSectionRenderer widget={widget as any} />
                        )}
                        {widget.type === "bannerSection" && (
                          <BannerSectionRenderer widget={widget as any} />
                        )}
                        {widget.type === "cardList" && (
                          <CardRenderer widget={widget as any} />
                        )}
                        {widget.type === "titleBanner" && (
                          <TitleBannerRenderer widget={widget as any} />
                        )}
                        {widget.type === "imageArea" && (
                          <ImageAreaRenderer widget={widget as any} />
                        )}
                        {widget.type === "titleText" && (
                          <TitleTextRenderer widget={widget as any} />
                        )}
                        {widget.type === "tabButton" && (
                          <TabButtonRenderer widget={widget as any} />
                        )}
                        {widget.type === "textStructure" && (
                          <TextStructureRenderer widget={widget as any} />
                        )}
                        {widget.type === "imageCard" && (
                          <ImageCardRenderer widget={widget as any} />
                        )}
                        {widget.type === "comparisonCard" && (
                          <ComparisonCardRenderer widget={widget as any} />
                        )}
                        {widget.type === "stripBanner" && (
                          <StripBannerRenderer widget={widget as any} />
                        )}
                      </div>
                    ))}
                  </section>
                ))}
              </main>
            </div>
          )}
        </div>
      </ConsoleDialogContent>
    </Dialog>
  );
}
