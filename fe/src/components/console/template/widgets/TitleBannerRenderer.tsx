import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  UniversalMedia,
  WidgetRendererProps,
  getImageUrl,
  getPaddingClass,
  getBorderRadiusClass,
  getBorderRadiusStyle,
} from "./WidgetUtils";

export const TITLE_BANNER_LAYOUT1_DEFAULT_ITEMS = [
  {
    id: "title-banner-feature-1",
    image: "/images/placeholder/banner_feature.png",
    title: "프로그램 특징",
    titleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
    desc: "프로그램 특징 내용 입력",
    descStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  },
  {
    id: "title-banner-feature-2",
    image: "/images/placeholder/banner_feature.png",
    title: "프로그램 특징",
    titleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
    desc: "프로그램 특징 내용 입력",
    descStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  },
  {
    id: "title-banner-feature-3",
    image: "/images/placeholder/banner_feature.png",
    title: "프로그램 특징",
    titleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
    desc: "프로그램 특징 내용 입력",
    descStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  },
] as const;

export const getTitleBannerLayout1Items = (data: any) => {
  if (Array.isArray(data?.items)) {
    return data.items.map((item: any, idx: number) => ({
      ...TITLE_BANNER_LAYOUT1_DEFAULT_ITEMS[
        idx % TITLE_BANNER_LAYOUT1_DEFAULT_ITEMS.length
      ],
      ...item,
      id: item?.id || `title-banner-feature-${idx + 1}`,
    }));
  }

  return TITLE_BANNER_LAYOUT1_DEFAULT_ITEMS.map((defaultItem, idx) => {
    const featureIndex = idx + 1;
    return {
      ...defaultItem,
      image: data?.[`feature${featureIndex}Image`] || defaultItem.image,
      imageStyle: data?.[`feature${featureIndex}ImageStyle`],
      title: data?.[`feature${featureIndex}Title`] || defaultItem.title,
      titleStyle:
        data?.[`feature${featureIndex}TitleStyle`] || defaultItem.titleStyle,
      desc: data?.[`feature${featureIndex}Desc`] || defaultItem.desc,
      descStyle:
        data?.[`feature${featureIndex}DescStyle`] || defaultItem.descStyle,
    };
  });
};

export const TITLE_BANNER_DEFAULTS = {
  subTitle: "버지니아 해안 리조트 건설 프로젝트",
  subTitleStyle: { color: "#285DE1", fontSize: "20px", fontWeight: "700" }, // blue-600
  title:
    "2026년 <span style='color: #285DE1'>미국 투자이민,</span><br/>꼭 알아야 할 3가지 핵심 트렌드",
  titleStyle: {
    color: "#131416",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
  },
  desc: "설명을 쓰는 곳입니다.",
  descStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "500" },
  textContentTitle: "서브 타이틀 입력",
  textContentTitleStyle: {
    color: "#131416",
    fontSize: "24px",
    fontWeight: "500",
  },
  textContent:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  textContentStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "400" },
  feature1DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  feature2Image: "/images/placeholder/banner_feature.png",
  feature2Title: "프로그램 특징",
  feature2TitleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
  feature2Desc: "프로그램 특징 내용 입력",
  feature2DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  feature3Image: "/images/placeholder/banner_feature.png",
  feature3Title: "프로그램 특징",
  feature3TitleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
  feature3Desc: "프로그램 특징 내용 입력",
  feature3DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  items: TITLE_BANNER_LAYOUT1_DEFAULT_ITEMS,
  backgroundImage: "/images/placeholder/titlebanner_banckground.png",
  layout1Image: "/images/placeholder/title_banner_img.png",
  layout2HeroImage: "/images/placeholder/title_banner_img2.png",
  layout3Image: "/images/placeholder/hero-img.jpg",
  layout3MobileImage: "/images/placeholder/hero-img.jpg",
  quoteLeftUrl: "/images/placeholder/banner_quote_left.jpg",
  quoteRightUrl: "/images/placeholder/banner_quote_right.jpg",
  layout3SmallTitle: "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!",
  layout3SmallTitleStyle: {
    color: "#131416",
    fontSize: "24px",
    fontWeight: "500",
  },
  layout3Title: "학부모 영주권 프로그램",
  layout3TitleStyle: {
    color: "#131416",
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
  },
  layout3Desc:
    "까다로운 자금 출처 없이 국내에서<br/>온가족이 미국 영주권을 취득할 수 있는 프로그램",
  layout3DescStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "500" },
  layout: "1",
};

