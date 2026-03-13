import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  getPaddingClass,
} from "./WidgetUtils";

export const TAB_BUTTON_DEFAULTS = {
  layout: "1",
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", fontWeight: "500", color: "#285DE1" },
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  items: [
    {
      id: "tab-1",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#ffffff" },
      active: true,
      link: "#",
    },
    {
      id: "tab-2",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-3",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-4",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-5",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-6",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-7",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
    {
      id: "tab-8",
      title: "TAB 명 링크 연결",
      titleStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
      active: false,
      link: "#",
    },
  ],
};

export const TabButtonRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";

  if (layout === "1") {
    const itemCount = (data.items || []).length;
    const visibleColumns = itemCount >= 4 ? 4 : itemCount || 1;

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center text-center w-full max-w-[800px]">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport as any),
                    color: "#285DE1",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemTitle", item.id);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback Content
  return (
    <section
      style={style}
      className={`w-full relative overflow-hidden group hover:ring-2 hover:ring-blue-500 transition-all ${!data.imageUrl && !data.videoUrl ? "bg-white" : ""}`}
    >
      <div
        className={`mx-auto w-full max-w-[1920px] ${getPaddingClass(viewport)} py-12 md:py-24 relative z-10`}
      >
        <div className="flex flex-col max-w-4xl mx-auto items-center text-center opacity-50 p-10 bg-시안-mode-gray10 rounded-xl">
          <p className="text-시안-mode-gray50 font-bold mb-2">
            TabButton 위젯 레이아웃 영역입니다.
          </p>
          <p className="text-시안-mode-gray40 text-sm">
            레이아웃 {layout} 번이 존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
};
