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
  imageUrl: "/images/placeholder/section-image.jpg",
  imageStyle: { objectFit: "cover" },
  items: [
    {
      id: "ib-item-1",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-2",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-3",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "20px", fontWeight: "700", color: "#FFFFFF" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "16px", fontWeight: "400", color: "#FFFFFF" },
    },
    {
      id: "ib-item-4",
      icon: "task_alt",
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
              className={`self-stretch w-full min-h-[600px] px-5 sm:px-10 xl:px-72 py-20 flex flex-col xl:flex-row justify-between items-center xl:items-start gap-10 xl:gap-20 hover:outline-dashed hover:outline-2 hover:outline-blue-300 transition-all cursor-pointer overflow-hidden z-0 ${!data.imageUrl ? "bg-gradient-to-br from-blue-500 via-teal-400 to-green-500" : ""}`}
              style={{
                backgroundColor: style?.backgroundColor,
                backgroundImage: data.imageUrl
                  ? `url(${data.imageUrl})`
                  : style?.backgroundImage,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("imageUrl");
              }}
            >
              {/* Left Column Text & Feature Row */}
              <div className="flex-1 self-stretch flex flex-col justify-between items-start w-full">
                {/* Header Text Group */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3 mb-10 xl:mb-0">
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.subTitle || "Program Name."}
                      className="justify-start text-white text-lg font-normal leading-4 font-['Tenor_Sans'] hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
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
                <div className="self-stretch px-6 py-6 bg-neutral-900/20 rounded-2xl flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3 w-full">
                  {(data.items || []).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex-1 w-full min-w-[200px] rounded-2xl flex flex-col justify-center items-start gap-3 hover:bg-white/5 transition-all p-2"
                    >
                      <div className="w-12 h-12 relative bg-시안-mode-gray10/20 rounded-xl flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white transition-all overflow-hidden">
                        {item.image || item.iconUrl ? (
                          <UniversalMedia
                            url={item.image || item.iconUrl}
                            alt={item.title || "Icon"}
                            className="w-full h-full object-cover"
                            style={getElementStyle(item.iconStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", item.id);
                            }}
                          />
                        ) : (
                          <span
                            className="material-symbols-outlined text-white text-3xl"
                            style={getElementStyle(item.iconStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", item.id);
                            }}
                          >
                            {item.icon || "receipt"}
                          </span>
                        )}
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start w-full gap-1">
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="self-stretch justify-start text-white text-xl font-bold leading-8 hover:outline-dashed hover:outline-2 hover:outline-white rounded transition-all cursor-text break-keep"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
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
                              onElementSelect?.("itemDesc", item.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
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
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10">
            <div className="self-stretch p-5 bg-시안-mode-gray5 rounded-[20px] flex flex-col xl:flex-row justify-start items-start gap-14 shadow-sm w-full">
              <div
                className="w-full xl:w-[600px] relative shrink-0 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all rounded-2xl overflow-hidden flex justify-center items-center h-auto"
                style={{
                  height: "auto",
                  minHeight: "0px",
                }}
              >
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/section-image.jpg"}
                  alt="banner"
                  className="w-full h-auto object-contain"
                  style={getElementStyle(data.imageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
                  }}
                />
              </div>

              <div className="flex-1 inline-flex flex-col justify-start items-start gap-10 w-full">
                <div className="self-stretch pt-2 xl:pt-10 flex flex-col justify-center items-start">
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.subTitle || "버지니아 해안 리조트 건설 프로젝트"
                      }
                      className="justify-start text-blue-600 text-xl font-bold leading-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
                        color: "#285DE1",
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
                      className="justify-start text-시안-mode-gray90 text-4xl font-bold leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all mt-3 cursor-text w-full"
                      style={getElementStyle(data.titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    />
                  )}
                  {!data.descStyle?.isHidden && (
                    <SafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="justify-start text-시안-mode-gray90 text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all mt-1 cursor-text break-keep"
                      style={getElementStyle(data.descStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>

                {/* Feature Cards Rows mapped from items (usually 2-3) */}
                <div className="self-stretch flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 w-full">
                  {(data.items || []).slice(0, 2).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex-1 w-full p-6 bg-white rounded-2xl outline outline-1 outline-시안-mode-gray20 outline-offset-[-1px] inline-flex flex-col justify-center items-center gap-5 hover:shadow-md transition-all"
                    >
                      <div className="w-24 h-24 relative bg-시안-mode-gray5 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-시안-mode-gray10">
                        {item.image || item.iconUrl ? (
                          <UniversalMedia
                            url={item.image || item.iconUrl}
                            alt={item.title || "Icon"}
                            className="w-full h-full object-cover"
                            style={getElementStyle(item.iconStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", item.id);
                            }}
                          />
                        ) : (
                          <span
                            className="material-symbols-outlined text-blue-500 text-4xl"
                            style={getElementStyle(item.iconStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", item.id);
                            }}
                          >
                            {item.icon || "payments"}
                          </span>
                        )}
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-center">
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-blue-600 text-xl font-bold leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text text-center break-keep"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
                            }}
                          />
                        )}
                        {!item.descStyle?.isHidden && (
                          <SafeHtml
                            html={item.desc || "프로그램 특징 내용 입력"}
                            className="justify-start text-시안-mode-gray50 text-base font-normal leading-6 mt-1 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text text-center break-keep"
                            style={getElementStyle(item.descStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemDesc", item.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center w-full">
            {/* Top Header Section with overhanging image/card */}
            <div className="self-stretch flex flex-col justify-start items-end w-full">
              <div className="w-full h-auto shrink-0 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all rounded-xl overflow-hidden flex justify-center items-center">
                <UniversalMedia
                  url={data.imageUrl}
                  alt="banner"
                  className="w-full h-auto object-contain"
                  style={getElementStyle(data.imageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
                  }}
                />
              </div>

              {/* Offset Card Overlapping the Image Slightly */}
              <div className="w-full px-5 xl:px-10 flex flex-col justify-start items-end gap-2.5 -mt-20 z-10 relative">
                <div className="w-full max-w-[680px] p-6 bg-white rounded-2xl shadow-[2px_2px_16px_0px_rgba(0,0,0,0.08)] flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-start w-full">
                    <div className="inline-flex flex-col justify-start items-start">
                      {!data.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={data.subTitle || "( 서브타이틀 )"}
                          className="justify-start text-blue-500 text-xl font-bold leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                          style={{
                            ...getElementStyle(data.subTitleStyle, viewport),
                            color: "#285DE1",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("subTitle");
                          }}
                        />
                      )}
                      {!data.titleStyle?.isHidden && (
                        <SafeHtml
                          html={data.title || "프로그램 특징"}
                          className="justify-start text-시안-mode-gray90 text-3xl font-bold leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full mt-1"
                          style={getElementStyle(data.titleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("title");
                          }}
                        />
                      )}
                    </div>

                    {/* Icon mapping from the first item if exists for visual flair */}
                    {data.items?.[0] && (
                      <div className="w-14 h-14 relative bg-시안-mode-gray5 rounded-full flex items-center justify-center cursor-pointer shadow-sm border border-시안-mode-gray10 shrink-0">
                        {data.items[0].image || data.items[0].iconUrl ? (
                          <UniversalMedia
                            url={data.items[0].image || data.items[0].iconUrl}
                            alt={data.items[0].title || "Icon"}
                            className="w-full h-auto object-contain rounded-full"
                            style={getElementStyle(
                              data.items[0].iconStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", data.items[0].id);
                            }}
                          />
                        ) : (
                          <span
                            className="material-symbols-outlined text-blue-500 text-3xl shrink-0"
                            style={getElementStyle(
                              data.items[0].iconStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemIcon", data.items[0].id);
                            }}
                          >
                            {data.items[0].icon || "apartment"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Two lines desc mapping items or direct property. (Fallback to first item desc if mapped this way in HTML logic) */}
                  {!data.descStyle?.isHidden && (
                    <SafeHtml
                      html={data.desc || "프로그램 특징 내용 입력<br/>2줄 입력"}
                      className="justify-start text-시안-mode-gray50 text-lg font-normal leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full break-keep"
                      style={getElementStyle(data.descStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Content Row */}
            <div className="self-stretch flex flex-col justify-center items-start gap-6 mt-16 w-full">
              {!data.contentTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.contentTitle || "서브 타이틀 입력"}
                  className="self-stretch justify-start text-시안-mode-gray90 text-4xl font-medium leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    data.contentTitleStyle || {
                      fontSize: "36px",
                      color: "#111827",
                    },
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("contentTitle");
                  }}
                />
              )}
              <div className="w-14 h-1 bg-시안-mode-gray20"></div>
              {!data.contentDescStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.contentDesc ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                  className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    data.contentDescStyle || {
                      fontSize: "20px",
                      color: "#6b7280",
                    },
                    viewport,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("contentDesc");
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
    return (
      <section style={style} className="w-full relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 pt-14 pb-28 flex flex-col xl:flex-row justify-center items-center gap-14 w-full">
            {/* Left Header Highlight Text */}
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-5 w-full xl:w-1/2">
              <div className="w-12 h-10 bg-gradient-to-br from-blue-300 to-blue-600 mask-quote">
                <span className="material-symbols-outlined text-[40px] text-blue-500 leading-none">
                  format_quote
                </span>
              </div>
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={
                    data.title ||
                    "이미 수많은 자산가들은<br/><span class='font-bold'>미국 영주권 취득</span>으로<br/><span class='font-bold'>수억 원을 절감</span>하며 미국에서<br/>자녀를 <span class='font-bold'>글로벌 리더</span>로 키우고 있습니다."
                  }
                  className="justify-start text-시안-mode-gray90 text-3xl font-medium leading-[48px] break-keep w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
            </div>

            {/* Right Card with Content Image */}
            <div className="flex flex-col xl:flex-row justify-start items-center w-full xl:w-1/2">
              <div className="px-6 xl:px-8 py-10 xl:py-14 bg-white rounded-3xl xl:rounded-r-none shadow-[2px_2px_16px_0px_rgba(0,0,0,0.08)] flex flex-col justify-center items-center gap-4 z-10 -mb-10 xl:mb-0 xl:-mr-10 xl:-translate-y-4">
                {!data.descStyle?.isHidden && (
                  <SafeHtml
                    html={
                      data.desc ||
                      "매년 최고액 갱신하는 국내 사교육비,<br/>서울대 졸업 후에도 막연한 취업 ..."
                    }
                    className="justify-start text-시안-mode-gray90 text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text text-center break-keep"
                    style={getElementStyle(data.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("desc");
                    }}
                  />
                )}
              </div>
              <div className="w-full xl:w-[620px] h-auto shrink-0 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all shadow-[8px_8px_20px_0px_rgba(0,0,0,0.12)] rounded-3xl xl:rounded-l-none xl:rounded-tr-[40px] xl:rounded-bl-[40px] z-0 overflow-hidden flex justify-center items-center">
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/section-image.jpg"}
                  alt="banner"
                  className="w-full h-auto object-contain"
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

  if (layout === "5") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch py-14 flex flex-col justify-start items-center w-full">
            {/* Top Gradient Header Box - [RESTORED] Original Gradient UI */}
            <div
              className={`self-stretch px-5 xl:px-72 py-20 xl:py-28 flex flex-col justify-start items-start gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-200 ${!data.imageUrl ? "bg-gradient-to-br from-blue-500 via-teal-400 to-green-500" : ""}`}
              style={{
                backgroundColor: style?.backgroundColor,
                backgroundImage: data.imageUrl
                  ? `url(${data.imageUrl})`
                  : style?.backgroundImage,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("imageUrl");
              }}
            >
              <div className="w-full max-w-[1360px] mx-auto flex flex-col justify-center items-start">
                {!data.subTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.subTitle || "( 서브타이틀 )"}
                    className="justify-start text-white text-lg font-medium leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text break-keep"
                    style={{
                      ...getElementStyle(data.subTitleStyle, viewport),
                      color: "#285DE1",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("subTitle");
                    }}
                  />
                )}
                {!data.titleStyle?.isHidden && (
                  <div
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all cursor-text w-full mt-2 mb-2"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("title");
                    }}
                  >
                    <SafeHtml
                      html={data.title || "타이틀명 입력"}
                      className="justify-start text-white text-4xl font-bold leading-[60px] break-keep w-full"
                      style={getElementStyle(data.titleStyle, viewport)}
                    />
                  </div>
                )}
                {!data.descStyle?.isHidden && (
                  <SafeHtml
                    html={data.desc || "이민 프로그램명 입력"}
                    className="justify-start text-white text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-200 rounded transition-all mt-1 cursor-text break-keep"
                    style={getElementStyle(data.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("desc");
                    }}
                  />
                )}
              </div>
            </div>

            {/* Bottom Floating Visual Columns + Main Banner */}
            <div className="self-stretch px-5 xl:px-72 flex flex-col xl:flex-row justify-between items-center xl:items-end w-full max-w-[1920px] mx-auto -mt-10 xl:-mt-16 gap-10 xl:gap-5 z-10">
              {/* Embedded Video Items List -> Mapping items array for 2 small widgets */}
              <div className="flex flex-col sm:flex-row justify-start items-start gap-10 w-full xl:w-auto">
                {(data.items || []).slice(0, 2).map((item: any) => (
                  <div
                    key={item.id}
                    className="w-full sm:w-80 outline outline-1 outline-시안-mode-gray20 outline-offset-[-1px] inline-flex flex-col justify-center items-center gap-4 overflow-hidden bg-white pb-6 shadow-sm hover:shadow-md transition-all rounded-b-2xl"
                  >
                    <div className="self-stretch h-auto relative overflow-hidden cursor-pointer w-full group flex justify-center items-center">
                      <UniversalMedia
                        url={item.image || item.iconUrl}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        alt="video thumbnail"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemIcon", item.id);
                        }}
                      />
                    </div>
                    <div className="self-stretch px-5 flex flex-col justify-start items-start gap-2 w-full">
                      {!item.titleStyle?.isHidden && (
                        <SafeHtml
                          html={item.title || "영상명 입력"}
                          className="justify-start text-시안-mode-gray90 text-2xl font-medium leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full break-keep"
                          style={getElementStyle(item.titleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemTitle", item.id);
                          }}
                        />
                      )}
                      {!item.descStyle?.isHidden && (
                        <SafeHtml
                          html={item.desc || "영상 소개 문구 적는 곳"}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                          style={getElementStyle(item.descStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemDesc", item.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Large Image */}
              <div className="w-full xl:w-[620px] h-auto shrink-0 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all rounded-2xl overflow-hidden shadow-sm flex justify-center items-center">
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/section-image.jpg"}
                  alt="banner"
                  className="w-full h-auto object-contain"
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
