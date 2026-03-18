import React from "react";
import { WidgetRendererProps } from "./WidgetUtils";
import {
  getElementStyle,
  SafeHtml,
  UniversalMedia,
  getPaddingClass,
  getVerticalPaddingClass,
} from "./WidgetUtils";

export const STRIP_BANNER_DEFAULTS = {
  layout: "1",
  title: "이미 수많은 가정이 학부모 영주권 프로그램으로",
  desc: "수십억 원을 절감하며 자녀가 IVY 리그에 합격했습니다!",
  imageUrl: "/images/placeholder/strip-banr.png",
  buttonText: "자세히 보기",
  buttonUrl: "#",
  backgroundColor: "#295E92",
  textColor: "#ffffff",
  targetUrl: "",
  titleStyle: {
    fontSize: "32px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.64px",
  },
  descStyle: {
    fontSize: "32px",
    fontSizeMobile: "20px",
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
  layout2SubTitle: "( 서브타이틀 )",
  layout2SubTitleStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    lineHeight: "32px",
  },
  layout2Title: "타이틀명 입력",
  layout2TitleStyle: {
    color: "#ffffff",
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    lineHeight: "60px",
  },
  layout2Desc: "이민 프로그램명 입력",
  layout2DescStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    lineHeight: "32px",
  },
  layout2ButtonText: "자세히 보기",
  layout2ButtonTextStyle: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "32px",
  },
  layout2ImageUrl: "/images/placeholder/strip-banr-layout2.png",
  // Layout 3 defaults
  layout3LeftImageUrl: "/images/placeholder/strip_banner_03_left.png",
  layout3RightImageUrl: "/images/placeholder/strip_banner_03_right.png",
  layout3LeftTitle: "9월 30일 이전 접수",
  layout3LeftTitleStyle: {
    fontSize: "36px",
    fontSizeMobile: "20px",
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.72px",
    backgroundColor:
      "linear-gradient(172.16deg, #285DE1 2.89%, #59A1B9 48.56%, #44A075 100%)",
  },
  layout3RightTitle: "9월 30일 이후 접수",
  layout3RightTitleStyle: {
    fontSize: "36px",
    fontSizeMobile: "20px",
    fontWeight: "700",
    color: "#131416",
    lineHeight: "150%",
    letterSpacing: "-0.72px",
    backgroundColor: "#59A1B9",
  },
  layout3LeftSubText: "제도가 바뀌어도",
  layout3LeftSubTextStyle: {
    fontSize: "24px",
    fontSizeMobile: "16px",
    fontWeight: "400",
    color: "#131416",
    lineHeight: "150%",
    letterSpacing: "-0.48px",
    backgroundColor: "#ffffff",
  },
  layout3LeftMainText: "100% 보호",
  layout3LeftMainTextStyle: {
    fontSize: "40px",
    fontSizeMobile: "22px",
    fontWeight: "700",
    color: "#131416",
    lineHeight: "150%",
    letterSpacing: "-0.8px",
  },
  layout3RightSubText: "투자금 인상・제도 변경・대기기간",
  layout3RightSubTextStyle: {
    fontSize: "24px",
    fontSizeMobile: "16px",
    fontWeight: "400",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.48px",
    backgroundColor: "#295E92",
  },
  layout3RightMainText: "증가 가능성",
  layout3RightMainTextStyle: {
    fontSize: "40px",
    fontSizeMobile: "22px",
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: "150%",
    letterSpacing: "-0.8px",
  },
};

