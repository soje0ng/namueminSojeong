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
          <div className="self-stretch px-5 md:px-10 xl:px-72 py-14 flex flex-col justify-start items-center gap-10">
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

  if (layout === "4") {
    const subtitle = data.subtitle || "";
    const title = data.title || "";
    const description = data.description || "";
    const overlayText1 = data.overlayText1 || "";
    const overlayText2 = data.overlayText2 || "";
    const quoteImageUrl = data.quoteImageUrl || "";

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            alignItems: "center",
            padding: "60px 40px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* 헤더: 인용부호 + 텍스트 */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* 여는 인용부호 */}
            <div
              style={{ width: "50px", height: "40px", flexShrink: 0 }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("quoteImageUrl");
              }}
            >
              {quoteImageUrl && (
                <img
                  src={quoteImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              )}
            </div>

            {/* 중앙 텍스트 블록 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
                lineHeight: 1.5,
                fontStyle: "normal",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "24px",
                  fontWeight: 500,
                  color: "#131416",
                  letterSpacing: "-0.48px",
                  lineHeight: 1.5,
                  margin: 0,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subtitle");
                }}
              >
                {subtitle}
              </p>
              <p
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#131416",
                  letterSpacing: "-0.96px",
                  lineHeight: 1.5,
                  margin: 0,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              >
                {title}
              </p>
              <div
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#6d7882",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.5,
                  whiteSpace: "pre",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("description");
                }}
              >
                {description}
              </div>
            </div>

            {/* 닫는 인용부호 (180도 회전) */}
            <div
              style={{
                width: "50px",
                height: "40px",
                flexShrink: 0,
                transform: "rotate(180deg)",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("quoteImageUrl");
              }}
            >
              {quoteImageUrl && (
                <img
                  src={quoteImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              )}
            </div>
          </div>

          {/* 이미지 + 오버레이 영역 */}
          <div
            style={{
              height: "400px",
              overflow: "hidden",
              borderRadius: "24px",
              width: "100%",
              position: "relative",
              flexShrink: 0,
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.(isMobile ? "mobileImageUrl" : "imageUrl");
            }}
          >
            <UniversalMedia
              url={currentImage}
              alt={`image area (${isMobile ? "Mobile" : "PC"})`}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
              }}
            />
            {/* 그라디언트 오버레이 */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(89,161,185,0.6) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* 텍스트 오버레이 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#ffffff",
                fontFamily: "Tenor Sans, serif",
                fontStyle: "normal",
                lineHeight: 1.2,
                letterSpacing: "-2.4px",
                textShadow: "0px 0px 8px rgba(0,0,0,0.25)",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("overlayText1");
              }}
            >
              <p style={{ fontSize: "80px", margin: 0 }}>{overlayText1}</p>
              <p style={{ fontSize: "60px", margin: 0 }}>{overlayText2}</p>
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
