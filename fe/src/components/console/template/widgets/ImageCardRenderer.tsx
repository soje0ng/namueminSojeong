import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
} from "./WidgetUtils";

export const IMAGE_CARD_DEFAULTS = {
  layout: "1",
  subTitle: "( 서브타이틀 )",
  title: "타이틀명 입력",
  desc: "이민 프로그램명 입력",
  items: [
    {
      id: "img-1",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
    {
      id: "img-2",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
    {
      id: "img-3",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
    {
      id: "img-4",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
    {
      id: "img-5",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
    {
      id: "img-6",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
    },
  ],
};

export const ImageCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);

  const layout = w.data.layout || "1";

  if (layout === "1") {
    return (
      <section style={style} className="w-full">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={getElementStyle(w.data.subTitleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.titleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.descStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* Grid Area */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6 w-full">
            <div
              className={`grid ${
                w.data.itemsPerRow === "1"
                  ? "grid-cols-1"
                  : w.data.itemsPerRow === "3"
                    ? "grid-cols-1 xl:grid-cols-3"
                    : w.data.itemsPerRow === "4"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 xl:grid-cols-2"
              } w-full ${w.data.rowGap || w.style?.gap ? "" : "gap-x-10 gap-y-6"}`}
              style={{
                gap: w.style?.gap
                  ? formatUnit(w.style.gap)
                  : w.data.rowGap
                    ? formatUnit(w.data.rowGap)
                    : undefined,
              }}
            >
              {(w.data.items || []).map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="flex-1 inline-flex flex-col justify-center items-center gap-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                >
                  <UniversalMedia
                    className="self-stretch w-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                    url={item.image}
                    alt="card_image"
                    style={getElementStyle(item.imageStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  />
                  {!item.titleStyle?.isHidden && (
                    <SafeHtml
                      html={item.title || "프로그램 특징"}
                      className="justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={getElementStyle(item.titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemTitle", item.id);
                      }}
                    />
                  )}
                  {!item.descStyle?.isHidden && (
                    <SafeHtml
                      html={item.desc || "프로그램 특징 내용 입력<br/>2줄 입력"}
                      className="text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                      style={getElementStyle(item.descStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemDesc", item.id);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    return (
      <section style={style} className="w-full">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={getElementStyle(w.data.subTitleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.titleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.descStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* Grid Area */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6 w-full">
            <div
              className={`grid ${
                w.data.itemsPerRow === "1"
                  ? "grid-cols-1"
                  : w.data.itemsPerRow === "3"
                    ? "grid-cols-1 xl:grid-cols-3"
                    : w.data.itemsPerRow === "4"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 lg:grid-cols-2"
              } w-full ${w.data.rowGap || w.style?.gap ? "" : "gap-10"}`}
              style={{
                gap: w.style?.gap
                  ? formatUnit(w.style.gap)
                  : w.data.rowGap
                    ? formatUnit(w.data.rowGap)
                    : undefined,
              }}
            >
              {(w.data.items || []).map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="flex-1 inline-flex flex-col justify-center items-center gap-3 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                >
                  <UniversalMedia
                    className="self-stretch w-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                    url={item.image}
                    alt="card_image"
                    style={getElementStyle(item.imageStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  />
                  {!item.titleStyle?.isHidden && (
                    <div className="self-stretch px-5 py-2 bg-시안-mode-Primary70 rounded-[30px] inline-flex justify-center items-center gap-2.5 transition-all">
                      <SafeHtml
                        html={item.title || "프로그램 특징"}
                        className="justify-start text-white text-2xl font-bold font-['Pretendard'] leading-9 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all rounded"
                        style={getElementStyle(item.titleStyle, viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemTitle", item.id);
                        }}
                      />
                    </div>
                  )}
                  <SafeHtml
                    html={item.desc || "프로그램 특징 내용 입력<br/>2줄 입력"}
                    className="text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={getElementStyle(item.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemDesc", item.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    return (
      <section style={style} className="w-full">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={getElementStyle(w.data.subTitleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.titleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.descStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* Grid Area */}
          <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full">
            <div
              className={`grid ${
                w.data.itemsPerRow === "1"
                  ? "grid-cols-1"
                  : w.data.itemsPerRow === "3"
                    ? "grid-cols-1 xl:grid-cols-3"
                    : w.data.itemsPerRow === "4"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 lg:grid-cols-2"
              } w-full ${w.data.rowGap || w.style?.gap ? "" : "gap-5"}`}
              style={{
                gap: w.style?.gap
                  ? formatUnit(w.style.gap)
                  : w.data.rowGap
                    ? formatUnit(w.data.rowGap)
                    : undefined,
              }}
            >
              {(w.data.items || []).map((item: any, idx: number) => {
                // desc 필드를 \n이나 <br/> 기준으로 나눠서 특징 리스트 생성 (기본 3개)
                const descLines = (item.desc || "프로그램 특징 내용 입력")
                  .split(/<br\s*\/?>|\n/gi)
                  .filter((l: string) => l.trim().length > 0);

                return (
                  <div
                    key={item.id || idx}
                    className="flex-1 outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] inline-flex flex-col justify-center items-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all bg-white"
                  >
                    <div
                      className="self-stretch relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                      style={{
                        display: item.imageStyle?.isHidden ? "none" : undefined,
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("image", item.id);
                      }}
                    >
                      <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}

                        className="w-full object-cover"
                        url={item.image}
                        alt="card_image"
                        style={getElementStyle(item.imageStyle, viewport)}
                      />
                      <div className="p-2 left-0 top-0 absolute inline-flex justify-start items-center gap-1">
                        {!item.badgeStyle1?.isHidden && (
                          <SafeHtml
                            html={item.badge1 || "우선심사"}
                            className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center transition-all text-center"
                            style={getElementStyle(item.badgeStyle1, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemBadge1", item.id);
                            }}
                          />
                        )}
                        {!item.badgeStyle2?.isHidden && (
                          <SafeHtml
                            html={item.badge2 || "I-956F"}
                            className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center transition-all text-center"
                            style={getElementStyle(item.badgeStyle2, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemBadge2", item.id);
                            }}
                          />
                        )}
                        {!item.badgeStyle3?.isHidden && (
                          <SafeHtml
                            html={item.badge3 || "높은 고용창출"}
                            className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center transition-all text-center"
                            style={getElementStyle(item.badgeStyle3, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemBadge3", item.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-3 bg-white">
                      <div className="flex flex-col justify-start items-start">
                        {!item.subTitleStyle?.isHidden && (
                          <SafeHtml
                            html={item.subTitle || "( 서브타이틀 )"}
                            className="text-center justify-start text-[#285DE1] text-lg font-medium font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(
                              item.subTitleStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemSubTitle", item.id);
                            }}
                          />
                        )}
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-zinc-950 text-3xl font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
                            }}
                          />
                        )}
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col gap-2">
                          {descLines.length > 0 ? (
                            descLines
                              .slice(0, 3)
                              .map((line: string, lIdx: number) => (
                                <div
                                  key={lIdx}
                                  className="self-stretch inline-flex justify-start items-start"
                                >
                                  {!item.featureLabelStyle?.isHidden && (
                                    <SafeHtml
                                      html={item.featureLabel || "특징 01"}
                                      className="w-24 justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                                      style={getElementStyle(
                                        item.featureLabelStyle,
                                        viewport,
                                      )}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.(
                                          "itemFeatureLabel",
                                          item.id,
                                        );
                                      }}
                                    />
                                  )}
                                  {!item.descStyle?.isHidden && (
                                    <SafeHtml
                                      html={line}
                                      className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                      style={getElementStyle(
                                        item.descStyle,
                                        viewport,
                                      )}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.("itemDesc", item.id);
                                      }}
                                    />
                                  )}
                                </div>
                              ))
                          ) : (
                            <div className="self-stretch inline-flex justify-start items-start">
                              <SafeHtml
                                html={item.featureLabel || "특징 01"}
                                className="w-24 justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                                style={getElementStyle(
                                  item.featureLabelStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemFeatureLabel",
                                    item.id,
                                  );
                                }}
                              />
                              <SafeHtml
                                html="프로그램 특징 내용 입력"
                                className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                style={getElementStyle(
                                  item.descStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", item.id);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "4") {
    return (
      <section style={style} className="w-full">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={getElementStyle(w.data.subTitleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.titleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.descStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* Grid Area */}
          <div
            className={`self-stretch grid ${
              w.data.itemsPerRow === "1"
                ? "grid-cols-1"
                : w.data.itemsPerRow === "3"
                  ? "grid-cols-1 xl:grid-cols-3"
                  : w.data.itemsPerRow === "4"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 lg:grid-cols-2"
            } justify-start items-start content-start w-full ${w.data.rowGap || w.style?.gap ? "" : "gap-5"}`}
            style={{
              gap: w.style?.gap
                ? formatUnit(w.style.gap)
                : w.data.rowGap
                  ? formatUnit(w.data.rowGap)
                  : undefined,
            }}
          >
            {(w.data.items || []).map((item: any, idx: number) => {
              const descLines = (item.desc || "프로그램 특징 내용 입력")
                .split(/<br\s*\/?>|\n/gi)
                .filter((l: string) => l.trim().length > 0);

              return (
                <div
                  key={item.id || idx}
                  className="flex-1 min-w-[300px] xl:min-w-[660px] outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] flex flex-col xl:flex-row justify-center items-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all bg-white"
                >
                  <div
                    className="flex-1 relative overflow-hidden w-full xl:w-auto shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                    style={{
                      display: item.imageStyle?.isHidden ? "none" : undefined,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  >
                    <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}

                      className="w-full object-cover"
                      url={item.image}
                      alt="card_image"
                      style={getElementStyle(item.imageStyle, viewport)}
                    />
                    <div className="p-2 left-0 top-0 absolute inline-flex justify-start items-center gap-1">
                      {!item.badgeStyle1?.isHidden && (
                        <SafeHtml
                          html={item.badge1 || "우선심사"}
                          className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                          style={getElementStyle(item.badgeStyle1, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge1", item.id);
                          }}
                        />
                      )}
                      {!item.badgeStyle2?.isHidden && (
                        <SafeHtml
                          html={item.badge2 || "I-956F"}
                          className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                          style={getElementStyle(item.badgeStyle2, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge2", item.id);
                          }}
                        />
                      )}
                      {!item.badgeStyle3?.isHidden && (
                        <SafeHtml
                          html={item.badge3 || "높은 고용창출"}
                          className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                          style={getElementStyle(item.badgeStyle3, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge3", item.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 bg-white inline-flex flex-col justify-start items-start gap-3 w-full xl:w-auto">
                    <div className="flex flex-col justify-start items-start">
                      {!item.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={item.subTitle || "( 서브타이틀 )"}
                          className="text-center justify-start text-[#285DE1] text-lg font-medium font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                          style={getElementStyle(item.subTitleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemSubTitle", item.id);
                          }}
                        />
                      )}
                      {!item.titleStyle?.isHidden && (
                        <SafeHtml
                          html={item.title || "프로그램 특징"}
                          className="justify-start text-zinc-950 text-3xl font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                          style={getElementStyle(item.titleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemTitle", item.id);
                          }}
                        />
                      )}
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch flex flex-col gap-2">
                        {descLines.length > 0 ? (
                          descLines
                            .slice(0, 3)
                            .map((line: string, lIdx: number) => (
                              <div
                                key={lIdx}
                                className="self-stretch inline-flex justify-start items-start"
                              >
                                {!item.featureLabelStyle?.isHidden && (
                                  <SafeHtml
                                    html={item.featureLabel || "특징 01"}
                                    className="w-24 justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                                    style={getElementStyle(
                                      item.featureLabelStyle,
                                      viewport,
                                    )}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemFeatureLabel",
                                        item.id,
                                      );
                                    }}
                                  />
                                )}
                                {!item.descStyle?.isHidden && (
                                  <SafeHtml
                                    html={line}
                                    className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                    style={getElementStyle(
                                      item.descStyle,
                                      viewport,
                                    )}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.("itemDesc", item.id);
                                    }}
                                  />
                                )}
                              </div>
                            ))
                        ) : (
                          <div className="self-stretch inline-flex justify-start items-start">
                            {!item.featureLabelStyle?.isHidden && (
                              <SafeHtml
                                html={item.featureLabel || "특징 01"}
                                className="w-24 justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                                style={getElementStyle(
                                  item.featureLabelStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemFeatureLabel",
                                    item.id,
                                  );
                                }}
                              />
                            )}
                            {!item.descStyle?.isHidden && (
                              <SafeHtml
                                html="프로그램 특징 내용 입력"
                                className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                style={getElementStyle(
                                  item.descStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", item.id);
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "5") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white border-t border-b border-시안-mode-gray1"
      >
        <div className="max-w-[1920px] mx-auto px-5 xl:px-64 py-20 relative min-h-[800px] flex flex-col items-center gap-10">
          {/* Background Text Overlay */}
          <SafeHtml
            html={w.data.ornamentText || "Beyond<br />Borders"}
            className="hidden xl:block absolute left-[983px] top-[422px] justify-center text-brown-Primary0 text-8xl font-normal font-['Tenor_Sans'] capitalize leading-[100px] opacity-20 hover:opacity-100 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
            style={{
              ...getElementStyle(w.data.ornamentTextStyle, viewport),
              zIndex: 0,
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("ornamentText");
            }}
          />

          <div
            className="w-full grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-20 relative"
            style={{ zIndex: 1 }}
          >
            {(w.data.items || []).slice(0, 4).map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="flex flex-col md:flex-row justify-start items-center hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all bg-white overflow-hidden shadow-sm"
              >
                <div
                  className="w-full md:w-[480px] relative overflow-hidden shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                  style={{
                    display: item.imageStyle?.isHidden ? "none" : undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("image", item.id);
                  }}
                >
                  <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}

                    className="w-full object-cover"
                    url={item.image}
                    alt="card_image"
                    style={getElementStyle(item.imageStyle, viewport)}
                  />
                </div>
                <div className="flex-1 h-80 px-6 py-10 bg-white border-t-2 border-시안-mode-gray95 flex flex-col justify-between items-start overflow-hidden">
                  <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <div className="flex flex-col justify-start items-start">
                        {!item.subTitleStyle?.isHidden && (
                          <SafeHtml
                            html={item.subTitle || "( 서브타이틀 )"}
                            className="text-center justify-start text-[#285DE1] text-lg font-medium font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(
                              item.subTitleStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemSubTitle", item.id);
                            }}
                          />
                        )}
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-zinc-950 text-3xl font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
                            }}
                          />
                        )}
                      </div>
                      {!item.descStyle?.isHidden && (
                        <SafeHtml
                          html={
                            item.desc ||
                            "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다."
                          }
                          className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 line-clamp-2 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                          style={getElementStyle(item.descStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemDesc", item.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-1">
                    {!item.badgeStyle1?.isHidden && (
                      <SafeHtml
                        html={item.badge1 || "우선심사"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                        style={getElementStyle(item.badgeStyle1, viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemBadge1", item.id);
                        }}
                      />
                    )}
                    {!item.badgeStyle2?.isHidden && (
                      <SafeHtml
                        html={item.badge2 || "I-956F"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                        style={getElementStyle(item.badgeStyle2, viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemBadge2", item.id);
                        }}
                      />
                    )}
                    {!item.badgeStyle3?.isHidden && (
                      <SafeHtml
                        html={item.badge3 || "높은 고용창출"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all w-full text-center"
                        style={getElementStyle(item.badgeStyle3, viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemBadge3", item.id);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Floating Image */}
          <div
            className="hidden xl:block absolute left-[1166px] top-[507px] opacity-40 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <img
              className="w-[494px] h-72 object-contain"
              src="/images/placeholder/card-lg.jpg"
              alt="decoration"
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === "6") {
    return (
      <section style={style} className="w-full">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={getElementStyle(w.data.subTitleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.titleStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={getElementStyle(w.data.descStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* List Area */}
          <div className="w-full border-t border-시안-mode-gray95 flex flex-col justify-start items-start">
            {(w.data.items || []).map((item: any, idx: number) => {
              // desc 필드를 줄바꿈 기준으로 분석하여 특징 리스트 생성
              const descLines = (item.desc || "")
                .split(/<br\s*\/?>|\n/gi)
                .filter((l: string) => l.trim().length > 0);
              const mainDescLines = descLines.filter(
                (l: string) => !l.startsWith("- ") && !l.startsWith("• "),
              );
              const featureLines = descLines
                .filter((l: string) => l.startsWith("- ") || l.startsWith("• "))
                .map((l: string) => l.substring(2));

              const displayMainDesc =
                mainDescLines[0] ||
                "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.";
              const displayFeatures =
                featureLines.length > 0
                  ? featureLines
                  : [
                      "프로그램 특징 내용 입력",
                      "프로그램 특징 내용 입력",
                      "프로그램 특징 내용 입력",
                      "프로그램 특징 내용 입력",
                      "프로그램 특징 내용 입력",
                      "프로그램 특징 내용 입력",
                    ];

              return (
                <div
                  key={item.id || idx}
                  className="self-stretch px-5 xl:px-14 py-10 border-b border-시안-mode-gray1 inline-flex flex-col md:flex-row justify-start items-start gap-10 xl:gap-14 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all bg-white"
                >
                  <div className="flex-1 flex justify-start items-start gap-6 xl:gap-10">
                    {/* Number Icon */}
                    <div className="w-14 h-14 bg-시안-mode-Primary5 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-시안-mode-Primary50 flex justify-center items-center gap-2.5 shrink-0">
                      <div className="text-center justify-start text-시안-mode-Primary50 text-xl font-bold font-['Pretendard'] leading-8">
                        {(idx + 1).toString().padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                      {/* Item Title */}
                      {!item.titleStyle?.isHidden && (
                        <div className="self-stretch pb-5 border-b border-시안-mode-gray1 inline-flex justify-start items-start gap-2.5">
                          <SafeHtml
                            html={item.title || "프로그램의 특징을 적는 곳"}
                            className="justify-start text-zinc-950 text-3xl font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(item.titleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
                            }}
                          />
                        </div>
                      )}

                      {/* Item Description & Features */}
                      {!item.descStyle?.isHidden && (
                        <div className="self-stretch pt-5 flex flex-col justify-start items-start">
                          <SafeHtml
                            html={displayMainDesc}
                            className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={getElementStyle(item.descStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemDesc", item.id);
                            }}
                          />

                          <div className="self-stretch pt-5 inline-flex justify-start items-center gap-x-6 gap-y-4 flex-wrap content-center">
                            {displayFeatures
                              .slice(0, 6)
                              .map((feature: string, fIdx: number) => (
                                <div
                                  key={fIdx}
                                  className="min-w-0 md:min-w-[240px] flex justify-start items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-시안-mode-Primary50 rounded shrink-0"></div>
                                  <div className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 flex-1">
                                    <SafeHtml
                                      html={feature}
                                      className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
                                      style={getElementStyle(
                                        item.descStyle,
                                        viewport,
                                      )}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.("itemDesc", item.id);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="w-48 relative overflow-hidden shrink-0 rounded-lg hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                    style={{
                      display: item.imageStyle?.isHidden ? "none" : undefined,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  >
                    <UniversalMedia
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}

                      className="w-full object-cover"
                      url={item.image}
                      alt="card_image"
                      style={getElementStyle(item.imageStyle, viewport)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={style}
      className="w-full text-center py-20 bg-시안-mode-gray5 border-y border-시안-mode-gray20"
    >
      <div className="text-시안-mode-gray40 font-bold mb-2 text-xl">
        이미지 카드 레이아웃 {layout}
      </div>
      <div className="text-시안-mode-gray40 text-sm">
        해당 레이아웃은 준비 중입니다.
      </div>
    </section>
  );
};
