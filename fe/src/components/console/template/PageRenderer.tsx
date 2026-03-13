"use client";

import type { PageData, Widget } from "@/types/console/template";

import {
  BannerSectionRenderer,
  CardRenderer,
  FaqRenderer,
  GridCardRenderer,
  IconCardRenderer,
  InfoBannerRenderer,
  ImageAreaRenderer,
  MainTitleRenderer,
  ProcessRenderer,
  TableRenderer,
  TextSectionRenderer,
  TitleBannerRenderer,
  VideoRenderer,
  TitleTextRenderer,
  TabButtonRenderer,
  TextStructureRenderer,
  ImageCardRenderer,
  StripBannerRenderer,
  CultureLetterRenderer,
} from "./Widgets";
import { ComparisonCardRenderer } from "./widgets/ComparisonCardRenderer";

interface PageRendererProps {
  pageData: PageData;
  viewport?: "desktop" | "tablet" | "mobile";
}

const renderWidget = (
  widget: Widget,
  viewport: "desktop" | "tablet" | "mobile",
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = { widget: widget as any, viewport };

  switch (widget.type) {
    case "mainTitle":
      return <MainTitleRenderer key={widget.id} {...props} />;
    case "video":
      return <VideoRenderer key={widget.id} {...props} />;
    case "gridCard":
      return <GridCardRenderer key={widget.id} {...props} />;
    case "infoBanner":
      return <InfoBannerRenderer key={widget.id} {...props} />;
    case "process":
    case "processCard":
      return <ProcessRenderer key={widget.id} {...props} />;
    case "imageCard":
      return <ImageCardRenderer key={widget.id} {...props} />;
    case "iconCard":
      return <IconCardRenderer key={widget.id} {...props} />;
    case "table":
      return <TableRenderer key={widget.id} {...props} />;
    case "table":
      return <TableRenderer key={widget.id} {...props} />;
    case "faq":
      return <FaqRenderer key={widget.id} {...props} />;
    case "textSection":
      return <TextSectionRenderer key={widget.id} {...props} />;
    case "bannerSection":
      return <BannerSectionRenderer key={widget.id} {...props} />;
    case "cardList":
      return <CardRenderer key={widget.id} {...props} />;
    case "titleBanner":
      return <TitleBannerRenderer key={widget.id} {...props} />;
    case "imageArea":
      return <ImageAreaRenderer key={widget.id} {...props} />;
    case "titleText":
      return <TitleTextRenderer key={widget.id} {...props} />;
    case "tabButton":
      return <TabButtonRenderer key={widget.id} {...props} />;
    case "comparisonCard":
      return <ComparisonCardRenderer key={widget.id} {...props} />;
    case "textStructure":
      return <TextStructureRenderer key={widget.id} {...props} />;
    case "stripBanner":
      return <StripBannerRenderer key={widget.id} {...props} />;
    case "cultureLetter":
      return <CultureLetterRenderer key={widget.id} {...props} />;
    default:
      return (
        <div
          key={widget.id}
          className="w-full min-h-[300px] flex mx-auto max-w-full my-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center"
        >
          <div className="text-center">
            <p className="text-xl font-bold text-gray-400">디자인 예정</p>
            <p className="text-sm text-gray-500 mt-2 font-mono bg-white px-3 py-1 rounded shadow-sm">
              {widget.type} / 레이아웃 {(widget.data as any)?.layout || 1}
            </p>
          </div>
        </div>
      );
  }
};

export default function PageRenderer({
  pageData,
  viewport = "desktop",
}: PageRendererProps) {
  return (
    <div className="bg-white">
      {pageData.sections.map((section) => (
        <section
          key={section.id}
          className="relative w-full"
          style={{ backgroundColor: section.backgroundColor }}
        >
          {section.widgets.map((widget) => renderWidget(widget, viewport))}
        </section>
      ))}
    </div>
  );
}
