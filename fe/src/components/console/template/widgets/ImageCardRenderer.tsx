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
  getBorderRadiusClass,
} from "./WidgetUtils";

const IMAGE_CARD_TEXT_DEFAULTS = {
  subTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
  },
  titleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
  },
  descStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
  },
  itemSubTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
  },
  itemTitleStyle: {
    fontSize: "30px",
    fontSizeMobile: "24px",
  },
  itemDescStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
  },
  itemFeatureLabelStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
  },
  itemBadgeStyle: {
    fontSize: "14px",
    fontSizeMobile: "14px",
  },
};

const createDefaultImageCardItem = (id: string) => ({
  id,
  image: "/images/placeholder/card-md.jpg",
  title: "프로그램 특징",
  desc: "프로그램 특징 내용 입력<br/>2줄 입력",
  titleStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.itemTitleStyle },
  descStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.itemDescStyle },
  subTitleStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.itemSubTitleStyle },
  featureLabelStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.itemFeatureLabelStyle },
  badgeStyle1: { ...IMAGE_CARD_TEXT_DEFAULTS.itemBadgeStyle },
  badgeStyle2: { ...IMAGE_CARD_TEXT_DEFAULTS.itemBadgeStyle },
  badgeStyle3: { ...IMAGE_CARD_TEXT_DEFAULTS.itemBadgeStyle },
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
});

export const IMAGE_CARD_DEFAULTS = {
  layout: "1",
  itemsPerRow: 3,
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.subTitleStyle },
  title: "타이틀명 입력",
  titleStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.titleStyle },
  desc: "이민 프로그램명 입력",
  descStyle: { ...IMAGE_CARD_TEXT_DEFAULTS.descStyle },
  items: [
    createDefaultImageCardItem("img-1"),
    createDefaultImageCardItem("img-2"),
    createDefaultImageCardItem("img-3"),
    createDefaultImageCardItem("img-4"),
    createDefaultImageCardItem("img-5"),
    createDefaultImageCardItem("img-6"),
  ],
};

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
  const style = useWidgetStyle(w.style);
  const itemsPerRow = Number(w.data.itemsPerRow) || 3;
  const imageCardImageHeight = formatUnit((w.data as any).imageHeight);
  const getTextStyle = (textStyle: any, defaultStyle: any) =>
    getElementStyle(
      {
        ...defaultStyle,
        ...(textStyle || {}),
      },
      viewport,
    );
  const getItemImageStyle = (imageStyle: any) => {
    const resolvedStyle = getElementStyle(imageStyle, viewport);
    return imageCardImageHeight && !resolvedStyle.height
      ? { ...resolvedStyle, height: imageCardImageHeight }
      : resolvedStyle;
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
      ...IMAGE_CARD_TEXT_DEFAULTS.itemBadgeStyle,
      ...(item?.[legacyBadgeStyleKey] || {}),
      ...(item?.[badgeStyleKey] || {}),
    };
    const baseStyle = getElementStyle(mergedBadgeStyle as any, viewport);
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
        }))
      : [];
  };

  if (layout === "1") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full max-w-[1920px] mx-auto`}
        >
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center">
            <SafeHtml
              html={w.data.subTitle || "( 서브타이틀 )"}
              className="text-center justify-start text-시안-mode-Primary50 font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text rounded transition-all"
              style={{
                ...getTextStyle(w.data.subTitleStyle, IMAGE_CARD_TEXT_DEFAULTS.subTitleStyle),
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
                              .map((feature: any, fIdx: number) => (
                                <div
                                  key={fIdx}
                                  className="flex justify-start items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-시안-mode-Primary50 rounded-full shrink-0"></div>
                                  <div className="justify-start text-시안-mode-gray50 font-normal font-['Pretendard'] leading-7 flex-1">
                                    <SafeHtml
                                      html={feature.value}
                                      className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text ${getBorderRadiusClass(viewport, "rounded")} transition-all`}
                                      style={getTextStyle(item.descStyle, IMAGE_CARD_TEXT_DEFAULTS.itemDescStyle)}
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
                              ))}
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
