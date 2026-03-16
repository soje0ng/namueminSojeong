import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  getPaddingClass,
  getBorderRadiusClass,
  getVerticalPaddingClass,
} from "./WidgetUtils";

export const TITLE_TEXT_DEFAULTS = {
  layout: "1",
  // Legacy (shared) fields kept for migration compatibility
  subTitle: "이민 프로그램명 입력",
  subTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  title: "타이틀 문구를 적는 곳입니다.",
  titleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  desc: "서브타이틀 입력 영역",
  descStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6B7280",
  },
  quoteLeftUrl: "/images/placeholder/icon-quote.jpg",
  quoteRightUrl: "/images/placeholder/icon-quote.jpg",
  quoteLeftWhiteUrl: "/images/placeholder/icon-quote.jpg",
  quoteRightWhiteUrl: "/images/placeholder/icon-quote.jpg",

  // Layout 1
  layout1Title: "타이틀 문구를 적는 곳입니다.",
  layout1TitleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  layout1SubTitle: "이민 프로그램명 입력",
  layout1SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  layout1LeftImageUrl: "/images/placeholder/banner_quote_left.jpg",
  layout1RightImageUrl: "/images/placeholder/banner_quote_right.jpg",

  // Layout 2
  layout2Title:
    "자녀를 미국에서 교육시키는 이유는<br/>世界 대학 순위가 증명하고 있습니다.",
  layout2TitleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#ffffff",
  },
  layout2SubTitle:
    "국내 최고 대학 서울대도 세계 순위에서는 62위 … 결국 전세계 상위권의 학교 중 70%는 미국 대학이 차지합니다.",
  layout2SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#ffffff",
  },
  layout2LeftImageUrl: "/images/placeholder/tt_layout2_left_01.png",
  layout2RightImageUrl: "/images/placeholder/tt_layout2_right_01.png",
  layout2BackgroundImageUrl: "/images/placeholder/tt_layout2_bg_01.jpg",

  // Layout 3
  layout3SubTitle: "타이틀명 입력",
  layout3SubTitleStyle: {
    color: "var(--gray-95, #131416)",
    fontFamily: "Pretendard",
    fontSize: "24px",
    fontSizeMobile: "18px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "150%",
    letterSpacing: "-0.48px",
  },
  layout3Title: "Program Name.",
  layout3TitleStyle: {
    color: "var(--mode-Primary70, #295E92)",
    fontFamily: "Pretendard",
    fontSize: "60px",
    fontSizeMobile: "28px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
    letterSpacing: "-1.2px",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationSkipInk: "auto",
    textDecorationThickness: "auto",
    textUnderlineOffset: "auto",
    textUnderlinePosition: "from-font",
  },
  layout3Desc: "서브타이틀 입력 영역",
  layout3DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6B7280",
  },

  // Layout 4
  layout4SubTitle: "( 서브타이틀 )",
  layout4SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  layout4Title: "타이틀명 입력",
  layout4TitleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  layout4Desc: "이민 프로그램명 입력",
  layout4DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6B7280",
  },
};

