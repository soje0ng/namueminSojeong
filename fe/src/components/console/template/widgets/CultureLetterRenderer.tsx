import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  getImageUrl,
  getPaddingClass,
} from "./WidgetUtils";

export const CULTURE_LETTER_DEFAULTS = {
  layout: "1",
  layout1BgImageUrl: "/images/placeholder/culture_letter_layout1_bg.jpg",
  layout1BgImageUrlStyle: {},
  layout1LogoFlowerImageUrl:
    "/images/placeholder/culture_letter_layout1_logo_flower.png",
  layout1LogoTextImageUrl:
    "/images/placeholder/culture_letter_layout1_logo_text.png",
  cultureLetter: "Culture Letter",
  cultureLetterStyle: {},
  issueNo: "No.15",
  issueNoStyle: {},
  issueDate: "2026년 1월호 컬처레터",
  issueDateStyle: {},
  title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  titleStyle: {},
  desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
  descStyle: {},
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

  /* ─────────────── Layout 1 : 컬처레터 헤더 - 좌측정렬 ─────────────── */
  if (layout === "1") {
    const bgImage =
      data.layout1BgImageUrl || CULTURE_LETTER_DEFAULTS.layout1BgImageUrl;
    const logoFlower =
      data.layout1LogoFlowerImageUrl ||
      CULTURE_LETTER_DEFAULTS.layout1LogoFlowerImageUrl;
    const logoText =
      data.layout1LogoTextImageUrl ||
      CULTURE_LETTER_DEFAULTS.layout1LogoTextImageUrl;

    return (
      <div
        className={`content-stretch flex flex-col gap-[80px] items-start justify-center ${getPaddingClass(viewport, "xl:px-[280px]")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={{
          ...style,
          backgroundImage:
            "linear-gradient(164.85485871944843deg, rgb(40, 93, 225) 2.8894%, rgb(89, 161, 185) 48.555%, rgb(68, 160, 117) 100%)",
        }}
        onDoubleClick={(e) => {
          onElementSelect?.("layout1BgImageUrl");
        }}
      >
        {/* img 레이어 — 배경 통이미지 (pointer-events-none: 클릭 이벤트 콘텐츠에 전달) */}
        <div className="absolute h-[492px] left-0 overflow-clip top-0 w-[1920px] pointer-events-none">
          <div className="absolute contents left-0 top-[-47px]">
            <div
              className="absolute h-[539px] left-0 top-[-47px] w-[1920px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(35, 55, 89) 8.5623%, rgb(33, 52, 83) 28.645%, rgb(28, 43, 68) 52.379%, rgb(19, 30, 43) 79.764%, rgb(12, 18, 20) 99.847%), linear-gradient(180.00000000000006deg, rgb(240, 207, 214) 0%, rgb(219, 159, 171) 100%)",
              }}
            />
            {bgImage && (
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
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
            className="content-stretch flex gap-[9px] items-center relative shrink-0 w-[299px] cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("layout1LogoFlowerImageUrl");
            }}
          >
            <div className="h-[40.004px] relative shrink-0 w-[39.742px]">
              <img
                alt=""
                className="absolute block max-w-none size-full"
                src={getImageUrl(
                  data.layout1LogoFlowerImageUrlStyle,
                  viewport,
                  logoFlower,
                )}
              />
            </div>
            <div
              className="h-[28.28px] relative shrink-0 w-[104.122px] cursor-pointer"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1LogoTextImageUrl");
              }}
            >
              <img
                alt=""
                className="absolute block max-w-none size-full"
                src={getImageUrl(
                  data.layout1LogoTextImageUrlStyle,
                  viewport,
                  logoText,
                )}
              />
            </div>
          </div>

          {/* Culture Letter */}
          <SafeHtml
            html={data.cultureLetter || CULTURE_LETTER_DEFAULTS.cultureLetter}
            className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            style={{
              fontFamily: "'Tenor Sans', sans-serif",
              fontSize: "40px",
              color: "#FFFFFF",
              letterSpacing: "-0.8px",
              lineHeight: 1,
              fontWeight: "400",
              ...getElementStyle(data.cultureLetterStyle, viewport),
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("cultureLetter");
            }}
          />

          {/* No. + 날짜 */}
          <div className="content-stretch flex gap-[16px] items-center not-italic relative shrink-0 whitespace-nowrap">
            <SafeHtml
              html={data.issueNo || CULTURE_LETTER_DEFAULTS.issueNo}
              className="relative shrink-0 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
              style={{
                fontFamily: "'Tenor Sans', sans-serif",
                fontSize: "24px",
                color: "#FFFFFF",
                letterSpacing: "-0.48px",
                lineHeight: 1,
                fontWeight: "400",
                ...getElementStyle(data.issueNoStyle, viewport),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("issueNo");
              }}
            />
            <SafeHtml
              html={data.issueDate || CULTURE_LETTER_DEFAULTS.issueDate}
              className="relative shrink-0 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "24px",
                color: "#FFFFFF",
                letterSpacing: "-0.48px",
                lineHeight: 1.5,
                fontWeight: "700",
                ...getElementStyle(data.issueDateStyle, viewport),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("issueDate");
              }}
            />
          </div>
        </div>

        {/* 텍스트 콘텐츠 */}
        <div className="content-stretch flex flex-col gap-[12px] items-start leading-[1.5] not-italic relative shrink-0 text-white whitespace-nowrap">
          <SafeHtml
            html={data.title || CULTURE_LETTER_DEFAULTS.title}
            className="relative shrink-0 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontSize: "48px",
              fontWeight: "700",
              letterSpacing: "-0.96px",
              color: "#FFFFFF",
              ...getElementStyle(data.titleStyle, viewport),
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("title");
            }}
          />
          <SafeHtml
            html={data.desc || CULTURE_LETTER_DEFAULTS.desc}
            className="relative shrink-0 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontSize: "24px",
              fontWeight: "500",
              letterSpacing: "-0.48px",
              color: "#FFFFFF",
              ...getElementStyle(data.descStyle, viewport),
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("desc");
            }}
          />
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
