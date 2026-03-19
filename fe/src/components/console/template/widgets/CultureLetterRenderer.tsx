import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  WidgetRendererProps,
  getImageUrl,
  getPaddingClass,
  getBorderRadiusClass,
  isVideoUrl,
  UniversalMedia,
  SafeHtml,
  getElementStyle,
  formatUnit,
} from "./WidgetUtils";

const CULTURE_LETTER_TEXT_STYLE_DEFAULTS = {
  layout1CultureLetterStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "40px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: "-0.8px",
    lineHeight: "1",
  },
  layout1IssueNoStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: "-0.48px",
    lineHeight: "1",
  },
  layout1IssueDateStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
  },
  layout1TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: "-0.96px",
    lineHeight: "1.5",
  },
  layout1DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "18px",
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
  },
  layout4SubLabelStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "20px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#285de1",
    textAlign: "center",
    letterSpacing: "-0.4px",
    lineHeight: "1.5",
  },
  layout4MainTitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
    letterSpacing: "-0.8px",
    lineHeight: "1.5",
  },
  layout4Card1TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "20px",
    fontSizeMobile: "16px",
    fontWeight: "500",
    color: "#060606",
    textAlign: "center",
    letterSpacing: "-0.4px",
    lineHeight: "1.5",
  },
  layout4Card2TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "20px",
    fontSizeMobile: "16px",
    fontWeight: "500",
    color: "#060606",
    textAlign: "center",
    letterSpacing: "-0.4px",
    lineHeight: "1.5",
  },
  layout4Card3TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "20px",
    fontSizeMobile: "16px",
    fontWeight: "500",
    color: "#060606",
    textAlign: "center",
    letterSpacing: "-0.4px",
    lineHeight: "1.5",
  },
  layout3CultureLetterStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "40px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#ffffff",
    letterSpacing: "-0.8px",
    lineHeight: "1",
  },
  layout3IssueNoStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#ffffff",
    letterSpacing: "-0.48px",
    lineHeight: "1",
  },
  layout3IssueDateStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
  },
  layout3TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.96px",
    lineHeight: "1.5",
  },
  layout3DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
  },
  layout2CultureLetterStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "40px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#131416",
    letterSpacing: "-0.8px",
    lineHeight: "1",
  },
  layout2IssueNoStyle: {
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "400",
    color: "#295e92",
    letterSpacing: "-0.48px",
    lineHeight: "1",
  },
  layout2IssueDateStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "700",
    color: "#58616a",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
  },
  layout2TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#295e92",
    letterSpacing: "-0.96px",
    lineHeight: "1.5",
    textAlign: "center",
  },
  layout2DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6d7882",
    letterSpacing: "-0.48px",
    lineHeight: "1.5",
    textAlign: "center",
  },
  layout5Card1TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontWeight: "700",
    color: "#131416",
    lineHeight: "1.5",
  },
  layout5Card1DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "18px",
    fontWeight: "400",
    color: "#6d7882",
    letterSpacing: "-0.36px",
    lineHeight: "1.5",
  },
  layout5Card2TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontWeight: "700",
    color: "#131416",
    lineHeight: "1.5",
  },
  layout5Card2DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "18px",
    fontWeight: "400",
    color: "#6d7882",
    letterSpacing: "-0.36px",
    lineHeight: "1.5",
  },
  layout5Card3TitleStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "24px",
    fontWeight: "700",
    color: "#131416",
    lineHeight: "1.5",
  },
  layout5Card3DescStyle: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: "18px",
    fontWeight: "400",
    color: "#6d7882",
    letterSpacing: "-0.36px",
    lineHeight: "1.5",
  },
} as const;

export const CULTURE_LETTER_DEFAULTS = {
  layout: "1",
  // Layout 1 - 컬처레터 헤더 좌측정렬
  layout1BgImageUrl: "/images/placeholder/culture_letter_layout1_bg.jpg",
  layout1BgImageUrlStyle: { objectFit: "cover" },
  layout1MobileBgImageUrl: "",
  layout1MobileBgImageUrlStyle: { objectFit: "cover" },
  layout1LogoImageUrl: "/images/placeholder/culture_letter_layout1_logo.png",
  layout1LogoImageUrlStyle: { objectFit: "contain" },
  layout1CultureLetter: "Culture Letter",
  layout1CultureLetterStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout1CultureLetterStyle,
  layout1IssueNo: "No.15",
  layout1IssueNoStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout1IssueNoStyle,
  layout1IssueDate: "2026년 1월호 컬처레터",
  layout1IssueDateStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout1IssueDateStyle,
  layout1Title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  layout1TitleStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout1TitleStyle,
  layout1Desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
  layout1DescStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout1DescStyle,
  // Layout 4 - 컬처레터 유튜브 타이틀 (키명 임의 지정)
  layout4SubLabel: "( Youtube )",
  layout4SubLabelStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout4SubLabelStyle,
  layout4MainTitle:
    "'내 가족과 자녀를 위한' 안정적인 미국 이민과 교육 종합 컨설팅",
  layout4MainTitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout4MainTitleStyle,
  cl4C1LogoUrl: "/images/placeholder/cl4_logo1.png",
  cl4C1LogoUrlStyle: { objectFit: "contain" },
  cl4C1ThumbUrl: "https://www.youtube.com/watch?v=bfeCmROrjXw",
  cl4C1ThumbUrlStyle: { objectFit: "cover" },
  layout4Card1Title: "뉴욕·LA 버리고 여기 산다고? 천억짜리 시골.. 진짜 이유는?",
  layout4Card1TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout4Card1TitleStyle,
  cl4C2LogoUrl: "/images/placeholder/cl4_logo2.png",
  cl4C2LogoUrlStyle: { objectFit: "contain" },
  cl4C2ThumbUrl: "https://www.youtube.com/watch?v=YAGU3YSwrTU&t=64s",
  cl4C2ThumbUrlStyle: { objectFit: "cover" },
  layout4Card2Title: "뉴욕·LA 버리고 여기 산다고? 천억짜리 시골.. 진짜 이유는?",
  layout4Card2TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout4Card2TitleStyle,
  cl4C3LogoUrl: "/images/placeholder/cl4_logo3.png",
  cl4C3LogoUrlStyle: { objectFit: "contain" },
  cl4C3ThumbUrl: "https://www.youtube.com/watch?v=DOPXQMX0rio&t=2s",
  cl4C3ThumbUrlStyle: { objectFit: "cover" },
  layout4Card3Title: "뉴욕·LA 버리고 여기 산다고? 천억짜리 시골.. 진짜 이유는?",
  layout4Card3TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout4Card3TitleStyle,
  // Layout 3 - 컬처레터 헤더 우측배너 (키명 임의 지정)
  cl3LogoUrl: "/images/placeholder/culture_letter_layout1_logo.png",
  cl3LogoUrlStyle: { objectFit: "contain" },
  cl3CardImgUrl: "/images/placeholder/cl3_banner.jpg",
  cl3CardImgUrlStyle: { objectFit: "cover" },
  layout3CultureLetter: "Culture Letter",
  layout3CultureLetterStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout3CultureLetterStyle,
  layout3IssueNo: "No.15",
  layout3IssueNoStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout3IssueNoStyle,
  layout3IssueDate: "2026년 1월호 컬처레터",
  layout3IssueDateStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout3IssueDateStyle,
  layout3Title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  layout3TitleStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout3TitleStyle,
  layout3Desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
  layout3DescStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout3DescStyle,
  cl3BgUrl: "",
  cl3BgUrlStyle: { objectFit: "cover" },
  cl3MobileBgUrl: "",
  cl3MobileBgUrlStyle: { objectFit: "cover" },
  // Layout 2 - 컬처레터 헤더 중앙정렬 (키명 임의 지정)
  cl2BgUrl: "",
  cl2BgUrlStyle: { objectFit: "cover" },
  cl2MobileBgUrl: "",
  cl2MobileBgUrlStyle: { objectFit: "cover" },
  cl2LogoUrl: "/images/placeholder/culture_letter_layout2_logo.png",
  cl2LogoUrlStyle: { objectFit: "contain" },
  layout2CultureLetter: "Culture Letter",
  layout2CultureLetterStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout2CultureLetterStyle,
  layout2IssueNo: "No.15",
  layout2IssueNoStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout2IssueNoStyle,
  layout2IssueDate: "2026년 1월호 컬처레터",
  layout2IssueDateStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout2IssueDateStyle,
  layout2Title: "텍스트 영역입니다.\n텍스트 타이틀 영역",
  layout2TitleStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout2TitleStyle,
  layout2Desc: "배너 타이틀 서브 영역입니다. 필요 없을 땐 노출 숨김.",
  layout2DescStyle: CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout2DescStyle,
  // Layout 5 - 컬처레터 바로가기 버튼 (키명 임의 지정)
  cl5C1SvgUrl: "/images/placeholder/cl5_icon1.svg",
  cl5C1SvgUrlStyle: { objectFit: "contain" },
  cl5C1CardBgUrl: "",
  cl5C1CardBgUrlStyle: {
    objectFit: "cover",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "24px",
  },
  layout5Card1Title: "1:1 상담 신청",
  layout5Card1TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card1TitleStyle,
  layout5Card1Desc: "기다리지 않고 바로",
  layout5Card1DescStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card1DescStyle,
  layout5Card1Link: "",
  cl5C2SvgUrl: "/images/placeholder/cl5_icon2.svg",
  cl5C2SvgUrlStyle: { objectFit: "contain" },
  cl5C2CardBgUrl: "",
  cl5C2CardBgUrlStyle: {
    objectFit: "cover",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "24px",
  },
  layout5Card2Title: "카카오톡 실시간 상담",
  layout5Card2TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card2TitleStyle,
  layout5Card2Desc: "카카오톡 실시간 상담",
  layout5Card2DescStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card2DescStyle,
  layout5Card2Link: "",
  cl5C3SvgUrl: "/images/placeholder/cl5_icon3.svg",
  cl5C3SvgUrlStyle: { objectFit: "contain" },
  cl5C3CardBgUrl: "",
  cl5C3CardBgUrlStyle: {
    objectFit: "cover",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "24px",
  },
  layout5Card3Title: "설명회 일정",
  layout5Card3TitleStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card3TitleStyle,
  layout5Card3Desc: "설명회 일정 바로가기",
  layout5Card3DescStyle:
    CULTURE_LETTER_TEXT_STYLE_DEFAULTS.layout5Card3DescStyle,
  layout5Card3Link: "",
  backgroundImage: "",
  backgroundImageStyle: {},
};

