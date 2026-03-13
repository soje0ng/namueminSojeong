import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  getImageUrl,
  getPaddingClass,
  getBorderRadiusClass,
  UniversalMedia,
} from "./WidgetUtils";

export const CULTURE_LETTER_DEFAULTS = {
  layout: "1",
  layout1BgImageUrl: "/images/placeholder/culture_letter_layout1_bg.jpg",
  layout1BgImageUrlStyle: { objectFit: "cover" },
  layout1LogoImageUrl: "/images/placeholder/culture_letter_layout1_logo.png",
  layout1LogoImageUrlStyle: { objectFit: "contain" },
  cultureLetter: "Culture Letter",
  cultureLetterStyle: {
    fontFamily: "Tenor Sans",
    fontSize: "40px",
    fontSizeMobile: "40px",
    color: "#FFFFFF",
    letterSpacing: "-0.8px",
    lineHeight: "1",
    fontWeight: "400",
  },
  issueNo: "No.15",
  issueNoStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "24px",
    color: "#FFFFFF",
    letterSpacing: "-0.48px",
    lineHeight: "1",
    fontWeight: "400",
  },
  issueDate: "2026년 1월호 컬처레터",
  issueDateStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    color: "#FFFFFF",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
    fontWeight: "700",
  },
  title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  titleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    letterSpacing: "-0.96px",
    color: "#FFFFFF",
  },
  desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
  descStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontWeight: "500",
    letterSpacing: "-0.48px",
    color: "#FFFFFF",
  },
  backgroundImage: "",
  backgroundImageStyle: {},
};

export const CultureLetterRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = String(data.layout || "1");
  const toHtmlWithBreaks = (value?: string) =>
    String(value || "").replace(/\n/g, "<br/>");

  /* ─────────────── Layout 1 : 컬처레터 헤더 - 좌측정렬 ─────────────── */
  if (layout === "1") {
    const bgImage =
      data.layout1BgImageUrl || CULTURE_LETTER_DEFAULTS.layout1BgImageUrl;
    const bgImageStyle = getElementStyle(
      data.layout1BgImageUrlStyle ||
        CULTURE_LETTER_DEFAULTS.layout1BgImageUrlStyle,
      viewport,
    );
    const logoImage =
      data.layout1LogoImageUrl || CULTURE_LETTER_DEFAULTS.layout1LogoImageUrl;

    return (
      <div
        className={`content-stretch flex flex-col gap-[80px] items-start justify-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={{
          backgroundColor: style.backgroundColor || "transparent",
          backgroundImage:
            style.backgroundImage ||
            "linear-gradient(164.85485871944843deg, rgb(40, 93, 225) 2.8894%, rgb(89, 161, 185) 48.555%, rgb(68, 160, 117) 100%)",
          ...style,
        }}
        onDoubleClick={(e) => {
          onElementSelect?.("layout1BgImageUrl");
        }}
      >
        {/* img 레이어 — 배경 통이미지 (pointer-events-none: 클릭 이벤트 콘텐츠에 전달) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(35, 55, 89) 8.5623%, rgb(33, 52, 83) 28.645%, rgb(28, 43, 68) 52.379%, rgb(19, 30, 43) 79.764%, rgb(12, 18, 20) 99.847%), linear-gradient(180.00000000000006deg, rgb(240, 207, 214) 0%, rgb(219, 159, 171) 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {bgImage && (
              <img
                alt=""
                className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
                style={{
                  objectFit: bgImageStyle.objectFit || "cover",
                  objectPosition: "center",
                }}
                src={getImageUrl(
                  data.layout1BgImageUrlStyle,
                  viewport,
                  bgImage,
                )}
              />
            )}
          </div>
        </div>

        {/* tit — 로고 | Culture Letter | No. + 날짜 */}
        <div className="border-[#b1b8be] border-b border-solid content-stretch flex items-center justify-between overflow-clip pb-[20px] relative shrink-0 w-full">
          {/* 나무이민 로고 (flower symbol + text) */}
          <div
            className="content-stretch flex items-center relative shrink-0 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("layout1LogoImageUrl");
            }}
          >
            <UniversalMedia
              alt="logo"
              className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
              url={logoImage}
              style={{
                height: "auto",
                maxHeight: viewport === "mobile" ? "40px" : "60px",
                width: "auto",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1LogoImageUrl");
              }}
            />
          </div>

          {/* Culture Letter */}
          <SafeHtml
            html={data.cultureLetter || CULTURE_LETTER_DEFAULTS.cultureLetter}
            className={`not-italic absolute left-1/2 -translate-x-1/2 shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
            style={{
              ...getElementStyle(
                data.cultureLetterStyle ||
                  CULTURE_LETTER_DEFAULTS.cultureLetterStyle,
                viewport,
              ),
              fontFamily:
                (data.cultureLetterStyle?.fontFamily ||
                  CULTURE_LETTER_DEFAULTS.cultureLetterStyle.fontFamily) ===
                "Tenor Sans"
                  ? "'Tenor Sans', sans-serif"
                  : undefined,
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("cultureLetter");
            }}
          />

          <div className="content-stretch flex flex-col items-end justify-center relative shrink-0">
            {!data.issueNoStyle?.isHidden && (
              <SafeHtml
                html={data.issueNo || CULTURE_LETTER_DEFAULTS.issueNo}
                className={`not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
                style={{
                  ...getElementStyle(
                    data.issueNoStyle || CULTURE_LETTER_DEFAULTS.issueNoStyle,
                    viewport,
                  ),
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("issueNo");
                }}
              />
            )}
            {!data.issueDateStyle?.isHidden && (
              <SafeHtml
                html={data.issueDate || CULTURE_LETTER_DEFAULTS.issueDate}
                className={`text-right cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getElementStyle(
                    data.issueDateStyle ||
                      CULTURE_LETTER_DEFAULTS.issueDateStyle,
                    viewport,
                  ),
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("issueDate");
                }}
              />
            )}
          </div>
        </div>

        <div className="content-stretch flex flex-col gap-[20px] items-start justify-start relative shrink-0 w-full">
          {!data.titleStyle?.isHidden && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.title || CULTURE_LETTER_DEFAULTS.title,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={{
                ...getElementStyle(
                  data.titleStyle || CULTURE_LETTER_DEFAULTS.titleStyle,
                  viewport,
                ),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
          )}

          {!data.descStyle?.isHidden && (
            <SafeHtml
              html={toHtmlWithBreaks(data.desc || CULTURE_LETTER_DEFAULTS.desc)}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={{
                ...getElementStyle(
                  data.descStyle || CULTURE_LETTER_DEFAULTS.descStyle,
                  viewport,
                ),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          )}
        </div>
      </div>
    );
  }

  /* ─────────────── Layout 2~5 : 구현 대기 ─────────────── */
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
        <p className="text-xl">컬처레터 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