export const TitleTextRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style, viewport as any);
  const data = w.data;
  const layout = data.layout || "1";

  const getValue = (
    primaryKey: string,
    fallbackKeys: string[] = [],
    fallbackValue: string,
  ) => {
    for (const key of [primaryKey, ...fallbackKeys]) {
      const value = (data as any)[key];
      if (value !== undefined && value !== null) return value;
    }
    return fallbackValue;
  };

  const getStyle = (
    primaryKey: string,
    fallbackKeys: string[] = [],
    fallbackStyle: any,
  ) => {
    for (const key of [primaryKey, ...fallbackKeys]) {
      const value = (data as any)[key];
      if (value !== undefined && value !== null) return value;
    }
    return fallbackStyle;
  };

  if (layout === "1") {
    const title = getValue(
      "layout1Title",
      ["title"],
      TITLE_TEXT_DEFAULTS.layout1Title,
    );
    const titleStyle = getStyle(
      "layout1TitleStyle",
      ["titleStyle"],
      TITLE_TEXT_DEFAULTS.layout1TitleStyle,
    );
    const subTitle = getValue(
      "layout1SubTitle",
      ["subTitle"],
      TITLE_TEXT_DEFAULTS.layout1SubTitle,
    );
    const subTitleStyle = getStyle(
      "layout1SubTitleStyle",
      ["subTitleStyle"],
      TITLE_TEXT_DEFAULTS.layout1SubTitleStyle,
    );
    const leftImage = getValue(
      "layout1LeftImageUrl",
      ["quoteLeftUrl"],
      TITLE_TEXT_DEFAULTS.layout1LeftImageUrl,
    );
    const rightImage = getValue(
      "layout1RightImageUrl",
      ["quoteRightUrl"],
      TITLE_TEXT_DEFAULTS.layout1RightImageUrl,
    );

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
            style={{
              gap:
                viewport === "mobile"
                  ? "8px"
                  : viewport === "tablet"
                    ? "20px"
                    : "60px",
            }}
          >
            <div
              className="inline-flex flex-col xl:flex-row justify-start items-start xl:items-start w-full xl:w-auto"
              style={{
                gap:
                  viewport === "mobile"
                    ? "8px"
                    : viewport === "tablet"
                      ? "20px"
                      : "60px",
              }}
            >
              {/* Left Image Area Slot */}
              <div
                className={`${viewport === "mobile" ? "w-5 h-5 mt-1" : "hidden xl:block w-[50px] h-[50px]"} shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-blue-400`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1LeftImageUrl");
                }}
              >
                <UniversalMedia
                  url={leftImage}
                  className="w-full h-full object-contain"
                  style={{ objectFit: "contain" }}
                  alt="Left Content Image"
                />
              </div>

              <div className="inline-flex flex-col justify-start items-center text-center w-full">
                {!titleStyle?.isHidden && (
                  <div className="justify-start transition-all w-fit mx-auto">
                    <SafeHtml
                      html={title}
                      className={`text-시안-mode-gray90 text-2xl xl:text-5xl font-bold leading-relaxed break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                      style={getElementStyle(titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout1Title");
                      }}
                    />
                  </div>
                )}
                {!subTitleStyle?.isHidden && (
                  <SafeHtml
                    html={subTitle}
                    className={`text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all mt-2 cursor-text break-keep`}
                    style={getElementStyle(subTitleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout1SubTitle");
                    }}
                  />
                )}
              </div>

              {/* Right Image Area Slot */}
              <div
                className={`${viewport === "mobile" ? "w-5 h-5 align-bottom mt-1" : "hidden xl:block w-[50px] h-[50px]"} shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-blue-400`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1RightImageUrl");
                }}
              >
                <UniversalMedia
                  url={rightImage}
                  className="w-full h-full object-contain"
                  style={{ objectFit: "contain" }}
                  alt="Right Content Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    const title = getValue(
      "layout2Title",
      ["title"],
      TITLE_TEXT_DEFAULTS.layout2Title,
    );
    const titleStyle = getStyle(
      "layout2TitleStyle",
      ["titleStyle"],
      TITLE_TEXT_DEFAULTS.layout2TitleStyle,
    );
    const subTitle = getValue(
      "layout2SubTitle",
      ["subTitle"],
      TITLE_TEXT_DEFAULTS.layout2SubTitle,
    );
    const subTitleStyle = getStyle(
      "layout2SubTitleStyle",
      ["subTitleStyle"],
      TITLE_TEXT_DEFAULTS.layout2SubTitleStyle,
    );
    const leftImage = getValue(
      "layout2LeftImageUrl",
      ["quoteLeftWhiteUrl"],
      TITLE_TEXT_DEFAULTS.layout2LeftImageUrl,
    );
    const rightImage = getValue(
      "layout2RightImageUrl",
      ["quoteRightWhiteUrl"],
      TITLE_TEXT_DEFAULTS.layout2RightImageUrl,
    );
    const backgroundImageUrl = getValue(
      "layout2BackgroundImageUrl",
      ["backgroundImage"],
      TITLE_TEXT_DEFAULTS.layout2BackgroundImageUrl,
    );

    const isMobile2 = viewport === "mobile";

    const l2BgStyle = {
      backgroundColor: style?.backgroundColor || "transparent",
      backgroundImage: style?.backgroundImage
        ? style.backgroundImage
        : `url(${backgroundImageUrl})`,
      backgroundSize: "cover" as const,
      backgroundPosition: "center" as const,
      backgroundRepeat: "no-repeat" as const,
    };

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          {isMobile2 ? (
            /* ── Mobile Layout ── */
            <div
              style={{
                ...l2BgStyle,
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: viewport === "mobile" ? "30px" : "60px",
                paddingBottom: viewport === "mobile" ? "30px" : "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout2BackgroundImageUrl");
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {/* Left Quote Icon */}
                <div
                  style={{
                    width: "25px",
                    height: "20px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2LeftImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={leftImage}
                    className="w-full h-full"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                    alt="Left Quote"
                  />
                </div>

                {/* Text Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1 0 0",
                    alignItems: "center",
                    textAlign: "center",
                    lineHeight: 1.5,
                    minWidth: 0,
                  }}
                >
                  {!titleStyle?.isHidden && (
                    <SafeHtml
                      html={title}
                      className={`hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded cursor-text transition-all break-keep`}
                      style={{
                        ...getElementStyle(titleStyle, viewport),
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 700,
                        letterSpacing: "-0.56px",
                        lineHeight: 1.5,
                        color: "#ffffff",
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2Title");
                      }}
                    />
                  )}
                  {!subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={subTitle}
                      className={`hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep`}
                      style={{
                        ...getElementStyle(subTitleStyle, viewport),
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "-0.36px",
                        lineHeight: 1.5,
                        color: "#e6e8ea",
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2SubTitle");
                      }}
                    />
                  )}
                </div>

                {/* Right Quote Icon */}
                <div
                  style={{
                    width: "25px",
                    height: "20px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2RightImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={rightImage}
                    className="w-full h-full"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                    alt="Right Quote"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ── PC / Tablet Layout (unchanged) ── */
            <div
              style={l2BgStyle}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout2BackgroundImageUrl");
              }}
              className={`self-stretch ${getPaddingClass(viewport)} py-16 xl:py-28 inline-flex flex-col justify-start items-center gap-14 w-full`}
            >
              <div className="inline-flex flex-col xl:flex-row justify-start items-center xl:items-start gap-5 xl:gap-14 w-full xl:w-auto">
                {/* Left Image Area Slot */}
                <div
                  className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-white/50"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2LeftImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={leftImage}
                    className="w-full h-full object-contain"
                    style={{ objectFit: "contain" }}
                    alt="Left Content Image"
                  />
                </div>

                <div className="inline-flex flex-col justify-start items-center text-center max-w-[800px]">
                  {!titleStyle?.isHidden && (
                    <div className="justify-start transition-all w-fit mx-auto">
                      <SafeHtml
                        html={title}
                        className={`text-white text-2xl xl:text-4xl font-bold leading-relaxed break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-200 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                        style={{
                          ...getElementStyle(titleStyle, viewport),
                          backgroundColor: "transparent",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout2Title");
                        }}
                      />
                    </div>
                  )}
                  {!subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={subTitle}
                      className={`text-center justify-start text-white/90 text-lg xl:text-xl font-medium leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-200 ${getBorderRadiusClass(viewport, "rounded")} transition-all mt-4 cursor-text break-keep`}
                      style={{
                        ...getElementStyle(subTitleStyle, viewport),
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2SubTitle");
                      }}
                    />
                  )}
                </div>

                {/* Right Image Area Slot */}
                <div
                  className="hidden xl:block w-[50px] h-[50px] shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-white/50"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2RightImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={rightImage}
                    className="w-full h-full object-contain"
                    style={{ objectFit: "contain" }}
                    alt="Right Content Image"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (layout === "3") {
    const subTitle = getValue(
      "layout3SubTitle",
      ["subTitle"],
      TITLE_TEXT_DEFAULTS.layout3SubTitle,
    );
    // DEFAULTS를 베이스로 merge → fontSizeMobile이 항상 존재하도록 보장
    const subTitleStyle = {
      ...TITLE_TEXT_DEFAULTS.layout3SubTitleStyle,
      ...(getStyle("layout3SubTitleStyle", ["subTitleStyle"], {}) || {}),
    };
    const title = getValue(
      "layout3Title",
      ["title"],
      TITLE_TEXT_DEFAULTS.layout3Title,
    );
    const titleStyle = {
      ...TITLE_TEXT_DEFAULTS.layout3TitleStyle,
      ...(getStyle("layout3TitleStyle", ["titleStyle"], {}) || {}),
    };
    const desc = getValue(
      "layout3Desc",
      ["desc"],
      TITLE_TEXT_DEFAULTS.layout3Desc,
    );
    const descStyle = {
      ...TITLE_TEXT_DEFAULTS.layout3DescStyle,
      ...(getStyle("layout3DescStyle", ["descStyle"], {}) || {}),
    };

    const isMobile3 = viewport === "mobile";

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-3 w-full text-center hover:ring-2 hover:ring-transparent transition-all`}
            style={
              isMobile3
                ? {
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "30px",
                    paddingBottom: "30px",
                    gap: "12px",
                  }
                : undefined
            }
          >
            {!(subTitleStyle as any)?.isHidden && (
              <SafeHtml
                html={subTitle}
                className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all cursor-text`}
                style={{
                  ...getElementStyle(subTitleStyle, viewport),
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  textAlign: "center" as const,
                  letterSpacing: isMobile3 ? "-0.36px" : "-0.48px",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3SubTitle");
                }}
              />
            )}

            {!(titleStyle as any)?.isHidden && (
              <div className="justify-start transition-all w-fit mx-auto">
                <SafeHtml
                  html={title}
                  className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                  style={{
                    ...getElementStyle(titleStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    color: "#295e92",
                    textDecorationLine: "underline",
                    textAlign: "center" as const,
                    letterSpacing: isMobile3 ? "-0.56px" : "-1.2px",
                    ...(isMobile3 ? { lineHeight: 1 } : {}),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Title");
                  }}
                />
              </div>
            )}

            {!(descStyle as any)?.isHidden && (
              <SafeHtml
                html={desc}
                className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all cursor-text`}
                style={{
                  ...getElementStyle(descStyle, viewport),
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  textAlign: "center" as const,
                  letterSpacing: "-0.36px",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Desc");
                }}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "4") {
    const subTitle = getValue(
      "layout4SubTitle",
      ["subTitle"],
      TITLE_TEXT_DEFAULTS.layout4SubTitle,
    );
    const subTitleStyle = getStyle(
      "layout4SubTitleStyle",
      ["subTitleStyle"],
      TITLE_TEXT_DEFAULTS.layout4SubTitleStyle,
    );
    const title = getValue(
      "layout4Title",
      ["title"],
      TITLE_TEXT_DEFAULTS.layout4Title,
    );
    const titleStyle = getStyle(
      "layout4TitleStyle",
      ["titleStyle"],
      TITLE_TEXT_DEFAULTS.layout4TitleStyle,
    );
    const desc = getValue(
      "layout4Desc",
      ["desc"],
      TITLE_TEXT_DEFAULTS.layout4Desc,
    );
    const descStyle = getStyle(
      "layout4DescStyle",
      ["descStyle"],
      TITLE_TEXT_DEFAULTS.layout4DescStyle,
    );

    const isMobile4 = viewport === "mobile";

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
            style={
              isMobile4
                ? {
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "30px",
                    paddingBottom: "30px",
                    gap: "0px",
                  }
                : undefined
            }
          >
            <div
              className="flex flex-col justify-start items-center text-center w-full max-w-[800px]"
              style={isMobile4 ? { gap: "0px" } : undefined}
            >
              {!subTitleStyle?.isHidden && (
                <SafeHtml
                  html={subTitle}
                  className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all cursor-text`}
                  style={{
                    ...getElementStyle(subTitleStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    ...(isMobile4
                      ? {
                          letterSpacing: "-0.36px",
                          textAlign: "center",
                        }
                      : {}),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4SubTitle");
                  }}
                />
              )}

              {!titleStyle?.isHidden && (
                <div
                  className="justify-start transition-all w-fit mx-auto"
                  style={
                    isMobile4
                      ? undefined
                      : { marginTop: "8px", marginBottom: "8px" }
                  }
                >
                  <SafeHtml
                    html={title}
                    className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                    style={{
                      ...getElementStyle(titleStyle, viewport),
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      lineHeight: 1.5,
                      ...(isMobile4
                        ? {
                            letterSpacing: "-0.56px",
                            color: "#131416",
                          }
                        : {}),
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout4Title");
                    }}
                  />
                </div>
              )}

              {!descStyle?.isHidden && (
                <SafeHtml
                  html={desc}
                  className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all cursor-text`}
                  style={{
                    ...getElementStyle(descStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    ...(isMobile4
                      ? {
                          letterSpacing: "-0.36px",
                          textAlign: "center",
                        }
                      : {}),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4Desc");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback Content
  return (
    <section
      style={style}
      className={`w-full relative overflow-hidden group hover:ring-2 hover:ring-blue-500 transition-all ${!data.imageUrl && !data.videoUrl ? "bg-white" : ""}`}
    >
      <div
        className={`mx-auto w-full max-w-[1920px] ${getPaddingClass(viewport)} py-12 md:py-24 relative z-10`}
      >
        <div
          className={`flex flex-col max-w-4xl mx-auto items-center text-center opacity-50 p-10 bg-시안-mode-gray10 ${getBorderRadiusClass(viewport, "rounded-xl")}`}
        >
          <p className="text-시안-mode-gray50 font-bold mb-2">
            TitleText 위젯 레이아웃 영역입니다.
          </p>
          <p className="text-시안-mode-gray40 text-sm">
            레이아웃 {layout} 번이 존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
};
