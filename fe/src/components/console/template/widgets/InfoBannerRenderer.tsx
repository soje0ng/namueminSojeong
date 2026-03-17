import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
  getPaddingClass,
  getBorderRadiusClass,
  getBorderRadiusStyle,
  getVerticalPaddingClass,
} from "./WidgetUtils";

export const INFO_BANNER_DEFAULTS = {
  layout: "1",
  subTitle: "Program Name.",
  subTitleStyle: {
    fontSize: "18px",
    fontSizeMobile: "18px",
    fontWeight: "400",
    color: "#FFFFFF",
  },
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  desc: "이민 프로그램명 입력",
  descStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  contentTitle: "서브 타이틀 입력",
  contentTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#111827",
  },
  contentDesc: "설명 텍스트 입력 영역입니다.",
  contentDescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6b7280",
  },
  layout1BgImageUrl: "/images/placeholder/infobanner_layout1_bg_image.jpg",
  imageUrl: "/images/placeholder/infobanner_layout1_right_media.png",
  layout2ImageUrl: "/images/placeholder/infobanner_layout2_main_image.jpg",
  layout2SubTitle: "버지니아 해안 리조트 건설 프로젝트",
  layout2SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "700",
    color: "#295E92",
  },
  layout2Title: "타이틀명 입력",
  layout2TitleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  layout2Desc: "이민 프로그램명 입력",
  layout2DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#131416",
  },
  layout3ImageUrl: "/images/placeholder/infobanner_layout3_main_image.jpg",
  layout3IconImageUrl: "/images/placeholder/infobanner_layout3_icon_image.png",
  layout3SubTitle: "( 서브타이틀 )",
  layout3SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "700",
    color: "#285DE1",
  },
  layout3Title: "프로그램 특징",
  layout3TitleStyle: {
    fontSize: "28px",
    fontSizeMobile: "20px",
    fontWeight: "700",
    color: "#060606",
  },
  layout3Desc: "프로그램 특징 내용 입력<br/>2줄 입력",
  layout3DescStyle: {
    fontSize: "18px",
    fontSizeMobile: "18px",
    fontWeight: "400",
    color: "#6d7882",
  },
  layout3ContentTitle: "서브 타이틀 입력",
  layout3ContentTitleStyle: {
    fontSize: "40px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#131416",
  },
  layout3ContentDesc:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  layout3ContentDescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6d7882",
  },
  layout4ImageUrl: "/images/placeholder/infobanner_layout4_main_image.jpg",
  layout4TopImageUrl: "/images/placeholder/infobanner_layout4_top_icon.png",
  layout4Title:
    "이미 수많은 자산가들은<br/><span class='font-bold'>미국 영주권 취득</span>으로<br/><span class='font-bold'>수억 원을 절감</span>하며 미국에서<br/>자녀를 <span class='font-bold'>글로벌 리더</span>로 키우고 있습니다.",
  layout4TitleStyle: {
    fontSize: "30px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#1e2124",
  },
  layout4Desc:
    "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ...",
  layout4DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#1e2124",
  },
  layout5BgImageUrl: "/images/placeholder/infobanner_layout5_bg_image.jpg",
  layout5ImageUrl: "/images/placeholder/infobanner_layout5_main_image.jpg",
  layout5Card1ImageUrl:
    "/images/placeholder/infobanner_layout5_card1_image.jpg",
  layout5Card2ImageUrl:
    "/images/placeholder/infobanner_layout5_card2_image.jpg",
  layout5Card1Title: "영상명 입력",
  layout5Card1TitleStyle: {
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#060606",
  },
  layout5Card1Desc: "영상 소개 문구 적는 곳",
  layout5Card1DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6D7882",
  },
  layout5Card2Title: "영상명 입력",
  layout5Card2TitleStyle: {
    fontSize: "24px",
    fontSizeMobile: "20px",
    fontWeight: "500",
    color: "#060606",
  },
  layout5Card2Desc: "영상 소개 문구 적는 곳",
  layout5Card2DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6D7882",
  },
  layout5SubTitle: "( 서브타이틀 )",
  layout5SubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  layout5Title: "타이틀명 입력",
  layout5TitleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  layout5Desc: "이민 프로그램명 입력",
  layout5DescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  imageStyle: { objectFit: "cover" },
  items: [
    {
      id: "ib-item-1",
      iconUrl: "/images/placeholder/info_banner_layout1_feature_media.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#FFFFFF",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "18px",
        fontSizeMobile: "16px",
        fontWeight: "400",
        color: "#FFFFFF",
      },
    },
    {
      id: "ib-item-2",
      iconUrl: "/images/placeholder/info_banner_layout1_feature_media.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#FFFFFF",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "18px",
        fontSizeMobile: "16px",
        fontWeight: "400",
        color: "#FFFFFF",
      },
    },
    {
      id: "ib-item-3",
      iconUrl: "/images/placeholder/info_banner_layout1_feature_media.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#FFFFFF",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "18px",
        fontSizeMobile: "16px",
        fontWeight: "400",
        color: "#FFFFFF",
      },
    },
    {
      id: "ib-item-4",
      iconUrl: "/images/placeholder/info_banner_layout1_feature_media.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "20px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#FFFFFF",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "18px",
        fontSizeMobile: "16px",
        fontWeight: "400",
        color: "#FFFFFF",
      },
    },
  ],
};

