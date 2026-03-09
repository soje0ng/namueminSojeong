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
  imageUrl: "/images/placeholder/area-image.jpg",
  mobileImageUrl: "/images/placeholder/area-image.jpg",
  imageStyle: { objectFit: "contain" },
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

  // New logic for simplified image rendering
  const imageUrl = data.imageUrl || IMAGE_AREA_DEFAULTS.imageUrl;
  const mobileImageUrl =
    data.mobileImageUrl || data.imageUrl || IMAGE_AREA_DEFAULTS.mobileImageUrl;
  const isMobile = viewport === "mobile";
  const currentImage = isMobile ? mobileImageUrl : imageUrl;
  const currentImageStyle = isMobile
    ? {
        ...(data.imageStyle || {}),
        ...(data.mobileImageUrlStyle || {}),
      }
    : data.imageStyle;

  if (layout === "1") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 lg:px-72 py-14 flex flex-col justify-start items-center gap-10">
            {/* 
                이미지 영역 고정 비율 및 높이 제한 전면 해제 
                이미지 본연의 비율대로 보여지도록 렌더링
            */}
            <div
              className="w-full max-w-[1200px] cursor-pointer transition-all overflow-hidden flex flex-col items-center justify-center"
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "0px" }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                // viewport와 관계없이 설정창의 PC/모바일 이미지 필드와 정확히 연동
                onElementSelect?.(isMobile ? "mobileImageUrl" : "imageUrl");
              }}
            >
              <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.(isMobile ? "mobileImageUrl" : "imageUrl");
                }}
                url={currentImage}
                alt={`banner image (${isMobile ? "Mobile" : "PC"})`}
                className="w-full h-auto hover:ring-4 hover:ring-blue-400"
                style={{
                  ...getElementStyle(currentImageStyle, viewport),
                  aspectRatio: "auto",
                  objectFit: currentImageStyle?.objectFit || "contain",
                }}
              />
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
      className="w-full relative py-20 bg-gray-50 flex items-center justify-center transition-all cursor-pointer"
      onDoubleClick={(e) => {
        e.stopPropagation();
        onElementSelect?.("backgroundImage");
      }}
    >
      <div className="text-center font-bold text-gray-400">
        <p className="text-xl">이미지 영역 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
