import React from "react";
import { IconCardWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
  getPaddingClass,
} from "./WidgetUtils";

const getGridColsClass = (
  itemsPerRow?: number,
  viewport?: string,
  defaultCols: number = 3,
) => {
  const cols = itemsPerRow || defaultCols;
  // viewport prop 기반 컬럼 결정 (빌더 프리뷰는 항상 넓은 DOM으로 렌더링됨)
  if (viewport === "mobile") return "grid-cols-1";
  if (viewport === "tablet") {
    if (cols === 1) return "grid-cols-1";
    if (cols >= 4) return "grid-cols-2";
    if (cols >= 3) return "grid-cols-2";
    return "grid-cols-2";
  }
  // desktop (Tailwind 반응형 사용)
  if (cols === 1) return "grid-cols-1";
  if (cols === 2) return "grid-cols-1 xl:grid-cols-2";
  if (cols === 4) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
  return "grid-cols-1 xl:grid-cols-3";
};

const getIconLayoutPlaceholderKey = (
  layout?: string | number,
  variant?: string,
) => {
  const normalizedRaw = String(layout || variant || "1")
    .trim()
    .toLowerCase();
  const digitMatch = normalizedRaw.match(/\d+/);
  const raw = (digitMatch?.[0] ??
    (normalizedRaw === "box" ? "1" : normalizedRaw)) as string;

  const num = Number.parseInt(raw, 10);

  if (Number.isInteger(num) && num >= 1 && num <= 6) return num.toString();
  return "1";
};

const getFixedRowItemWidthStyle = (itemsPerRow: number, gap: string) => {
  const cols = Math.max(1, Number(itemsPerRow) || 1);
  const width = `calc((100% - (${cols} - 1) * ${gap}) / ${cols})`;
  return {
    flex: `0 0 ${width}`,
    maxWidth: width,
  } as React.CSSProperties;
};

export const ICON_CARD_DEFAULTS = {
  variant: "box",
  title: "좌측타이틀영역",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "서브타이틀영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  items: [
    {
      id: "ts-1",
      icon: "/images/placeholder/card_img1.png",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px", color: "#666666" },
    },
    {
      id: "ts-2",
      icon: "/images/placeholder/card_img1.png",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px", color: "#666666" },
    },
    {
      id: "ts-3",
      icon: "/images/placeholder/card_img1.png",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px", color: "#666666" },
    },
    {
      id: "ts-4",
      icon: "/images/placeholder/card_img1.png",
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px", color: "#666666" },
    },
  ],
};

export const ICON_CARD_ITEM_DEFAULT = {
  icon: "/images/placeholder/card_img1.png",
  title: "콘텐츠 비즈니스 설계자들 2024",
  desc: "새로운 시대를 이끄는 기획자들의 비결",
  titleStyle: { fontWeight: "700", fontSize: "20px", fontSizeMobile: "20px" },
  descStyle: { fontSize: "18px", color: "#666666" },
};

