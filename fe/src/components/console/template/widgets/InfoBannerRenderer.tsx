import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
} from "./WidgetUtils";

export const INFO_BANNER_DEFAULTS = {
  layout: "1",
  subTitle: "Program Name.",
  subTitleStyle: { fontSize: "18px", fontWeight: "400", color: "#285DE1" },
  title: "타이틀명 입력",
  titleStyle: { fontSize: "48px", fontWeight: "700", color: "#FFFFFF" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", fontWeight: "500", color: "#FFFFFF" },
  contentTitle: "서브 타이틀 입력",
  contentTitleStyle: { fontSize: "36px", fontWeight: "500", color: "#111827" },
  contentDesc: "설명 텍스트 입력 영역입니다.",
  contentDescStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  layout1BgImageUrl: "/images/placeholder/infobanner_layout1_bg_image.jpg",
  imageUrl: "/images/placeholder/infobanner_layout1_right_media.png",
  layout2ImageUrl: "/images/placeholder/infobanner_layout2_main_image.jpg",
  layout2SubTitle: "버지니아 해안 리조트 건설 프로젝트",
  layout2SubTitleStyle: { fontSize: "20px", fontWeight: "700", color: "#295E92" },
  layout2Title: "타이틀명 입력",
  layout2TitleStyle: { fontSize: "36px", fontWeight: "700", color: "#131416" },
  layout2Desc: "이민 프로그램명 입력",
  layout2DescStyle: { fontSize: "20px", fontWeight: "500", color: "#131416" },
  layout3ImageUrl: "/images/placeholder/infobanner_layout3_main_image.jpg",
  layout3IconImageUrl: "/images/placeholder/infobanner_layout3_icon_image.png",
  layout3SubTitle: "( 서브타이틀 )",
  layout3SubTitleStyle: { fontSize: "20px", fontWeight: "700", color: "#285DE1" },
  layout3Title: "프로그램 특징",
  layout3TitleStyle: { fontSize: "30px", fontWeight: "700", color: "#1e2124" },
  layout3Desc: "프로그램 특징 내용 입력<br/>2줄 입력",
  layout3DescStyle: { fontSize: "18px", fontWeight: "400", color: "#6d7882" },
  layout3ContentTitle: "서브 타이틀 입력",
  layout3ContentTitleStyle: { fontSize: "36px", fontWeight: "500", color: "#111827" },
  layout3ContentDesc:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  layout3ContentDescStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  layout4ImageUrl: "/images/placeholder/infobanner_layout4_main_image.jpg",
  layout4TopImageUrl: "/images/placeholder/infobanner_layout4_top_icon.png",
  layout4Title:
    "이미 수많은 자산가들은<br/><span class='font-bold'>미국 영주권 취득</span>으로<br/><span class='font-bold'>수억 원을 절감</span>하며 미국에서<br/>자녀를 <span class='font-bold'>글로벌 리더</span>로 키우고 있습니다.",
  layout4TitleStyle: { fontSize: "30px", fontWeight: "500", color: "#1e2124" },
  layout4Desc: "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ...",
  layout4DescStyle: { fontSize: "20px", fontWeight: "500", color: "#1e2124" },
  layout5BgImageUrl: "/images/placeholder/infobanner_layout5_bg_image.jpg",
  layout5ImageUrl: "/images/placeholder/infobanner_layout5_main_image.jpg",
  layout5Card1ImageUrl: "/images/placeholder/infobanner_layout5_card1_image.jpg",
  layout5Card2ImageUrl: "/images/placeholder/infobanner_layout5_card2_image.jpg",
  layout5Card1Title: "영상명 입력",
  layout5Card1TitleStyle: { fontSize: "24px", fontWeight: "500", color: "#060606" },
  layout5Card1Desc: "영상 소개 문구 적는 곳",
  layout5Card1DescStyle: { fontSize: "20px", fontWeight: "500", color: "#6D7882" },
  layout5Card2Title: "영상명 입력",
  layout5Card2TitleStyle: { fontSize: "24px", fontWeight: "500", color: "#060606" },
  layout5Card2Desc: "영상 소개 문구 적는 곳",
  layout5Card2DescStyle: { fontSize: "20px", fontWeight: "500", color: "#6D7882" },
  layout5SubTitle: "( 서브타이틀 )",
  layout5SubTitleStyle: { fontSize: "18px", fontWeight: "500", color: "#285DE1" },
  layout5Title: "타이틀명 입력",
  layout5TitleStyle: { fontSize: "36px", fontWeight: "700", color: "#FFFFFF" },
  layout5Desc: "이민 프로그램명 입력",
  layout5DescStyle: { fontSize: "20px", fontWeight: "500", color: "#FFFFFF" },
  imageStyle: { objectFit: "cover" },
  items: [
    {
      id: "ib-item-1",
      iconUrl: "/images/placeholder/infobanner_item_icon_ka.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-2",
      iconUrl: "/images/placeholder/infobanner_item_icon_ka.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-3",
      iconUrl: "/images/placeholder/infobanner_item_icon_ka.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-4",
      iconUrl: "/images/placeholder/infobanner_item_icon_ka.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
  ],
};

export const InfoBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";
  const isMediaUrl = (value: any) =>
    typeof value === "string" &&
    /^(https?:\/\/|\/|\.{1,2}\/|data:|blob:)/i.test(value);

  if (layout === "1") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch py-14 flex flex-col justify-start items-center gap-10">
            {/* Background Container Box - [RESTORED] Original Gradient UI */}
            <div
              className={`self-stretch w-full px-5 sm:px-10 xl:px-72 py-20 flex flex-col xl:flex-row justify-between items-center xl:items-start gap-10 xl:gap-20 hover:outline-dashed hover:outline-2 hover:outline-blue-300 transition-all cursor-pointer overflow-hidden z-0 ${!data.layout1BgImageUrl ? "bg-gradient-to-br from-blue-500 via-teal-400 to-green-500" : ""}`}
              style={{
                backgroundColor: style?.backgroundColor,
                backgroundImage: data.layout1BgImageUrl
                  ? `url(${data.layout1BgImageUrl})`
                  : style?.backgroundImage,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1BgImageUrl");
              }}
            >
              {/* Left Column Text & Feature Row */}
              <div className="flex-1 self-stretch flex flex-col justify-start items-start gap-20 w-full">
                {/* Header Text Group */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.subTitle || "Program Name."}
                      className="justify-start text-white text-lg font-normal leading-4 font-['Tenor_Sans'] hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
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
                      className="justify-start text-white text-5xl font-bold leading-[72px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text w-full"
                      style={{
                        ...getElementStyle(data.titleStyle, viewport),
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
                      className="justify-start text-white text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.descStyle, viewport),
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>

                {/* Feature Cards Row */}
                <div className="self-stretch px-6 py-6 bg-neutral-900/20 rounded-2xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                  {(data.items || []).map((item: any, idx: number) => {
                    const itemSelectId = item.id || `__idx_${idx}`;
                    return (
                    <div
                      key={item.id || itemSelectId}
                      className="w-full flex flex-col justify-center items-start gap-3"
                    >
                      <div
                        className="w-12 h-12 relative flex items-center justify-center cursor-pointer overflow-hidden"
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
                            "/images/placeholder/infobanner_item_icon_ka.png"
                          }
                          alt={item.title || "Icon"}
                          className="w-full h-full object-contain"
                          style={getElementStyle(item.iconStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                        />
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start w-full gap-1">
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="self-stretch justify-start text-white text-xl font-bold leading-8 hover:outline-dashed hover:outline-2 hover:outline-white rounded transition-all cursor-text break-keep"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", itemSelectId);
                            }}
                          />
                        )}
                        {!item.descStyle?.isHidden && (
                          <SafeHtml
                            html={item.desc || "프로그램 특징 내용 입력"}
                            className="self-stretch justify-start text-white text-base font-normal leading-6 hover:outline-dashed hover:outline-2 hover:outline-white rounded transition-all cursor-text break-keep"
                            style={getElementStyle(item.descStyle, viewport)}
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

              <div
                className={`w-full xl:w-[560px] shrink-0 cursor-pointer hover:ring-4 hover:ring-white transition-all rounded-2xl overflow-hidden shadow-[24px_12px_16px_0px_rgba(0,0,0,0.20)] z-10 flex justify-center items-center`}
                style={{ height: "auto" }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
              >
                <UniversalMedia
                  url={data.imageUrl}
                  className="w-full h-auto object-contain"
                  alt="banner image"
                  style={getElementStyle(data.imageStyle, viewport)}
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
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10">
            <div className="self-stretch p-5 bg-시안-mode-gray5 rounded-[20px] flex flex-col xl:flex-row justify-start items-start gap-14 w-full">
              <div
                className="w-full xl:w-[600px] self-stretch rounded-2xl overflow-hidden cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                style={{
                  minHeight: "0",
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
                  style={getElementStyle(l2ImageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                />
              </div>

              <div className="flex-1 inline-flex flex-col justify-start items-start gap-10 w-full">
                <div className="self-stretch pt-10 flex flex-col justify-center items-start">
                  {!l2SubTitleStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout2SubTitle ||
                        data.subTitle ||
                        "버지니아 해안 리조트 건설 프로젝트"
                      }
                      className="text-center justify-start text-시안-mode-Primary70 text-xl font-bold font-['Pretendard'] leading-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l2SubTitleStyle, viewport),
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
                      className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                      style={{
                        ...getElementStyle(l2TitleStyle, viewport),
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
                      html={data.layout2Desc || data.desc || "이민 프로그램명 입력"}
                      className="text-center justify-start text-시안-mode-gray95 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(l2DescStyle, viewport),
                        color: "#131416",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout2Desc");
                      }}
                    />
                  )}
                </div>

                <div className="self-stretch flex flex-col xl:flex-row xl:flex-wrap justify-center items-center gap-3 w-full">
                  {(data.items || []).map((item: any, idx: number) => {
                    const itemSelectId = item.id || `__idx_${idx}`;
                    return (
                    <div
                      key={item.id || itemSelectId}
                      className="flex-1 w-full p-6 bg-시안-mode-gray0 rounded-2xl inline-flex flex-col justify-center items-center gap-5"
                    >
                      <div
                        className="w-24 h-24 relative cursor-pointer overflow-hidden transition-all"
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
                            "/images/placeholder/infobanner_item_icon_ka.png"
                              ? ""
                              : item.iconUrl) ||
                            "/images/placeholder/infobanner_layout2_item_icon.png"
                          }
                          alt={`layout2-feature-icon-${idx + 1}`}
                          className="w-full h-full object-contain"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemIcon", itemSelectId);
                          }}
                        />
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-center">
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-시안-mode-Primary70 text-xl font-bold font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text text-center break-keep"
                            style={{
                              ...getElementStyle(item.titleStyle, viewport),
                              color: "#295E92",
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
                            className="justify-start text-시안-mode-gray50 text-base font-normal font-['Pretendard'] leading-6 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text text-center break-keep"
                            style={{
                              ...getElementStyle(item.descStyle, viewport),
                              color: "#6D7882",
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

    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center w-full">
            {/* Top Header Section with overhanging image/card */}
            <div className="self-stretch flex flex-col justify-start items-end w-full">
              <div className="w-full h-auto shrink-0 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all rounded-xl overflow-hidden flex justify-center items-center">
                <UniversalMedia
                  url={data.layout3ImageUrl || data.imageUrl}
                  alt="banner"
                  className="w-full h-auto object-contain"
                  style={getElementStyle(l3ImageStyle, viewport)}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-[70%] z-10"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3ImageUrl");
                  }}
                />
              </div>

              {/* Offset Card Overlapping the Image Slightly */}
              <div className="w-full px-5 xl:px-10 flex flex-col justify-start items-end gap-2.5 -mt-20 z-10 relative">
                <div className="w-full max-w-[680px] p-6 bg-white rounded-2xl shadow-[2px_2px_16px_0px_rgba(0,0,0,0.08)] flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-start w-full">
                    <div className="inline-flex flex-col justify-start items-start">
                      {!l3SubTitleStyle?.isHidden && (
                        <SafeHtml
                          html={data.layout3SubTitle || data.subTitle || "( 서브타이틀 )"}
                          className="justify-start text-blue-500 text-xl font-bold leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                          style={{
                            ...getElementStyle(l3SubTitleStyle, viewport),
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
                          html={data.layout3Title || data.title || "프로그램 특징"}
                          className="justify-start text-시안-mode-gray90 text-3xl font-bold leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full mt-1"
                          style={getElementStyle(l3TitleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("layout3Title");
                          }}
                        />
                      )}
                    </div>

                    <div
                      className="w-14 h-14 relative overflow-hidden cursor-pointer shrink-0"
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

                  {/* Two lines desc mapping items or direct property. (Fallback to first item desc if mapped this way in HTML logic) */}
                  {!l3DescStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.layout3Desc ||
                        data.desc ||
                        "프로그램 특징 내용 입력<br/>2줄 입력"
                      }
                      className="justify-start text-시안-mode-gray50 text-lg font-normal leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full break-keep"
                      style={getElementStyle(l3DescStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout3Desc");
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Content Row */}
            <div className="self-stretch flex flex-col justify-center items-start gap-6 mt-16 w-full">
              {!l3ContentTitleStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout3ContentTitle || data.contentTitle || "서브 타이틀 입력"
                  }
                  className="self-stretch justify-start text-시안-mode-gray90 text-4xl font-medium leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    l3ContentTitleStyle || {
                      fontSize: "36px",
                      color: "#111827",
                    },
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3ContentTitle");
                  }}
                />
              )}
              <div className="w-14 h-1 bg-시안-mode-gray20"></div>
              {!l3ContentDescStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout3ContentDesc ||
                    data.contentDesc ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                  className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    l3ContentDescStyle || {
                      fontSize: "20px",
                      color: "#6b7280",
                    },
                    viewport,
                  )}
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
    const l4ImageStyle = data.layout4ImageUrlStyle || data.imageStyle;

    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch w-full px-[280px] pt-14 pb-28 inline-flex justify-center items-center gap-14">
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
              <div
                className="w-12 h-10 overflow-hidden cursor-pointer"
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
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4TopImageUrl");
                  }}
                />
              </div>
              {!l4TitleStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.layout4Title ||
                    data.title ||
                    "이미 수많은 자산가들은<br/><span class='text-gray-95 text-3xl font-bold font-[&quot;Pretendard&quot;] leading-[48px]'>미국 영주권 취득</span><span class='text-gray-95 text-3xl font-medium font-[&quot;Pretendard&quot;] leading-[48px]'>으로<br/></span><span class='text-gray-95 text-3xl font-bold font-[&quot;Pretendard&quot;] leading-[48px]'>수억 원을 절감</span><span class='text-gray-95 text-3xl font-medium font-[&quot;Pretendard&quot;] leading-[48px]'>하며 미국에서 <br/>자녀를 </span><span class='text-gray-95 text-3xl font-bold font-[&quot;Pretendard&quot;] leading-[48px]'>글로벌 리더</span><span class='text-gray-95 text-3xl font-medium font-[&quot;Pretendard&quot;] leading-[48px]'>로 키우고 있습니다. </span>"
                  }
                  className="justify-start text-gray-95 text-3xl font-medium font-['Pretendard'] leading-[48px]"
                  style={{
                    ...getElementStyle(l4TitleStyle, viewport),
                    color: "#131416",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4Title");
                  }}
                />
              )}
            </div>
            <div className="inline-flex justify-start items-center -space-x-[120px]">
              <div className="relative z-10 w-auto px-6 py-10 bg-시안-mode-gray0 rounded-3xl shadow-[2px_2px_16px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-center items-center gap-4">
                {!l4DescStyle?.isHidden && (
                  <SafeHtml
                    html={
                      data.layout4Desc ||
                      data.desc ||
                      "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ..."
                    }
                    className="justify-start text-zinc-950 text-xl font-medium font-['Pretendard'] leading-8"
                    style={{
                      ...getElementStyle(l4DescStyle, viewport),
                      width: undefined,
                      maxWidth: "none",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout4Desc");
                    }}
                  />
                )}
              </div>
              <div
                className="relative z-0 w-[620px] h-96 rounded-tr-[40px] rounded-bl-[40px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.12)] overflow-hidden cursor-pointer"
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
                  className="w-[620px] h-96 object-cover"
                  style={getElementStyle(l4ImageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout4ImageUrl");
                  }}
                />
              </div>
            </div>
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

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch w-full py-14 flex flex-col justify-start items-center">
            <div
              className="self-stretch px-72 py-28 bg-gradient-to-br from-시안-mode-Primary50 via-시안-mode-subColor30 to-시안-mode-subColor50 flex flex-col justify-start items-start gap-10"
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
                {!l5SubTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout5SubTitle || data.subTitle || "( 서브타이틀 )"}
                    className="justify-start text-gray-0 text-lg font-medium font-['Pretendard'] leading-7"
                    style={{
                      ...getElementStyle(l5SubTitleStyle, viewport),
                      fontSize: "18px",
                      fontWeight: "500",
                      lineHeight: "28px",
                      color: "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5SubTitle");
                    }}
                  />
                )}
                {!l5TitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout5Title || data.title || "타이틀명 입력"}
                    className="justify-start text-gray-0 text-4xl font-bold font-['Pretendard'] leading-[60px]"
                    style={{
                      ...getElementStyle(l5TitleStyle, viewport),
                      fontSize: "36px",
                      fontWeight: "700",
                      lineHeight: "60px",
                      color: "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("layout5Title");
                    }}
                  />
                )}
                {!l5DescStyle?.isHidden && (
                  <SafeHtml
                    html={data.layout5Desc || data.desc || "이민 프로그램명 입력"}
                    className="justify-start text-gray-0 text-xl font-medium font-['Pretendard'] leading-8"
                    style={{
                      ...getElementStyle(l5DescStyle, viewport),
                      fontSize: "20px",
                      fontWeight: "500",
                      lineHeight: "32px",
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
              className={`self-stretch w-full px-72 ${
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
                    ? data.layout5Card1Desc || item?.desc || "영상 소개 문구 적는 곳"
                    : isSecondCard
                      ? data.layout5Card2Desc || item?.desc || "영상 소개 문구 적는 곳"
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
                            style={{
                              ...getElementStyle(titleStyle, viewport),
                              fontSize: "24px",
                              fontWeight: "500",
                              lineHeight: "36px",
                              color: "#060606",
                            }}
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
                            style={{
                              ...getElementStyle(descStyle, viewport),
                              fontSize: "20px",
                              fontWeight: "500",
                              lineHeight: "32px",
                              color: "#6D7882",
                            }}
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
              <div className="w-[620px] aspect-[31/22] rounded-2xl overflow-hidden cursor-pointer">
                <UniversalMedia
                  url={
                    data.layout5ImageUrl ||
                    "/images/placeholder/infobanner_layout5_main_image.jpg"
                  }
                  alt="banner"
                  className="w-full h-full"
                  style={getElementStyle(l5ImageStyle, viewport)}
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
