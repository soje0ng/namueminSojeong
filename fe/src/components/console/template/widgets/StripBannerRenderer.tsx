import React from "react";
import { WidgetRendererProps } from "./WidgetUtils";
import {
  getElementStyle,
  SafeHtml,
  UniversalMedia,
  getPaddingClass,
} from "./WidgetUtils";

export const STRIP_BANNER_DEFAULTS = {
  layout: "1",
  title: "이미 수많은 가정이 학부모 영주권 프로그램으로",
  desc: "수십억 원을 절감하며 자녀가 IVY 리그에 합격했습니다!",
  imageUrl: "/images/placeholder/strip-banr.png",
  buttonText: "자세히 보기",
  buttonUrl: "#",
  backgroundColor: "#295E92",
  textColor: "#ffffff",
  targetUrl: "",
  titleStyle: {
    fontSize: "32px",
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.64px",
  },
  descStyle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.64px",
  },
  imageStyle: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    objectFit: "cover",
  },
  layout2SubTitle: "( 서브타이틀 )",
  layout2SubTitleStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "500",
    lineHeight: "32px",
  },
  layout2Title: "타이틀명 입력",
  layout2TitleStyle: {
    color: "#ffffff",
    fontSize: "36px",
    fontWeight: "700",
    lineHeight: "60px",
  },
  layout2Desc: "이민 프로그램명 입력",
  layout2DescStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "500",
    lineHeight: "32px",
  },
  layout2ButtonText: "자세히 보기",
  layout2ButtonTextStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "32px",
  },
  layout2ImageUrl: "/images/placeholder/strip-banr-layout2.png",
};

export const StripBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const data = (widget.data as any) || STRIP_BANNER_DEFAULTS;
  const layout = data.layout || "1";

  const sectionStyle: React.CSSProperties = {
    backgroundColor:
      widget.style?.backgroundColor || data.backgroundColor || "#295E92",
    color: data.textColor || "#ffffff",
    paddingTop: widget.style?.paddingTop || "40px",
    paddingBottom: widget.style?.paddingBottom || "40px",
  };

  // Layout 1: Left Text, Right Image
  if (layout === "1") {
    const content = (
      <section
        className="w-full relative overflow-hidden"
        style={{
          paddingTop: widget.style?.paddingTop || "0px",
          paddingBottom: widget.style?.paddingBottom || "0px",
        }}
      >
        <div
          className={`self-stretch ${getPaddingClass(viewport, "")} inline-flex flex-col justify-center items-center gap-2.5 w-full`}
        >
          <div
            className={`self-stretch ${getPaddingClass(viewport, "xl:pl-20")} inline-flex flex-col xl:flex-row justify-start items-center gap-2 w-full min-h-[16rem] rounded-xl overflow-hidden relative`}
            style={{ backgroundColor: sectionStyle.backgroundColor }}
          >
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2 py-10 xl:py-0 w-full z-10">
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title}
                  className="justify-start font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc}
                  className="justify-start font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>
            <div
              className="w-full xl:w-96 h-60 relative overflow-hidden xl:absolute xl:right-0 xl:bottom-0 shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onElementSelect?.("imageUrl");
              }}
            >
              <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
                url={data.imageUrl}
                className="w-full xl:w-96 h-full xl:h-64 xl:left-[12px] xl:top-[17px] absolute object-cover"
                style={getElementStyle(data.imageStyle, viewport)}
                alt="Banner Image"
              />
            </div>
          </div>
        </div>
      </section>
    );

    if (data.targetUrl) {
      return (
        <a
          href={data.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full cursor-pointer hover:opacity-95 transition-opacity"
        >
          {content}
        </a>
      );
    }
    return content;
  }

  // Layout 2
  const defaultBg2Color = "#01355F";
  const bg2Color =
    widget.style?.backgroundColor && widget.style.backgroundColor !== "#295E92"
      ? widget.style.backgroundColor
      : defaultBg2Color;
  const layout2ImageStyle = data.layout2ImageUrlStyle || data.imageStyle;

  const content = (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: widget.style?.paddingTop || "0px",
        paddingBottom: widget.style?.paddingBottom || "0px",
      }}
    >
      <div
        className={`self-stretch ${getPaddingClass(viewport, "")} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
      >
        <div
          className="self-stretch h-auto xl:h-96 rounded-[20px] inline-flex flex-col xl:flex-row justify-start items-stretch overflow-hidden w-full relative"
          style={{ backgroundColor: bg2Color }}
        >
          <div
            className="flex-1 min-h-[240px] xl:min-h-0 relative overflow-hidden shrink-0 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onElementSelect?.("layout2ImageUrl");
            }}
          >
            <UniversalMedia
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout2ImageUrl");
              }}
              className="w-full h-full object-cover absolute inset-0"
              url={
                data.layout2ImageUrl ||
                "/images/placeholder/strip-banr-layout2.png"
              }
              alt="Banner Image"
              style={{
                ...getElementStyle(layout2ImageStyle, viewport),
                borderRadius: "0px",
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="flex-1 self-stretch p-8 xl:p-14 inline-flex flex-col justify-between items-start w-full">
            <div className="self-stretch flex flex-col justify-center items-start w-full">
              {!data.layout2SubTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.layout2SubTitle || "( 서브타이틀 )"}
                  className="text-center justify-start font-medium font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                  style={getElementStyle(
                    data.layout2SubTitleStyle ||
                      STRIP_BANNER_DEFAULTS.layout2SubTitleStyle,
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("layout2SubTitle");
                  }}
                />
              )}
              {!data.layout2TitleStyle?.isHidden && (
                <SafeHtml
                  html={data.layout2Title || "타이틀명 입력"}
                  className="justify-start font-bold font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                  style={getElementStyle(
                    data.layout2TitleStyle ||
                      STRIP_BANNER_DEFAULTS.layout2TitleStyle,
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("layout2Title");
                  }}
                />
              )}
              {!data.layout2DescStyle?.isHidden && (
                <SafeHtml
                  html={data.layout2Desc || "이민 프로그램명 입력"}
                  className="text-center justify-start font-medium font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                  style={getElementStyle(
                    data.layout2DescStyle ||
                      STRIP_BANNER_DEFAULTS.layout2DescStyle,
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("layout2Desc");
                  }}
                />
              )}
            </div>

            <div className="h-12 py-1 rounded-3xl inline-flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mt-6 xl:mt-0">
              {!data.layout2ButtonTextStyle?.isHidden && (
                <SafeHtml
                  html={data.layout2ButtonText || "자세히 보기"}
                  className="justify-start font-bold font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                  style={getElementStyle(
                    data.layout2ButtonTextStyle ||
                      STRIP_BANNER_DEFAULTS.layout2ButtonTextStyle,
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementSelect?.("layout2ButtonText");
                  }}
                />
              )}
              <div className="w-6 h-6 flex justify-center items-center">
                <img
                  src="/images/placeholder/icon-arrow.png"
                  alt="arrow icon"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (data.targetUrl) {
    return (
      <a
        href={data.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full cursor-pointer hover:opacity-95 transition-opacity"
      >
        {content}
      </a>
    );
  }
  return content;
};