export const IconCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as IconCardWidget;
  const style = useWidgetStyle(w.style);
  const iconCardImageHeight = formatUnit((w.data as any).imageHeight);
  const iconPlaceholderLayout = getIconLayoutPlaceholderKey(
    w.data.layout,
    w.data.variant,
  );
  const currentLayout = getIconLayoutPlaceholderKey(
    w.data.layout,
    w.data.variant,
  );
  const isNaturalIconLayout = ["1", "2", "3", "4", "6"].includes(currentLayout);
  const getIconMediaStyle = (iconStyle: any) => ({
    ...(() => {
      const base = getElementStyle(iconStyle, viewport) as any;
      if (!iconStyle?.width) delete base.width;
      if (!iconStyle?.height) delete base.height;
      if (!iconStyle?.objectFit) delete base.objectFit;
      if (["1", "2"].includes(currentLayout)) {
        delete base.borderRadius;
      }
      if (["3", "4", "5", "6"].includes(currentLayout)) {
        delete base.backgroundColor;
        delete base.borderRadius;
        delete base.borderColor;
        delete base.borderWidth;
        delete base.borderStyle;
      }
      return base;
    })(),
    ...(iconCardImageHeight && !iconStyle?.height
      ? { height: iconCardImageHeight }
      : {}),
    ...(isNaturalIconLayout ? {} : { height: "100%" }),
    objectFit: iconStyle?.objectFit || "contain",
  });
  const getIconFrameStyle = (iconStyle: any) => ({
    ...(iconStyle?.width ? { width: formatUnit(iconStyle.width) } : {}),
    ...(iconStyle?.height || iconCardImageHeight
      ? { height: formatUnit(iconStyle?.height || iconCardImageHeight) }
      : {}),
    backgroundColor: iconStyle?.backgroundColor || "transparent",
  });
  const bannerImageStyle = (() => {
    const resolvedStyle = getElementStyle((w.data as any).imageStyle, viewport);
    return iconCardImageHeight && !resolvedStyle.height
      ? { ...resolvedStyle, height: iconCardImageHeight }
      : resolvedStyle;
  })();
  const isLayout1BannerHidden = !!(w.data as any).imageStyle?.isHidden;
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

  if (
    currentLayout === "1" ||
    currentLayout === "layout1" ||
    currentLayout === "box"
  ) {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch w-full ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div className="self-stretch flex flex-col justify-start items-start w-full relative">
            <div className="self-stretch cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all overflow-hidden w-full flex justify-center items-center relative z-0">
              <UniversalMedia
                className="self-stretch w-full h-auto object-contain"
                url={
                  (w.data as any).imageUrl ||
                  "/images/placeholder/icon_card_banner.png"
                }
                alt="banner image"
                style={{
                  height: "auto",
                  ...bannerImageStyle,
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
              />
            </div>
            <div
              className={`self-stretch px-5 md:px-10 grid ${getGridColsClass(
                w.data.itemsPerRow,
                viewport,
              )} ${isLayout1BannerHidden ? "" : "-mt-20"} relative z-10`}
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "20px" }}
            >
              {(w.data.items || []).map((item: any, i: number) => (
                <div
                  key={item.id || i}
                  style={getItemCardBackgroundStyle(item.itemStyle, {
                    backgroundImage:
                      "linear-gradient(to bottom right, #f8fafc, #eff6ff)",
                  })}
                  className="w-full px-5 py-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] inline-flex flex-col justify-center items-center gap-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all relative z-20"
                  onDoubleClick={(e) =>
                    handleItemBackgroundDoubleClick(e, item.id || `__idx_${i}`)
                  }
                >
                  <SafeHtml
                    html={item.title || "프로그램 특징"}
                    className="text-center justify-start text-시안-mode-Primary80 text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.titleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", item.id || i.toString());
                    }}
                  />
                  <div
                    className="relative z-20 bg-시안-mode-gray5 overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center"
                    style={getIconFrameStyle(item.iconStyle)}
                  >
                    <UniversalMedia
                      url={(() => {
                        const currentImg = item.iconUrl || item.icon;
                        if (
                          currentImg &&
                          !currentImg.includes("/images/placeholder/")
                        )
                          return currentImg;
                        return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                      })()}
                      alt="icon"
                      className="max-w-full"
                      naturalSize
                      style={getIconMediaStyle(item.iconStyle)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemIcon", item.id || i.toString());
                      }}
                    />
                  </div>
                  <SafeHtml
                    html={item.desc || "프로그램 특징 내용 입력"}
                    className="text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemDesc", item.id || i.toString());
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

  if (currentLayout === "2") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div
            className={`self-stretch ${getPaddingClass(viewport, "")} bg-시안-mode-gray5 rounded-[20px] grid ${getGridColsClass(w.data.itemsPerRow, viewport, 4)} overflow-hidden`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "0px" }}
          >
            {(w.data.items || []).map((item: any, i: number) => (
              <div
                key={item.id || i}
                className="w-full px-5 py-6 rounded-2xl inline-flex flex-col justify-start items-center gap-3 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                style={getItemCardBackgroundStyle(item.itemStyle)}
                onDoubleClick={(e) =>
                  handleItemBackgroundDoubleClick(e, item.id || `__idx_${i}`)
                }
              >
                <div
                  className="relative bg-시안-mode-gray5 overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center shrink-0"
                  style={getIconFrameStyle(item.iconStyle)}
                >
                  <UniversalMedia
                    url={(() => {
                      const currentImg = item.iconUrl || item.icon;
                      if (
                        currentImg &&
                        !currentImg.includes("/images/placeholder/")
                      )
                        return currentImg;
                      return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                    })()}
                    alt="icon"
                    className="max-w-full"
                    naturalSize
                    style={getIconMediaStyle(item.iconStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemIcon", item.id || i.toString());
                    }}
                  />
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                  <SafeHtml
                    html={item.title || "프로그램 특징"}
                    className="text-center justify-start text-[#285DE1] text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.titleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", item.id || i.toString());
                    }}
                  />
                  <SafeHtml
                    html={item.desc || "프로그램 특징 내용 입력"}
                    className="text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemDesc", item.id || i.toString());
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (currentLayout === "3") {
    const items = w.data.items || [];
    const itemsPerRow = w.data.itemsPerRow || 3;
    const rowItemGap = w.style?.gap ? formatUnit(w.style.gap) : "36px";
    const rowItemWidthStyle = getFixedRowItemWidthStyle(
      itemsPerRow,
      rowItemGap,
    );
    const rows: any[][] = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }

    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div
            className={`self-stretch grid ${getGridColsClass(w.data.itemsPerRow, viewport)}`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "24px" }}
          >
            {(w.data.items || []).map((item: any, i: number) => (
              <div
                key={item.id || i}
                className="w-full px-5 py-8 bg-시안-mode-gray0 rounded-2xl shadow-[2px_2px_12px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-start items-center gap-4 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                style={getItemCardBackgroundStyle(item.itemStyle)}
                onDoubleClick={(e) =>
                  handleItemBackgroundDoubleClick(e, item.id || `__idx_${i}`)
                }
              >
                <SafeHtml
                  html={(item as any).subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                  style={getElementStyle((item as any).subTitleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("itemSubTitle", item.id || i.toString());
                  }}
                />

                <div
                  className="relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center shrink-0"
                  style={getIconFrameStyle(item.iconStyle)}
                >
                  <UniversalMedia
                    url={(() => {
                      const currentImg = item.iconUrl || item.icon;
                      if (
                        currentImg &&
                        !currentImg.includes("/images/placeholder/")
                      )
                        return currentImg;
                      return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                    })()}
                    alt="icon"
                    className="max-w-full"
                    naturalSize
                    style={getIconMediaStyle(item.iconStyle)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemIcon", item.id || i.toString());
                    }}
                  />
                </div>

                <div className="flex flex-col justify-start items-center gap-2">
                  <SafeHtml
                    html={item.title || "프로그램 특징"}
                    className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.titleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", item.id || i.toString());
                    }}
                  />
                  <SafeHtml
                    html={item.desc || "프로그램 특징 내용 입력"}
                    className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded text-center"
                    style={getElementStyle(item.descStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemDesc", item.id || i.toString());
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (currentLayout === "4") {
    const items = w.data.items || [];
    const itemsPerRow = w.data.itemsPerRow || 3;
    const rowItemGap = w.style?.gap ? formatUnit(w.style.gap) : "20px";
    const rowItemWidthStyle = getFixedRowItemWidthStyle(
      itemsPerRow,
      rowItemGap,
    );
    const rows: any[][] = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }

    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div
            className="self-stretch flex flex-col justify-start items-start"
            style={{ gap: w.data.rowGap ? formatUnit(w.data.rowGap) : "24px" }}
          >
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="self-stretch inline-flex justify-start items-center flex-wrap"
                style={{ gap: rowItemGap }}
              >
                {row.map((item: any, i: number) => {
                  const itemIndex = rowIndex * itemsPerRow + i;
                  return (
                    <div
                      key={item.id || itemIndex}
                      className="w-full px-5 py-6 bg-시안-mode-gray5 rounded-2xl flex justify-between items-center gap-4 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                      style={{
                        ...rowItemWidthStyle,
                        ...getItemCardBackgroundStyle(item.itemStyle),
                      }}
                      onDoubleClick={(e) =>
                        handleItemBackgroundDoubleClick(
                          e,
                          item.id || `__idx_${itemIndex}`,
                        )
                      }
                    >
                      <div className="inline-flex flex-col justify-start items-start gap-2 flex-1 min-w-0">
                        <SafeHtml
                          html={item.title || "프로그램 특징"}
                          className="justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                          style={getElementStyle(item.titleStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemTitle",
                              item.id || itemIndex.toString(),
                            );
                          }}
                        />
                        <SafeHtml
                          html={item.desc || "프로그램 특징 내용 입력"}
                          className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                          style={getElementStyle(item.descStyle, viewport)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemDesc",
                              item.id || itemIndex.toString(),
                            );
                          }}
                        />
                      </div>

                      <div
                        className="shrink-0 relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center"
                        style={getIconFrameStyle(item.iconStyle)}
                      >
                        <UniversalMedia
                          url={(() => {
                            const currentImg = item.iconUrl || item.icon;
                            if (
                              currentImg &&
                              !currentImg.includes("/images/placeholder/")
                            )
                              return currentImg;
                            return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                          })()}
                          alt="icon"
                          className="max-w-full"
                          naturalSize
                          style={getIconMediaStyle(item.iconStyle)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemIcon",
                              item.id || itemIndex.toString(),
                            );
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (currentLayout === "5") {
    const items = w.data.items || [];
    const itemsPerRow = w.data.itemsPerRow || 3;
    const rowItemGap = w.style?.gap ? formatUnit(w.style.gap) : "36px";
    const rowItemWidthStyle = getFixedRowItemWidthStyle(
      itemsPerRow,
      rowItemGap,
    );
    const rows: any[][] = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }

    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div
            className={`self-stretch grid ${getGridColsClass(w.data.itemsPerRow, viewport)}`}
            style={{ gap: w.data.rowGap ? formatUnit(w.data.rowGap) : "40px" }}
          >
            {(w.data.items || []).map((item: any, i: number) => (
              <div
                key={item.id || i}
                className="w-full px-5 py-6 bg-시안-mode-gray0 rounded-2xl shadow-[2px_2px_16px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-start items-start gap-4 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                style={getItemCardBackgroundStyle(item.itemStyle)}
                onDoubleClick={(e) =>
                  handleItemBackgroundDoubleClick(e, item.id || `__idx_${i}`)
                }
              >
                <div className="self-stretch inline-flex justify-between items-start">
                  <div className="inline-flex flex-col justify-start items-start">
                    <SafeHtml
                      html={(item as any).subTitle || "( 서브타이틀 )"}
                      className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                      style={getElementStyle(
                        (item as any).subTitleStyle,
                        viewport,
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(
                          "itemSubTitle",
                          item.id || i.toString(),
                        );
                      }}
                    />
                    <SafeHtml
                      html={item.title || "프로그램 특징"}
                      className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                      style={getElementStyle(item.titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemTitle", item.id || i.toString());
                      }}
                    />
                  </div>

                  <div
                    className="w-14 h-14 relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center shrink-0"
                    style={getIconFrameStyle(item.iconStyle)}
                  >
                    <UniversalMedia
                      url={(() => {
                        const currentImg = item.iconUrl || item.icon;
                        if (
                          currentImg &&
                          !currentImg.includes("/images/placeholder/")
                        )
                          return currentImg;
                        return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                      })()}
                      alt="icon"
                      className="w-10 h-10 object-contain"
                      style={getIconMediaStyle(item.iconStyle)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemIcon", item.id || i.toString());
                      }}
                    />
                  </div>
                </div>

                <SafeHtml
                  html={item.desc || "프로그램 특징 내용 입력"}
                  className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded w-full"
                  style={getElementStyle(item.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("itemDesc", item.id || i.toString());
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (currentLayout === "6") {
    return (
      <section style={style} className="w-full">
        <div
          className={`self-stretch ${getPaddingClass(viewport)} py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("style");
          }}
        >
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] text-center break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!(w.data as any).descStyle?.isHidden && (
              <SafeHtml
                html={(w.data as any).desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep mt-2"
                style={getElementStyle((w.data as any).descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div
            className="self-stretch flex flex-col justify-start items-start"
            style={{ gap: w.data.rowGap ? formatUnit(w.data.rowGap) : "24px" }}
          >
            <div
              className={`self-stretch grid ${getGridColsClass(w.data.itemsPerRow, viewport)}`}
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "20px" }}
            >
              {(w.data.items || []).map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="w-full px-5 py-10 bg-시안-mode-gray0 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#E6E8EA] inline-flex flex-col justify-center items-center gap-3 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                  style={getItemCardBackgroundStyle(item.itemStyle)}
                  onDoubleClick={(e) => {
                    handleItemBackgroundDoubleClick(
                      e,
                      item.id || `__idx_${idx}`,
                    );
                  }}
                >
                  <div
                    className="relative overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all flex items-center justify-center"
                    style={getIconFrameStyle(item.iconStyle)}
                  >
                    <UniversalMedia
                      url={(() => {
                        const currentImg = item.iconUrl || item.icon;
                        if (
                          currentImg &&
                          !currentImg.includes("/images/placeholder/")
                        )
                          return currentImg;
                        return `/images/placeholder/card_img${iconPlaceholderLayout}.png`;
                      })()}
                      alt="icon"
                      className="max-w-full"
                      naturalSize
                      style={getIconMediaStyle(item.iconStyle)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(
                          "itemIcon",
                          item.id || idx.toString(),
                        );
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <SafeHtml
                      html={item.title || "프로그램 특징"}
                      className="justify-start text-zinc-950 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                      style={getElementStyle(item.titleStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemTitle", item.id);
                      }}
                    />
                    <SafeHtml
                      html={item.desc || "프로그램 특징 내용 입력"}
                      className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text text-center"
                      style={getElementStyle(item.descStyle, viewport)}
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
        </div>
      </section>
    );
  }

  return (
    <section style={style} className="w-full py-10 text-center">
      아이콘 리스트 레이아웃 {currentLayout} (준비 중)
    </section>
  );
};
