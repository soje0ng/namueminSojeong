import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
  getPaddingClass,
  getVerticalPaddingClass,
  getBorderRadiusClass,
} from "./WidgetUtils";

export const IMAGE_CARD_DEFAULTS = {
  layout: "1",
  itemsPerRow: 3,
  subTitle: "( 서브타이틀 )",
  title: "타이틀명 입력",
  desc: "이민 프로그램명 입력",
  items: [
    {
      id: "img-1",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
    {
      id: "img-2",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
    {
      id: "img-3",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
    {
      id: "img-4",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
    {
      id: "img-5",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
    {
      id: "img-6",
      image: "/images/placeholder/card-md.jpg",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력<br/>2줄 입력",
      features: [
        {
          label: "특징 01",
          value: "프로그램 특징 내용 입력",
        },
        {
          label: "특징 02",
          value: "2줄 입력",
        },
      ],
    },
  ],
};

const IMAGE_CARD_STYLE_DEFAULTS = {
  rootSubTitle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  rootTitle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  rootDesc: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#6D7882",
  },
  itemSubTitle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  itemTitleSmall: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "700",
    color: "#131416",
  },
  itemTitleOverlay: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  itemTitleLarge: {
    fontSize: "30px",
    fontSizeMobile: "24px",
    fontWeight: "700",
    color: "#131416",
  },
  itemDesc: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "400",
    color: "#6D7882",
  },
  featureLabel: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
  featureValue: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    fontWeight: "400",
    color: "#6D7882",
  },
  badge: {
    fontSize: "14px",
    fontWeight: "600",
  },
} as const;

const normalizeImageCardLayout = (layout: any): string => {
  const raw = String(layout || "1").trim();
  return raw.startsWith("layout") ? raw.replace(/^layout/, "") : raw;
};

export const ImageCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style, viewport as any);
  const itemsPerRow = Number(w.data.itemsPerRow) || 3;
  const imageCardImageHeight = formatUnit((w.data as any).imageHeight);
  const getItemImageStyle = (imageStyle: any) => {
    const resolvedStyle = getElementStyle(imageStyle, viewport);
    return imageCardImageHeight && !resolvedStyle.height
      ? { ...resolvedStyle, height: imageCardImageHeight }
      : resolvedStyle;
  };
  const getImageCardTextStyle = (role: string, style?: any) => {
    const fallback =
      role === "itemTitle" && layout === "2"
        ? IMAGE_CARD_STYLE_DEFAULTS.itemTitleOverlay
        : role === "itemTitle" && ["3", "4", "5", "6"].includes(layout)
          ? IMAGE_CARD_STYLE_DEFAULTS.itemTitleLarge
          : role === "itemTitle"
            ? IMAGE_CARD_STYLE_DEFAULTS.itemTitleSmall
            : (IMAGE_CARD_STYLE_DEFAULTS as Record<string, any>)[role] || {};

    return getElementStyle(
      {
        ...fallback,
        ...(style || {}),
      },
      viewport,
    );
  };
  const getItemImageFrameStyle = (imageStyle: any) => ({
    display: imageStyle?.isHidden ? "none" : undefined,
    ...(imageStyle?.width ? { width: formatUnit(imageStyle.width) } : {}),
    ...(imageCardImageHeight && !imageStyle?.height
      ? { height: imageCardImageHeight }
      : {}),
  });
  const getBadgeStyle = (item: any, badgeNum: 1 | 2 | 3) => {
    const badgeStyleKey = `badgeStyle${badgeNum}` as const;
    const legacyBadgeStyleKey = `badge${badgeNum}Style` as const;
    const mergedBadgeStyle = {
      ...(item?.[legacyBadgeStyleKey] || {}),
      ...(item?.[badgeStyleKey] || {}),
    };
    const baseStyle = getImageCardTextStyle("badge", mergedBadgeStyle as any);
    const isHidden =
      (item?.[badgeStyleKey]?.isHidden ??
        item?.[legacyBadgeStyleKey]?.isHidden) === true;

    if (isHidden) return {};

    return {
      ...baseStyle,
      backgroundColor:
        baseStyle.backgroundColor || (badgeNum === 1 ? "#285DE1" : "#F8FAFC"),
      color: baseStyle.color || (badgeNum === 1 ? "#FFFFFF" : "#131416"),
    };
  };

  const layout = normalizeImageCardLayout(w.data.layout || "1");

  const selectCardItem = (itemId?: string, elementKey = "item") => {
    if (!itemId) return;
    onElementSelect?.(elementKey, itemId);
  };
  const getItemCardBackgroundStyle = (
    itemStyle: any,
    baseStyle: React.CSSProperties = {},
  ) => {
    const resolvedStyle = getElementStyle(itemStyle, viewport) as any;
    const mergedBaseStyle = { ...baseStyle } as React.CSSProperties;
    if (resolvedStyle.backgroundColor && !resolvedStyle.backgroundImage) {
      delete (mergedBaseStyle as any).backgroundImage;
      delete (mergedBaseStyle as any).backgroundSize;
      delete (mergedBaseStyle as any).backgroundPosition;
      delete (mergedBaseStyle as any).backgroundRepeat;
    }
    return {
      ...mergedBaseStyle,
      ...(resolvedStyle.backgroundColor
        ? { backgroundColor: resolvedStyle.backgroundColor }
        : {}),
      ...(resolvedStyle.backgroundImage
        ? {
            backgroundImage: resolvedStyle.backgroundImage,
            backgroundSize: resolvedStyle.backgroundSize || "cover",
            backgroundPosition: resolvedStyle.backgroundPosition || "center",
            backgroundRepeat: resolvedStyle.backgroundRepeat || "no-repeat",
          }
        : {}),
    } as React.CSSProperties;
  };
  const handleItemBackgroundDoubleClick = (
    e: React.MouseEvent,
    itemId?: string,
  ) => {
    e.stopPropagation();
    if (!itemId) return;
    onElementSelect?.("itemStyle", itemId);
  };

  const parseFeatureLines = (value: any): string[] => {
    const source = typeof value === "string" ? value : "";
    const lines = source
      .replace(/\r\n?/g, "\n")
      .split(/\n|<br\s*\/?>/gi)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    return lines;
  };

  const getItemFeatureRows = (item: any) => {
    const defaultLabel = (idx: number) =>
      `${item?.featureLabel || "특징"} ${String(idx + 1).padStart(2, "0")}`;

    if (Array.isArray(item.features) && item.features.length > 0) {
      let idx = 0;
      return item.features.flatMap((it: any, featureIdx: number) => {
        if (!it) {
          const empty = {
            label: defaultLabel(idx),
            value: "",
          };
          idx += 1;
          return [empty];
        }

        if (typeof it === "string") {
          const lines = parseFeatureLines(it);
          const sourceLines = lines.length ? lines : [""];

          return sourceLines.map((line: string) => {
            const row = {
              label: defaultLabel(idx),
              value: line,
              labelStyle: undefined,
              valueStyle: undefined,
            };
            idx += 1;
            return row;
          });
        }

        if (typeof it !== "object") return [];

        const lines = parseFeatureLines(it.value);
        const normalizedLines = lines.length ? lines : [""];
        const baseLabel = (it.label || "").trim();

        return normalizedLines.map((line: string, lineIdx: number) => {
          const row = {
            label:
              lineIdx > 0 ? defaultLabel(idx) : baseLabel || defaultLabel(idx),
            value: line,
            labelStyle: it.labelStyle,
            valueStyle: it.valueStyle,
          };
          idx += 1;
          return row;
        });
      });
    }

    const descLines = (item.desc || "프로그램 특징 내용 입력")
      .split(/<br\s*\/?>|\n/gi)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    return descLines.length > 0
      ? descLines.map((line: string, idx: number) => ({
          label: defaultLabel(idx),
          value: line,
          labelStyle: undefined,
          valueStyle: undefined,
        }))
      : [];
  };

  if (layout === "1") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
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
                itemsPerRow === 1
                  ? "grid-cols-1"
                  : itemsPerRow === 3
                    ? "grid-cols-1 xl:grid-cols-3"
                    : itemsPerRow === 4
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
                  className={`flex-1 inline-flex flex-col justify-center items-center gap-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectCardItem(item.id ?? `__idx_${idx}`);
                  }}
                  onDoubleClick={(e) =>
                    handleItemBackgroundDoubleClick(
                      e,
                      item.id ?? `__idx_${idx}`,
                    )
                  }
                >
                  <UniversalMedia
                    className="self-stretch w-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                    url={item.image || item.imageUrl}
                    alt="card_image"
                    style={getItemImageStyle(item.imageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id || idx.toString());
                    }}
                  />
                  {!item.titleStyle?.isHidden && (
                    <SafeHtml
                      html={item.title || "프로그램 특징"}
                      className={`justify-start text-시안-mode-gray95 font-medium font-['Pretendard'] leading-9 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                      style={{
                        ...getImageCardTextStyle("itemTitle", item.titleStyle),
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(
                          "itemTitle",
                          item.id || idx.toString(),
                        );
                      }}
                    />
                  )}
                  {!item.descStyle?.isHidden && (
                    <SafeHtml
                      html={item.desc || "프로그램 특징 내용 입력<br/>2줄 입력"}
                      className={`text-center justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                      style={{
                        ...getImageCardTextStyle("itemDesc", item.descStyle),
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(
                          "itemDesc",
                          item.id || idx.toString(),
                        );
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
        <div
          className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
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
                itemsPerRow === 1
                  ? "grid-cols-1"
                  : itemsPerRow === 3
                    ? "grid-cols-1 xl:grid-cols-3"
                    : itemsPerRow === 4
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
                  className={`flex-1 inline-flex flex-col justify-center items-center gap-3 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectCardItem(item.id ?? `__idx_${idx}`);
                  }}
                  onDoubleClick={(e) =>
                    handleItemBackgroundDoubleClick(
                      e,
                      item.id ?? `__idx_${idx}`,
                    )
                  }
                >
                  <UniversalMedia
                    className="self-stretch w-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all"
                    url={item.image || item.imageUrl}
                    alt="card_image"
                    style={getItemImageStyle(item.imageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id || idx.toString());
                    }}
                  />
                  {!item.titleStyle?.isHidden && (
                    <div
                      className="self-stretch px-5 py-2 rounded-[30px] inline-flex justify-center items-center gap-2.5 transition-all"
                      style={{
                        backgroundColor:
                          item.titleStyle?.backgroundColor || "#295e92",
                      }}
                    >
                      <SafeHtml
                        html={item.title || "프로그램 특징"}
                        className={`justify-start text-white font-bold font-['Pretendard'] leading-9 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all ${getBorderRadiusClass(viewport, "rounded")}`}
                        style={{
                          ...getImageCardTextStyle(
                            "itemTitle",
                            item.titleStyle,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(
                            "itemTitle",
                            item.id || idx.toString(),
                          );
                        }}
                      />
                    </div>
                  )}
                  <SafeHtml
                    html={item.desc || "프로그램 특징 내용 입력<br/>2줄 입력"}
                    className="text-center justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                    style={{
                      ...getImageCardTextStyle("itemDesc", item.descStyle),
                    }}
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
        <div
          className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
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
                itemsPerRow === 1
                  ? "grid-cols-1"
                  : itemsPerRow === 3
                    ? "grid-cols-1 xl:grid-cols-3"
                    : itemsPerRow === 4
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
                const featureRows = getItemFeatureRows(item);

                return (
                  <div
                    key={item.id || idx}
                    className={`flex-1 outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] inline-flex flex-col justify-start items-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer ${getBorderRadiusClass(viewport, "rounded")} transition-all bg-white h-full`}
                    style={getItemCardBackgroundStyle(item.itemStyle)}
                    onClick={(e) => {
                      const cardItemId = item.id ?? `__idx_${idx}`;
                      e.stopPropagation();
                      selectCardItem(
                        cardItemId,
                        layout === "3" ? "itemFeatures" : "item",
                      );
                    }}
                    onDoubleClick={(e) =>
                      handleItemBackgroundDoubleClick(
                        e,
                        item.id ?? `__idx_${idx}`,
                      )
                    }
                  >
                    <div
                      className="self-stretch relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                      style={getItemImageFrameStyle(item.imageStyle)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("image", item.id);
                      }}
                    >
                      <UniversalMedia
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("image", item.id || idx.toString());
                        }}
                        className="w-full object-cover"
                        url={item.image || item.imageUrl}
                        alt="card_image"
                        style={getItemImageStyle(item.imageStyle)}
                      />
                      <div className="p-2 left-0 top-0 absolute inline-flex justify-start items-center gap-1">
                        {!item.badgeStyle1?.isHidden && (
                          <SafeHtml
                            html={item.badge1 || "우선심사"}
                            className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center transition-all text-center"
                            style={{
                              ...getBadgeStyle(item, 1),
                            }}
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
                            style={{
                              ...getBadgeStyle(item, 2),
                            }}
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
                            style={{
                              ...getBadgeStyle(item, 3),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemBadge3", item.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className={`self-stretch ${getPaddingClass(viewport, "")} py-6 flex flex-col justify-start items-start gap-3 bg-white flex-grow`}
                      style={getItemCardBackgroundStyle(item.itemStyle)}
                    >
                      <div className="flex flex-col justify-start items-start">
                        {!item.subTitleStyle?.isHidden && (
                          <SafeHtml
                            html={item.subTitle || "( 서브타이틀 )"}
                            className="text-center justify-start text-[#285DE1] font-medium font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={{
                              ...getImageCardTextStyle(
                                "itemSubTitle",
                                item.subTitleStyle,
                              ),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemSubTitle", item.id);
                            }}
                          />
                        )}
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-zinc-950 font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={{
                              ...getImageCardTextStyle(
                                "itemTitle",
                                item.titleStyle,
                              ),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", item.id);
                            }}
                          />
                        )}
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col gap-2">
                          {featureRows.length > 0 ? (
                            featureRows.slice(0, 3).map(
                              (
                                feature: {
                                  label: string;
                                  value: string;
                                  labelStyle?: any;
                                  valueStyle?: any;
                                },
                                lIdx: number,
                              ) => (
                                <div
                                  key={lIdx}
                                  className="self-stretch inline-flex justify-start items-start"
                                >
                                  {!(
                                    feature.labelStyle?.isHidden ??
                                    item.featureLabelStyle?.isHidden
                                  ) && (
                                    <SafeHtml
                                      html={feature.label}
                                      className={`${(feature.valueStyle?.isHidden ?? item.descStyle?.isHidden) ? "flex-1 min-w-0 w-full" : "w-24 shrink-0"} justify-start text-시안-mode-Primary70 font-medium font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text`}
                                      style={{
                                        ...getImageCardTextStyle(
                                          "featureLabel",
                                          {
                                            ...(item.featureLabelStyle || {}),
                                            ...(feature.labelStyle || {}),
                                          },
                                        ),
                                        ...((feature.valueStyle?.isHidden ??
                                        item.descStyle?.isHidden)
                                          ? { width: "100%" }
                                          : {}),
                                      }}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.(
                                          `itemFeatureLabel:${lIdx}`,
                                          item.id,
                                        );
                                      }}
                                    />
                                  )}
                                  {!(
                                    feature.valueStyle?.isHidden ??
                                    item.descStyle?.isHidden
                                  ) && (
                                    <SafeHtml
                                      html={feature.value}
                                      className={`flex-1 justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                                      style={getImageCardTextStyle(
                                        "featureValue",
                                        {
                                          ...(item.descStyle || {}),
                                          ...(feature.valueStyle || {}),
                                        },
                                      )}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.(
                                          `itemFeatureValue:${lIdx}`,
                                          item.id,
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              ),
                            )
                          ) : (
                            <div className="self-stretch inline-flex justify-start items-start">
                              {!(
                                featureRows[0]?.labelStyle?.isHidden ??
                                item.featureLabelStyle?.isHidden
                              ) && (
                                <SafeHtml
                                  html={
                                    featureRows[0]?.label ||
                                    item.featureLabel ||
                                    "특징 01"
                                  }
                                  className={`${(featureRows[0]?.valueStyle?.isHidden ?? item.descStyle?.isHidden) ? "flex-1 min-w-0 w-full" : "w-24 shrink-0"} justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text`}
                                  style={{
                                    ...getImageCardTextStyle("featureLabel", {
                                      ...(item.featureLabelStyle || {}),
                                      ...(featureRows[0]?.labelStyle || {}),
                                    }),
                                    ...((featureRows[0]?.valueStyle?.isHidden ??
                                    item.descStyle?.isHidden)
                                      ? { width: "100%" }
                                      : {}),
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemFeatureLabel:0",
                                      item.id,
                                    );
                                  }}
                                />
                              )}
                              {!(
                                featureRows[0]?.valueStyle?.isHidden ??
                                item.descStyle?.isHidden
                              ) && (
                                <SafeHtml
                                  html={
                                    featureRows[0]?.value ||
                                    "프로그램 특징 내용 입력"
                                  }
                                  className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                  style={getImageCardTextStyle("featureValue", {
                                    ...(item.descStyle || {}),
                                    ...(featureRows[0]?.valueStyle || {}),
                                  })}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemFeatureValue:0",
                                      item.id,
                                    );
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
        </div>
      </section>
    );
  }

  if (layout === "4") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className={`text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className={`justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text ${getBorderRadiusClass(viewport, "rounded")} transition-all mt-2`}
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className={`text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text ${getBorderRadiusClass(viewport, "rounded")} transition-all mt-2`}
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* Grid Area */}
          <div
            className={`self-stretch grid ${
              itemsPerRow === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
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
              const featureRows = getItemFeatureRows(item);

              return (
                <div
                  key={item.id || idx}
                  className="flex-1 min-w-[300px] xl:min-w-[660px] outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] flex flex-col xl:flex-row justify-center items-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer rounded transition-all bg-white"
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectCardItem(item.id ?? `__idx_${idx}`, "itemFeatures");
                  }}
                  onDoubleClick={(e) =>
                    handleItemBackgroundDoubleClick(
                      e,
                      item.id ?? `__idx_${idx}`,
                    )
                  }
                >
                  <div
                    className="flex-1 relative overflow-hidden w-full xl:w-auto shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                    style={getItemImageFrameStyle(item.imageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  >
                    <UniversalMedia
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("image", item.id || idx.toString());
                      }}
                      className="w-full object-cover"
                      url={item.image || item.imageUrl}
                      alt="card_image"
                      style={getItemImageStyle(item.imageStyle)}
                    />
                    <div className="p-2 left-0 top-0 absolute inline-flex justify-start items-center gap-1">
                      {!item.badgeStyle1?.isHidden && (
                        <SafeHtml
                          html={item.badge1 || "우선심사"}
                          className="px-3 py-2 font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                          style={{
                            ...getBadgeStyle(item, 1),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge1", item.id);
                          }}
                        />
                      )}
                      {!item.badgeStyle2?.isHidden && (
                        <SafeHtml
                          html={item.badge2 || "I-956F"}
                          className="px-3 py-2 font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                          style={getBadgeStyle(item, 2)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge2", item.id);
                          }}
                        />
                      )}
                      {!item.badgeStyle3?.isHidden && (
                        <SafeHtml
                          html={item.badge3 || "높은 고용창출"}
                          className="px-3 py-2 font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                          style={getBadgeStyle(item, 3)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemBadge3", item.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className="flex-1 p-6 bg-white inline-flex flex-col justify-start items-start gap-3 w-full xl:w-auto"
                    style={getItemCardBackgroundStyle(item.itemStyle)}
                  >
                    <div className="flex flex-col justify-start items-start">
                      {!item.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={item.subTitle || "( 서브타이틀 )"}
                          className="text-center justify-start text-[#285DE1] font-medium font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                          style={{
                            ...getImageCardTextStyle(
                              "itemSubTitle",
                              item.subTitleStyle,
                            ),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemSubTitle", item.id);
                          }}
                        />
                      )}
                      {!item.titleStyle?.isHidden && (
                        <SafeHtml
                          html={item.title || "프로그램 특징"}
                          className="justify-start text-zinc-950 font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                          style={{
                            ...getImageCardTextStyle(
                              "itemTitle",
                              item.titleStyle,
                            ),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemTitle", item.id);
                          }}
                        />
                      )}
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch flex flex-col gap-2">
                        {featureRows.length > 0 ? (
                          featureRows.slice(0, 3).map(
                            (
                              feature: {
                                label: string;
                                value: string;
                                labelStyle?: any;
                                valueStyle?: any;
                              },
                              lIdx: number,
                            ) => (
                              <div
                                key={lIdx}
                                className="self-stretch inline-flex justify-start items-start"
                              >
                                {!(
                                  feature.labelStyle?.isHidden ??
                                  item.featureLabelStyle?.isHidden
                                ) && (
                                  <SafeHtml
                                    html={feature.label || "특징 01"}
                                    className={`${(feature.valueStyle?.isHidden ?? item.descStyle?.isHidden) ? "flex-1 min-w-0 w-full" : "w-24 shrink-0"} justify-start text-시안-mode-Primary70 font-medium font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text`}
                                    style={{
                                      ...getImageCardTextStyle("featureLabel", {
                                        ...(item.featureLabelStyle || {}),
                                        ...(feature.labelStyle || {}),
                                      }),
                                      ...((feature.valueStyle?.isHidden ??
                                      item.descStyle?.isHidden)
                                        ? { width: "100%" }
                                        : {}),
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        `itemFeatureLabel:${lIdx}`,
                                        item.id,
                                      );
                                    }}
                                  />
                                )}
                                {!(
                                  feature.valueStyle?.isHidden ??
                                  item.descStyle?.isHidden
                                ) && (
                                  <SafeHtml
                                    html={feature.value || ""}
                                    className={`flex-1 justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} cursor-text transition-all`}
                                    style={{
                                      ...getImageCardTextStyle("featureValue", {
                                        ...(item.descStyle || {}),
                                        ...(feature.valueStyle || {}),
                                      }),
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        `itemFeatureValue:${lIdx}`,
                                        item.id,
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            ),
                          )
                        ) : (
                          <div className="self-stretch inline-flex justify-start items-start">
                            {!(
                              featureRows[0]?.labelStyle?.isHidden ??
                              item.featureLabelStyle?.isHidden
                            ) && (
                              <SafeHtml
                                html={
                                  featureRows[0]?.label ||
                                  item.featureLabel ||
                                  "특징 01"
                                }
                                className={`${(featureRows[0]?.valueStyle?.isHidden ?? item.descStyle?.isHidden) ? "flex-1 min-w-0 w-full" : "w-24 shrink-0"} justify-start text-시안-mode-Primary70 text-lg font-medium font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text`}
                                style={{
                                  ...getImageCardTextStyle("featureLabel", {
                                    ...(item.featureLabelStyle || {}),
                                    ...(featureRows[0]?.labelStyle || {}),
                                  }),
                                  ...((featureRows[0]?.valueStyle?.isHidden ??
                                  item.descStyle?.isHidden)
                                    ? { width: "100%" }
                                    : {}),
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemFeatureLabel:0",
                                    item.id,
                                  );
                                }}
                              />
                            )}
                            {!(
                              featureRows[0]?.valueStyle?.isHidden ??
                              item.descStyle?.isHidden
                            ) && (
                              <SafeHtml
                                html={
                                  featureRows[0]?.value ||
                                  "프로그램 특징 내용 입력"
                                }
                                className="flex-1 justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all"
                                style={{
                                  ...getImageCardTextStyle("featureValue", {
                                    ...(item.descStyle || {}),
                                    ...(featureRows[0]?.valueStyle || {}),
                                  }),
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemFeatureValue:0",
                                    item.id,
                                  );
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
        <div
          className={`max-w-[1920px] mx-auto ${getPaddingClass(viewport, "xl:px-64")} py-20 relative min-h-[800px] flex flex-col items-center gap-10`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          <div
            className="w-full grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-20 relative"
            style={{ zIndex: 1 }}
          >
            {(w.data.items || []).slice(0, 4).map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className={`flex flex-col md:flex-row justify-start items-center hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer ${getBorderRadiusClass(viewport, "rounded")} transition-all bg-white overflow-hidden shadow-sm`}
                style={getItemCardBackgroundStyle(item.itemStyle)}
                onClick={(e) => {
                  e.stopPropagation();
                  selectCardItem(item.id ?? `__idx_${idx}`);
                }}
                onDoubleClick={(e) =>
                  handleItemBackgroundDoubleClick(e, item.id ?? `__idx_${idx}`)
                }
              >
                <div
                  className="w-full md:w-[480px] relative overflow-hidden shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                  style={getItemImageFrameStyle(item.imageStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("image", item.id);
                  }}
                >
                  <UniversalMedia
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id || idx.toString());
                    }}
                    className="w-full object-cover"
                    url={item.image || item.imageUrl}
                    alt="card_image"
                    style={getItemImageStyle(item.imageStyle)}
                  />
                </div>
                <div
                  className="flex-1 h-80 px-6 py-10 border-t-2 border-시안-mode-gray95 flex flex-col justify-between items-start overflow-hidden xl:-ml-[180px] relative z-10 shadow-lg"
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                >
                  {/* Background Pattern Image */}
                  <div
                    className="absolute top-0 right-0 w-full h-full pointer-events-none"
                    style={{
                      backgroundImage: 'url("/images/placeholder/box.png")',
                      backgroundSize: "cover",
                      backgroundPosition: "top right",
                      backgroundRepeat: "no-repeat",
                      zIndex: -1,
                    }}
                  />
                  <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <div className="flex flex-col justify-start items-start">
                        {!item.titleStyle?.isHidden && (
                          <SafeHtml
                            html={item.title || "프로그램 특징"}
                            className="justify-start text-zinc-950 font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={{
                              ...getImageCardTextStyle(
                                "itemTitle",
                                item.titleStyle,
                              ),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "itemTitle",
                                item.id || idx.toString(),
                              );
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
                          className={`self-stretch justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 line-clamp-2 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                          style={getImageCardTextStyle(
                            "itemDesc",
                            item.descStyle,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemDesc",
                              item.id || idx.toString(),
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-1">
                    {!item.badgeStyle1?.isHidden && (
                      <SafeHtml
                        html={item.badge1 || "우선심사"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                        style={getBadgeStyle(item, 1)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemBadge1", item.id);
                        }}
                      />
                    )}
                    {!item.badgeStyle2?.isHidden && (
                      <SafeHtml
                        html={item.badge2 || "I-956F"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                        style={getBadgeStyle(item, 2)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemBadge2", item.id);
                        }}
                      />
                    )}
                    {!item.badgeStyle3?.isHidden && (
                      <SafeHtml
                        html={item.badge3 || "높은 고용창출"}
                        className="px-3 py-2 text-base font-semibold font-['Pretendard'] leading-4 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded-lg flex justify-center items-center gap-2.5 transition-all text-center"
                        style={getBadgeStyle(item, 3)}
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
        </div>
      </section>
    );
  }

  if (layout === "6") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getImageCardTextStyle("rootSubTitle", w.data.subTitleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            <SafeHtml
              html={w.data.title || "타이틀명 입력"}
              className="justify-start text-시안-mode-gray95 font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootTitle", w.data.titleStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <SafeHtml
              html={w.data.desc || "이민 프로그램명 입력"}
              className="text-center justify-start text-시안-mode-gray50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all mt-2"
              style={{
                ...getImageCardTextStyle("rootDesc", w.data.descStyle),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* List Area */}
          <div className="w-full border-t border-시안-mode-gray95 flex flex-col justify-start items-start">
            {(w.data.items || []).map((item: any, idx: number) => {
              const featureRows = getItemFeatureRows(item);

              return (
                <div
                  key={item.id || idx}
                  className={`self-stretch ${getPaddingClass(viewport, "")} py-10 border-b border-시안-mode-gray1 inline-flex flex-col md:flex-row justify-start items-start gap-10 xl:gap-14 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all bg-white`}
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                  onClick={(e) => {
                    const cardItemId = item.id ?? `__idx_${idx}`;
                    e.stopPropagation();
                    selectCardItem(cardItemId, "itemFeatures");
                  }}
                  onDoubleClick={(e) =>
                    handleItemBackgroundDoubleClick(
                      e,
                      item.id ?? `__idx_${idx}`,
                    )
                  }
                >
                  <div className="flex-1 flex justify-start items-start gap-6 xl:gap-10">
                    {/* Number Icon */}
                    <div className="w-14 h-14 bg-시안-mode-Primary5 rounded-full outline outline-1 outline-offset-[-1px] outline-시안-mode-Primary50 flex justify-center items-center gap-2.5 shrink-0">
                      <div className="text-center justify-start text-시안-mode-Primary50 font-bold font-['Pretendard'] leading-8">
                        {(idx + 1).toString().padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                      {/* Item Title */}
                      {!item.titleStyle?.isHidden && (
                        <div className="self-stretch pb-5 border-b border-시안-mode-gray1 inline-flex justify-start items-start gap-2.5">
                          <SafeHtml
                            html={item.title || "프로그램의 특징을 적는 곳"}
                            className="justify-start text-zinc-950 font-bold font-['Pretendard'] leading-10 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                            style={{
                              ...getImageCardTextStyle(
                                "itemTitle",
                                item.titleStyle,
                              ),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "itemTitle",
                                item.id || idx.toString(),
                              );
                            }}
                          />
                        </div>
                      )}

                      {/* Item Description & Features */}
                      {!item.descStyle?.isHidden && (
                        <div className="self-stretch pt-5 flex flex-col justify-start items-start">
                          <SafeHtml
                            html={
                              (item.desc || "").split(/<br\s*\/?>|\n/gi)[0] ||
                              "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다."
                            }
                            className={`self-stretch justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                            style={{
                              ...getImageCardTextStyle(
                                "itemDesc",
                                item.descStyle,
                              ),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "itemDesc",
                                item.id || idx.toString(),
                              );
                            }}
                          />

                          <div className="self-stretch pt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
                            {featureRows
                              .slice(0, 6)
                              .map((feature: any, fIdx: number) =>
                                (feature.valueStyle?.isHidden ??
                                item.descStyle?.isHidden) ? null : (
                                  <div
                                    key={fIdx}
                                    className="flex justify-start items-center gap-2"
                                  >
                                    <div className="w-2 h-2 bg-시안-mode-Primary50 rounded-full shrink-0"></div>
                                    <div className="justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 flex-1">
                                      <SafeHtml
                                        html={feature.value}
                                        className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                                        style={getImageCardTextStyle(
                                          "featureValue",
                                          {
                                            ...(item.descStyle || {}),
                                            ...(feature.valueStyle || {}),
                                          },
                                        )}
                                        onDoubleClick={(e) => {
                                          e.stopPropagation();
                                          onElementSelect?.(
                                            `itemFeatureValue:${fIdx}`,
                                            item.id,
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="w-48 h-48 relative overflow-hidden shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all flex justify-center items-center"
                    style={getItemImageFrameStyle(item.imageStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("image", item.id);
                    }}
                  >
                    <UniversalMedia
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("image", item.id || idx.toString());
                      }}
                      className="w-full h-full object-cover"
                      url={item.image || item.imageUrl}
                      alt="card_image"
                      style={getItemImageStyle(item.imageStyle)}
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
      <div className="text-시안-mode-gray40 font-bold mb-2">
        이미지 카드 레이아웃 {layout}
      </div>
      <div className="text-시안-mode-gray40 text-sm">
        해당 레이아웃은 준비 중입니다.
      </div>
    </section>
  );
};