export const TitleBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = String(data.layout || "1")
    .trim()
    .replace(/^layout/, "");
  const hasLayout1Items = Array.isArray(data.items);
  const layout1Features = getTitleBannerLayout1Items(data);
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";
  const layout3Image = data.layout3Image || TITLE_BANNER_DEFAULTS.layout3Image;
  const layout3MobileImage =
    data.layout3MobileImage ||
    data.layout3Image ||
    TITLE_BANNER_DEFAULTS.layout3MobileImage;
  const layout3CurrentImage = isMobile ? layout3MobileImage : layout3Image;
  const layout3CurrentImageStyle = isMobile
    ? {
        ...(data.layout3ImageStyle || {}),
        ...(data.layout3MobileImageStyle || {}),
      }
    : data.layout3ImageStyle;
  const shouldWrapLayout1Features = layout1Features.length > 3;
  const getLayout1FeatureCardStyle = (): React.CSSProperties =>
    shouldWrapLayout1Features
      ? isMobile
        ? { flex: "0 0 100%", maxWidth: "100%" }
        : { flex: "0 0 33.333333%", maxWidth: "33.333333%" }
      : {};
  const getTitleBannerTextStyle = (
    textStyle: any,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(textStyle, viewport as any),
    ...overrides,
  });

  /* ─────────────────────────────────────────── 레이아웃 1 (구조 원복) ─── */
  if (layout === "1") {
    /* ── 태블릿: 세로 스택 레이아웃 ── */
    if (isTablet) {
      return (
        <section
          style={{
            ...style,
            backgroundImage: data.backgroundImage
              ? `url(${getImageUrl(data.backgroundImageStyle, viewport, data.backgroundImage)})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full relative overflow-hidden transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("backgroundImage");
          }}
        >
          <div className="mx-auto w-full max-w-[1920px] relative">
            <div
              className={`${viewport === "tablet" ? "px-10" : viewport === "mobile" ? "px-5" : "pl-5 pr-0 md:pl-10 md:pr-0 xl:pl-[280px] xl:pr-0"} py-[60px] flex flex-col gap-[60px] w-full`}
            >
              {/* 텍스트 섹션 */}
              <div className="flex flex-col gap-[40px] w-full">
                {/* 타이틀 그룹 */}
                <div className="flex flex-col gap-3 items-start">
                  <SafeHtml
                    className="font-bold font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                    style={getTitleBannerTextStyle(data.subTitleStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("subTitle");
                    }}
                    html={data.subTitle || "버지니아 해안 리조트 건설 프로젝트"}
                  />
                  <div
                    className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("title");
                    }}
                  >
                    <SafeHtml
                      className="font-['Pretendard']"
                      style={getElementStyle(
                        data.titleStyle || TITLE_BANNER_DEFAULTS.titleStyle,
                        viewport,
                      )}
                      html={
                        data.title ||
                        `<span class="text-gray-950 font-bold">2026년 </span><span class="text-[#285DE1] font-bold">미국 투자이민,<br/></span><span class="text-gray-950 font-bold">꼭 알아야 할 3가지 핵심 트렌드</span>`
                      }
                    />
                  </div>
                  <SafeHtml
                    className="font-medium font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                    style={getTitleBannerTextStyle(data.descStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("desc");
                    }}
                    html={data.desc || "설명을 쓰는 곳입니다."}
                  />
                </div>

                {/* 본문 + 특징 그룹 */}
                <div className="flex flex-col gap-[20px] w-full">
                  <SafeHtml
                    className="w-full font-medium font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                    style={getTitleBannerTextStyle(data.textContentStyle, {
                      color: "#6d7882",
                      fontSize: "18px",
                      letterSpacing: "-0.4px",
                    })}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("textContent");
                    }}
                    html={
                      data.textContent ||
                      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                    }
                  />
                  <div
                    className="w-full flex flex-wrap justify-center items-start"
                    style={
                      shouldWrapLayout1Features ? { rowGap: "24px" } : undefined
                    }
                  >
                    {layout1Features.map((feature: any, idx: number) => {
                      const isLast = idx === layout1Features.length - 1;
                      const useDivider = layout1Features.length <= 3 && !isLast;

                      return (
                        <div
                          key={feature.id || idx}
                          className={`w-full sm:flex-1 max-w-[440px] ${useDivider ? "border-r border-gray-200" : ""} flex flex-col justify-start items-center gap-4`}
                          style={getLayout1FeatureCardStyle()}
                        >
                          <UniversalMedia
                            className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "contain",
                              ...getElementStyle(feature.imageStyle, viewport),
                            }}
                            url={getImageUrl(
                              feature.imageStyle,
                              viewport,
                              feature.image,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              if (hasLayout1Items) {
                                onElementSelect?.("itemImage", feature.id);
                                return;
                              }
                              onElementSelect?.(`feature${idx + 1}Image`);
                            }}
                          />
                          <div className="flex flex-col justify-start items-center gap-2">
                            <SafeHtml
                              className="text-center font-bold font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                              style={{
                                ...getElementStyle(
                                  feature.titleStyle,
                                  viewport as any,
                                ),
                                color: "#295e92",
                                fontSize: "24px",
                                letterSpacing: "-0.48px",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                if (hasLayout1Items) {
                                  onElementSelect?.("itemTitle", feature.id);
                                  return;
                                }
                                onElementSelect?.(`feature${idx + 1}Title`);
                              }}
                              html={feature.title || "프로그램 특징"}
                            />
                            <SafeHtml
                              className="text-center font-normal font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                              style={{
                                ...getElementStyle(
                                  feature.descStyle,
                                  viewport as any,
                                ),
                                color: "#6d7882",
                                fontSize: "18px",
                                letterSpacing: "-0.36px",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                if (hasLayout1Items) {
                                  onElementSelect?.("itemDesc", feature.id);
                                  return;
                                }
                                onElementSelect?.(`feature${idx + 1}Desc`);
                              }}
                              html={feature.desc || "프로그램 특징 내용 입력"}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 하단 이미지 */}
              <div className="relative shrink-0 w-full h-[360px] overflow-hidden">
                <UniversalMedia
                  className="absolute inset-0 w-full h-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                  url={getImageUrl(
                    data.layout1ImageStyle,
                    viewport,
                    data.layout1Image,
                  )}
                  style={getElementStyle(data.layout1ImageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout1Image");
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ── 데스크톱: 기존 가로 레이아웃 ── */
    return (
      <section
        style={{
          ...style,
          backgroundImage: data.backgroundImage
            ? `url(${getImageUrl(data.backgroundImageStyle, viewport, data.backgroundImage)})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full relative overflow-hidden transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("backgroundImage");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${isTablet ? "px-10" : isMobile ? "px-5" : "pl-5 md:pl-10 xl:pl-[280px] pr-0"} py-14 inline-flex justify-start items-center gap-20`}
          >
            <div className="flex-1 inline-flex flex-col justify-between items-start">
              {/* 상단 텍스트 그룹 */}
              <div className="flex flex-col justify-start items-start gap-3">
                {/* 버지니아 해안 리조트 건설 프로젝트 */}
                <SafeHtml
                  className="justify-start text-blue-600 text-lg xl:text-xl font-bold font-['Pretendard'] leading-normal hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={getTitleBannerTextStyle(data.subTitleStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                  html={data.subTitle || "버지니아 해안 리조트 건설 프로젝트"}
                />
                {/* 타이틀 영역 */}
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    className="font-['Pretendard'] leading-relaxed"
                    style={getElementStyle(
                      data.titleStyle || TITLE_BANNER_DEFAULTS.titleStyle,
                      viewport as any,
                    )}
                    html={
                      data.title ||
                      `<span class="text-gray-950 font-bold">2026년 </span><span class="text-[#285DE1] font-bold">미국 투자이민,<br/></span><span class="text-gray-950 font-bold">꼭 알아야 할 3가지 핵심 트렌드</span>`
                    }
                  />
                </div>
                {/* 설명을 쓰는 곳입니다. */}
                <SafeHtml
                  className="justify-start text-gray-500 text-lg xl:text-xl font-medium font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={getTitleBannerTextStyle(data.descStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                  html={data.desc || "설명을 쓰는 곳입니다."}
                />
              </div>

              {/* 하단 특징 및 본문 그룹 */}
              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                <SafeHtml
                  className="self-stretch justify-start text-gray-500 text-lg xl:text-xl font-medium font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={getTitleBannerTextStyle(data.textContentStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContent");
                  }}
                  html={
                    data.textContent ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                />

                <div
                  className="self-stretch flex flex-wrap justify-center items-start"
                  style={
                    shouldWrapLayout1Features ? { rowGap: "24px" } : undefined
                  }
                >
                  {layout1Features.map((feature: any, idx: number) => {
                    const isLast = idx === layout1Features.length - 1;
                    const useDivider = layout1Features.length <= 3 && !isLast;

                    return (
                      <div
                        key={feature.id || idx}
                        className={`w-full md:flex-1 max-w-96 ${useDivider ? "border-r border-gray-200" : ""} inline-flex flex-col justify-start items-center gap-4`}
                        style={getLayout1FeatureCardStyle()}
                      >
                        <UniversalMedia
                          className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                          style={{
                            width: "96px",
                            height: "96px",
                            objectFit: "contain",
                            ...getElementStyle(feature.imageStyle, viewport),
                          }}
                          url={getImageUrl(
                            feature.imageStyle,
                            viewport,
                            feature.image,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (hasLayout1Items) {
                              onElementSelect?.("itemImage", feature.id);
                              return;
                            }
                            onElementSelect?.(`feature${idx + 1}Image`);
                          }}
                        />
                        <div className="flex flex-col justify-start items-center gap-2">
                          <SafeHtml
                            className="text-center justify-start text-[#0369a1] text-2xl font-bold font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                            style={{
                              ...getElementStyle(feature.titleStyle, viewport),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              if (hasLayout1Items) {
                                onElementSelect?.("itemTitle", feature.id);
                                return;
                              }
                              onElementSelect?.(`feature${idx + 1}Title`);
                            }}
                            html={feature.title || "프로그램 특징"}
                          />
                          <SafeHtml
                            className="text-center justify-start text-gray-500 text-lg font-normal font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                            style={{
                              ...getElementStyle(feature.descStyle, viewport),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              if (hasLayout1Items) {
                                onElementSelect?.("itemDesc", feature.id);
                                return;
                              }
                              onElementSelect?.(`feature${idx + 1}Desc`);
                            }}
                            html={feature.desc || "프로그램 특징 내용 입력"}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <UniversalMedia
              className={`w-[820px] h-[575px] ${getBorderRadiusClass(viewport, "rounded-tl-2xl rounded-bl-2xl")} object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer`}
              url={getImageUrl(
                data.layout1ImageStyle,
                viewport,
                data.layout1Image,
              )}
              style={getElementStyle(data.layout1ImageStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1Image");
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    /* ── 태블릿: 세로 스택 레이아웃 (피그마 이미지타이틀02) ── */
    if (isTablet) {
      return (
        <section
          style={style}
          className="w-full relative transition-all cursor-pointer"
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("backgroundImage");
          }}
        >
          <div className="mx-auto w-full max-w-[1920px] relative">
            {/* 피그마 스펙: flex-col gap-[40px] padding: 60px 40px */}
            <div
              className={`${getPaddingClass(viewport)} py-14 flex flex-col gap-[40px] items-start w-full`}
            >
              {/* subtit 그룹: flex-col gap-[12px] */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                {/* subTitle: 20px medium leading-none #295e92 tracking:-0.4px */}
                <SafeHtml
                  html={data.subTitle || "Program Name."}
                  className="font-medium font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getTitleBannerTextStyle(data.subTitleStyle, {
                    color: "#295e92",
                    fontSize: "18px",
                    letterSpacing: "-0.4px",
                  })}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
                {/* title: 48px bold leading-1.5 #131416 tracking:-0.96px */}
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={{
                    ...getElementStyle(
                      data.titleStyle || TITLE_BANNER_DEFAULTS.titleStyle,
                      viewport,
                    ),
                    color: "#131416",
                    fontSize: "48px",
                    letterSpacing: "-0.96px",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
                {/* desc: 20px medium leading-1.5 #6d7882 tracking:-0.4px */}
                <SafeHtml
                  html={data.desc || "서브타이틀 입력 영역"}
                  className="font-medium font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getTitleBannerTextStyle(data.descStyle, {
                    color: "#6d7882",
                    fontSize: "18px",
                    letterSpacing: "-0.4px",
                    width: "100%",
                  })}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              </div>

              {/* 하단 row: flex gap-[40px] items-end justify-center w-full */}
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {/* 이미지: w-360px h-440px rounded-tl-[60px] */}
                <div
                  style={{
                    position: "relative",
                    width: "360px",
                    height: "440px",
                    borderRadius: "60px 0 0 0",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <UniversalMedia
                    className="absolute inset-0 w-full h-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                    url={getImageUrl(
                      data.layout2HeroImageStyle,
                      viewport,
                      data.layout2HeroImage ||
                        "/images/placeholder/title_banner_img2.png",
                    )}
                    style={{
                      ...getElementStyle(data.layout2HeroImageStyle, viewport),
                      borderRadius: getBorderRadiusStyle(
                        viewport,
                        "60px 0 0 0",
                      ),
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout2HeroImage");
                    }}
                  />
                </div>

                {/* txt01: flex-1 flex-col gap-[8px] items-start justify-center */}
                <div
                  style={{
                    flex: "1 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  {/* textContentTitle: 24px medium leading-1.5 #131416 tracking:-0.48px */}
                  <SafeHtml
                    html={data.textContentTitle || "서브 타이틀 입력"}
                    className="font-medium font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                    style={{
                      ...getElementStyle(data.textContentTitleStyle, viewport),
                      color: "#131416",
                      fontSize: "24px",
                      letterSpacing: "-0.48px",
                      width: "100%",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("textContentTitle");
                    }}
                  />
                  {/* 구분선: bg-[#e6e8ea] h-1px w-60px */}
                  <div
                    style={{
                      backgroundColor: "#e6e8ea",
                      height: "1px",
                      width: "60px",
                      flexShrink: 0,
                    }}
                  />
                  {/* textContent: 20px medium leading-1.5 #6d7882 tracking:-0.4px */}
                  <SafeHtml
                    html={
                      data.textContent ||
                      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                    }
                    className="font-medium font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                    style={getTitleBannerTextStyle(data.textContentStyle, {
                      color: "#6d7882",
                      fontSize: "18px",
                      letterSpacing: "-0.4px",
                      width: "100%",
                    })}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("textContent");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ── 데스크톱: 기존 가로 레이아웃 ── */
    return (
      <section
        style={style}
        className="w-full relative transition-all cursor-pointer"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("backgroundImage");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`w-full ${getPaddingClass(viewport)} py-[60px] flex justify-between items-start self-stretch`}
          >
            <div className="inline-flex flex-col justify-start items-start gap-3">
              <SafeHtml
                html={data.subTitle || "Program Name."}
                className="justify-start text-시안-mode-Primary70 text-lg xl:text-xl font-medium font-['Pretendard'] leading-normal hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                style={getTitleBannerTextStyle(data.subTitleStyle)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
              <SafeHtml
                html={data.title || "타이틀명 입력"}
                className="justify-start text-gray-95 text-5xl font-bold font-['Pretendard'] leading-relaxed hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                style={getElementStyle(
                  data.titleStyle || TITLE_BANNER_DEFAULTS.titleStyle,
                  viewport,
                )}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
              <SafeHtml
                html={data.desc || "서브타이틀 입력 영역"}
                className="self-stretch justify-start text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                style={getTitleBannerTextStyle(data.descStyle)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "800px",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "40px",
              }}
            >
              <UniversalMedia
                className={`w-[360px] h-auto max-h-[440px] ${getBorderRadiusClass(viewport, "rounded-tl-[60px]")} object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer`}
                url={getImageUrl(
                  data.layout2HeroImageStyle,
                  viewport,
                  data.layout2HeroImage ||
                    "/images/placeholder/title_banner_img2.png",
                )}
                style={getElementStyle(data.layout2HeroImageStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2HeroImage");
                }}
              />
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <SafeHtml
                  html={data.textContentTitle || "서브 타이틀 입력"}
                  className="self-stretch justify-start text-gray-95 text-2xl font-medium font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(data.textContentTitleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContentTitle");
                  }}
                />
                <div className="w-14 h-px bg-gray-10"></div>
                <SafeHtml
                  html={
                    data.textContent ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다."
                  }
                  className="self-stretch justify-start text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getTitleBannerTextStyle(data.textContentStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContent");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    /* ── 공통 이미지 배너 렌더 (tablet/desktop 공유) ── */
    /* ── 태블릿: 피그마 이미지박스04 스펙 ── */
    if (isTablet) {
      return (
        <section
          style={style}
          className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
          onDoubleClick={() => onElementSelect?.("style")}
        >
          <div className="mx-auto w-full max-w-[1920px] relative">
            {/* 피그마: flex-col gap-[40px] items-center padding:60px 40px */}
            <div
              className={`${getPaddingClass(viewport)} py-14 flex flex-col gap-[40px] items-center w-full`}
            >
              {/* 상단: 따옴표 + 텍스트 | flex gap-[60px] items-start */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                }}
              >
                {/* 좌측 따옴표: w-[50px] h-[40px] */}
                <div
                  style={{
                    position: "relative",
                    width: "50px",
                    height: "40px",
                    flexShrink: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("quoteLeftUrl");
                  }}
                >
                  <UniversalMedia
                    url={getImageUrl(
                      data.quoteLeftUrlStyle,
                      viewport,
                      data.quoteLeftUrl,
                    )}
                    style={{
                      ...getElementStyle(data.quoteLeftUrlStyle, viewport),
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    className="absolute inset-0 w-full h-full"
                    alt="Left Quote"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("quoteLeftUrl");
                    }}
                  />
                </div>

                {/* subtit 그룹: flex-col gap-[8px] items-center text-center */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {/* layout3SmallTitle: 24px medium leading-1.5 #131416 tracking:-0.48px */}
                  <SafeHtml
                    html={
                      data.layout3SmallTitle ||
                      "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!"
                    }
                    className="font-medium font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                    style={{
                      ...getElementStyle(data.layout3SmallTitleStyle, viewport),
                      color: "#131416",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.48px",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout3SmallTitle");
                    }}
                  />
                  {/* layout3Title: 48px bold leading-1.5 #131416 tracking:-0.96px */}
                  <SafeHtml
                    html={data.layout3Title || "학부모 영주권 프로그램"}
                    className="font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                    style={{
                      ...getElementStyle(
                        data.layout3TitleStyle ||
                          TITLE_BANNER_DEFAULTS.layout3TitleStyle,
                        viewport,
                      ),
                      color: "#131416",
                      fontSize: "48px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.96px",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout3Title");
                    }}
                  />
                  {/* layout3Desc: 20px medium leading-1.5 #6d7882 tracking:-0.4px */}
                  <SafeHtml
                    html={
                      data.layout3Desc ||
                      "까다로운 자금 출처 없이 국내에서<br/>온가족이 미국 영주권을 취득할 수 있는 프로그램"
                    }
                    className="font-medium font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                    style={getTitleBannerTextStyle(data.layout3DescStyle, {
                      color: "#6d7882",
                      fontSize: "20px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                    })}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout3Desc");
                    }}
                  />
                </div>

                {/* 우측 따옴표: w-[50px] h-[40px] rotate-180 */}
                <div
                  style={{
                    position: "relative",
                    width: "50px",
                    height: "40px",
                    flexShrink: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("quoteRightUrl");
                  }}
                >
                  <UniversalMedia
                    url={getImageUrl(
                      data.quoteRightUrlStyle,
                      viewport,
                      data.quoteRightUrl,
                    )}
                    style={{
                      ...getElementStyle(data.quoteRightUrlStyle, viewport),
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    className="absolute inset-0 w-full h-full"
                    alt="Right Quote"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("quoteRightUrl");
                    }}
                  />
                </div>
              </div>

              {/* 하단 이미지 배너 */}
              <div
                style={{
                  position: "relative",
                  borderRadius: getBorderRadiusStyle(viewport, "24px"),
                  overflow: "hidden",
                  width: "100%",
                  flexShrink: 0,
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.(
                    isMobile ? "layout3MobileImage" : "layout3Image",
                  );
                }}
              >
                <UniversalMedia
                  className="w-full"
                  url={layout3CurrentImage}
                  style={{
                    ...getElementStyle(layout3CurrentImageStyle, viewport),
                    height: "auto",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.(
                      isMobile ? "layout3MobileImage" : "layout3Image",
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ── 데스크톱: 기존 레이아웃 ── */
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${getPaddingClass(viewport)} pt-28 pb-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* 상단: 따옴표 + 텍스트 */}
            <div className="inline-flex justify-start items-start gap-14">
              {/* 좌측 따옴표 이미지 */}
              <div
                className="w-12 h-10 shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteLeftUrl");
                }}
              >
                <UniversalMedia
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("quoteLeftUrl");
                  }}
                  url={getImageUrl(
                    data.quoteLeftUrlStyle,
                    viewport,
                    data.quoteLeftUrl,
                  )}
                  style={getElementStyle(data.quoteLeftUrlStyle, viewport)}
                  className="w-full h-full object-contain"
                  alt="Left Quote"
                />
              </div>

              {/* 텍스트 그룹 */}
              <div className="inline-flex flex-col justify-start items-center gap-2">
                <SafeHtml
                  html={
                    data.layout3SmallTitle ||
                    "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!"
                  }
                  className="text-center justify-start text-gray-95 text-2xl font-medium font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(data.layout3SmallTitleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3SmallTitle");
                  }}
                />
                <SafeHtml
                  html={data.layout3Title || "학부모 영주권 프로그램"}
                  className="text-center justify-start text-gray-95 text-5xl font-bold font-['Pretendard'] leading-[72px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(
                    data.layout3TitleStyle ||
                      TITLE_BANNER_DEFAULTS.layout3TitleStyle,
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Title");
                  }}
                />
                <SafeHtml
                  html={
                    data.layout3Desc ||
                    "까다로운 자금 출처 없이 국내에서<br/>온가족이 미국 영주권을 취득할 수 있는 프로그램"
                  }
                  className="text-center justify-start text-gray-50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getTitleBannerTextStyle(data.layout3DescStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Desc");
                  }}
                />
              </div>

              {/* 우측 따옴표 이미지 */}
              <div
                className="w-12 h-10 shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteRightUrl");
                }}
              >
                <UniversalMedia
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("quoteRightUrl");
                  }}
                  url={getImageUrl(
                    data.quoteRightUrlStyle,
                    viewport,
                    data.quoteRightUrl,
                  )}
                  style={getElementStyle(data.quoteRightUrlStyle, viewport)}
                  className="w-full h-full object-contain"
                  alt="Right Quote"
                />
              </div>
            </div>

            {/* 하단: 통이미지 배너 */}
            <div
              className={`self-stretch relative ${getBorderRadiusClass(viewport, "rounded-3xl")} overflow-hidden`}
            >
              <UniversalMedia
                className="w-full"
                url={layout3CurrentImage}
                style={{
                  ...getElementStyle(layout3CurrentImageStyle, viewport),
                  height: "auto",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.(
                    isMobile ? "layout3MobileImage" : "layout3Image",
                  );
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        <p className="text-lg xl:text-xl">타이틀 배너 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
