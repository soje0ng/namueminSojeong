import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  getPaddingClass,
  getVerticalPaddingClass,
} from "./WidgetUtils";

export const TAB_BUTTON_DEFAULTS = {
  layout: "1",
  subTitle: "( 서브타이틀 )",
  subTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  desc: "이민 프로그램명 입력",
  descStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6b7280",
  },
  items: [
    {
      id: "tab-1",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#ffffff",
      },
      active: true,
      link: "#",
    },
    {
      id: "tab-2",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-3",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-4",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-5",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-6",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-7",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
      active: false,
      link: "#",
    },
    {
      id: "tab-8",
      title: "TAB 명 링크 연결",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6b7280",
      },
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
  const style = useWidgetStyle(w.style, viewport as any);
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
            className={`self-stretch ${getPaddingClass(viewport)} inline-flex flex-col justify-start items-center w-full hover:ring-2 hover:ring-transparent transition-all`}
            style={{
              ...style,
              paddingTop: viewport === "mobile" ? "30px" : style.paddingTop,
              paddingBottom: viewport === "mobile" ? "30px" : style.paddingBottom,
              gap: viewport === "mobile" ? "24px" : "40px",
            }}
          >
            <div
              className={`flex flex-col justify-start items-center text-center w-full max-w-[800px] ${viewport === "mobile" ? "gap-0" : ""}`}
            >
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    color: "#285DE1",
                    ...getElementStyle(data.subTitleStyle, viewport as any),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="text-center justify-start text-시안-mode-gray90 text-2xl xl:text-4xl font-bold leading-tight xl:leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                  style={getElementStyle(data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.descStyle, viewport as any),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            <div
              className={`self-stretch w-full border-t border-시안-mode-gray20 grid ${viewport === "mobile" ? "grid-cols-2" : ""}`}
              style={{
                gap: w.style?.gap
                  ? formatUnit(w.style.gap)
                  : data.itemGap
                    ? formatUnit(data.itemGap)
                    : undefined,
                gridTemplateColumns:
                  viewport === "mobile"
                    ? undefined
                    : `repeat(${visibleColumns}, minmax(0, 1fr))`,
              }}
            >
              {(data.items || []).map((item: any, i: number) => {
                if (!item) return null;

                const isEditing = !!onElementSelect;
                const isActive = isEditing
                  ? !!item.active
                  : item.active ||
                    (i === 0 &&
                      !(data.items || []).some((x: any) => x && x.active));

                const itemStyle = item.style
                  ? getElementStyle(item.style, viewport)
                  : {};
                const titleStyle = item.titleStyle
                  ? getElementStyle(item.titleStyle, viewport)
                  : {};

                const {
                  backgroundColor: titleBg,
                  backgroundImage: titleBgImg,
                  ...textOnlyStyle
                } = titleStyle;

                const containerBg = item.style?.backgroundColor || titleBg;
                const containerBgImg = item.style?.backgroundImage
                  ? `url(${item.style.backgroundImage})`
                  : titleBgImg;
                const hasCustomBg = !!(containerBg || containerBgImg);

                if (isActive) {
                  return (
                    <div
                      key={item.id}
                      className="w-full px-4 py-3 border-b border-시안-mode-gray20 flex justify-center items-center gap-2.5 hover:ring-2 hover:ring-blue-300 cursor-pointer transition-all"
                      style={{
                        ...itemStyle,
                        backgroundColor: containerBg,
                        backgroundImage: !hasCustomBg
                          ? "linear-gradient(90deg, var(--mode-Primary30, #5B88F5) 0%, var(--mode-Primary70, #295E92) 100%)"
                          : containerBgImg,
                      }}
                    >
                      <SafeHtml
                        html={item.title || "TAB 명 링크 연결"}
                        className={`flex-1 text-center justify-start font-medium leading-8 break-keep ${
                          !item.titleStyle?.color ? "text-white" : ""
                        } hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded`}
                        style={textOnlyStyle}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemTitle", item.id);
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className={`w-full px-4 py-3 border-b border-시안-mode-gray20 flex justify-center items-center gap-2.5 hover:ring-2 hover:ring-blue-300 cursor-pointer transition-all ${
                      !hasCustomBg ? "bg-white" : ""
                    }`}
                    style={{
                      ...itemStyle,
                      backgroundColor: containerBg,
                      backgroundImage: containerBgImg,
                    }}
                  >
                    <SafeHtml
                      html={item.title || "TAB 명 링크 연결"}
                      className={`flex-1 text-center justify-start font-medium leading-8 break-keep ${
                        !item.titleStyle?.color ? "text-시안-mode-gray50" : ""
                      } hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded`}
                      style={textOnlyStyle}
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
