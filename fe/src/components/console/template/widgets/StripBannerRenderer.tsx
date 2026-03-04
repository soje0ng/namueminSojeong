import React from "react";
import { WidgetRendererProps } from "./WidgetUtils";
import { getElementStyle, SafeHtml, UniversalMedia } from "./WidgetUtils";

export const STRIP_BANNER_DEFAULTS = {
  layout: "1",
  title: "이미 수많은 가정이 학부모 영주권 프로그램으로",
  desc: "수십억 원을 절감하며 자녀가 IVY 리그에 합격했습니다!",
  imageUrl: "/images/placeholder/strip-banner.jpg",
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
        <div className="self-stretch px-5 xl:px-72 inline-flex flex-col justify-center items-center gap-2.5 w-full">
          <div
            className="self-stretch px-5 xl:pl-20 inline-flex flex-col xl:flex-row justify-start items-center gap-2 w-full min-h-[16rem] rounded-xl overflow-hidden relative"
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

  // Layout 2: Centered Text with background image
  const content = (
    <section
      style={{
        ...sectionStyle,
        backgroundImage: `url(${data.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full relative overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
      <div className="mx-auto w-full max-w-[1920px] px-5 xl:px-72 relative z-10 flex flex-col items-center justify-center text-center gap-6">
        {!data.titleStyle?.isHidden && (
          <SafeHtml
            html={data.title}
            className="justify-center text-white text-3xl md:text-5xl font-bold break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
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
            className="justify-center text-white/90 text-xl md:text-2xl break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
            style={getElementStyle(data.descStyle, viewport)}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onElementSelect?.("desc");
            }}
          />
        )}
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
