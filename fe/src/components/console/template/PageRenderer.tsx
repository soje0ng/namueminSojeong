"use client";

import type { PageData, Widget } from "@/types/console/template";

import { getTemplateWidgetRenderer } from "./WidgetRendererRegistry";

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

  if (widget.type === "codeSection") {
    return (
      <div
        key={widget.id}
        className="w-full"
        dangerouslySetInnerHTML={{
          __html: (widget.data as any).code || "",
        }}
      />
    );
  }

  const Renderer = getTemplateWidgetRenderer(widget.type);
  if (Renderer) return <Renderer key={widget.id} {...props} />;

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
