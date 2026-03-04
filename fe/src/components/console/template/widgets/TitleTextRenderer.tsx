import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
} from "./WidgetUtils";

export const TITLE_TEXT_DEFAULTS = {
  layout: "1",
  subTitle: "이민 프로그램명 입력",
  subTitleStyle: { fontSize: "20px", fontWeight: "500", color: "#285DE1" },
  title: "타이틀 문구를 적는 곳입니다.",
  titleStyle: { fontSize: "48px", fontWeight: "700", color: "#111827" },
  quoteLeft: "/images/placeholder/icon-quote.jpg",
  quoteRight: "/images/placeholder/icon-quote.jpg",
};

export const TitleTextRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";

  if (layout === "1") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-14 w-full">
            <div className="inline-flex flex-col xl:flex-row justify-start items-center xl:items-start gap-5 xl:gap-14 w-full xl:w-auto">
              {/* Left Image Area Slot */}
              <div
                className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-blue-400"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteLeft");
                }}
              >
                <UniversalMedia
                  url={data.quoteLeft || "/images/placeholder/icon-quote.jpg"}
                  className="w-full h-full object-contain"
                  alt="Left Content Image"
                />
              </div>

              <div className="inline-flex flex-col justify-start items-center text-center w-full">
                {!data.titleStyle?.isHidden && (
                  <div className="justify-start transition-all w-fit mx-auto">
                    <SafeHtml
                      html={data.title || "타이틀 문구를 적는 곳입니다."}
                      className="text-시안-mode-gray90 text-3xl xl:text-5xl font-bold leading-tight xl:leading-[72px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                      style={getElementStyle(data.titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    />
                  </div>
                )}
                {!data.subTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.subTitle || "이민 프로그램명 입력"}
                    className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all mt-2 cursor-text break-keep"
                    style={{ ...getElementStyle(data.subTitleStyle, viewport), color: "#285DE1" }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("subTitle");
                    }}
                  />
                )}
              </div>

              {/* Right Image Area Slot */}
              <div
                className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-blue-400"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteRight");
                }}
              >
                <UniversalMedia
                  url={data.quoteRight || "/images/placeholder/icon-quote.jpg"}
                  className="w-full h-full object-contain"
                  alt="Right Content Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            style={{
              // 1. 배경색 우선 적용
              backgroundColor: style?.backgroundColor || "transparent",
              // 2. 사용자가 배경 이미지를 올렸거나 배경색을 바꿨다면 기본 그라데이션을 제거
              backgroundImage: style?.backgroundImage
                ? style.backgroundImage
                : style?.backgroundColor
                  ? "none"
                  : "linear-gradient(to bottom right, #3b82f6, #2dd4bf, #22c55e)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="self-stretch px-5 xl:px-72 py-16 xl:py-28 inline-flex flex-col justify-start items-center gap-14 w-full"
          >
            <div className="inline-flex flex-col xl:flex-row justify-start items-center xl:items-start gap-5 xl:gap-14 w-full xl:w-auto">
              {/* Left Image Area Slot */}
              <div
                className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-white/50"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteLeft");
                }}
              >
                <UniversalMedia
                  url={data.quoteLeft || "/images/placeholder/icon-quote.jpg"}
                  className="w-full h-full object-contain"
                  alt="Left Content Image"
                />
              </div>

              <div className="inline-flex flex-col justify-start items-center text-center max-w-[800px]">
                {!data.titleStyle?.isHidden && (
                  <div className="justify-start transition-all w-fit mx-auto">
                    <SafeHtml
                      html={
                        data.title ||
                        "자녀를 미국에서 교육시키는 이유는<br/>세계 대학 순위가 증명하고 있습니다."
                      }
                      className="text-white text-3xl xl:text-4xl font-bold leading-tight xl:leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded cursor-text transition-all"
                      style={{
                        ...getElementStyle(data.titleStyle, viewport),
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    />
                  </div>
                )}
                {!data.subTitleStyle?.isHidden && (
                  <SafeHtml
                    html={
                      data.subTitle ||
                      "국내 최고 대학 서울대도 세계 순위에서는 62위 … 결국 전세계 상위권의 학교 중 70%는 미국 대학이 차지합니다."
                    }
                    className="text-center justify-start text-white/90 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all mt-4 cursor-text break-keep"
                    style={{
                      ...getElementStyle(data.subTitleStyle, viewport),
                      backgroundColor: "transparent",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("subTitle");
                    }}
                  />
                )}
              </div>

              {/* Right Image Area Slot */}
              <div
                className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-white/50"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteRight");
                }}
              >
                <UniversalMedia
                  url={data.quoteRight || "/images/placeholder/icon-quote.jpg"}
                  className="w-full h-full object-contain"
                  alt="Right Content Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-3 w-full text-center hover:ring-2 hover:ring-transparent transition-all">
            {!data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={data.subTitle || "타이틀명 입력"}
                className="text-center justify-start text-시안-mode-gray90 text-xl xl:text-2xl font-bold leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{ ...getElementStyle(data.subTitleStyle, viewport), color: "#285DE1" }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}

            {!data.titleStyle?.isHidden && (
              <div className="justify-start transition-all w-fit mx-auto">
                <SafeHtml
                  html={data.title || "Program Name."}
                  className="text-center justify-start text-blue-600 text-4xl xl:text-6xl font-normal underline leading-tight xl:leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              </div>
            )}

            {/* The layout HTML actually provides a 3rd sub-subtitle "서브타이틀 입력 영역". We can map this to data.desc to avoid creating too many fields. */}
            {!data.descStyle?.isHidden && (
              <SafeHtml
                html={data.desc || "서브타이틀 입력 영역"}
                className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all mt-2 cursor-text break-keep"
                style={getElementStyle(data.descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "4") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            <div className="flex flex-col justify-start items-center text-center w-full max-w-[800px]">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-blue-500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{ ...getElementStyle(data.subTitleStyle, viewport), color: "#285DE1" }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}

              {!data.titleStyle?.isHidden && (
                <div className="justify-start transition-all w-fit mx-auto mt-2 mb-2">
                  <SafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray90 text-3xl xl:text-4xl font-bold leading-tight xl:leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                    style={getElementStyle(data.titleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("title");
                    }}
                  />
                </div>
              )}

              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
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
      <div className="mx-auto w-full max-w-[1920px] px-4 md:px-12 xl:px-32 py-12 md:py-24 relative z-10">
        <div className="flex flex-col max-w-4xl mx-auto items-center text-center opacity-50 p-10 bg-시안-mode-gray10 rounded-xl">
          <p className="text-시안-mode-gray50 font-bold mb-2">
            TitleText 위젯 레이아웃 영역입니다.
          </p>
          <p className="text-시안-mode-gray40 text-sm">
            레이아웃 {layout} 번이 존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
};