export const StripBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const data = (widget.data as any) || STRIP_BANNER_DEFAULTS;
  const layout = data.layout || "1";
  const getStripBannerTextStyle = (
    textStyle: any,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(textStyle, viewport),
    ...overrides,
  });

  const sectionStyle: React.CSSProperties = {
    backgroundColor:
      widget.style?.backgroundColor || data.backgroundColor || "#295E92",
    color: data.textColor || "#ffffff",
    paddingTop: widget.style?.paddingTop || "40px",
    paddingBottom: widget.style?.paddingBottom || "40px",
  };

  // Layout 1: Left Text, Right Image
  if (layout === "1") {
    // Tablet/mobile: outer div has no horizontal padding — card spans full width
    const outerPaddingStyle: React.CSSProperties =
      viewport === "tablet" || viewport === "mobile"
        ? { paddingLeft: 0, paddingRight: 0 }
        : {};

    // Banner card container: viewport-specific layout
    const bannerCardStyle: React.CSSProperties = {
      backgroundColor: sectionStyle.backgroundColor,
      ...(viewport === "tablet"
        ? {
            flexDirection: "row",
            alignItems: "center",
            padding: "24px 40px",
            gap: "8px",
            minHeight: "unset",
            borderRadius: 0,
          }
        : viewport === "mobile"
          ? {
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "24px 20px",
              gap: "8px",
              minHeight: "unset",
              borderRadius: 0,
            }
          : {}),
    };

    // Text container: tablet/mobile override padding + gap
    const textContainerStyle: React.CSSProperties =
      viewport === "tablet" || viewport === "mobile"
        ? { gap: "8px", paddingTop: 0, paddingBottom: 0 }
        : { paddingLeft: "80px" };

    // Image container: tablet = 200×133px flow; mobile = full-width on top
    const imageContainerStyle: React.CSSProperties =
      viewport === "tablet"
        ? {
            position: "relative",
            width: "200px",
            height: "133px",
            flexShrink: 0,
            overflow: "hidden",
          }
        : viewport === "mobile"
          ? {
              position: "relative",
              width: "100%",
              height: "auto",
              flexShrink: 0,
              overflow: "hidden",
              order: -1,
            }
          : {};

    // title text (subtitle — medium weight)
    const titleTextStyle: React.CSSProperties = {
      ...getStripBannerTextStyle({
        fontSizeMobile: "18px",
        ...data.titleStyle,
      }),
      ...(viewport === "tablet"
        ? { fontSize: "20px", letterSpacing: "-0.4px", lineHeight: "150%" }
        : viewport === "mobile"
          ? { letterSpacing: "-0.36px", lineHeight: "150%" }
          : {}),
    };

    // desc text (main title — bold)
    const descTextStyle: React.CSSProperties = {
      ...getStripBannerTextStyle({ fontSizeMobile: "20px", ...data.descStyle }),
      ...(viewport === "tablet"
        ? { fontSize: "28px", letterSpacing: "-0.56px", lineHeight: "150%" }
        : viewport === "mobile"
          ? { letterSpacing: "-0.4px", lineHeight: "150%" }
          : {}),
    };

    const content = (
      <section
        className="w-full relative overflow-hidden"
        style={{
          paddingTop: widget.style?.paddingTop || "0px",
          paddingBottom: widget.style?.paddingBottom || "0px",
        }}
      >
        <div
          className={`self-stretch ${getPaddingClass(viewport)} inline-flex flex-col justify-center items-center gap-2.5 w-full`}
          style={outerPaddingStyle}
        >
          <div
            className="self-stretch inline-flex flex-col xl:flex-row justify-start items-center gap-2 w-full min-h-[16rem] rounded-xl overflow-hidden relative"
            style={bannerCardStyle}
          >
            <div
              className="flex-1 inline-flex flex-col justify-start items-start gap-2 py-10 xl:py-0 w-full z-10"
              style={textContainerStyle}
            >
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title}
                  className="justify-start font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                  style={titleTextStyle}
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
                  style={descTextStyle}
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
              style={imageContainerStyle}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onElementSelect?.("imageUrl");
              }}
            >
              <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
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

  // Layout 2
  if (layout === "2") {
    const defaultBg2Color = "#01355F";
    const bg2Color =
      widget.style?.backgroundColor &&
      widget.style.backgroundColor !== "#295E92"
        ? widget.style.backgroundColor
        : defaultBg2Color;
    const layout2ImageStyle = data.layout2ImageUrlStyle || data.imageStyle;

    // ── MOBILE: 이미지(위) + 텍스트+아이콘 row(아래) ──
    if (viewport === "mobile") {
      const mobileContent = (
        <section
          className="w-full relative overflow-hidden"
          style={{
            paddingTop: widget.style?.paddingTop || "0px",
            paddingBottom: widget.style?.paddingBottom || "0px",
          }}
        >
          <div
            className={`self-stretch ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-center items-center w-full`}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <div
              className="overflow-hidden w-full"
              style={{
                backgroundColor: bg2Color,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 이미지 — 전체 너비, 높이 auto */}
              <div
                className="relative overflow-hidden shrink-0 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 w-full"
                style={{ height: "auto" }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementSelect?.("layout2ImageUrl");
                }}
              >
                <UniversalMedia
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                  className="w-full object-cover"
                  url={
                    data.layout2ImageUrl ||
                    "/images/placeholder/strip-banr-layout2.png"
                  }
                  alt="Banner Image"
                  style={{
                    ...getElementStyle(layout2ImageStyle, viewport),
                    borderRadius: "0px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* 텍스트(flex-1) + 아이콘 row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "16px 20px",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    flex: "1 0 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  {!data.layout2SubTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2SubTitle || "( 서브타이틀 )"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle({
                          fontSizeMobile: "18px",
                          ...(data.layout2SubTitleStyle ||
                            STRIP_BANNER_DEFAULTS.layout2SubTitleStyle),
                        }),
                        letterSpacing: "-0.36px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2SubTitle");
                      }}
                    />
                  )}
                  {!data.layout2TitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2Title || "타이틀명 입력"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle({
                          fontSizeMobile: "28px",
                          ...(data.layout2TitleStyle ||
                            STRIP_BANNER_DEFAULTS.layout2TitleStyle),
                        }),
                        letterSpacing: "-0.56px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2Title");
                      }}
                    />
                  )}
                  {!data.layout2DescStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2Desc || "이민 프로그램명 입력"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle({
                          fontSizeMobile: "18px",
                          ...(data.layout2DescStyle ||
                            STRIP_BANNER_DEFAULTS.layout2DescStyle),
                        }),
                        letterSpacing: "-0.36px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2Desc");
                      }}
                    />
                  )}
                </div>
                {/* 모바일: 아이콘만, 버튼 텍스트 없음 */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/placeholder/icon-arrow.png"
                    alt="arrow icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
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
            {mobileContent}
          </a>
        );
      }
      return mobileContent;
    }

    // ── TABLET: 이미지(좌 flex-1) + 텍스트패널(우 flex-1) ──
    if (viewport === "tablet") {
      const tabletContent = (
        <section
          className="w-full relative overflow-hidden"
          style={{
            paddingTop: widget.style?.paddingTop || "0px",
            paddingBottom: widget.style?.paddingBottom || "0px",
          }}
        >
          <div
            className="self-stretch inline-flex flex-col justify-center items-center w-full"
            style={{ padding: "60px 40px" }}
          >
            <div
              className="overflow-hidden w-full"
              style={{
                backgroundColor: bg2Color,
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                minHeight: "400px",
                borderRadius: "20px",
              }}
            >
              {/* 이미지 — flex-1 왼쪽 */}
              <div
                className="relative overflow-hidden shrink-0 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                style={{ flex: "1 0 0", minHeight: 0 }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementSelect?.("layout2ImageUrl");
                }}
              >
                <UniversalMedia
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                  className="w-full h-full object-cover absolute inset-0"
                  url={
                    data.layout2ImageUrl ||
                    "/images/placeholder/strip-banr-layout2.png"
                  }
                  alt="Banner Image"
                  style={{
                    ...getElementStyle(layout2ImageStyle, viewport),
                    borderRadius: "0px",
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* 텍스트 패널 — flex-1 오른쪽 */}
              <div
                style={{
                  flex: "1 0 0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "100%",
                    lineHeight: "1.5",
                  }}
                >
                  {!data.layout2SubTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2SubTitle || "( 서브타이틀 )"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle(
                          data.layout2SubTitleStyle ||
                            STRIP_BANNER_DEFAULTS.layout2SubTitleStyle,
                        ),
                        letterSpacing: "-0.4px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2SubTitle");
                      }}
                    />
                  )}
                  {!data.layout2TitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2Title || "타이틀명 입력"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle(
                          data.layout2TitleStyle ||
                            STRIP_BANNER_DEFAULTS.layout2TitleStyle,
                        ),
                        letterSpacing: "-0.8px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2Title");
                      }}
                    />
                  )}
                  {!data.layout2DescStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2Desc || "이민 프로그램명 입력"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle(
                          data.layout2DescStyle ||
                            STRIP_BANNER_DEFAULTS.layout2DescStyle,
                        ),
                        letterSpacing: "-0.4px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2Desc");
                      }}
                    />
                  )}
                </div>
                {/* 버튼: 텍스트 + 아이콘 */}
                <div
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    height: "48px",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "24px",
                    cursor: "pointer",
                  }}
                >
                  {!data.layout2ButtonTextStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2ButtonText || "자세히 보기"}
                      className="font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={{
                        ...getStripBannerTextStyle(
                          data.layout2ButtonTextStyle ||
                            STRIP_BANNER_DEFAULTS.layout2ButtonTextStyle,
                        ),
                        letterSpacing: "-0.4px",
                        lineHeight: "1.5",
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onElementSelect?.("layout2ButtonText");
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/images/placeholder/icon-arrow.png"
                      alt="arrow icon"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
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
            {tabletContent}
          </a>
        );
      }
      return tabletContent;
    }

    // ── PC (기존 코드 유지) ──
    const content = (
      <section
        className="w-full relative overflow-hidden"
        style={{
          paddingTop: widget.style?.paddingTop || "0px",
          paddingBottom: widget.style?.paddingBottom || "0px",
        }}
      >
        <div
          className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex xl:flex-row flex-col justify-center items-center gap-10 w-full`}
        >
          <div
            className="self-stretch h-auto xl:h-96 rounded-[20px] inline-flex flex-col xl:flex-row justify-start items-stretch overflow-hidden w-full relative"
            style={{ backgroundColor: bg2Color }}
          >
            <div
              className="flex-1 min-h-[240px] xl:min-h-0 relative overflow-hidden shrink-0 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onElementSelect?.("layout2ImageUrl");
              }}
            >
              <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2ImageUrl");
                }}
                className="w-full h-full object-cover absolute inset-0"
                url={
                  data.layout2ImageUrl ||
                  "/images/placeholder/strip-banr-layout2.png"
                }
                alt="Banner Image"
                style={{
                  ...getElementStyle(layout2ImageStyle, viewport),
                  borderRadius: "0px",
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              className="flex-1 self-stretch inline-flex flex-col justify-between items-start w-full"
              style={{
                paddingTop: "56px",
                paddingBottom: "56px",
                paddingRight: "56px",
                paddingLeft: "80px",
              }}
            >
              <div className="self-stretch flex flex-col justify-center items-start w-full">
                {!data.layout2SubTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout2SubTitle || "( 서브타이틀 )"}
                    className="text-center justify-start font-medium font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={getStripBannerTextStyle(
                      data.layout2SubTitleStyle ||
                        STRIP_BANNER_DEFAULTS.layout2SubTitleStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onElementSelect?.("layout2SubTitle");
                    }}
                  />
                )}
                {!data.layout2TitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout2Title || "타이틀명 입력"}
                    className="justify-start font-bold font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={getStripBannerTextStyle(
                      data.layout2TitleStyle ||
                        STRIP_BANNER_DEFAULTS.layout2TitleStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onElementSelect?.("layout2Title");
                    }}
                  />
                )}
                {!data.layout2DescStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout2Desc || "이민 프로그램명 입력"}
                    className="text-center justify-start font-medium font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={getStripBannerTextStyle(
                      data.layout2DescStyle ||
                        STRIP_BANNER_DEFAULTS.layout2DescStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onElementSelect?.("layout2Desc");
                    }}
                  />
                )}
              </div>
              <div className="h-12 py-1 rounded-3xl inline-flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mt-6 xl:mt-0">
                {!data.layout2ButtonTextStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout2ButtonText || "자세히 보기"}
                    className="justify-start font-bold font-['Pretendard'] break-keep cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={getStripBannerTextStyle(
                      data.layout2ButtonTextStyle ||
                        STRIP_BANNER_DEFAULTS.layout2ButtonTextStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onElementSelect?.("layout2ButtonText");
                    }}
                  />
                )}
                <div className="w-6 h-6 flex justify-center items-center">
                  <img
                    src="/images/placeholder/icon-arrow.png"
                    alt="arrow icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
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

  // Layout 3: 2-column cards (image + title bar + text area)
  if (layout === "3") {
    const defaultBg3Color = "#0B1D48";
    const bg3Color =
      widget.style?.backgroundColor &&
      widget.style.backgroundColor !== "#295E92"
        ? widget.style.backgroundColor
        : defaultBg3Color;

    const leftTitleStyle =
      data.layout3LeftTitleStyle || STRIP_BANNER_DEFAULTS.layout3LeftTitleStyle;
    const rightTitleStyle =
      data.layout3RightTitleStyle ||
      STRIP_BANNER_DEFAULTS.layout3RightTitleStyle;
    const leftSubTextStyle =
      data.layout3LeftSubTextStyle ||
      STRIP_BANNER_DEFAULTS.layout3LeftSubTextStyle;
    const rightSubTextStyle =
      data.layout3RightSubTextStyle ||
      STRIP_BANNER_DEFAULTS.layout3RightSubTextStyle;
    const leftMainTextStyle =
      data.layout3LeftMainTextStyle ||
      STRIP_BANNER_DEFAULTS.layout3LeftMainTextStyle;
    const rightMainTextStyle =
      data.layout3RightMainTextStyle ||
      STRIP_BANNER_DEFAULTS.layout3RightMainTextStyle;

    // Helper: background 스타일 (gradient 문자열이면 background, 아니면 backgroundColor)
    const getBgStyle = (bgValue?: string): React.CSSProperties => {
      if (!bgValue) return {};
      if (bgValue.startsWith("linear-gradient") || bgValue.startsWith("radial-gradient")) {
        return { background: bgValue };
      }
      return { backgroundColor: bgValue };
    };

    const isMobile = viewport === "mobile";
    const isTablet = viewport === "tablet";

    const outerPadding: React.CSSProperties = isMobile
      ? { padding: "32px 20px" }
      : isTablet
        ? { padding: "40px 40px" }
        : { padding: "60px 280px" };

    const cardGap = isMobile ? "20px" : isTablet ? "20px" : "40px";
    const innerGap = isMobile ? "8px" : "16px";
    const titleFontSize = isMobile ? "20px" : "36px";
    const titlePadding = isMobile ? "12px" : "16px";
    const subFontSize = isMobile ? "16px" : "24px";
    const mainFontSize = isMobile ? "22px" : "40px";
    const textPadding = isMobile ? "16px" : "24px";
    const borderRadius = isMobile ? "8px" : "16px";

    const renderCard = (
      side: "left" | "right",
      imageUrl: string,
      imageKey: string,
      titleText: string,
      titleKey: string,
      titleStyleObj: any,
      subText: string,
      subKey: string,
      subStyleObj: any,
      mainText: string,
      mainKey: string,
      mainStyleObj: any,
    ) => (
      <div
        style={{
          flex: isMobile ? "unset" : "1 0 0",
          display: "flex",
          flexDirection: "column",
          gap: innerGap,
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          width: isMobile ? "100%" : undefined,
        }}
      >
        {/* Image */}
        {!data[imageKey + "Style"]?.isHidden && (
          <div
            style={{
              width: "100%",
              aspectRatio: "11 / 4",
              borderRadius,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
            className="cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onElementSelect?.(imageKey);
            }}
          >
            <UniversalMedia
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.(imageKey);
              }}
              url={imageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ borderRadius }}
              alt={`Banner ${side} Image`}
            />
          </div>
        )}
        {/* Title bar + Text area (gap 0) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title bar */}
          {!titleStyleObj?.isHidden && (
            <div
              style={{
                ...getBgStyle(titleStyleObj?.backgroundColor),
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: titlePadding,
                borderRadius,
              }}
            >
              <SafeHtml
                html={titleText}
                className="font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                style={{
                  ...getElementStyle(titleStyleObj, viewport),
                  fontSize: titleFontSize,
                  backgroundColor: "transparent",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementSelect?.(titleKey);
                }}
              />
            </div>
          )}
          {/* Text area */}
          <div
            style={{
              ...getBgStyle(subStyleObj?.backgroundColor),
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: textPadding,
              borderRadius,
              textAlign: "center",
            }}
          >
            {!subStyleObj?.isHidden && (
              <SafeHtml
                html={subText}
                className="font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                style={{
                  ...getElementStyle(subStyleObj, viewport),
                  fontSize: subFontSize,
                  backgroundColor: "transparent",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementSelect?.(subKey);
                }}
              />
            )}
            {!mainStyleObj?.isHidden && (
              <SafeHtml
                html={mainText}
                className="font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 cursor-text transition-all"
                style={{
                  ...getElementStyle(mainStyleObj, viewport),
                  fontSize: mainFontSize,
                  backgroundColor: "transparent",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementSelect?.(mainKey);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );

    const content = (
      <section
        className="w-full relative overflow-hidden"
        style={{
          paddingTop: widget.style?.paddingTop || "0px",
          paddingBottom: widget.style?.paddingBottom || "0px",
        }}
      >
        <div
          style={{
            backgroundColor: bg3Color,
            ...outerPadding,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: cardGap,
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {renderCard(
            "left",
            data.layout3LeftImageUrl ||
              STRIP_BANNER_DEFAULTS.layout3LeftImageUrl,
            "layout3LeftImageUrl",
            data.layout3LeftTitle || STRIP_BANNER_DEFAULTS.layout3LeftTitle,
            "layout3LeftTitle",
            leftTitleStyle,
            data.layout3LeftSubText ||
              STRIP_BANNER_DEFAULTS.layout3LeftSubText,
            "layout3LeftSubText",
            leftSubTextStyle,
            data.layout3LeftMainText ||
              STRIP_BANNER_DEFAULTS.layout3LeftMainText,
            "layout3LeftMainText",
            leftMainTextStyle,
          )}
          {renderCard(
            "right",
            data.layout3RightImageUrl ||
              STRIP_BANNER_DEFAULTS.layout3RightImageUrl,
            "layout3RightImageUrl",
            data.layout3RightTitle || STRIP_BANNER_DEFAULTS.layout3RightTitle,
            "layout3RightTitle",
            rightTitleStyle,
            data.layout3RightSubText ||
              STRIP_BANNER_DEFAULTS.layout3RightSubText,
            "layout3RightSubText",
            rightSubTextStyle,
            data.layout3RightMainText ||
              STRIP_BANNER_DEFAULTS.layout3RightMainText,
            "layout3RightMainText",
            rightMainTextStyle,
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
  }

  // Fallback
  return null;
};
