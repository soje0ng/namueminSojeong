import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
} from "./WidgetUtils";

export const IMAGE_AREA_DEFAULTS = {
  layout: "1",
  image: "/images/placeholder/area-image.jpg",
  imageStyle: { objectFit: "cover" },
};

export const ImageAreaRenderer: React.FC<WidgetRendererProps> = ({
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
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 lg:px-72 py-14 flex flex-col justify-start items-center gap-10">
            <div
              className="w-full max-w-[1200px] h-auto aspect-square cursor-pointer transition-all overflow-hidden shadow-sm flex flex-col items-center justify-center"
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "0px" }}
            >
              {/* 
                1. PC용 이미지: 
                   - viewport가 desktop이거나 
                   - 모바일 이미지가 없는 경우 항상 표시
              */}
              {(viewport === "desktop" || !data.mobileImage) && (
                <UniversalMedia
                  url={data.image || "/images/placeholder/area-image.jpg"}
                  alt="banner image (PC)"
                  className="w-full h-full hover:ring-4 hover:ring-blue-400"
                  style={getElementStyle(data.imageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("image");
                  }}
                />
              )}

              {/* 
                2. 모바일용 이미지: 
                   - viewport가 tablet/mobile이고 
                   - 모바일 이미지가 등록된 경우에만 표시
              */}
              {(viewport === "tablet" || viewport === "mobile") &&
                data.mobileImage && (
                  <UniversalMedia
                    url={data.mobileImage}
                    alt="banner image (Mobile)"
                    className="w-full h-full hover:ring-4 hover:ring-blue-400"
                    style={getElementStyle(data.imageStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("mobileImage");
                    }}
                  />
                )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback Layout Placeholder (Design Pending)
  return (
    <section
      style={style}
      className="w-full relative py-20 bg-시안-mode-gray5 flex items-center justify-center"
    >
      <div className="text-center font-bold text-시안-mode-gray40">
        <p className="text-xl">이미지 영역 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
