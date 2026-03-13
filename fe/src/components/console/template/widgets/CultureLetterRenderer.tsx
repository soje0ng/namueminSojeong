import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  WidgetRendererProps,
  getImageUrl,
  getPaddingClass,
  getBorderRadiusClass,
  UniversalMedia,
  SafeHtml,
  getElementStyle,
} from "./WidgetUtils";

export const CULTURE_LETTER_DEFAULTS = {
  layout: "1",
  // Layout 1 - 컬처레터 헤더 좌측정렬
  layout1BgImageUrl: "/images/placeholder/culture_letter_layout1_bg.jpg",
  layout1BgImageUrlStyle: { objectFit: "cover" },
  layout1LogoImageUrl: "/images/placeholder/culture_letter_layout1_logo.png",
  layout1LogoImageUrlStyle: { objectFit: "contain" },
  layout1CultureLetter: "Culture Letter",
  layout1IssueNo: "No.15",
  layout1IssueDate: "2026년 1월호 컬처레터",
  layout1Title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  layout1Desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
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
        onDoubleClick={() => {
          onElementSelect?.("layout1BgImageUrl");
        }}
      >
        {/* img 레이어 — 배경 통이미지 */}
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

        {/* tit — 로고 | Culture Letter(정중앙) | No. + 날짜 */}
        <div
          style={{
            borderBottom: "1px solid #b1b8be",
            paddingBottom: "20px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          {/* 나무이민 로고 (좌측) */}
          <div
            className="cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            style={{ display: "flex", alignItems: "center" }}
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
                height: "40px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1LogoImageUrl");
              }}
            />
          </div>

          {/* Culture Letter (그리드 정중앙, 스타일 고정) */}
          <SafeHtml
            html={
              data.layout1CultureLetter ||
              CULTURE_LETTER_DEFAULTS.layout1CultureLetter
            }
            className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
            style={{
              justifySelf: "center",
              fontFamily: "'Tenor Sans', sans-serif",
              fontSize: "40px",
              fontWeight: "400",
              color: "#FFFFFF",
              letterSpacing: "-0.8px",
              lineHeight: "1",
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("layout1CultureLetter");
            }}
          />

          {/* No. + 날짜 (우측, 세로 스택, 스타일 고정) */}
          <div className="content-stretch flex flex-col items-end justify-center relative shrink-0">
            {!data.layout1IssueNoStyle?.isHidden && (
              <SafeHtml
                html={
                  data.layout1IssueNo ||
                  CULTURE_LETTER_DEFAULTS.layout1IssueNo
                }
                className={`not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
                style={{
                  fontFamily: "'Tenor Sans', sans-serif",
                  fontSize: "24px",
                  fontWeight: "400",
                  color: "#FFFFFF",
                  letterSpacing: "-0.48px",
                  lineHeight: "1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1IssueNo");
                }}
              />
            )}
            {!data.layout1IssueDateStyle?.isHidden && (
              <SafeHtml
                html={
                  data.layout1IssueDate ||
                  CULTURE_LETTER_DEFAULTS.layout1IssueDate
                }
                className={`text-right cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.5",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1IssueDate");
                }}
              />
            )}
          </div>
        </div>

        {/* 본문 — 타이틀 + 설명 (좌측, 스타일 고정) */}
        <div className="content-stretch flex flex-col gap-[20px] items-start justify-start relative shrink-0 w-full">
          {!data.layout1TitleStyle?.isHidden && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout1Title || CULTURE_LETTER_DEFAULTS.layout1Title,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: viewport === "mobile" ? "28px" : "48px",
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: "-0.96px",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1Title");
              }}
            />
          )}
          {!data.layout1DescStyle?.isHidden && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout1Desc || CULTURE_LETTER_DEFAULTS.layout1Desc,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "24px",
                fontWeight: "400",
                color: "#FFFFFF",
                letterSpacing: "-0.48px",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1Desc");
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