const CULTURE_LETTER_LAYOUT1_DEFAULT_BACKGROUND =
  "linear-gradient(180deg, rgb(35, 55, 89) 8.5623%, rgb(33, 52, 83) 28.645%, rgb(28, 43, 68) 52.379%, rgb(19, 30, 43) 79.764%, rgb(12, 18, 20) 99.847%), linear-gradient(180.00000000000006deg, rgb(240, 207, 214) 0%, rgb(219, 159, 171) 100%)";

const CULTURE_LETTER_LAYOUT3_DEFAULT_BACKGROUND =
  "linear-gradient(to left, #062843, #0f66a9)";

export const CultureLetterRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = String(data.layout || "1");
  const hasCultureLetterLayoutState = Boolean((data as any).__layoutStateMap);
  const isMobileViewport = viewport === "mobile" || viewport === "tablet";
  const toHtmlWithBreaks = (value?: string) =>
    String(value || "").replace(/\n/g, "<br/>");
  const getCultureLetterStyleSource = (styleKey: string) => {
    const defaultStyle = (CULTURE_LETTER_DEFAULTS as any)[styleKey];
    const currentStyle = data[styleKey];

    if (
      defaultStyle &&
      typeof defaultStyle === "object" &&
      currentStyle &&
      typeof currentStyle === "object"
    ) {
      return {
        ...defaultStyle,
        ...currentStyle,
      };
    }

    return currentStyle || defaultStyle;
  };
  const getCultureLetterTextStyle = (
    styleKey: string,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(getCultureLetterStyleSource(styleKey), viewport),
    ...overrides,
  });
  const getCultureLetterSectionStyle = (
    sectionStyle: React.CSSProperties,
  ): React.CSSProperties => ({
    ...style,
    ...sectionStyle,
    paddingTop:
      formatUnit((data as any).sectionPaddingTop) ??
      (!hasCultureLetterLayoutState ? style.paddingTop : undefined) ??
      sectionStyle.paddingTop,
    paddingBottom:
      formatUnit((data as any).sectionPaddingBottom) ??
      (!hasCultureLetterLayoutState ? style.paddingBottom : undefined) ??
      sectionStyle.paddingBottom,
  });
  const isCultureLetterTextHidden = (styleKey: string) =>
    Boolean(data[styleKey]?.isHidden);

  // YouTube URL → 썸네일 이미지 URL 추출
  const getYoutubeThumbnail = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/,
    );
    if (!match) return null;
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  };

  const resolveThumbDisplay = (url: string) => getYoutubeThumbnail(url) || url;
  const isInlinePlayableThumb = (url: string) => Boolean(url && isVideoUrl(url));
  const renderLayout4ThumbMedia = (
    thumbRaw: string,
    thumbStyle: React.CSSProperties,
  ) => {
    const thumbDisplaySrc = resolveThumbDisplay(thumbRaw);

    if (!onElementSelect && isInlinePlayableThumb(thumbRaw)) {
      return (
        <UniversalMedia
          url={thumbRaw}
          className="absolute inset-0 w-full h-full"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            borderRadius: thumbStyle.borderRadius,
          }}
        />
      );
    }

    if (thumbDisplaySrc || thumbRaw) {
      return (
        <img
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            ...thumbStyle,
            objectPosition: thumbStyle.objectPosition || "center",
            pointerEvents: "none",
          }}
          src={thumbDisplaySrc || thumbRaw}
        />
      );
    }

    return (
      <div
        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          color: "#9ca3af",
        }}
      >
        썸네일 이미지
      </div>
    );
  };
  const getResponsiveMedia = (
    desktopUrl: string | undefined,
    mobileUrl: string | undefined,
    desktopStyle: Record<string, any> | undefined,
    mobileStyle: Record<string, any> | undefined,
    defaultUrl: string = "",
  ) => {
    const activeUrl = isMobileViewport
      ? mobileUrl || desktopUrl || defaultUrl
      : desktopUrl || defaultUrl;

    const sourceStyle = isMobileViewport
      ? {
          ...(desktopStyle || {}),
          ...(mobileStyle || {}),
        }
      : desktopStyle || {};

    return {
      url: activeUrl,
      style: getElementStyle(sourceStyle, viewport),
      sourceStyle,
    };
  };

  /* ─────────────── Layout 1 : 컬처레터 헤더 - 좌측정렬 ─────────────── */
  if (layout === "1") {
    const { url: bgImage, style: bgImageStyle } = getResponsiveMedia(
      data.layout1BgImageUrl,
      data.layout1MobileBgImageUrl,
      data.layout1BgImageUrlStyle ?? CULTURE_LETTER_DEFAULTS.layout1BgImageUrlStyle,
      data.layout1MobileBgImageUrlStyle ?? CULTURE_LETTER_DEFAULTS.layout1MobileBgImageUrlStyle,
      data.layout1BgImageUrl === "" ? "" : (data.layout1BgImageUrl || CULTURE_LETTER_DEFAULTS.layout1BgImageUrl),
    );
    const logoImage =
      data.layout1LogoImageUrl ?? CULTURE_LETTER_DEFAULTS.layout1LogoImageUrl;

    // 사용자가 배경색을 지정했거나 배경 이미지가 있으면 기본 그라디언트를 숨김
    const layout1BackgroundImage =
      style.backgroundColor || bgImage
        ? undefined
        : CULTURE_LETTER_LAYOUT1_DEFAULT_BACKGROUND;

    /* ── 태블릿 레이아웃 (피그마 node-id: 3298:29808, 768px) ── */
    if (viewport === "tablet") {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "40px",
            paddingRight: "40px",
            alignItems: "flex-start",
            justifyContent: "center",
          })}
          onDoubleClick={() => {
            onElementSelect?.("layout1BgImageUrl");
          }}
          onClick={(e) => {
            if (!onElementSelect) {
              console.log("Layout 1 Clicked");
            }
          }}
        >
          {/* 배경 레이어 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: style.backgroundColor || "transparent",
                  backgroundImage: layout1BackgroundImage,
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
                    ...bgImageStyle,
                    objectPosition: bgImageStyle.objectPosition || "center",
                  }}
                  src={bgImage}
                />
              )}
            </div>
          </div>

          {/* tit 태블릿 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 — 가로 중앙 정렬 */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {!isCultureLetterTextHidden("layout1IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout1IssueNo ?? CULTURE_LETTER_DEFAULTS.layout1IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout1IssueNoStyle"),
                    fontSize: "24px",
                    fontWeight: "400",
                    letterSpacing: "-0.48px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout1IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout1IssueDate ?? CULTURE_LETTER_DEFAULTS.layout1IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout1IssueDateStyle"),
                    fontSize: "24px",
                    fontWeight: "700",
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

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                style={{ display: "flex", alignItems: "center" }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1LogoImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
              >
                <UniversalMedia
                  alt="logo"
                  className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  url={logoImage}
                  style={{
                    height: "40px",
                    width: "auto",
                    display: "block",
                    ...getElementStyle(
                      data.layout1LogoImageUrlStyle ?? CULTURE_LETTER_DEFAULTS.layout1LogoImageUrlStyle,
                      viewport
                    ),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1LogoImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout1CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout1CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout1CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout1CultureLetterStyle"),
                    fontSize: "28px",
                    fontWeight: "400",
                    letterSpacing: "-0.56px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1CultureLetter");
                    } else if (data.layout1CultureLetterLink) {
                      window.open(data.layout1CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 본문 — 타이틀 + 설명 (좌측 정렬) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "flex-start",
              position: "relative",
              flexShrink: 0,
              width: "100%",
            }}
          >
            {!isCultureLetterTextHidden("layout1TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout1Title ?? CULTURE_LETTER_DEFAULTS.layout1Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout1TitleStyle"),
                  fontSize: "48px",
                  fontWeight: "700",
                  letterSpacing: "-0.96px",
                  lineHeight: "1.5",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout1DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout1Desc ?? CULTURE_LETTER_DEFAULTS.layout1Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout1DescStyle"),
                  fontSize: "24px",
                  fontWeight: "400",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.5",
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

    /* ── 모바일 레이아웃 (피그마 node-id: 3298:58872, 375px) ── */
    if (isMobileViewport) {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            paddingTop: "24px",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
          })}
          onDoubleClick={() => {
            onElementSelect?.("layout1MobileBgImageUrl");
          }}
          onClick={(e) => {
            if (!onElementSelect) {
              console.log("Layout 1 Clicked");
            }
          }}
        >
          {/* 배경 레이어 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: style.backgroundColor || "transparent",
                  backgroundImage: layout1BackgroundImage,
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
                    ...bgImageStyle,
                    objectPosition: bgImageStyle.objectPosition || "center",
                  }}
                  src={bgImage}
                />
              )}
            </div>
          </div>

          {/* tit 모바일 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 (모바일에서는 이미지처럼 나란히 배치) */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!isCultureLetterTextHidden("layout1IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout1IssueNo ?? CULTURE_LETTER_DEFAULTS.layout1IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all font-['Tenor_Sans',sans-serif]"
                  style={{
                    ...getCultureLetterTextStyle("layout1IssueNoStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout1IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout1IssueDate ?? CULTURE_LETTER_DEFAULTS.layout1IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout1IssueDateStyle"),
                    fontWeight: "700",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1IssueDate");
                  }}
                />
              )}
            </div>

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                style={{ display: "flex", alignItems: "center" }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1LogoImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
              >
                <UniversalMedia
                  alt="logo"
                  className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  url={logoImage}
                  style={{
                    height: "24px",
                    width: "auto",
                    display: "block",
                    ...getElementStyle(
                      data.layout1LogoImageUrlStyle ?? CULTURE_LETTER_DEFAULTS.layout1LogoImageUrlStyle,
                      viewport
                    ),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1LogoImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout1CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout1CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout1CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all font-['Tenor_Sans',sans-serif]"
                  style={{
                    ...getCultureLetterTextStyle("layout1CultureLetterStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1CultureLetter");
                    } else if (data.layout1CultureLetterLink) {
                      window.open(data.layout1CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 본문 — 타이틀 + 설명 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-start",
              position: "relative",
              flexShrink: 0,
              width: "100%",
            }}
          >
            {!isCultureLetterTextHidden("layout1TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout1Title ?? CULTURE_LETTER_DEFAULTS.layout1Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout1TitleStyle"),
                  fontWeight: "700",
                  letterSpacing: "-0.56px",
                  lineHeight: "1.5",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout1DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout1Desc ?? CULTURE_LETTER_DEFAULTS.layout1Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout1DescStyle"),
                  fontWeight: "400",
                  letterSpacing: "-0.36px",
                  lineHeight: "1.5",
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

    /* ── PC 레이아웃 (기존 유지) ── */
    return (
      <div
        className={`content-stretch flex flex-col gap-[80px] items-start justify-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={getCultureLetterSectionStyle({
          backgroundImage: undefined,
        })}
        onDoubleClick={() => {
          onElementSelect?.(
            isMobileViewport ? "layout1MobileBgImageUrl" : "layout1BgImageUrl",
          );
        }}
        onClick={(e) => {
          if (!onElementSelect) {
            // 이소정 님, 여기에 레이아웃 1 클릭 시 동작할 미리보기 로직(팝업 등)을 추가할 예정입니다.
            console.log("Layout 1 Clicked");
          }
        }}
      >
        {/* 배경 레이어 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: style.backgroundColor || "transparent",
                backgroundImage: layout1BackgroundImage,
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
                  ...bgImageStyle,
                  objectPosition: bgImageStyle.objectPosition || "center",
                }}
                src={bgImage}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
          >
            <UniversalMedia
              alt="logo"
              className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
              url={logoImage}
              style={{
                height: "40px",
                    width: "auto",
                    display: "block",
                    ...getElementStyle(
                      data.layout1LogoImageUrlStyle ?? CULTURE_LETTER_DEFAULTS.layout1LogoImageUrlStyle,
                      viewport
                    ),
              }}
              onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1LogoImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1LogoImageUrl");
                    } else if (data.layout1LogoImageUrlLink) {
                      window.open(data.layout1LogoImageUrlLink, "_self");
                    }
                  }}
            />
          </div>

          {/* Culture Letter (그리드 정중앙, 스타일 고정) */}
          {!isCultureLetterTextHidden("layout1CultureLetterStyle") && (
            <SafeHtml
              html={
                data.layout1CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout1CultureLetter
              }
              className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
              style={getCultureLetterTextStyle("layout1CultureLetterStyle", {
                justifySelf: "center",
              })}
              onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout1CultureLetter");
                    } else if (data.layout1CultureLetterLink) {
                      window.open(data.layout1CultureLetterLink, "_self");
                    }
                  }}
            />
          )}

          {/* No. + 날짜 (우측, 세로 스택, 스타일 고정) */}
          <div className="content-stretch flex flex-col lg:flex-row items-end lg:items-center justify-center relative shrink-0 lg:gap-[16px]">
            {!isCultureLetterTextHidden("layout1IssueNoStyle") && (
              <SafeHtml
                html={
                  data.layout1IssueNo ?? CULTURE_LETTER_DEFAULTS.layout1IssueNo
                }
                className={`not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
                style={getCultureLetterTextStyle("layout1IssueNoStyle")}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout1IssueNo");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout1IssueDateStyle") && (
              <SafeHtml
                html={
                  data.layout1IssueDate ?? CULTURE_LETTER_DEFAULTS.layout1IssueDate
                }
                className={`text-right cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={getCultureLetterTextStyle("layout1IssueDateStyle")}
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
          {!isCultureLetterTextHidden("layout1TitleStyle") && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout1Title ?? CULTURE_LETTER_DEFAULTS.layout1Title,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout1TitleStyle")}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1Title");
              }}
            />
          )}
          {!isCultureLetterTextHidden("layout1DescStyle") && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout1Desc ?? CULTURE_LETTER_DEFAULTS.layout1Desc,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout1DescStyle")}
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

  /* ─────────────── Layout 4 : 컬처레터 유튜브 타이틀 ─────────────── */
  if (layout === "4") {
    const cards = [
      {
        logoKey: "cl4C1LogoUrl" as const,
        thumbKey: "cl4C1ThumbUrl" as const,
        titleKey: "layout4Card1Title" as const,
        logoStyleKey: "cl4C1LogoUrlStyle" as const,
        thumbStyleKey: "cl4C1ThumbUrlStyle" as const,
      },
      {
        logoKey: "cl4C2LogoUrl" as const,
        thumbKey: "cl4C2ThumbUrl" as const,
        titleKey: "layout4Card2Title" as const,
        logoStyleKey: "cl4C2LogoUrlStyle" as const,
        thumbStyleKey: "cl4C2ThumbUrlStyle" as const,
      },
      {
        logoKey: "cl4C3LogoUrl" as const,
        thumbKey: "cl4C3ThumbUrl" as const,
        titleKey: "layout4Card3Title" as const,
        logoStyleKey: "cl4C3LogoUrlStyle" as const,
        thumbStyleKey: "cl4C3ThumbUrlStyle" as const,
      },
    ];

    /* ── 태블릿 레이아웃 (피그마 node-id: 3298:29833 구조 적용) ── */
    if (viewport === "tablet") {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundColor: style.backgroundColor || "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "40px",
            paddingRight: "40px",
          })}
        >
          {/* 상단 타이틀 섹션 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              width: "100%",
            }}
          >
            {!isCultureLetterTextHidden("layout4SubLabelStyle") && (
              <SafeHtml
                html={data.layout4SubLabel ?? CULTURE_LETTER_DEFAULTS.layout4SubLabel}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout4SubLabelStyle"),
                  fontSize: "24px",
                  fontWeight: "400",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.5",
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                  width: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout4SubLabel");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout4MainTitleStyle") && (
              <SafeHtml
                html={data.layout4MainTitle ?? CULTURE_LETTER_DEFAULTS.layout4MainTitle}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout4MainTitleStyle"),
                  fontSize: "48px",
                  fontWeight: "700",
                  letterSpacing: "-0.96px",
                  lineHeight: "1.4",
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                  width: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout4MainTitle");
                }}
              />
            )}
          </div>

          {/* 카드 3개 — 태블릿에서 세로 스택 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
            }}
          >
            {cards.map((card, idx) => {
              const logoImg =(data[card.logoKey] ?? CULTURE_LETTER_DEFAULTS[card.logoKey]) || "";
              const thumbRaw =(data[card.thumbKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbKey]) || "";
              const thumbStyle = getElementStyle(
                data[card.thumbStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbStyleKey],
                viewport,
              );
              const titleText = data[card.titleKey] ?? CULTURE_LETTER_DEFAULTS[card.titleKey];
              const titleStyleKey = `${card.titleKey}Style`;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "flex-start",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* 카테고리 로고 */}
                  <div
                    style={{
                      height: "24px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      width: logoImg ? "auto" : "100px",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.(card.logoKey);
                    }}
                  >
                    {logoImg ? (
                      <UniversalMedia
                        alt="category-logo"
                        className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                        url={logoImg}
                        style={{
                          ...getElementStyle(
                            data[card.logoStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.logoStyleKey],
                            viewport,
                          ),
                          height: "24px",
                          width: "auto",
                          display: "block",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(card.logoKey);
                        }}
                      />
                    ) : (
                      <div
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                        style={{
                          height: "24px",
                          width: "100px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: "#9ca3af",
                          cursor: "pointer",
                        }}
                      >
                        카테고리 로고
                      </div>
                    )}
                  </div>

                  {/* 썸네일 */}
                  <div
                    style={{
                      aspectRatio: "240 / 140",
                      position: "relative",
                      flexShrink: 0,
                      width: "100%",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.(card.thumbKey);
                    }}
                    onClick={() => {
                      if (!onElementSelect && thumbRaw && !isInlinePlayableThumb(thumbRaw)) {
                        window.open(thumbRaw, "_blank", "noopener,noreferrer");
                      } 
                    }}
                  >
                    {renderLayout4ThumbMedia(thumbRaw, thumbStyle)}
                  </div>

                  {/* 영상 제목 */}
                  {!isCultureLetterTextHidden(titleStyleKey) && (
                    <SafeHtml
                      html={toHtmlWithBreaks(titleText)}
                      className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                      style={getCultureLetterTextStyle(titleStyleKey, {
                        width: "100%",
                        whiteSpace: "pre-wrap",
                      })}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.titleKey);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    /* ── 모바일 레이아웃 (피그마 node-id: 3298:58894 구조 적용) ── */
    if (isMobileViewport) {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundColor: style.backgroundColor || "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
          })}
        >
          {/* 상단 타이틀 섹션 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              width: "100%",
            }}
          >
            {!isCultureLetterTextHidden("layout4SubLabelStyle") && (
              <SafeHtml
                html={data.layout4SubLabel ?? CULTURE_LETTER_DEFAULTS.layout4SubLabel}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout4SubLabelStyle"),
                  fontWeight: "400",
                  letterSpacing: "-0.4px",
                  lineHeight: "1.5",
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                  width: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout4SubLabel");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout4MainTitleStyle") && (
              <SafeHtml
                html={data.layout4MainTitle ?? CULTURE_LETTER_DEFAULTS.layout4MainTitle}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout4MainTitleStyle"),
                  fontWeight: "700",
                  letterSpacing: "-0.56px",
                  lineHeight: "1.4",
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                  width: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout4MainTitle");
                }}
              />
            )}
          </div>

          {/* 카드 3개 — 모바일에서 세로 스택 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
            }}
          >
            {cards.map((card, idx) => {
              const logoImg =(data[card.logoKey] ?? CULTURE_LETTER_DEFAULTS[card.logoKey]) || "";
              const thumbRaw =(data[card.thumbKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbKey]) || "";
              const thumbStyle = getElementStyle(
                data[card.thumbStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbStyleKey],
                viewport,
              );
              const titleText = data[card.titleKey] ?? CULTURE_LETTER_DEFAULTS[card.titleKey];
              const titleStyleKey = `${card.titleKey}Style`;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "flex-start",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* 카테고리 로고 */}
                  <div
                    style={{
                      height: "24px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      width: logoImg ? "auto" : "100px",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.(card.logoKey);
                    }}
                  >
                    {logoImg ? (
                      <UniversalMedia
                        alt="category-logo"
                        className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                        url={logoImg}
                        style={{
                          ...getElementStyle(
                            data[card.logoStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.logoStyleKey],
                            viewport,
                          ),
                          height: "24px",
                          width: "auto",
                          display: "block",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(card.logoKey);
                        }}
                      />
                    ) : (
                      <div
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                        style={{
                          height: "24px",
                          width: "100px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: "#9ca3af",
                          cursor: "pointer",
                        }}
                      >
                        카테고리 로고
                      </div>
                    )}
                  </div>

                  {/* 썸네일 */}
                  <div
                    style={{
                      aspectRatio: "240 / 140",
                      position: "relative",
                      flexShrink: 0,
                      width: "100%",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.(card.thumbKey);
                    }}
                    onClick={() => {
                      if (!onElementSelect && thumbRaw && !isInlinePlayableThumb(thumbRaw)) {
                        window.open(thumbRaw, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    {renderLayout4ThumbMedia(thumbRaw, thumbStyle)}
                  </div>

                  {/* 영상 제목 */}
                  {!isCultureLetterTextHidden(titleStyleKey) && (
                    <SafeHtml
                      html={toHtmlWithBreaks(titleText)}
                      className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                      style={{
                        ...getCultureLetterTextStyle(titleStyleKey, {
                          width: "100%",
                          whiteSpace: "pre-wrap",
                        }),
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.titleKey);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    /* ── PC 레이아웃 (기존 유지) ── */
    return (
      <div
        className={`content-stretch flex flex-col items-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={getCultureLetterSectionStyle({
          backgroundColor: style.backgroundColor || "#ffffff",
          gap: "40px",
          paddingTop: "60px",
          paddingBottom: "60px",
        })}
      >
        {/* 상단 타이틀 섹션 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: "1.5",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {!isCultureLetterTextHidden("layout4SubLabelStyle") && (
            <SafeHtml
              html={
                data.layout4SubLabel ?? CULTURE_LETTER_DEFAULTS.layout4SubLabel
              }
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout4SubLabelStyle", {
                whiteSpace: "nowrap",
              })}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout4SubLabel");
              }}
            />
          )}
          {!isCultureLetterTextHidden("layout4MainTitleStyle") && (
            <SafeHtml
              html={
                data.layout4MainTitle ?? CULTURE_LETTER_DEFAULTS.layout4MainTitle
              }
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout4MainTitleStyle", {
                whiteSpace: "nowrap",
              })}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout4MainTitle");
              }}
            />
          )}
        </div>

        {/* 미디어 카드 3개 */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            position: "relative",
            flexShrink: 0,
            width: "100%",
          }}
        >
          {cards.map((card, idx) => {
            const logoImg =(data[card.logoKey] ?? CULTURE_LETTER_DEFAULTS[card.logoKey]) || "";
            const thumbRaw =(data[card.thumbKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbKey]) || "";
            const thumbStyle = getElementStyle(
              data[card.thumbStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.thumbStyleKey],
              viewport,
            );
            const titleText =
              data[card.titleKey] ?? CULTURE_LETTER_DEFAULTS[card.titleKey];
            const titleStyleKey = `${card.titleKey}Style`;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flex: "1 0 0",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "flex-start",
                  minHeight: "1px",
                  minWidth: "1px",
                  position: "relative",
                }}
              >
                {/* 카테고리 로고 (h-24px) */}
                <div
                  style={{
                    height: "24px",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    cursor: "pointer",
                    width: logoImg ? "auto" : "100px",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.logoKey);
                  }}
                >
                  {logoImg ? (
                    <UniversalMedia
                      alt="category-logo"
                      className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                      url={logoImg}
                      style={{
                        ...getElementStyle(
                          data[card.logoStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.logoStyleKey],
                          viewport,
                        ),
                        height: "24px",
                        width: "auto",
                        display: "block",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.logoKey);
                      }}
                    />
                  ) : (
                    <div
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                      style={{
                        height: "24px",
                        width: "100px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: "#9ca3af",
                        cursor: "pointer",
                      }}
                    >
                      카테고리 로고
                    </div>
                  )}
                </div>

                {/* 썸네일 이미지 (aspect 240/140) */}
                <div
                  style={{
                    aspectRatio: "240 / 140",
                    position: "relative",
                    flexShrink: 0,
                    width: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.thumbKey);
                  }}
                  onClick={() => {
                    if (!onElementSelect && thumbRaw && !isInlinePlayableThumb(thumbRaw)) {
                      window.open(thumbRaw, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {renderLayout4ThumbMedia(thumbRaw, thumbStyle)}
                </div>

                {/* 영상 제목 */}
                {!isCultureLetterTextHidden(titleStyleKey) && (
                  <SafeHtml
                    html={toHtmlWithBreaks(titleText)}
                    className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                    style={getCultureLetterTextStyle(titleStyleKey, {
                      width: "100%",
                      whiteSpace: "pre-wrap",
                    })}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.(card.titleKey);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─────────────── Layout 3 : 컬처레터 헤더 - 우측배너 ─────────────── */
  if (layout === "3") {
    const { url: bgImage, style: bgImageStyle } = getResponsiveMedia(
      data.cl3BgUrl,
      data.cl3MobileBgUrl,
      data.cl3BgUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3BgUrlStyle,
      data.cl3MobileBgUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3MobileBgUrlStyle,
    );
    const logoImage = data.cl3LogoUrl ?? CULTURE_LETTER_DEFAULTS.cl3LogoUrl;
    const cardImg = data.cl3CardImgUrl ?? CULTURE_LETTER_DEFAULTS.cl3CardImgUrl;
    const cardImgStyle = getElementStyle(
      data.cl3CardImgUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3CardImgUrlStyle,
      viewport,
    );

    const layout3DefaultBg =
      style.backgroundColor || bgImage
        ? undefined
        : CULTURE_LETTER_LAYOUT3_DEFAULT_BACKGROUND;

    /* ── 태블릿 레이아웃 (피그마 node-id: 3298:29833) ── */
    if (viewport === "tablet") {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            background: layout3DefaultBg,
            backgroundColor: layout3DefaultBg
              ? undefined
              : style.backgroundColor,
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "40px",
            paddingRight: "40px",
            alignItems: "flex-start",
          })}
          onDoubleClick={() => {
            onElementSelect?.("cl3BgUrl");
          }}
        >
          {/* 배경 이미지 */}
          {bgImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
                style={{
                  ...bgImageStyle,
                  objectPosition: bgImageStyle.objectPosition || "center",
                }}
                src={bgImage}
              />
            </div>
          )}

          {/* tit 태블릿 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {!isCultureLetterTextHidden("layout3IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout3IssueNo ?? CULTURE_LETTER_DEFAULTS.layout3IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3IssueNoStyle"),
                    fontSize: "24px",
                    fontWeight: "400",
                    letterSpacing: "-0.48px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout3IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout3IssueDate ?? CULTURE_LETTER_DEFAULTS.layout3IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3IssueDateStyle"),
                    fontSize: "24px",
                    fontWeight: "700",
                    letterSpacing: "-0.48px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3IssueDate");
                  }}
                />
              )}
            </div>

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("cl3LogoUrl");
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
                    ...getElementStyle(data.cl3LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl3LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl3LogoUrl");
                    } else if (data.cl3LogoUrlLink) {
                      window.open(data.cl3LogoUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout3CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout3CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout3CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3CultureLetterStyle"),
                    fontSize: "28px",
                    fontWeight: "400",
                    letterSpacing: "-0.56px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout3CultureLetter");
                    } else if (data.layout3CultureLetterLink) {
                      window.open(data.layout3CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 텍스트 블록 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "flex-start",
              lineHeight: "1.5",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {!isCultureLetterTextHidden("layout3TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout3Title ?? CULTURE_LETTER_DEFAULTS.layout3Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout3TitleStyle"),
                  fontSize: "48px",
                  fontWeight: "700",
                  letterSpacing: "-0.96px",
                  lineHeight: "1.5",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout3DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout3Desc ?? CULTURE_LETTER_DEFAULTS.layout3Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout3DescStyle"),
                  fontSize: "24px",
                  fontWeight: "500",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.5",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Desc");
                }}
              />
            )}
          </div>

          {/* 카드 이미지 — 가로 full, aspect 620:360, radius 20px */}
          {!isCultureLetterTextHidden("cl3CardImgUrlStyle") && (
            <div
              style={{
                aspectRatio: "620 / 360",
                width: "100%",
                position: "relative",
                borderRadius: "20px",
                boxShadow: "8px 8px 20px 0px rgba(0,0,0,0.12)",
                flexShrink: 0,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("cl3CardImgUrl");
              }}
            >
              {cardImg ? (
                <img
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    ...cardImgStyle,
                    objectPosition: cardImgStyle.objectPosition || "center",
                    borderRadius: "20px",
                    pointerEvents: "none",
                  }}
                  src={cardImg}
                />
              ) : (
                <div
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "14px",
                  }}
                >
                  이미지를 등록해 주세요
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    /* ── 모바일 레이아웃 (피그마 node-id: 3298:58894, 375px) ── */
    if (isMobileViewport) {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            background: layout3DefaultBg,
            backgroundColor: layout3DefaultBg
              ? undefined
              : style.backgroundColor,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
            alignItems: "flex-start",
            justifyContent: "center",
          })}
          onDoubleClick={() => {
            onElementSelect?.("cl3MobileBgUrl");
          }}
        >
          {/* 배경 이미지 */}
          {bgImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
                style={{
                  ...bgImageStyle,
                  objectPosition: bgImageStyle.objectPosition || "center",
                }}
                src={bgImage}
              />
            </div>
          )}

          {/* tit 모바일 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {!isCultureLetterTextHidden("layout3IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout3IssueNo ?? CULTURE_LETTER_DEFAULTS.layout3IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3IssueNoStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout3IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout3IssueDate ?? CULTURE_LETTER_DEFAULTS.layout3IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3IssueDateStyle"),
                    fontWeight: "700",
                    letterSpacing: "-0.4px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3IssueDate");
                  }}
                />
              )}
            </div>

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("cl3LogoUrl");
                }}
              >
                <UniversalMedia
                  alt="logo"
                  className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  url={logoImage}
                  style={{
                    height: "24px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                    ...getElementStyle(data.cl3LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl3LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl3LogoUrl");
                    } else if (data.cl3LogoUrlLink) {
                      window.open(data.cl3LogoUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout3CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout3CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout3CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout3CultureLetterStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout3CultureLetter");
                    } else if (data.layout3CultureLetterLink) {
                      window.open(data.layout3CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 본문 — 텍스트 + 카드 이미지 (세로 배열) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "flex-start",
              position: "relative",
              width: "100%",
            }}
          >
            {/* 텍스트 블록 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "flex-start",
                lineHeight: "1.5",
                width: "100%",
              }}
            >
              {!isCultureLetterTextHidden("layout3TitleStyle") && (
                <SafeHtml
                  html={toHtmlWithBreaks(
                    data.layout3Title ?? CULTURE_LETTER_DEFAULTS.layout3Title,
                  )}
                  className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                  style={{
                    ...getCultureLetterTextStyle("layout3TitleStyle"),
                    fontWeight: "700",
                    letterSpacing: "-0.56px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Title");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout3DescStyle") && (
                <SafeHtml
                  html={toHtmlWithBreaks(
                    data.layout3Desc ?? CULTURE_LETTER_DEFAULTS.layout3Desc,
                  )}
                  className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                  style={{
                    ...getCultureLetterTextStyle("layout3DescStyle"),
                    fontWeight: "500",
                    letterSpacing: "-0.36px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Desc");
                  }}
                />
              )}
            </div>

            {/* 카드 이미지 — 가로 full, aspect 620:360, radius 8px */}
            {!isCultureLetterTextHidden("cl3CardImgUrlStyle") && (
              <div
                style={{
                  aspectRatio: "620 / 360",
                  width: "100%",
                  position: "relative",
                  borderRadius: "8px",
                  boxShadow: "8px 8px 20px 0px rgba(0,0,0,0.12)",
                  flexShrink: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("cl3CardImgUrl");
                }}
              >
                {cardImg ? (
                  <img
                    alt=""
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      ...cardImgStyle,
                      objectPosition: cardImgStyle.objectPosition || "center",
                      borderRadius: "8px",
                      pointerEvents: "none",
                    }}
                    src={cardImg}
                  />
                ) : (
                  <div
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "14px",
                    }}
                  >
                    이미지를 등록해 주세요
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    /* ── PC 레이아웃 (기존 유지) ── */
    return (
      <div
        className={`content-stretch flex flex-col items-start justify-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={getCultureLetterSectionStyle({
          backgroundImage: undefined,
          backgroundColor: style.backgroundColor,
          background:
            style.backgroundColor || bgImage
              ? undefined
              : CULTURE_LETTER_LAYOUT3_DEFAULT_BACKGROUND,
          gap: "40px",
          paddingTop: "40px",
          paddingBottom: "120px",
        })}
        onDoubleClick={() => {
          onElementSelect?.(isMobileViewport ? "cl3MobileBgUrl" : "cl3BgUrl");
        }}
      >
        {bgImage && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
              style={{
                ...bgImageStyle,
                objectPosition: bgImageStyle.objectPosition || "center",
              }}
              src={bgImage}
            />
          </div>
        )}
        {/* tit — 로고(좌) | Culture Letter(정중앙) | No.+날짜(우) */}
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
          {/* 로고 — 좌측, h-40px 단일 이미지 */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("cl3LogoUrl");
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
                    ...getElementStyle(data.cl3LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl3LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl3LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl3LogoUrl");
                    } else if (data.cl3LogoUrlLink) {
                      window.open(data.cl3LogoUrlLink, "_self");
                    }
                  }}
            />
          </div>

          {/* Culture Letter — 그리드 정중앙 */}
          {!isCultureLetterTextHidden("layout3CultureLetterStyle") && (
            <SafeHtml
              html={
                data.layout3CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout3CultureLetter
              }
              className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
              style={getCultureLetterTextStyle("layout3CultureLetterStyle", {
                justifySelf: "center",
              })}
              onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout3CultureLetter");
                    } else if (data.layout3CultureLetterLink) {
                      window.open(data.layout3CultureLetterLink, "_self");
                    }
                  }}
            />
          )}

          {/* No.15 + 날짜 — 우측, 가로 flex gap-16px */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {!isCultureLetterTextHidden("layout3IssueNoStyle") && (
              <SafeHtml
                html={
                  data.layout3IssueNo ?? CULTURE_LETTER_DEFAULTS.layout3IssueNo
                }
                className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
                style={getCultureLetterTextStyle("layout3IssueNoStyle")}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3IssueNo");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout3IssueDateStyle") && (
              <SafeHtml
                html={
                  data.layout3IssueDate ?? CULTURE_LETTER_DEFAULTS.layout3IssueDate
                }
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={getCultureLetterTextStyle("layout3IssueDateStyle")}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3IssueDate");
                }}
              />
            )}
          </div>
        </div>

        {/* 본문 — 좌측 텍스트 + 우측 이미지 카드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
          }}
        >
          {/* 좌측 텍스트 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "flex-start",
              lineHeight: "1.5",
            }}
          >
            {!isCultureLetterTextHidden("layout3TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout3Title ?? CULTURE_LETTER_DEFAULTS.layout3Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={getCultureLetterTextStyle("layout3TitleStyle", {
                  whiteSpace: "nowrap",
                })}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout3DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout3Desc ?? CULTURE_LETTER_DEFAULTS.layout3Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={getCultureLetterTextStyle("layout3DescStyle", {
                  whiteSpace: "nowrap",
                })}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Desc");
                }}
              />
            )}
          </div>

          {/* 우측 이미지 카드 — w-620px h-360px, radius-20px, shadow */}
          {!isCultureLetterTextHidden("cl3CardImgUrlStyle") && (
            <div
              style={{
                height: "360px",
                width: "620px",
                position: "relative",
                borderRadius: "20px",
                boxShadow: "8px 8px 20px 0px rgba(0,0,0,0.12)",
                flexShrink: 0,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("cl3CardImgUrl");
              }}
              onClick={(e) => {
                if (!onElementSelect) {
                  // 레이아웃 3 카드 클릭 시 미리보기 동작
                  console.log("Layout 3 Card Clicked");
                }
              }}
            >
              {cardImg ? (
                <img
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    ...cardImgStyle,
                    objectPosition: cardImgStyle.objectPosition || "center",
                    borderRadius: "20px",
                    pointerEvents: "none",
                  }}
                  src={cardImg}
                />
              ) : (
                <div
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "14px",
                  }}
                >
                  이미지를 등록해 주세요
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────── Layout 2 : 컬처레터 헤더 - 중앙정렬 ─────────────── */
  if (layout === "2") {
    const { url: bgImage, style: bgImageStyle } = getResponsiveMedia(
      data.cl2BgUrl,
      data.cl2MobileBgUrl,
      data.cl2BgUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl2BgUrlStyle,
      data.cl2MobileBgUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl2MobileBgUrlStyle,
    );
    const logoImage = data.cl2LogoUrl ?? CULTURE_LETTER_DEFAULTS.cl2LogoUrl;

    /* ── 태블릿 레이아웃 (피그마 node-id: 3298:29824, 768px) ── */
    if (viewport === "tablet") {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            backgroundColor: style.backgroundColor || "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            paddingTop: "40px",
            paddingBottom: "60px",
            paddingLeft: "40px",
            paddingRight: "40px",
            alignItems: "center",
            justifyContent: "center",
          })}
          onDoubleClick={() => {
            onElementSelect?.("cl2BgUrl");
          }}
        >
          {/* 배경 통이미지 레이어 */}
          {bgImage && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
                style={{
                  ...bgImageStyle,
                  objectPosition: bgImageStyle.objectPosition || "center",
                }}
                src={bgImage}
              />
            </div>
          )}

          {/* tit 태블릿 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 — 가로 중앙 정렬 */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {!isCultureLetterTextHidden("layout2IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout2IssueNo ?? CULTURE_LETTER_DEFAULTS.layout2IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2IssueNoStyle"),
                    fontSize: "24px",
                    fontWeight: "400",
                    letterSpacing: "-0.48px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout2IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout2IssueDate ?? CULTURE_LETTER_DEFAULTS.layout2IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2IssueDateStyle"),
                    fontSize: "24px",
                    fontWeight: "700",
                    letterSpacing: "-0.48px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2IssueDate");
                  }}
                />
              )}
            </div>

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("cl2LogoUrl");
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
                    ...getElementStyle(data.cl2LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl2LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl2LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl2LogoUrl");
                    } else if (data.cl2LogoUrlLink) {
                      window.open(data.cl2LogoUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout2CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout2CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout2CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2CultureLetterStyle"),
                    fontSize: "40px",
                    fontWeight: "400",
                    letterSpacing: "-0.8px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout2CultureLetter");
                    } else if (data.layout2CultureLetterLink) {
                      window.open(data.layout2CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 본문 — 타이틀 + 설명 (중앙 정렬) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              textAlign: "center",
            }}
          >
            {!isCultureLetterTextHidden("layout2TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout2Title ?? CULTURE_LETTER_DEFAULTS.layout2Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout2TitleStyle"),
                  fontSize: "48px",
                  fontWeight: "700",
                  letterSpacing: "-0.96px",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout2DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout2Desc ?? CULTURE_LETTER_DEFAULTS.layout2Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout2DescStyle"),
                  fontSize: "24px",
                  fontWeight: "500",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2Desc");
                }}
              />
            )}
          </div>
        </div>
      );
    }

    /* ── 모바일 레이아웃 (피그마 node-id: 3298:58888, 375px) ── */
    if (isMobileViewport) {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            backgroundImage: undefined,
            backgroundColor: style.backgroundColor || "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            paddingTop: "24px",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
          })}
          onDoubleClick={() => {
            onElementSelect?.("cl2MobileBgUrl");
          }}
        >
          {/* 배경 통이미지 레이어 */}
          {bgImage && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
                style={{
                  ...bgImageStyle,
                  objectPosition: bgImageStyle.objectPosition || "center",
                }}
                src={bgImage}
              />
            </div>
          )}

          {/* tit 모바일 — flex-col 2행 구조 */}
          <div
            style={{
              borderBottom: "1px solid #b1b8be",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Row 1 : No. + 날짜 — 가로 중앙 정렬 */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {!isCultureLetterTextHidden("layout2IssueNoStyle") && (
                <SafeHtml
                  html={
                    data.layout2IssueNo ?? CULTURE_LETTER_DEFAULTS.layout2IssueNo
                  }
                  className="not-italic relative shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2IssueNoStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2IssueNo");
                  }}
                />
              )}
              {!isCultureLetterTextHidden("layout2IssueDateStyle") && (
                <SafeHtml
                  html={
                    data.layout2IssueDate ?? CULTURE_LETTER_DEFAULTS.layout2IssueDate
                  }
                  className="cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2IssueDateStyle"),
                    fontWeight: "700",
                    letterSpacing: "-0.4px",
                    lineHeight: "1.5",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2IssueDate");
                  }}
                />
              )}
            </div>

            {/* Row 2 : 로고(좌) | Culture Letter(우) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("cl2LogoUrl");
                }}
              >
                <UniversalMedia
                  alt="logo"
                  className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  url={logoImage}
                  style={{
                    height: "24px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                    ...getElementStyle(data.cl2LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl2LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl2LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl2LogoUrl");
                    } else if (data.cl2LogoUrlLink) {
                      window.open(data.cl2LogoUrlLink, "_self");
                    }
                  }}
                />
              </div>
              {!isCultureLetterTextHidden("layout2CultureLetterStyle") && (
                <SafeHtml
                  html={
                    data.layout2CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout2CultureLetter
                  }
                  className="not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  style={{
                    ...getCultureLetterTextStyle("layout2CultureLetterStyle"),
                    fontWeight: "400",
                    letterSpacing: "-0.4px",
                    lineHeight: "1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout2CultureLetter");
                    } else if (data.layout2CultureLetterLink) {
                      window.open(data.layout2CultureLetterLink, "_self");
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* 본문 — 타이틀 + 설명 (중앙 정렬) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              textAlign: "center",
            }}
          >
            {!isCultureLetterTextHidden("layout2TitleStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout2Title ?? CULTURE_LETTER_DEFAULTS.layout2Title,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout2TitleStyle"),
                  fontWeight: "700",
                  letterSpacing: "-0.56px",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2Title");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout2DescStyle") && (
              <SafeHtml
                html={toHtmlWithBreaks(
                  data.layout2Desc ?? CULTURE_LETTER_DEFAULTS.layout2Desc,
                )}
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={{
                  ...getCultureLetterTextStyle("layout2DescStyle"),
                  fontWeight: "500",
                  letterSpacing: "-0.36px",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2Desc");
                }}
              />
            )}
          </div>
        </div>
      );
    }

    /* ── PC 레이아웃 (기존 유지) ── */
    return (
      <div
        className={`content-stretch flex flex-col items-center justify-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={getCultureLetterSectionStyle({
          backgroundImage: undefined,
          backgroundColor: style.backgroundColor || "#ffffff",
          gap: "80px",
          paddingTop: "40px",
          paddingBottom: "120px",
        })}
        onDoubleClick={() => {
          onElementSelect?.(isMobileViewport ? "cl2MobileBgUrl" : "cl2BgUrl");
        }}
      >
        {/* 배경 통이미지 레이어 (h-492px 고정) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "492px",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {bgImage && (
            <img
              alt=""
              className="absolute inset-0 max-w-none pointer-events-none w-full h-full"
              style={{
                ...bgImageStyle,
                objectPosition: bgImageStyle.objectPosition || "center",
              }}
              src={bgImage}
            />
          )}
        </div>

        {/* tit — 로고(좌) | Culture Letter(정중앙) | No. + 날짜(우) */}
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
          {/* 로고 — 좌측, h-40px 단일 이미지 */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("cl2LogoUrl");
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
                    ...getElementStyle(data.cl2LogoUrlStyle ?? CULTURE_LETTER_DEFAULTS.cl2LogoUrlStyle, viewport)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("cl2LogoUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("cl2LogoUrl");
                    } else if (data.cl2LogoUrlLink) {
                      window.open(data.cl2LogoUrlLink, "_self");
                    }
                  }}
            />
          </div>

          {/* Culture Letter — 그리드 정중앙 */}
          {!isCultureLetterTextHidden("layout2CultureLetterStyle") && (
            <SafeHtml
              html={
                data.layout2CultureLetter ?? CULTURE_LETTER_DEFAULTS.layout2CultureLetter
              }
              className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
              style={getCultureLetterTextStyle("layout2CultureLetterStyle", {
                justifySelf: "center",
              })}
              onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2CultureLetter");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onElementSelect) {
                      onElementSelect("layout2CultureLetter");
                    } else if (data.layout2CultureLetterLink) {
                      window.open(data.layout2CultureLetterLink, "_self");
                    }
                  }}
            />
          )}

          {/* No.15 + 날짜 — 우측, 가로 flex gap-16px */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {!isCultureLetterTextHidden("layout2IssueNoStyle") && (
              <SafeHtml
                html={
                  data.layout2IssueNo ?? CULTURE_LETTER_DEFAULTS.layout2IssueNo
                }
                className={`not-italic shrink-0 whitespace-nowrap cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all flex items-center`}
                style={getCultureLetterTextStyle("layout2IssueNoStyle")}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2IssueNo");
                }}
              />
            )}
            {!isCultureLetterTextHidden("layout2IssueDateStyle") && (
              <SafeHtml
                html={
                  data.layout2IssueDate ?? CULTURE_LETTER_DEFAULTS.layout2IssueDate
                }
                className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                style={getCultureLetterTextStyle("layout2IssueDateStyle")}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2IssueDate");
                }}
              />
            )}
          </div>
        </div>

        {/* 본문 — 타이틀 + 설명 (중앙 정렬) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            textAlign: "center",
          }}
        >
          {!isCultureLetterTextHidden("layout2TitleStyle") && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout2Title ?? CULTURE_LETTER_DEFAULTS.layout2Title,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout2TitleStyle")}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout2Title");
              }}
            />
          )}
          {!isCultureLetterTextHidden("layout2DescStyle") && (
            <SafeHtml
              html={toHtmlWithBreaks(
                data.layout2Desc ?? CULTURE_LETTER_DEFAULTS.layout2Desc,
              )}
              className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
              style={getCultureLetterTextStyle("layout2DescStyle")}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout2Desc");
              }}
            />
          )}
        </div>
      </div>
    );
  }

  /* ─────────────── Layout 5 : 컬처레터 바로가기 버튼 ─────────────── */
  if (layout === "5") {
    const cards = [
      {
        svgKey: "cl5C1SvgUrl" as const,
        svgStyleKey: "cl5C1SvgUrlStyle" as const,
        cardBgImgKey: "cl5C1CardBgUrl" as const,
        cardBgImgStyleKey: "cl5C1CardBgUrlStyle" as const,
        titleKey: "layout5Card1Title" as const,
        titleStyleKey: "layout5Card1TitleStyle" as const,
        descKey: "layout5Card1Desc" as const,
        descStyleKey: "layout5Card1DescStyle" as const,
        linkKey: "layout5Card1Link" as const,
      },
      {
        svgKey: "cl5C2SvgUrl" as const,
        svgStyleKey: "cl5C2SvgUrlStyle" as const,
        cardBgImgKey: "cl5C2CardBgUrl" as const,
        cardBgImgStyleKey: "cl5C2CardBgUrlStyle" as const,
        titleKey: "layout5Card2Title" as const,
        titleStyleKey: "layout5Card2TitleStyle" as const,
        descKey: "layout5Card2Desc" as const,
        descStyleKey: "layout5Card2DescStyle" as const,
        linkKey: "layout5Card2Link" as const,
      },
      {
        svgKey: "cl5C3SvgUrl" as const,
        svgStyleKey: "cl5C3SvgUrlStyle" as const,
        cardBgImgKey: "cl5C3CardBgUrl" as const,
        cardBgImgStyleKey: "cl5C3CardBgUrlStyle" as const,
        titleKey: "layout5Card3Title" as const,
        titleStyleKey: "layout5Card3TitleStyle" as const,
        descKey: "layout5Card3Desc" as const,
        descStyleKey: "layout5Card3DescStyle" as const,
        linkKey: "layout5Card3Link" as const,
      },
    ];

    /* ── 공통 카드 렌더 헬퍼 (태블릿/모바일 재사용) ── */
    const renderCard5 = (
      card: (typeof cards)[number],
      idx: number,
      cardStyle: React.CSSProperties,
      wrapperStyle: React.CSSProperties,
    ) => {
      const svgImg =((data as any)[card.svgKey] ?? CULTURE_LETTER_DEFAULTS[card.svgKey]) || "";
      const cardBgImgR =((data as any)[card.cardBgImgKey] ?? CULTURE_LETTER_DEFAULTS[card.cardBgImgKey]) || "";
      const cardBgImgStyleRaw =
        (data as any)[card.cardBgImgStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.cardBgImgStyleKey];
      const cardBgImgStyleR = getElementStyle(cardBgImgStyleRaw, viewport);
      const svgImgStyle = getElementStyle(
        (data as any)[card.svgStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.svgStyleKey],
        viewport,
      );
      const isSvgHidden = svgImgStyle.display === "none";
      const linkHref = (data as any)[card.linkKey] || "";
      const cardBgColor =
        cardBgImgStyleR.backgroundColor || "rgba(255,255,255,0.8)";
      const cardBorderRadius =
        (cardStyle.borderRadius as string) || "24px";

      return (
        <a
          key={idx}
          href={linkHref || undefined}
          target={linkHref ? "_blank" : undefined}
          rel={linkHref ? "noopener noreferrer" : undefined}
          style={wrapperStyle}
          onClick={(e) => {
            if (onElementSelect) e.preventDefault();
          }}
        >
          <div
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              backgroundColor: cardBgColor,
              border: "1px solid #ddeffe",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              width: "100%",
              ...cardStyle,
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.(card.cardBgImgKey);
            }}
          >
            {/* 카드 배경 이미지 */}
            {cardBgImgR && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  borderRadius: cardBorderRadius,
                  pointerEvents: "none",
                }}
              >
                <img
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    ...cardBgImgStyleR,
                    objectPosition: cardBgImgStyleR.objectPosition || "center",
                  }}
                  src={cardBgImgR}
                />
              </div>
            )}

            {/* 아이콘 영역 80×80 */}
            <div
              style={{
                width: "80px",
                height: "80px",
                flexShrink: 0,
                position: "relative",
                cursor: "pointer",
                display: isSvgHidden ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.(card.svgKey);
              }}
            >
              {svgImg || (CULTURE_LETTER_DEFAULTS as any)[card.svgKey] ? (
                <img
                  alt="icon"
                  style={{
                    ...svgImgStyle,
                    width: "80px",
                    height: "80px",
                    display: svgImgStyle.display === "none" ? "none" : "block",
                    objectFit: "contain",
                  }}
                  src={svgImg || (CULTURE_LETTER_DEFAULTS as any)[card.svgKey]}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.svgKey);
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#6d7882",
                  }}
                >
                  아이콘
                </div>
              )}
            </div>

            {/* 텍스트 영역 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                flexShrink: 0,
                textAlign: "center",
                fontStyle: "normal",
                width: "100%",
              }}
            >
              {!isCultureLetterTextHidden(card.titleStyleKey) && (
                <SafeHtml
                  html={
                    (data as any)[card.titleKey] ?? CULTURE_LETTER_DEFAULTS[card.titleKey]
                  }
                  className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                  style={{
                    ...getCultureLetterTextStyle(card.titleStyleKey),
                    fontSize: "24px",
                    fontWeight: "700",
                    letterSpacing: "0px",
                    lineHeight: "1.5",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                    width: "100%",
                    color: "#131416",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.titleKey);
                  }}
                />
              )}
              {!isCultureLetterTextHidden(card.descStyleKey) && (
                <SafeHtml
                  html={
                    (data as any)[card.descKey] ?? CULTURE_LETTER_DEFAULTS[card.descKey]
                  }
                  className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                  style={{
                    ...getCultureLetterTextStyle(card.descStyleKey),
                    fontSize: "18px",
                    fontWeight: "400",
                    letterSpacing: "-0.36px",
                    lineHeight: "1.5",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                    width: "100%",
                    color: "#6d7882",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.descKey);
                  }}
                />
              )}
            </div>
          </div>
        </a>
      );
    };

    /* ── 태블릿 레이아웃 (피그마 node-id: 3298:29846) ── */
    if (viewport === "tablet") {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            background:
              style.backgroundImage || style.backgroundColor
                ? undefined
                : "linear-gradient(151.97deg, rgb(40, 93, 225) 2.89%, rgb(89, 161, 185) 48.56%, rgb(68, 160, 117) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "60px",
            paddingBottom: "60px",
            paddingLeft: "40px",
            paddingRight: "40px",
          })}
        >
          {/* 카드 3개 가로 배치 — 태블릿 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {cards.map((card, idx) =>
              renderCard5(
                card,
                idx,
                {
                  borderRadius: "24px",
                  paddingTop: "40px",
                  paddingBottom: "40px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  flex: "1 0 0",
                  minWidth: "1px",
                  minHeight: "1px",
                },
                {
                  flex: "1 0 0",
                  minWidth: "1px",
                  display: "flex",
                  alignSelf: "stretch",
                  textDecoration: "none",
                  overflow: "hidden",
                  borderRadius: "24px",
                },
              ),
            )}
          </div>
        </div>
      );
    }

    /* ── 모바일 레이아웃 (피그마 node-id: 3298:58909) ── */
    if (isMobileViewport) {
      return (
        <div
          className={`${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
          style={getCultureLetterSectionStyle({
            background:
              style.backgroundImage || style.backgroundColor
                ? undefined
                : "linear-gradient(113.90deg, rgb(40, 93, 225) 2.89%, rgb(89, 161, 185) 48.56%, rgb(68, 160, 117) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "60px",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
          })}
        >
          {/* 카드 3개 세로 스택 — 모바일 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {cards.map((card, idx) =>
              renderCard5(
                card,
                idx,
                {
                  borderRadius: "8px",
                  paddingTop: "24px",
                  paddingBottom: "24px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  width: "100%",
                },
                {
                  width: "100%",
                  display: "flex",
                  textDecoration: "none",
                  overflow: "hidden",
                  borderRadius: "8px",
                },
              ),
            )}
          </div>
        </div>
      );
    }

    /* ── PC 레이아웃 (기존 유지) ── */
    return (
      <div
        className={`content-stretch flex flex-col items-center ${getPaddingClass(viewport, "xl:px-[280px]")} ${getBorderRadiusClass(viewport, "")} relative w-full overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
        style={getCultureLetterSectionStyle({
          background:
            style.backgroundImage || style.backgroundColor
              ? undefined
              : "linear-gradient(169.07deg, rgb(40, 93, 225) 2.89%, rgb(89, 161, 185) 48.56%, rgb(68, 160, 117) 100%)",
          paddingTop: "60px",
          paddingBottom: "60px",
        })}
      >
        {/* 카드 3개 가로 배치 */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "stretch",
            position: "relative",
            flexShrink: 0,
            width: "100%",
          }}
        >
          {cards.map((card, idx) => {
            const svgImg =((data as any)[card.svgKey] ?? CULTURE_LETTER_DEFAULTS[card.svgKey]) || "";
            const cardBgImg =((data as any)[card.cardBgImgKey] ?? CULTURE_LETTER_DEFAULTS[card.cardBgImgKey]) || "";
            const cardBgImgStyleRaw =
              (data as any)[card.cardBgImgStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.cardBgImgStyleKey];
            const cardBgImgStyle = getElementStyle(cardBgImgStyleRaw, viewport);
            const svgImgStyle = getElementStyle(
              (data as any)[card.svgStyleKey] ?? CULTURE_LETTER_DEFAULTS[card.svgStyleKey],
              viewport,
            );
            const isSvgHidden = svgImgStyle.display === "none";
            const cardBgColor =
              cardBgImgStyle.backgroundColor || "rgba(255,255,255,0.8)";
            const cardBorderRadius = cardBgImgStyle.borderRadius || "24px";
            const linkHref = (data as any)[card.linkKey] || "";

            const cardInner = (
              <div
                style={{
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  backgroundColor: cardBgColor,
                  border: "1px solid #ddeffe",
                  borderRadius: cardBorderRadius,
                  flex: "1 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 12px",
                  position: "relative",
                  minHeight: "1px",
                  minWidth: "1px",
                  overflow: "hidden",
                  height: "100%",
                  width: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.(card.cardBgImgKey);
                }}
                onClick={(e) => {
                  if (!onElementSelect && linkHref) {
                    window.open(linkHref, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {/* 카드 배경 이미지 — borderRadius는 카드와 동일하게 */}
                {cardBgImg && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      overflow: "hidden",
                      borderRadius: cardBorderRadius,
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      alt=""
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        ...cardBgImgStyle,
                        objectPosition:
                          cardBgImgStyle.objectPosition || "center",
                      }}
                      src={cardBgImg}
                    />
                  </div>
                )}

                {/* 아이콘 이미지 영역 (80x80, 배경색/곡률 없음 — 사용자 SVG 포함) */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    flexShrink: 0,
                    position: "relative",
                    cursor: "pointer",
                    display: isSvgHidden ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(card.svgKey);
                  }}
                >
                  {svgImg || (CULTURE_LETTER_DEFAULTS as any)[card.svgKey] ? (
                    <img
                      alt="icon"
                      className={`block max-w-none ${getBorderRadiusClass(viewport, "")} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                      style={{
                        ...svgImgStyle,
                        width: "80px",
                        height: "80px",
                        display: svgImgStyle.display === "none" ? "none" : "block",
                        objectFit: "contain",
                      }}
                      src={
                        svgImg || (CULTURE_LETTER_DEFAULTS as any)[card.svgKey]
                      }
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.svgKey);
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "rgba(255,255,255,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#6d7882",
                      }}
                    >
                      아이콘
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    flexShrink: 0,
                    textAlign: "center",
                    fontStyle: "normal",
                  }}
                >
                  {!isCultureLetterTextHidden(card.titleStyleKey) && (
                    <SafeHtml
                      html={
                        (data as any)[card.titleKey] ?? CULTURE_LETTER_DEFAULTS[card.titleKey]
                      }
                      className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                      style={getCultureLetterTextStyle(card.titleStyleKey, {
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      })}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.titleKey);
                      }}
                    />
                  )}
                  {!isCultureLetterTextHidden(card.descStyleKey) && (
                    <SafeHtml
                      html={
                        (data as any)[card.descKey] ?? CULTURE_LETTER_DEFAULTS[card.descKey]
                      }
                      className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "")} transition-all`}
                      style={getCultureLetterTextStyle(card.descStyleKey, {
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      })}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(card.descKey);
                      }}
                    />
                  )}
                </div>
              </div>
            );

            return (
              <a
                key={idx}
                href={linkHref || undefined}
                target={linkHref ? "_blank" : undefined}
                rel={linkHref ? "noopener noreferrer" : undefined}
                style={{
                  flex: "1 0 0",
                  minWidth: "1px",
                  display: "flex",
                  alignSelf: "stretch",
                  textDecoration: "none",
                  cursor: linkHref ? "pointer" : "default",
                  overflow: "hidden",
                  borderRadius: cardBorderRadius,
                }}
                onClick={(e) => {
                  if (onElementSelect) e.preventDefault();
                }}
              >
                {cardInner}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─────────────── Layout fallback : 구현 대기 ─────────────── */
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