export const InfoBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style, viewport as any);
  const data = w.data;
  const layout = data.layout || "1";
  const infoBannerImageHeight = formatUnit((data as any).imageHeight);
  const getMainImageStyle = (imageStyle: any) => {
    const resolvedStyle = getElementStyle(imageStyle, viewport);
    return infoBannerImageHeight && !resolvedStyle.height
      ? { ...resolvedStyle, height: infoBannerImageHeight }
      : resolvedStyle;
  };
  const getMainImageFrameStyle = (
    imageStyle: any,
    extra: React.CSSProperties = {},
  ) => ({
    ...extra,
    ...(imageStyle?.width ? { width: formatUnit(imageStyle.width) } : {}),
    ...(infoBannerImageHeight && !imageStyle?.height
      ? { height: infoBannerImageHeight }
      : {}),
  });
  const isMediaUrl = (value: any) =>
    typeof value === "string" &&
    /^(https?:\/\/|\/|\.{1,2}\/|data:|blob:)/i.test(value);

  if (layout === "1") {
    const isTablet = viewport === "tablet";
    const isMobile = viewport === "mobile";
    const isDesktop = viewport === "desktop";

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          {/* Outer section wrapper — py-60px tablet */}
          <div
            className="self-stretch flex flex-col justify-start items-center"
            style={{
              paddingTop: isTablet ? "60px" : isMobile ? "40px" : "56px",
              paddingBottom: isTablet ? "60px" : isMobile ? "40px" : "56px",
              gap: "40px",
            }}
          >
            {/* Banner Container — gradient bg, full-bleed */}
            <div
              className="self-stretch w-full flex hover:outline-dashed hover:outline-2 hover:outline-blue-300 transition-all cursor-pointer overflow-hidden z-0"
              style={{
                flexDirection: isDesktop ? "row" : "column",
                alignItems: "flex-start",
                justifyContent: isDesktop ? "space-between" : "flex-start",
                paddingTop: "80px",
                paddingBottom: "80px",
                paddingLeft: isTablet ? "40px" : isMobile ? "20px" : "280px",
                paddingRight: isTablet ? "40px" : isMobile ? "20px" : "280px",
                gap: "40px",
                backgroundImage: data.layout1BgImageUrl
                  ? `url(${data.layout1BgImageUrl})`
                  : "linear-gradient(128.14deg, #285DE1 2.89%, #59A1B9 48.56%, #44A075 100%)",
                backgroundSize: data.layout1BgImageUrl ? "cover" : undefined,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1BgImageUrl");
              }}
            >
              {/* Left Column: Text + Feature Row — gap-20px */}
              <div
                className="self-stretch flex flex-col justify-start items-start w-full"
                style={{
                  flex: isDesktop ? "1" : undefined,
                  gap: "20px",
                }}
              >
                {/* Header Text Group — gap-12px desktop/tablet, gap-0 mobile (피그마 스펙) */}
                <div
                  className={`self-stretch flex flex-col justify-center ${isMobile ? "items-start text-left gap-0" : "items-start gap-[12px]"}`}
                >
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.subTitle || "Program Name."}
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
                        fontFamily: "'Tenor Sans', sans-serif",
                        fontWeight: "400",
                        letterSpacing: "-0.36px",
                        lineHeight: "1",
                        color: "#FFFFFF",
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("subTitle");
                      }}
                    />
                  )}
                  {!data.titleStyle?.isHidden && (
                    <SafeHtml
                      html={data.title || "타이틀명 입력"}
                      className="break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text w-full"
                      style={{
                        ...getElementStyle(
                          data.titleStyle || INFO_BANNER_DEFAULTS.titleStyle,
                          viewport,
                        ),
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: "700",
                        letterSpacing: "-0.96px",
                        lineHeight: "1.5",
                        color: "#FFFFFF",
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    />
                  )}
                  {!data.descStyle?.isHidden && (
                    <SafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.descStyle, viewport),
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: "500",
                        letterSpacing: "-0.4px",
                        lineHeight: "1.5",
                        color: "#FFFFFF",
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>

                {/* Feature Cards Row — mobile: 2-col grid / desktop: flex-row */}
                <div
                  className="self-stretch w-full"
                  style={
                    isMobile
                      ? {
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          columnGap: "12px",
                          rowGap: "12px",
                          paddingLeft: "12px",
                          paddingRight: "12px",
                          backgroundColor: "rgba(19,20,22,0.2)",
                          borderRadius: "8px",
                        }
                      : {
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: isDesktop ? "wrap" : "nowrap",
                          gap: "12px",
                          paddingLeft: "24px",
                          paddingRight: "24px",
                          backgroundColor: "rgba(19,20,22,0.2)",
                          borderRadius: "16px",
                        }
                  }
                >
                  {(data.items || []).map((item: any, idx: number) => {
                    const itemSelectId = item.id || `__idx_${idx}`;
                    return (
                      <div
                        key={item.id || itemSelectId}
                        style={{
                          ...(isMobile
                            ? {}
                            : {
                                flex: isDesktop
                                  ? "0 0 calc(25% - 9px)"
                                  : "1 0 0",
                              }),
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          paddingTop: "24px",
                          paddingBottom: "24px",
                          minWidth: 0,
                        }}
                      >
                        {/* Icon — 48×48, rounded-12px, bg-#e6e8ea */}
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "#e6e8ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                        >
                          <UniversalMedia
                            url={
                              item.iconUrl ||
                              item.image ||
                              (isMediaUrl(item.icon) ? item.icon : "") ||
                              "/images/placeholder/info_banner_layout1_feature_media.png"
                            }
                            alt={item.title || "Icon"}
                            className="w-full h-full object-contain"
                            style={{
                              ...getElementStyle(item.iconStyle, viewport),
                              backgroundColor: "transparent",
                              borderRadius: 0,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", itemSelectId);
                            }}
                          />
                        </div>
                        {/* Item Text */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            width: "100%",
                            alignItems: "flex-start",
                            textAlign: "left",
                          }}
                        >
                          {!item.titleStyle?.isHidden && (
                            <SafeHtml
                              html={item.title || "프로그램 특징"}
                              className="hover:outline-dashed hover:outline-2 hover:outline-white rounded transition-all cursor-text break-keep w-full"
                              style={{
                                ...getElementStyle(item.titleStyle, viewport),
                                fontFamily: "'Pretendard', sans-serif",
                                fontWeight: "700",
                                letterSpacing: "-0.4px",
                                lineHeight: "1.5",
                                color: "#FFFFFF",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", itemSelectId);
                              }}
                            />
                          )}
                          {!item.descStyle?.isHidden && (
                            <SafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="hover:outline-dashed hover:outline-2 hover:outline-white rounded transition-all cursor-text break-keep w-full"
                              style={{
                                ...getElementStyle(item.descStyle, viewport),
                                fontFamily: "'Pretendard', sans-serif",
                                fontWeight: "400",
                                letterSpacing: "-0.32px",
                                lineHeight: "1.5",
                                color: "#FFFFFF",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemDesc", itemSelectId);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image Area — rounded-16px desktop, rounded-8px mobile/tablet, shadow */}
              <div
                className="cursor-pointer hover:ring-4 hover:ring-white transition-all z-10 flex justify-center items-center"
                style={{
                  width: isDesktop ? "560px" : "100%",
                  flexShrink: isDesktop ? 0 : undefined,
                  height:
                    infoBannerImageHeight ||
                    data.imageStyle?.height ||
                    (isDesktop ? "auto" : undefined),
                  borderRadius: isMobile ? "8px" : "16px",
                  boxShadow: "24px 12px 16px 0px rgba(0,0,0,0.20)",
                  overflow: "hidden",
                  position: "relative",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
              >
                <UniversalMedia
                  url={data.imageUrl}
                  className="w-full h-full object-cover"
                  alt="banner image"
                  style={getMainImageStyle(data.imageStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    const isTablet2 = viewport === "tablet";
    const isMobile2 = viewport === "mobile";
    const isDesktop2 = viewport === "desktop";
    const l2ImageStyle = data.layout2ImageUrlStyle || data.imageStyle;
    const l2SubTitleStyle = data.layout2SubTitleStyle || data.subTitleStyle;
    const l2TitleStyle = data.layout2TitleStyle || data.titleStyle;
    const l2DescStyle = data.layout2DescStyle || data.descStyle;

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          {/* Outer section wrapper — px-40px py-60px tablet */}
          <div
            className="self-stretch flex flex-col justify-start items-center"
            style={{
              paddingTop: isTablet2 ? "60px" : isMobile2 ? "40px" : "100px",
              paddingBottom: isTablet2 ? "60px" : isMobile2 ? "40px" : "100px",
              paddingLeft: isTablet2 ? "40px" : isMobile2 ? "0px" : "280px",
              paddingRight: isTablet2 ? "40px" : isMobile2 ? "0px" : "280px",
            }}
          >
            {/* Banner Card — bg-#f6f7fb, p-20px, rounded-20px(desktop/tablet) / no-radius(mobile) */}
            <div
              className="self-stretch w-full flex hover:outline-none"
              style={{
                flexDirection: isDesktop2 ? "row" : "column",
                alignItems: "flex-start",
                gap: isDesktop2 ? "56px" : isMobile2 ? "24px" : "40px",
                padding: "20px",
                backgroundColor: "#f6f7fb",
                borderRadius: isMobile2 ? "0px" : "20px",
              }}
            >
              {/* Image Area — h-260px, rounded-16px */}
              <div
                className="cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all overflow-hidden"
                style={{
                  width: isDesktop2 ? "600px" : "100%",
                  flexShrink: isDesktop2 ? 0 : undefined,
                  height:
                    infoBannerImageHeight ||
                    l2ImageStyle?.height ||
                    (isDesktop2 ? "480px" : undefined),
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2ImageUrl");
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2ImageUrl");
                }}
              >
                <UniversalMedia
                  url={
                    data.layout2ImageUrl ||
                    "/images/placeholder/infobanner_layout2_main_image.jpg"
                  }
                  alt="layout2-main-image"
                  className="w-full h-full object-cover"
                  style={getMainImageStyle(l2ImageStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                />
              </div>

              {/* Content Section — gap-24px */}
              <div
                className="self-stretch flex flex-col justify-start items-start w-full"
                style={{
                  flex: isDesktop2 ? "1" : undefined,
                  gap: "24px",
                  paddingTop: isDesktop2 ? "40px" : "0px",
                }}
              >
                {/* Text Group (subtit) — flex-col, no gap */}
                <div
                  className={`self-stretch flex flex-col justify-center ${isMobile2 ? "items-center text-center gap-0" : "items-start gap-0"}`}
                >
                  {!l2SubTitleStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout2SubTitle ||
                        data.subTitle ||
                        "버지니아 해안 리조트 건설 프로젝트"
                      }
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l2SubTitleStyle, viewport),
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: "700",
                        letterSpacing: isMobile2 ? "-0.36px" : "-0.4px",
                        lineHeight: "1",
                        color: "#295E92",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2SubTitle");
                      }}
                    />
                  )}
                  {!l2TitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.layout2Title || data.title || "타이틀명 입력"}
                      className="break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                      style={{
                        ...getElementStyle(l2TitleStyle, viewport),
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: "700",
                        letterSpacing: isMobile2 ? "-0.56px" : "-0.8px",
                        lineHeight: "1.5",
                        color: "#131416",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2Title");
                      }}
                    />
                  )}
                  {!l2DescStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout2Desc || data.desc || "이민 프로그램명 입력"
                      }
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l2DescStyle, viewport),
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: "500",
                        letterSpacing: isMobile2 ? "-0.36px" : "-0.4px",
                        lineHeight: "1.5",
                        color: "#131416",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2Desc");
                      }}
                    />
                  )}
                </div>

                {/* Feature Row — mobile: 2-col grid gap-8px / desktop: flex-row gap-12px */}
                <div
                  className="self-stretch w-full"
                  style={
                    isMobile2
                      ? {
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: "8px",
                        }
                      : {
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: isDesktop2 ? "wrap" : "nowrap",
                          gap: "12px",
                          alignItems: "center",
                          justifyContent: "center",
                        }
                  }
                >
                  {(data.items || []).map((item: any, idx: number) => {
                    const itemSelectId = item.id || `__idx_${idx}`;
                    return (
                      <div
                        key={item.id || itemSelectId}
                        style={{
                          ...(isMobile2
                            ? {}
                            : {
                                flex: isDesktop2
                                  ? "0 0 calc(25% - 9px)"
                                  : "1 0 0",
                              }),
                          display: "flex",
                          flexDirection: "column",
                          gap: isMobile2 ? "8px" : "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingLeft: isMobile2 ? "8px" : "24px",
                          paddingRight: isMobile2 ? "8px" : "24px",
                          paddingTop: isMobile2 ? "20px" : "24px",
                          paddingBottom: isMobile2 ? "20px" : "24px",
                          backgroundColor: "#FFFFFF",
                          borderRadius: isMobile2 ? "8px" : "16px",
                          minWidth: 0,
                        }}
                      >
                        {/* Icon — 100×100, rounded-50px, bg-#f6f7fb */}
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50px",
                            backgroundColor: "#f6f7fb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                        >
                          <UniversalMedia
                            url={
                              item.image ||
                              (item.iconUrl ===
                                "/images/placeholder/infobanner_item_icon_ka.png" ||
                              item.iconUrl ===
                                "/images/placeholder/info_banner_layout1_feature_media.png"
                                ? ""
                                : item.iconUrl) ||
                              "/images/placeholder/info_banner_layout1_feature_media2.png"
                            }
                            alt={`layout2-feature-icon-${idx + 1}`}
                            className="w-full h-full object-contain"
                            style={getElementStyle(item.iconStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", itemSelectId);
                            }}
                          />
                        </div>
                        {/* Item Text */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0px",
                            width: "100%",
                          }}
                        >
                          {!item.titleStyle?.isHidden && (
                            <SafeHtml
                              html={item.title || "프로그램 특징"}
                              className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                              style={{
                                ...getElementStyle(item.titleStyle, viewport),
                                fontFamily: "'Pretendard', sans-serif",
                                fontWeight: "700",
                                letterSpacing: "-0.4px",
                                lineHeight: "1.5",
                                color: "#295E92",
                                textAlign: "center",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", itemSelectId);
                              }}
                            />
                          )}
                          {!item.descStyle?.isHidden && (
                            <SafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                              style={{
                                ...getElementStyle(item.descStyle, viewport),
                                fontFamily: "'Pretendard', sans-serif",
                                fontWeight: "400",
                                letterSpacing: "-0.32px",
                                lineHeight: "1.5",
                                color: "#6d7882",
                                textAlign: "center",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemDesc", itemSelectId);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    const l3ImageStyle = data.layout3ImageUrlStyle || data.imageStyle;
    const l3SubTitleStyle = data.layout3SubTitleStyle || data.subTitleStyle;
    const l3TitleStyle = data.layout3TitleStyle || data.titleStyle;
    const l3DescStyle = data.layout3DescStyle || data.descStyle;
    const l3ContentTitleStyle =
      data.layout3ContentTitleStyle || data.contentTitleStyle;
    const l3ContentDescStyle =
      data.layout3ContentDescStyle || data.contentDescStyle;

    const isTablet3 = viewport === "tablet";
    const isMobile3 = viewport === "mobile";
    const isDesktop3 = viewport === "desktop";

    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          {/* Outer wrapper */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              paddingLeft: isTablet3 ? "40px" : isMobile3 ? "0px" : "280px",
              paddingRight: isTablet3 ? "40px" : isMobile3 ? "0px" : "280px",
              paddingTop: isTablet3 ? "60px" : isMobile3 ? "0px" : "100px",
              paddingBottom: isTablet3 ? "60px" : isMobile3 ? "60px" : "100px",
              gap: isTablet3 ? "40px" : isMobile3 ? "24px" : "40px",
            }}
          >
            {/* Top section: image + offset card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "100%",
                position: "relative",
                paddingBottom: isMobile3 ? "20px" : "80px",
              }}
            >
              {/* Full-bleed image area */}
              <div
                style={{
                  width: "100%",
                  height: isTablet3 ? "400px" : isMobile3 ? undefined : "480px",
                  overflow: "hidden",
                  cursor: "pointer",
                  marginBottom: isMobile3 ? "-20px" : "-80px",
                  borderRadius: isMobile3 ? "0px" : "16px",
                }}
                onClick={() => onElementSelect?.("layout3ImageUrl")}
              >
                <UniversalMedia
                  url={data.layout3ImageUrl || data.imageUrl}
                  alt="banner"
                  className="w-full h-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3ImageUrl");
                  }}
                />
              </div>

              {/* Offset card wrapper — overlaps image bottom */}
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingLeft: isMobile3 ? "8px" : "40px",
                  paddingRight: isMobile3 ? "8px" : "40px",
                }}
              >
                {/* Card */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: isDesktop3 ? "680px" : "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: isMobile3 ? "8px" : "16px",
                    boxShadow: "2px 2px 16px 0px rgba(0,0,0,0.08)",
                    padding: isMobile3 ? "16px" : "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Card header row */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    {/* Left: subTitle + title */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0px",
                        flex: 1,
                        minWidth: 0,
                        alignItems: isMobile3 ? "center" : "flex-start",
                        textAlign: isMobile3 ? "center" : "left",
                      }}
                    >
                      {!l3SubTitleStyle?.isHidden && (
                        <SafeHtml
                          html={
                            data.layout3SubTitle ||
                            data.subTitle ||
                            "( 서브타이틀 )"
                          }
                          className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                          style={{
                            ...getElementStyle(l3SubTitleStyle, viewport),
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 700,
                            letterSpacing: isMobile3 ? "-0.36px" : "-0.4px",
                            lineHeight: 1.5,
                            color: "#285DE1",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("layout3SubTitle");
                          }}
                        />
                      )}
                      {!l3TitleStyle?.isHidden && (
                        <SafeHtml
                          html={
                            data.layout3Title || data.title || "프로그램 특징"
                          }
                          className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                          style={{
                            ...getElementStyle(l3TitleStyle, viewport),
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 700,
                            letterSpacing: isMobile3 ? "-0.4px" : "-0.56px",
                            lineHeight: 1.5,
                            color: "#060606",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("layout3Title");
                          }}
                        />
                      )}
                    </div>

                    {/* Right: icon image */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "60px",
                        backgroundColor: "#f6f7fb",
                        overflow: "hidden",
                        flexShrink: 0,
                        cursor: "pointer",
                        marginLeft: "16px",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout3IconImageUrl");
                      }}
                    >
                      <UniversalMedia
                        url={
                          data.layout3IconImageUrl ||
                          "/images/placeholder/infobanner_layout3_icon_image.png"
                        }
                        alt="layout3-icon-image"
                        className="w-full h-full object-cover"
                        style={getElementStyle(
                          data.layout3IconImageUrlStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout3IconImageUrl");
                        }}
                      />
                    </div>
                  </div>

                  {/* Desc */}
                  {!l3DescStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout3Desc ||
                        data.desc ||
                        "프로그램 특징 내용 입력<br/>2줄 입력"
                      }
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l3DescStyle, viewport),
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 400,
                        letterSpacing: "-0.36px",
                        lineHeight: 1.5,
                        color: "#6d7882",
                        width: "100%",
                        textAlign: isMobile3 ? "center" : "left",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout3Desc");
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom txt01 section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile3 ? "center" : "flex-start",
                gap: isMobile3 ? "16px" : "24px",
                width: "100%",
                paddingLeft: isMobile3 ? "20px" : "0px",
                paddingRight: isMobile3 ? "20px" : "0px",
                textAlign: isMobile3 ? "center" : "left",
              }}
            >
              {!l3ContentTitleStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout3ContentTitle ||
                    data.contentTitle ||
                    "서브 타이틀 입력"
                  }
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(l3ContentTitleStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 500,
                    letterSpacing: isMobile3 ? "-0.4px" : "-0.8px",
                    lineHeight: 1.5,
                    color: "#131416",
                    width: "100%",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3ContentTitle");
                  }}
                />
              )}
              {/* Divider */}
              <div
                style={{
                  backgroundColor: "#e6e8ea",
                  height: isMobile3 ? "2px" : "4px",
                  width: isMobile3 ? "30px" : "60px",
                  borderRadius: "2px",
                }}
              />
              {!l3ContentDescStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout3ContentDesc ||
                    data.contentDesc ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(l3ContentDescStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 500,
                    letterSpacing: isMobile3 ? "-0.36px" : "-0.4px",
                    lineHeight: 1.5,
                    color: "#6d7882",
                    width: "100%",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3ContentDesc");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "4") {
    const l4TitleStyle = data.layout4TitleStyle || data.titleStyle;
    const l4DescStyle = data.layout4DescStyle || data.descStyle;
    const l4TopImageStyle = data.layout4TopImageUrlStyle;
    const l4ImageStyle = data.layout4ImageUrlStyle || data.imageStyle;

    const isTablet4 = viewport === "tablet";
    const isMobile4 = viewport === "mobile";
    const isDesktop4 = viewport === "desktop";

    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop4 ? "row" : "column",
              gap: isDesktop4 ? "56px" : isMobile4 ? "24px" : "40px",
              alignItems: "center",
              justifyContent: isDesktop4 ? "center" : undefined,
              width: "100%",
              paddingLeft: isTablet4 ? "40px" : isMobile4 ? "20px" : "280px",
              paddingRight: isTablet4 ? "40px" : isMobile4 ? "20px" : "280px",
              paddingTop: isTablet4 ? "60px" : isMobile4 ? "60px" : "56px",
              paddingBottom: isTablet4 ? "60px" : isMobile4 ? "60px" : "112px",
            }}
          >
            {/* Top icon + Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: isDesktop4 ? "flex-start" : "center",
                justifyContent: isDesktop4 ? "center" : undefined,
                flex: isDesktop4 ? "1 1 0" : undefined,
                width: isDesktop4 ? undefined : "100%",
              }}
            >
              {/* Quote icon */}
              <div
                style={{
                  width: isMobile4 ? "25px" : "50px",
                  height: isMobile4 ? "20px" : "40px",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout4TopImageUrl");
                }}
              >
                <UniversalMedia
                  url={
                    data.layout4TopImageUrl ||
                    "/images/placeholder/infobanner_layout4_top_icon.png"
                  }
                  alt="layout4-top-image"
                  className="w-full h-full object-cover"
                  style={getElementStyle(l4TopImageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4TopImageUrl");
                  }}
                />
              </div>

              {/* Title */}
              {!l4TitleStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout4Title ||
                    data.title ||
                    "이미 수많은 자산가들은<br/><span style='font-weight:700'>미국 영주권 취득</span>으로<br/><span style='font-weight:700'>수억 원을 절감</span>하며 미국에서<br/>자녀를 <span style='font-weight:700'>글로벌 리더</span>로 키우고 있습니다."
                  }
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(l4TitleStyle, viewport),
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 500,
                    letterSpacing: isMobile4 ? "-0.4px" : "-0.64px",
                    lineHeight: 1.5,
                    color: "#131416",
                    textAlign: isDesktop4 ? "left" : "center",
                    width: "100%",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4Title");
                  }}
                />
              )}
            </div>

            {/* Card + Image section */}
            {isMobile4 ? (
              /* Mobile: card above, image below — Figma 3298:58988 */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  isolation: "isolate",
                  width: "100%",
                }}
              >
                {/* Card — z:2, above image */}
                {!l4DescStyle?.isHidden && (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "24px",
                      boxShadow: "2px 2px 16px 0px rgba(0,0,0,0.08)",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      width: "100%",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <SafeHtml
                      html={
                        data.layout4Desc ||
                        data.desc ||
                        "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ..."
                      }
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                      style={{
                        ...getElementStyle(l4DescStyle, viewport),
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "-0.36px",
                        lineHeight: 1.5,
                        color: "#060606",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout4Desc");
                      }}
                    />
                  </div>
                )}
                {/* Image — z:1, below card */}
                <div
                  style={{
                    width: "100%",
                    borderTopRightRadius: "40px",
                    borderBottomLeftRadius: "40px",
                    borderTopLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                    boxShadow: "8px 8px 20px 0px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4ImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={
                      data.layout4ImageUrl ||
                      data.imageUrl ||
                      "/images/placeholder/infobanner_layout4_main_image.jpg"
                    }
                    alt="layout4-main-image"
                    className="w-full h-auto block"
                    style={getElementStyle(l4ImageStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout4ImageUrl");
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Tablet / Desktop: card overlaps image (card left z-2, image right z-1) */
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: isTablet4 ? "120px" : "0px",
                  position: "relative",
                  isolation: "isolate",
                  flexShrink: isDesktop4 ? 0 : undefined,
                  width: isTablet4 ? "100%" : undefined,
                }}
              >
                {/* Card — z:2, mr:-120px to overlap image */}
                {!l4DescStyle?.isHidden && (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "24px",
                      boxShadow: "2px 2px 16px 0px rgba(0,0,0,0.08)",
                      paddingTop: "40px",
                      paddingBottom: "40px",
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "-120px",
                      position: "relative",
                      zIndex: 2,
                      flexShrink: 0,
                    }}
                  >
                    <SafeHtml
                      html={
                        data.layout4Desc ||
                        data.desc ||
                        "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ..."
                      }
                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l4DescStyle, viewport),
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "-0.4px",
                        lineHeight: 1.5,
                        color: "#060606",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout4Desc");
                      }}
                    />
                  </div>
                )}
                {/* Image — z:1 */}
                <div
                  style={{
                    width: isTablet4 ? "483px" : "620px",
                    height: isTablet4 ? "400px" : "384px",
                    borderTopRightRadius: "40px",
                    borderBottomLeftRadius: "40px",
                    borderTopLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                    boxShadow: "8px 8px 20px 0px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4ImageUrl");
                  }}
                >
                  <UniversalMedia
                    url={
                      data.layout4ImageUrl ||
                      data.imageUrl ||
                      "https://placehold.co/620x400"
                    }
                    alt="layout4-main-image"
                    className="w-full h-full"
                    style={getMainImageStyle(l4ImageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout4ImageUrl");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "5") {
    const l5SubTitleStyle = data.layout5SubTitleStyle || {};
    const l5TitleStyle = data.layout5TitleStyle || {};
    const l5DescStyle = data.layout5DescStyle || {};
    const l5ImageStyle = data.layout5ImageUrlStyle || data.imageStyle;

    const isTablet5 = viewport === "tablet";
    const isMobile5 = viewport === "mobile";
    const isDesktop5 = viewport === "desktop";

    // ─── Desktop: 원본 코드 그대로 보존 ───────────────────────────────────
    if (isDesktop5) {
      return (
        <section
          style={style}
          className="w-full relative overflow-hidden bg-white"
        >
          <div className="mx-auto w-full max-w-[1920px] relative">
            <div
              className={`self-stretch w-full ${getVerticalPaddingClass(viewport as any)} flex flex-col justify-start items-center`}
            >
              <div
                className={`self-stretch ${getPaddingClass(viewport, "xl:px-[280px]")} py-28 bg-gradient-to-br from-시안-mode-Primary50 via-시안-mode-subColor30 to-시안-mode-subColor50 flex flex-col justify-start items-start gap-10`}
                style={{
                  backgroundImage: data.layout5BgImageUrl
                    ? `url(${data.layout5BgImageUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout5BgImageUrl");
                }}
              >
                <div className="w-[1360px] max-w-full flex flex-col justify-center items-start">
                  {!(l5SubTitleStyle as any)?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout5SubTitle ||
                        data.subTitle ||
                        "( 서브타이틀 )"
                      }
                      className="justify-start text-gray-0 text-lg font-medium font-['Pretendard'] leading-7"
                      style={{
                        ...getElementStyle(l5SubTitleStyle, viewport),
                        color: "#FFFFFF",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout5SubTitle");
                      }}
                    />
                  )}
                  {!(l5TitleStyle as any)?.isHidden && (
                    <SafeHtml
                      html={data.layout5Title || data.title || "타이틀명 입력"}
                      className="justify-start text-gray-0 text-4xl font-bold font-['Pretendard'] leading-[60px]"
                      style={{
                        ...getElementStyle(l5TitleStyle, viewport),
                        color: "#FFFFFF",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout5Title");
                      }}
                    />
                  )}
                  {!(l5DescStyle as any)?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout5Desc || data.desc || "이민 프로그램명 입력"
                      }
                      className="justify-start text-gray-0 text-xl font-medium font-['Pretendard'] leading-8"
                      style={{
                        ...getElementStyle(l5DescStyle, viewport),
                        color: "#FFFFFF",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout5Desc");
                      }}
                    />
                  )}
                </div>
              </div>

              <div
                className={`self-stretch w-full ${getPaddingClass(viewport, "xl:px-[280px]")} ${
                  (data.items || []).length > 2 ? "-mt-[80px]" : "-mt-[240px]"
                } flex justify-between ${
                  (data.items || []).length > 2 ? "items-start" : "items-end"
                }`}
              >
                <div className="grid grid-cols-2 gap-10">
                  {(data.items || []).map((item: any, idx: number) => {
                    const itemSelectId = item?.id || `ib-layout5-item-${idx}`;
                    const isFirstCard = idx === 0;
                    const isSecondCard = idx === 1;
                    const imageUrl = isFirstCard
                      ? data.layout5Card1ImageUrl ||
                        item?.imageUrl ||
                        item?.image ||
                        "/images/placeholder/infobanner_layout5_card1_image.jpg"
                      : isSecondCard
                        ? data.layout5Card2ImageUrl ||
                          item?.imageUrl ||
                          item?.image ||
                          "/images/placeholder/infobanner_layout5_card2_image.jpg"
                        : item?.imageUrl ||
                          item?.image ||
                          "/images/placeholder/infobanner_layout5_card1_image.jpg";
                    const titleStyle = isFirstCard
                      ? data.layout5Card1TitleStyle
                      : isSecondCard
                        ? data.layout5Card2TitleStyle
                        : item?.titleStyle;
                    const descStyle = isFirstCard
                      ? data.layout5Card1DescStyle
                      : isSecondCard
                        ? data.layout5Card2DescStyle
                        : item?.descStyle;
                    const titleText = isFirstCard
                      ? data.layout5Card1Title || item?.title || "영상명 입력"
                      : isSecondCard
                        ? data.layout5Card2Title || item?.title || "영상명 입력"
                        : item?.title || "영상명 입력";
                    const descText = isFirstCard
                      ? data.layout5Card1Desc ||
                        item?.desc ||
                        "영상 소개 문구 적는 곳"
                      : isSecondCard
                        ? data.layout5Card2Desc ||
                          item?.desc ||
                          "영상 소개 문구 적는 곳"
                        : item?.desc || "영상 소개 문구 적는 곳";

                    return (
                      <div
                        key={itemSelectId}
                        className="w-80 inline-flex flex-col justify-center items-center gap-4 overflow-hidden"
                      >
                        <div className="w-80 aspect-[16/9] relative rounded-2xl overflow-hidden">
                          <UniversalMedia
                            url={imageUrl}
                            className="w-full h-full"
                            alt="video thumbnail"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              if (isFirstCard) {
                                onElementSelect?.("layout5Card1ImageUrl");
                                return;
                              }
                              if (isSecondCard) {
                                onElementSelect?.("layout5Card2ImageUrl");
                                return;
                              }
                              onElementSelect?.("itemImage", itemSelectId);
                            }}
                          />
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          {!titleStyle?.isHidden && (
                            <SafeHtml
                              html={titleText}
                              className="justify-start text-zinc-950 text-2xl font-medium font-['Pretendard'] leading-9"
                              style={getElementStyle(titleStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                if (isFirstCard) {
                                  onElementSelect?.("layout5Card1Title");
                                  return;
                                }
                                if (isSecondCard) {
                                  onElementSelect?.("layout5Card2Title");
                                  return;
                                }
                                onElementSelect?.("itemTitle", itemSelectId);
                              }}
                            />
                          )}
                          {!descStyle?.isHidden && (
                            <SafeHtml
                              html={descText}
                              className="self-stretch justify-start text-gray-500 text-xl font-medium font-['Pretendard'] leading-8"
                              style={getElementStyle(descStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                if (isFirstCard) {
                                  onElementSelect?.("layout5Card1Desc");
                                  return;
                                }
                                if (isSecondCard) {
                                  onElementSelect?.("layout5Card2Desc");
                                  return;
                                }
                                onElementSelect?.("itemDesc", itemSelectId);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="w-[620px] aspect-[31/22] rounded-2xl overflow-hidden cursor-pointer"
                  style={getMainImageFrameStyle(l5ImageStyle)}
                >
                  <UniversalMedia
                    url={
                      data.layout5ImageUrl ||
                      "/images/placeholder/infobanner_layout5_main_image.jpg"
                    }
                    alt="banner"
                    className="w-full h-full"
                    style={getMainImageStyle(l5ImageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5ImageUrl");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ─── Tablet / Mobile: Figma 스펙 inline style ─────────────────────────
    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          {/* Outer wrapper */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: isMobile5 ? "30px" : "60px",
              paddingBottom: isMobile5 ? "100px" : "140px",
              width: "100%",
            }}
          >
            {/* Banner section — mb:-80px 으로 하단 섹션이 80px 겹침 */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "40px",
                paddingRight: "40px",
                paddingTop: isTablet5 ? "120px" : "60px",
                paddingBottom: isTablet5 ? "120px" : "60px",
                marginBottom: isMobile5 ? "-40px" : "-80px",
                backgroundImage: data.layout5BgImageUrl
                  ? `url(${data.layout5BgImageUrl})`
                  : "linear-gradient(147.64deg, #285DE1 2.89%, #59A1B9 48.56%, #44A075 100%)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout5BgImageUrl");
              }}
            >
              {/* subtit group */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile5 ? "center" : "flex-start",
                  justifyContent: "center",
                  width: "100%",
                  textAlign: isMobile5 ? "center" : "left",
                  gap: isMobile5 ? "0px" : undefined,
                }}
              >
                {!(l5SubTitleStyle as any)?.isHidden && (
                  <SafeHtml
                    html={
                      data.layout5SubTitle || data.subTitle || "( 서브타이틀 )"
                    }
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                    style={{
                      ...getElementStyle(l5SubTitleStyle, viewport),
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 500,
                      letterSpacing: "-0.36px",
                      lineHeight: 1.5,
                      color: "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5SubTitle");
                    }}
                  />
                )}
                {!(l5TitleStyle as any)?.isHidden && (
                  <SafeHtml
                    html={data.layout5Title || data.title || "타이틀명 입력"}
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                    style={{
                      ...getElementStyle(l5TitleStyle, viewport),
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      letterSpacing: isMobile5 ? "-0.56px" : "-0.8px",
                      lineHeight: 1.5,
                      color: "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5Title");
                    }}
                  />
                )}
                {!(l5DescStyle as any)?.isHidden && (
                  <SafeHtml
                    html={
                      data.layout5Desc || data.desc || "이민 프로그램명 입력"
                    }
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                    style={{
                      ...getElementStyle(l5DescStyle, viewport),
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 500,
                      letterSpacing: "-0.36px",
                      lineHeight: 1.5,
                      color: "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5Desc");
                    }}
                  />
                )}
              </div>
            </div>

            {/* 하단 section — 배너와 80px 겹침, mb:-80px */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile5 ? "16px" : "24px",
                alignItems: "flex-start",
                paddingLeft: isTablet5 ? "40px" : "20px",
                paddingRight: isTablet5 ? "40px" : "20px",
                width: "100%",
              }}
            >
              {/* 메인 이미지 */}
              <div
                style={{
                  height: isTablet5 ? "240px" : isMobile5 ? "160px" : undefined,
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout5ImageUrl");
                }}
              >
                <UniversalMedia
                  url={
                    data.layout5ImageUrl ||
                    "/images/placeholder/infobanner_layout5_main_image.jpg"
                  }
                  alt="banner"
                  className="w-full h-full"
                  style={getMainImageStyle(l5ImageStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout5ImageUrl");
                  }}
                />
              </div>

              {/* 영상 카드 리스트 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: isMobile5 ? "8px" : "20px",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {/* Card 1 */}
                <div
                  style={{
                    flex: "1 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile5 ? "8px" : "16px",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: isMobile5 ? "100px" : "180px",
                      width: "100%",
                      borderRadius: isMobile5 ? "8px" : "16px",
                      overflow: "hidden",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5Card1ImageUrl");
                    }}
                  >
                    <UniversalMedia
                      url={
                        data.layout5Card1ImageUrl ||
                        "/images/placeholder/infobanner_layout5_card1_image.jpg"
                      }
                      alt="card1-image"
                      className="w-full h-full"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout5Card1ImageUrl");
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                      alignItems: "flex-start",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {!data.layout5Card1TitleStyle?.isHidden && (
                      <SafeHtml
                        html={data.layout5Card1Title || "영상명 입력"}
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          ...getElementStyle(
                            data.layout5Card1TitleStyle,
                            viewport,
                          ),
                          fontFamily: "Pretendard, sans-serif",
                          fontWeight: 500,
                          letterSpacing: isMobile5 ? "-0.4px" : "-0.48px",
                          lineHeight: 1.5,
                          color: "#060606",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout5Card1Title");
                        }}
                      />
                    )}
                    {!data.layout5Card1DescStyle?.isHidden && (
                      <SafeHtml
                        html={data.layout5Card1Desc || "영상 소개 문구 적는 곳"}
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          ...getElementStyle(
                            data.layout5Card1DescStyle,
                            viewport,
                          ),
                          fontFamily: "Pretendard, sans-serif",
                          fontWeight: 500,
                          letterSpacing: isMobile5 ? "-0.36px" : "-0.4px",
                          lineHeight: 1.5,
                          color: "#6d7882",
                          width: "100%",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout5Card1Desc");
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  style={{
                    flex: "1 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile5 ? "8px" : "16px",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: isMobile5 ? "100px" : "180px",
                      width: "100%",
                      borderRadius: isMobile5 ? "8px" : "16px",
                      overflow: "hidden",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5Card2ImageUrl");
                    }}
                  >
                    <UniversalMedia
                      url={
                        data.layout5Card2ImageUrl ||
                        "/images/placeholder/infobanner_layout5_card2_image.jpg"
                      }
                      alt="card2-image"
                      className="w-full h-full"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout5Card2ImageUrl");
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                      alignItems: "flex-start",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {!data.layout5Card2TitleStyle?.isHidden && (
                      <SafeHtml
                        html={data.layout5Card2Title || "영상명 입력"}
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          ...getElementStyle(
                            data.layout5Card2TitleStyle,
                            viewport,
                          ),
                          fontFamily: "Pretendard, sans-serif",
                          fontWeight: 500,
                          letterSpacing: isMobile5 ? "-0.4px" : "-0.48px",
                          lineHeight: 1.5,
                          color: "#060606",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout5Card2Title");
                        }}
                      />
                    )}
                    {!data.layout5Card2DescStyle?.isHidden && (
                      <SafeHtml
                        html={data.layout5Card2Desc || "영상 소개 문구 적는 곳"}
                        className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          ...getElementStyle(
                            data.layout5Card2DescStyle,
                            viewport,
                          ),
                          fontFamily: "Pretendard, sans-serif",
                          fontWeight: 500,
                          letterSpacing: isMobile5 ? "-0.36px" : "-0.4px",
                          lineHeight: 1.5,
                          color: "#6d7882",
                          width: "100%",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout5Card2Desc");
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback Layout Placeholder
  return (
    <section
      style={style}
      className="w-full relative py-20 bg-시안-mode-gray5 flex items-center justify-center"
    >
      <div className="text-center font-bold text-시안-mode-gray40">
        <p className="text-xl">안내 배너 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
