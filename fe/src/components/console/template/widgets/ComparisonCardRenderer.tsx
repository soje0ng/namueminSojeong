import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
} from "./WidgetUtils";

export const COMPARISON_CARD_DEFAULTS = {
  layout: "1",
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "36px",
    fontSizeMobile: "28px",
    fontWeight: "700",
  },
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", color: "#666666" },
  items: [
    {
      id: "1",
      iconUrl: "/images/placeholder/card-lg.jpg",
      title: "프로그램 특징",
      titleStyle: { fontSize: "30px", fontWeight: "500", color: "#666666" },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: { fontSize: "20px" },
    },
    {
      id: "2",
      iconUrl: "/images/placeholder/section-image.jpg",
      title: "프로그램 특징",
      titleStyle: { fontSize: "30px", fontWeight: "500", color: "#ffffff" },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: { fontSize: "20px" },
    },
  ],
};

export const ComparisonCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";

  if (layout === "1" || layout === "layout1") {
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;

    return (
      <section
        style={{
          ...style,
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
        className="w-full h-auto"
      >
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            style={{
              backgroundColor: style?.backgroundColor || "#FFFFFF",
              backgroundImage: style?.backgroundImage || "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className="self-stretch inline-flex justify-center items-center flex-wrap xl:flex-nowrap"
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "56px" }}
            >
              {items.slice(0, 2).map((item: any, idx: number) => (
                <React.Fragment key={item.id || idx}>
                  <div
                    className={`flex-1 inline-flex flex-col justify-center items-center w-full ${idx === 0 ? "max-w-[440px]" : "max-w-[560px]"}`}
                  >
                    <div
                      className={`${idx === 0 ? "w-full max-w-96 min-h-60" : "w-full max-w-[560px] min-h-60"} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative`}
                      style={{ height: data.imageHeight || "320px" }}
                    >
                      <UniversalMedia
                        url={
                          item.iconUrl ||
                          item.icon ||
                          item.image ||
                          (idx === 0
                            ? "/images/placeholder/card-lg.jpg"
                            : "/images/placeholder/section-image.jpg")
                        }
                        className="w-full h-full object-cover"
                        alt="comparison image"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("icon", item.id);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        backgroundImage:
                          idx === 1
                            ? "linear-gradient(to bottom right, #3b82f6, #2dd4bf, #22c55e)"
                            : "none",
                      }}
                      className={`self-stretch py-5 ${idx === 0 ? "bg-시안-mode-gray5" : ""} inline-flex justify-center items-center gap-2.5`}
                    >
                      <SafeHtml
                        html={item.title || "프로그램 특징"}
                        className={`justify-start ${idx === 0 ? "text-시안-mode-gray7" : "text-시안-mode-gray0"} text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text`}
                        style={getElementStyle(
                          item.titleStyle,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemTitle", item.id);
                        }}
                      />
                    </div>
                    <div
                      className="self-stretch flex flex-col justify-start items-start"
                      style={{ gap: "0px" }}
                    >
                      {[1, 2, 3].map((num) => {
                        const fallbackLines = (
                          item.desc ||
                          "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력"
                        ).split("\n");
                        const defaultDesc =
                          fallbackLines[num - 1] || "프로그램 특징 내용 입력";
                        const descVal =
                          item[`desc${num}`] !== undefined
                            ? item[`desc${num}`]
                            : defaultDesc;
                        return (
                          <div
                            key={num}
                            className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                          >
                            <SafeHtml
                              html={descVal}
                              className="text-center justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                              style={getElementStyle(
                                item.descStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(`itemDesc${num}`, item.id);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {idx === 0 && (
                    <div className="hidden xl:block w-px self-stretch bg-시안-mode-gray2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2" || layout === "layout2") {
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;

    return (
      <section
        style={{
          ...style,
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
        className="w-full h-auto"
      >
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            style={{
              backgroundColor: style?.backgroundColor || "#FFFFFF",
              backgroundImage: style?.backgroundImage || "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
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
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className="self-stretch border-t border-시안-mode-gray95 inline-flex justify-center items-start overflow-hidden flex-wrap xl:flex-nowrap"
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "0px" }}
            >
              {/* Left Item */}
              <div className="flex-1 inline-flex flex-col justify-center items-center w-full">
                <div className="self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5">
                  <SafeHtml
                    html={items[0]?.title || "프로그램 특징"}
                    className="justify-start text-시안-mode-gray50 text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={getElementStyle(
                      items[0]?.titleStyle,
                      viewport as any,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", items[0]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative"
                  style={{ height: data.imageHeight || "320px" }}
                >
                  <UniversalMedia
                    url={
                      items[0]?.iconUrl ||
                      items[0]?.icon ||
                      items[0]?.image ||
                      "/images/placeholder/section-image.jpg"
                    }
                    className="w-full h-full object-cover"
                    alt="left comparison image"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("icon", items[0]?.id);
                    }}
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start w-full">
                  {[1, 2, 3].map((num) => {
                    const fallbackLines = (
                      items[0]?.desc ||
                      "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력"
                    ).split("\n");
                    const defaultDesc =
                      fallbackLines[num - 1] || "프로그램 특징 내용 입력";
                    const descVal =
                      items[0]?.[`desc${num}`] !== undefined
                        ? items[0]?.[`desc${num}`]
                        : defaultDesc;
                    return (
                      <div
                        key={num}
                        className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                      >
                        <SafeHtml
                          html={descVal}
                          className="text-center justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text w-full"
                          style={getElementStyle(
                            items[0]?.descStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`itemDesc${num}`, items[0]?.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Middle Label Column */}
              <div className="hidden xl:inline-flex bg-시안-mode-gray5 flex-col justify-center items-start self-stretch">
                <div className="w-60 flex-1 py-3 bg-시안-mode-subColor50 outline outline-1 outline-offset-[-1px] outline-시안-mode-gray1 inline-flex justify-center items-center gap-2.5">
                  <SafeHtml
                    html={data.middleTitle || "비교 head명"}
                    className="text-center justify-start text-시안-mode-gray0 text-3xl font-medium font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-white/50 rounded cursor-text transition-all break-keep"
                    style={getElementStyle(
                      data.middleTitleStyle || {},
                      viewport as any,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("middleTitle");
                    }}
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  {(items[0]?.desc || "\n\n")
                    .split("\n")
                    .map((_: any, lIdx: number) => (
                      <div
                        key={lIdx}
                        className="self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5"
                      >
                        <SafeHtml
                          html={
                            data.rowLabels?.[lIdx] || "프로그램 특징 내용 입력"
                          }
                          className="text-center justify-start text-시안-mode-gray95 text-xl font-semibold font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all break-keep"
                          style={getElementStyle(
                            data.rowLabelStyle || {},
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("rowLabel", String(lIdx));
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Item */}
              <div className="flex-1 inline-flex flex-col justify-center items-center w-full">
                <div className="self-stretch py-3 bg-시안-mode-subColor10 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5">
                  <SafeHtml
                    html={items[1]?.title || "프로그램 특징"}
                    className="justify-start text-시안-mode-subColor50 text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={getElementStyle(
                      items[1]?.titleStyle,
                      viewport as any,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", items[1]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative"
                  style={{ height: data.imageHeight || "320px" }}
                >
                  <UniversalMedia
                    url={
                      items[1]?.iconUrl ||
                      items[1]?.icon ||
                      items[1]?.image ||
                      "/images/placeholder/section-image.jpg"
                    }
                    className="w-full h-full object-cover"
                    alt="right comparison image"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("icon", items[1]?.id);
                    }}
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start w-full">
                  {[1, 2, 3].map((num) => {
                    const fallbackLines = (
                      items[1]?.desc ||
                      "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력"
                    ).split("\n");
                    const defaultDesc =
                      fallbackLines[num - 1] || "프로그램 특징 내용 입력";
                    const descVal =
                      items[1]?.[`desc${num}`] !== undefined
                        ? items[1]?.[`desc${num}`]
                        : defaultDesc;
                    return (
                      <div
                        key={num}
                        className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                      >
                        <SafeHtml
                          html={descVal}
                          className="text-center justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text w-full"
                          style={getElementStyle(
                            items[1]?.descStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`itemDesc${num}`, items[1]?.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback
  return null;
};
