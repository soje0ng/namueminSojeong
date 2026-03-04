import React from "react";
import { WidgetRendererProps } from "./WidgetUtils";
import { getElementStyle, SafeHtml, UniversalMedia } from "./WidgetUtils";

export const STRIP_BANNER_DEFAULTS = {
  layout: "1",
  title: "띠배너 타이틀을 입력하세요",
  desc: "띠배너 설명을 입력하세요",
  imageUrl: "/images/placeholder/strip-banner.jpg",
  buttonText: "자세히 보기",
  buttonUrl: "#",
  backgroundColor: "#f8f9fa",
  textColor: "#1f2937",
  titleStyle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  descStyle: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "#4b5563",
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
    backgroundColor: data.backgroundColor || "#f8f9fa",
    color: data.textColor || "#1f2937",
    paddingTop: widget.style?.paddingTop || "40px",
    paddingBottom: widget.style?.paddingBottom || "40px",
  };

  // Layout 1: Left Text, Right Image
  if (layout === "1") {
    return (
      <section style={sectionStyle} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] px-5 xl:px-72 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 flex flex-col items-start gap-4">
            {!data.titleStyle?.isHidden && (
              <SafeHtml
                html={data.title}
                className="text-3xl md:text-4xl font-bold break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
                style={getElementStyle(data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!data.descStyle?.isHidden && (
              <SafeHtml
                html={data.desc}
                className="text-lg md:text-xl break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
                style={getElementStyle(data.descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>
          <div
            className="w-full md:w-1/3 shrink-0 relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded-xl overflow-hidden"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("imageUrl");
            }}
          >
            <UniversalMedia
              url={data.imageUrl}
              className="w-full h-full object-cover"
              style={getElementStyle(data.imageStyle, viewport)}
              alt="Banner Image"
            />
          </div>
        </div>
      </section>
    );
  }

  // Layout 2: Centered Text with background image
  return (
    <section
      style={{
        ...sectionStyle,
        backgroundImage: `url(${data.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full relative overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="mx-auto w-full max-w-[1920px] px-5 xl:px-72 relative z-10 flex flex-col items-center justify-center text-center gap-6">
        {!data.titleStyle?.isHidden && (
          <SafeHtml
            html={data.title}
            className="text-4xl md:text-5xl font-bold text-white break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
            style={getElementStyle(data.titleStyle, viewport)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("title");
            }}
          />
        )}
        {!data.descStyle?.isHidden && (
          <SafeHtml
            html={data.desc}
            className="text-xl md:text-2xl text-white/90 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text"
            style={getElementStyle(data.descStyle, viewport)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("desc");
            }}
          />
        )}
      </div>
    </section>
  );
};
