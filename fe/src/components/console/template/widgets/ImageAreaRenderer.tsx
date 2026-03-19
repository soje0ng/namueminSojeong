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

  const imageUrl = data.imageUrl !== undefined ? data.imageUrl : IMAGE_AREA_DEFAULTS.imageUrl;
  const mobileImageUrl =
    data.mobileImageUrl !== undefined && data.mobileImageUrl !== ""
      ? data.mobileImageUrl
      : imageUrl;
  const isMobile = viewport === "mobile" || viewport === "tablet";
  const currentImage = isMobile ? mobileImageUrl : imageUrl;
  const currentImageStyle = isMobile
    ? {
        ...(data.imageStyle || {}),
        ...(data.mobileImageUrlStyle || {}),
      }
    : data.imageStyle;
  const rawDesktopHorizontalPadding = data.desktopHorizontalPadding;
  const hasDesktopHorizontalPadding = (() => {
    if (
      rawDesktopHorizontalPadding === undefined ||
      rawDesktopHorizontalPadding === null
    ) {
      return false;
    }

    const normalized = String(rawDesktopHorizontalPadding).trim().toLowerCase();
    if (!normalized) return false;

    const numeric = Number(normalized.replace(/px$/, ""));
    return Number.isNaN(numeric) ? true : numeric !== 0;
  })();
  const imageAreaHorizontalPadding = hasDesktopHorizontalPadding
    ? viewport === "mobile"
      ? "20px"
      : viewport === "tablet"
        ? "40px"
        : formatUnit(rawDesktopHorizontalPadding) || "0px"
    : "0px";

  return (
    <section
      style={style}
      className="w-full relative overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-[1920px] relative">
        <div
          className="self-stretch py-0 flex flex-col justify-start items-center gap-10"
          style={{
            paddingLeft: imageAreaHorizontalPadding,
            paddingRight: imageAreaHorizontalPadding,
          }}
        >
          {/* 
              이미지 영역 고정 비율 및 높이 제한 전면 해제 
              이미지 본연의 비율대로 보여지도록 렌더링
          */}
          <div
            className="w-full cursor-pointer transition-all overflow-hidden flex flex-col items-center justify-center"
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
              className="hover:ring-4 hover:ring-blue-400"
              naturalSize={!isMobile}
              style={{
                ...getElementStyle(currentImageStyle, viewport),
                aspectRatio: "auto",
                objectFit: currentImageStyle?.objectFit || "contain",
                width: isMobile ? "100%" : currentImageStyle?.width || "auto",
                height: isMobile
                  ? (data.mobileImageUrlStyle as any)?.height || "auto"
                  : currentImageStyle?.height || "auto",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
