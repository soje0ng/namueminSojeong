import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  mergeTextStyleWithFallback,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
  getPaddingClass,
  getBorderRadiusClass,
  getVerticalPaddingClass,
} from "./WidgetUtils";

export const DEFAULT_LEFT_DESC_ITEMS = [
  { id: "l1", text: "프로그램 특징 내용 입력" },
  { id: "l2", text: "프로그램 특징 내용 입력" },
  { id: "l3", text: "프로그램 특징 내용 입력" },
];
export const DEFAULT_RIGHT_DESC_ITEMS = [
  { id: "r1", text: "프로그램 특징 내용 입력" },
  { id: "r2", text: "프로그램 특징 내용 입력" },
  { id: "r3", text: "프로그램 특징 내용 입력" },
];

export const COMPARISON_CARD_DEFAULTS = {
  layout: "1",
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  subTitle: "( 서브타이틀 )",
  subTitleStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    color: "#285DE1",
    fontWeight: "500",
  },
  desc: "이민 프로그램명 입력",
  descStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    color: "#6D7882",
    fontWeight: "500",
  },
  middleTitle: "비교 head명",
  middleTitleStyle: {
    fontSize: "30px",
    fontSizeMobile: "20px",
    color: "#ffffff",
    fontWeight: "500",
  },
  rowLabelStyle: {
    fontSize: "20px",
    fontSizeMobile: "18px",
    color: "#131416",
    fontWeight: "600",
  },
  leftDescItems: DEFAULT_LEFT_DESC_ITEMS,
  rightDescItems: DEFAULT_RIGHT_DESC_ITEMS,
  items: [
    {
      id: "1",
      iconUrl: "/images/placeholder/card-lg.jpg",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "30px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#131416",
      },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        color: "#6D7882",
        fontWeight: "400",
      },
    },
    {
      id: "2",
      iconUrl:
        "/images/placeholder/imaginary-comparison-right-custom-asset-3f9a21.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "30px",
        fontSizeMobile: "20px",
        fontWeight: "700",
        color: "#ffffff",
      },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        color: "#6D7882",
        fontWeight: "400",
      },
    },
  ],
};

export const ComparisonCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style, viewport as any);
  const data = w.data;
  const layout = data.layout || "1";
  const comparisonImageHeight = formatUnit((data as any).imageHeight);
  const getComparisonImageStyle = (imageStyle: any) => {
    const resolvedStyle = getElementStyle(imageStyle, viewport as any);
    return comparisonImageHeight && !resolvedStyle.height
      ? { ...resolvedStyle, height: comparisonImageHeight }
      : resolvedStyle;
  };
  const getComparisonImageFrameStyle = (imageStyle: any) => ({
    ...(imageStyle?.width ? { width: formatUnit(imageStyle.width) } : {}),
    height: imageStyle?.height || comparisonImageHeight || "auto",
  });
  const getComparisonTextStyle = (
    textStyle: any,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(textStyle, viewport as any),
    ...overrides,
  });
  const getComparisonRootTextStyle = (
    role: "subTitle" | "title" | "desc",
    textStyle: any,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(
      mergeTextStyleWithFallback(textStyle, {
        ...(role === "title"
          ? {
              fontSize: "40px",
              fontSizeMobile: "28px",
            }
          : {
              fontSize: "20px",
              fontSizeMobile: "18px",
            }),
      }),
      viewport as any,
    ),
    ...overrides,
  });
  const getComparisonLayout2TextStyle = (
    role: "itemTitle" | "itemDesc" | "middleTitle" | "rowLabel",
    textStyle: any,
    overrides: React.CSSProperties = {},
  ) => ({
    ...getElementStyle(
      mergeTextStyleWithFallback(textStyle, {
        ...(role === "itemTitle"
          ? {
              fontSize: "30px",
              fontSizeMobile: "20px",
              fontWeight: "700",
            }
          : role === "middleTitle"
            ? {
                fontSize: "30px",
                fontSizeMobile: "20px",
                fontWeight: "500",
              }
            : role === "rowLabel"
              ? {
                  fontSize: "20px",
                  fontSizeMobile: "18px",
                  fontWeight: "600",
                }
              : {
                  fontSize: "20px",
                  fontSizeMobile: "18px",
                  fontWeight: "400",
                }),
      }),
      viewport as any,
    ),
    ...overrides,
  });
  const comparisonRootHeaderClassName = `flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-0" : "gap-3"}`;
  const comparisonLayout2GapClassName = "gap-2.5";
  const comparisonTableCellPaddingClassName = "px-2";
  const getComparisonDescItemRef = (
    side: "left" | "right",
    index: number,
  ) => `${side}:${index}`;
  const openComparisonDescManager = (
    e: React.MouseEvent,
    side: "leftDescItems" | "rightDescItems",
  ) => {
    e.stopPropagation();
    onElementSelect?.(side);
  };
  const openComparisonDescItemEditor = (
    e: React.MouseEvent,
    side: "left" | "right",
    index: number,
  ) => {
    e.stopPropagation();
    onElementSelect?.(
      side === "left" ? "leftDescItems" : "rightDescItems",
      getComparisonDescItemRef(side, index),
    );
  };

  if (layout === "1" || layout === "layout1") {
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;
    const leftDescItems: { id: string; text: string }[] =
      data.leftDescItems || DEFAULT_LEFT_DESC_ITEMS;
    const rightDescItems: { id: string; text: string }[] =
      data.rightDescItems || DEFAULT_RIGHT_DESC_ITEMS;
    const layout1Columns =
      viewport === "desktop" && !!data.reverseLayout
        ? [
            {
              side: "right" as const,
              managerKey: "rightDescItems" as const,
              item: items[1],
              descItems: rightDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[1],
              desktopWidth: "560px",
            },
            {
              side: "left" as const,
              managerKey: "leftDescItems" as const,
              item: items[0],
              descItems: leftDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[0],
              desktopWidth: "440px",
            },
          ]
        : [
            {
              side: "left" as const,
              managerKey: "leftDescItems" as const,
              item: items[0],
              descItems: leftDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[0],
              desktopWidth: "440px",
            },
            {
              side: "right" as const,
              managerKey: "rightDescItems" as const,
              item: items[1],
              descItems: rightDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[1],
              desktopWidth: "560px",
            },
          ];
    const layout1RowCount = Math.max(
      ...layout1Columns.map((column) => column.descItems.length),
      0,
    );
    const layout1GridTemplateColumns =
      viewport === "desktop"
        ? `minmax(0, ${layout1Columns[0].desktopWidth}) 1px minmax(0, ${layout1Columns[1].desktopWidth})`
        : "minmax(0,1fr) minmax(0,1fr)";
    const layout1ColumnGap =
      viewport === "desktop"
        ? w.style?.gap
          ? formatUnit(w.style.gap)
          : "56px"
        : "0px";

    return (
      <section
        style={{
          ...style,
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
        className="w-full h-auto"
      >
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            style={{
              backgroundColor: style?.backgroundColor || "#FFFFFF",
              backgroundImage: style?.backgroundImage || "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-6" : "gap-10"} w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className={comparisonRootHeaderClassName}>
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getComparisonRootTextStyle("subTitle", data.subTitleStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className={`justify-start font-['Pretendard'] ${viewport === "mobile" ? "leading-tight" : "leading-[60px]"} hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep`}
                  style={getComparisonRootTextStyle("title", data.titleStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getComparisonRootTextStyle("desc", data.descStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div className="self-stretch flex flex-col justify-start items-center w-full">
              <div
                className="self-stretch"
                style={{
                  display: "grid",
                  gridTemplateColumns: layout1GridTemplateColumns,
                  columnGap: layout1ColumnGap,
                  alignItems: "stretch",
                  width: viewport === "desktop" ? "fit-content" : "100%",
                  maxWidth: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {layout1Columns.map((column, idx) => (
                  <React.Fragment key={column.side}>
                    <div className="min-w-0 inline-flex flex-col justify-center items-center w-full">
                      <div
                        className={`self-stretch w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center ${getBorderRadiusClass(viewport, "")}`}
                        style={getComparisonImageFrameStyle(column.item?.imageStyle)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("iconUrl", column.item?.id);
                        }}
                      >
                        <UniversalMedia
                          url={
                            column.item?.iconUrl ||
                            column.item?.icon ||
                            column.item?.image
                          }
                          className="w-full"
                          alt="comparison image"
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            ...getComparisonImageStyle(column.item?.imageStyle),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("iconUrl", column.item?.id);
                          }}
                        />
                      </div>
                      {!column.item?.titleStyle?.isHidden && (
                        <div
                          style={{
                            backgroundColor:
                              getElementStyle(
                                column.item?.titleStyle,
                                viewport as any,
                              ).backgroundColor || undefined,
                            backgroundImage: column.item?.imageUrl
                              ? `url(${column.item.imageUrl})`
                              : column.side === "right" &&
                                  !getElementStyle(
                                    column.item?.titleStyle,
                                    viewport as any,
                                  ).backgroundColor
                                ? "linear-gradient(133deg, var(--mode-Primary50, #285DE1) -2.89%, var(--mode-subColor30, #59A1B9) 48.56%, var(--mode-subColor50, #44A075) 100%)"
                                : "none",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                          className={`self-stretch py-5 ${column.side === "left" ? "bg-시안-mode-gray5" : ""} ${getBorderRadiusClass(viewport, "")} inline-flex justify-center items-center gap-2.5 ${comparisonTableCellPaddingClassName} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("imageUrl", column.item?.id);
                          }}
                        >
                          <SafeHtml
                            html={column.item?.title || "프로그램 특징"}
                            className="text-center justify-center font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                            style={getComparisonTextStyle({
                              ...(column.defaultItem?.titleStyle || {}),
                              ...(column.item?.titleStyle || {}),
                            })}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", column.item?.id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {viewport === "desktop" && idx === 0 && (
                      <div
                        className="self-stretch"
                        style={{
                          width: "1px",
                          background: "var(--gray-20, #CDD1D5)",
                        }}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="self-stretch">
                {Array.from({ length: layout1RowCount }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: layout1GridTemplateColumns,
                      columnGap: layout1ColumnGap,
                      alignItems: "stretch",
                      width: viewport === "desktop" ? "fit-content" : "100%",
                      maxWidth: "100%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    {layout1Columns.map((column, idx) => {
                      const descItem = column.descItems[rowIdx];
                      return (
                        <React.Fragment key={`${column.side}-${rowIdx}`}>
                          <div
                            className={`self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5 ${comparisonTableCellPaddingClassName} cursor-pointer relative min-w-0 group/desc-cell`}
                            onDoubleClick={(e) =>
                              descItem
                                ? openComparisonDescItemEditor(
                                    e,
                                    column.side,
                                    rowIdx,
                                  )
                                : openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                            }
                          >
                            {rowIdx === 0 && (
                              <button
                                type="button"
                                className="absolute top-1 right-1 hidden group-hover/desc-cell:flex items-center bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
                                onClick={(e) =>
                                  openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                                }
                                onDoubleClick={(e) =>
                                  openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                                }
                              >
                                항목 관리
                              </button>
                            )}
                            {descItem ? (
                              <SafeHtml
                                html={descItem.text || "프로그램 특징 내용 입력"}
                                className="text-center justify-start font-['Pretendard'] leading-8 w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getComparisonTextStyle({
                                  ...(column.defaultItem?.descStyle || {}),
                                  ...(column.item?.descStyle || {}),
                                })}
                                onDoubleClick={(e) =>
                                  openComparisonDescItemEditor(
                                    e,
                                    column.side,
                                    rowIdx,
                                  )
                                }
                              />
                            ) : null}
                          </div>
                          {viewport === "desktop" && idx === 0 && (
                            <div
                              className="self-stretch"
                              style={{
                                width: "1px",
                                background: "var(--gray-20, #CDD1D5)",
                              }}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2" || layout === "layout2") {
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;
    const leftDescItems: { id: string; text: string }[] =
      data.leftDescItems || DEFAULT_LEFT_DESC_ITEMS;
    const rightDescItems: { id: string; text: string }[] =
      data.rightDescItems || DEFAULT_RIGHT_DESC_ITEMS;
    const layout2SideColumns =
      viewport === "desktop" && !!data.reverseLayout
        ? [
            {
              side: "right" as const,
              managerKey: "rightDescItems" as const,
              item: items[1],
              descItems: rightDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[1],
              titleClass: "self-stretch py-3 bg-시안-mode-subColor10 border-b border-시안-mode-gray1 inline-flex justify-center items-center",
              useGradientFallback: true,
            },
            {
              side: "left" as const,
              managerKey: "leftDescItems" as const,
              item: items[0],
              descItems: leftDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[0],
              titleClass: "self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center",
              useGradientFallback: false,
            },
          ]
        : [
            {
              side: "left" as const,
              managerKey: "leftDescItems" as const,
              item: items[0],
              descItems: leftDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[0],
              titleClass: "self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center",
              useGradientFallback: false,
            },
            {
              side: "right" as const,
              managerKey: "rightDescItems" as const,
              item: items[1],
              descItems: rightDescItems,
              defaultItem: COMPARISON_CARD_DEFAULTS.items[1],
              titleClass: "self-stretch py-3 bg-시안-mode-subColor10 border-b border-시안-mode-gray1 inline-flex justify-center items-center",
              useGradientFallback: true,
            },
          ];
    const layout2MiddleWidth =
      viewport === "desktop" ? "240px" : viewport === "tablet" ? "200px" : "120px";
    const layout2GridTemplateColumns = `minmax(0,1fr) minmax(0, ${layout2MiddleWidth}) minmax(0,1fr)`;
    const layout2RowLabels: string[] = data.rowLabels || [];
    const layout2RowCount = Math.max(
      leftDescItems.length,
      rightDescItems.length,
      layout2RowLabels.length,
      0,
    );
    const layout2ComparisonAreaStyle =
      viewport === "mobile"
        ? {
            width: "calc(100% + 40px)",
            marginLeft: "-20px",
            marginRight: "-20px",
          }
        : viewport === "tablet"
          ? {
              width: "calc(100% + 48px)",
              marginLeft: "-24px",
              marginRight: "-24px",
            }
          : {};

    return (
      <section
        style={{
          ...style,
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
        className="w-full h-auto"
      >
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            style={{
              backgroundColor: style?.backgroundColor || "#FFFFFF",
              backgroundImage: style?.backgroundImage || "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={`self-stretch ${getPaddingClass(viewport)} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-6" : "gap-10"} w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className={comparisonRootHeaderClassName}>
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={getComparisonRootTextStyle("subTitle", data.subTitleStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className={`justify-start font-['Pretendard'] ${viewport === "mobile" ? "leading-tight" : "leading-[60px]"} hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep`}
                  style={getComparisonRootTextStyle("title", data.titleStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={getComparisonRootTextStyle("desc", data.descStyle)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className={`self-stretch border-t border-시안-mode-gray95 overflow-hidden ${getBorderRadiusClass(viewport, "")}`}
              style={layout2ComparisonAreaStyle}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: layout2GridTemplateColumns,
                  alignItems: "stretch",
                }}
              >
                <div
                  className={`${layout2SideColumns[0].titleClass} ${comparisonLayout2GapClassName} ${comparisonTableCellPaddingClassName} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  style={{
                    gridColumn: "1",
                    gridRow: "1",
                    backgroundImage: layout2SideColumns[0].item?.imageUrl
                      ? `url(${layout2SideColumns[0].item.imageUrl})`
                      : layout2SideColumns[0].useGradientFallback &&
                          !getElementStyle(
                            layout2SideColumns[0].item?.titleStyle,
                            viewport as any,
                          ).backgroundColor
                        ? "linear-gradient(133deg, var(--mode-Primary50, #285DE1) -2.89%, var(--mode-subColor30, #59A1B9) 48.56%, var(--mode-subColor50, #44A075) 100%)"
                        : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor:
                      getElementStyle(
                        layout2SideColumns[0].item?.titleStyle,
                        viewport as any,
                      ).backgroundColor || undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl", layout2SideColumns[0].item?.id);
                  }}
                >
                  <SafeHtml
                    html={layout2SideColumns[0].item?.title || "프로그램 특징"}
                    className="text-center justify-center font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={getComparisonLayout2TextStyle(
                      "itemTitle",
                      layout2SideColumns[0].item?.titleStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", layout2SideColumns[0].item?.id);
                    }}
                  />
                </div>
                <div
                  className={`self-stretch py-3 bg-시안-mode-subColor50 flex justify-center items-center ${comparisonLayout2GapClassName} ${comparisonTableCellPaddingClassName}`}
                  style={{
                    gridColumn: "2",
                    gridRow: "1 / span 2",
                    backgroundColor:
                      getElementStyle(
                        data.middleTitleStyle || {},
                        viewport as any,
                      ).backgroundColor || undefined,
                  }}
                >
                  {!data.middleTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.middleTitle || "비교 head명"}
                      className="text-center justify-start w-full font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-white/50 rounded cursor-text transition-all whitespace-pre-wrap break-all"
                      style={getComparisonLayout2TextStyle(
                        "middleTitle",
                        data.middleTitleStyle || {},
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("middleTitle");
                      }}
                    />
                  )}
                </div>
                <div
                  className={`${layout2SideColumns[1].titleClass} ${comparisonLayout2GapClassName} ${comparisonTableCellPaddingClassName} hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                  style={{
                    gridColumn: "3",
                    gridRow: "1",
                    backgroundImage: layout2SideColumns[1].item?.imageUrl
                      ? `url(${layout2SideColumns[1].item.imageUrl})`
                      : layout2SideColumns[1].useGradientFallback &&
                          !getElementStyle(
                            layout2SideColumns[1].item?.titleStyle,
                            viewport as any,
                          ).backgroundColor
                        ? "linear-gradient(133deg, var(--mode-Primary50, #285DE1) -2.89%, var(--mode-subColor30, #59A1B9) 48.56%, var(--mode-subColor50, #44A075) 100%)"
                        : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor:
                      getElementStyle(
                        layout2SideColumns[1].item?.titleStyle,
                        viewport as any,
                      ).backgroundColor || undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl", layout2SideColumns[1].item?.id);
                  }}
                >
                  <SafeHtml
                    html={layout2SideColumns[1].item?.title || "프로그램 특징"}
                    className="text-center justify-center font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={getComparisonLayout2TextStyle(
                      "itemTitle",
                      layout2SideColumns[1].item?.titleStyle,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", layout2SideColumns[1].item?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center h-auto"
                  style={{
                    gridColumn: "1",
                    gridRow: "2",
                    ...getComparisonImageFrameStyle(
                      layout2SideColumns[0].item?.imageStyle,
                    ),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("iconUrl", layout2SideColumns[0].item?.id);
                  }}
                >
                  <UniversalMedia
                    url={
                      layout2SideColumns[0].item?.iconUrl ||
                      layout2SideColumns[0].item?.icon ||
                      layout2SideColumns[0].item?.image
                    }
                    className="w-full"
                    alt="comparison image"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      ...getComparisonImageStyle(
                        layout2SideColumns[0].item?.imageStyle,
                      ),
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("iconUrl", layout2SideColumns[0].item?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center h-auto"
                  style={{
                    gridColumn: "3",
                    gridRow: "2",
                    ...getComparisonImageFrameStyle(
                      layout2SideColumns[1].item?.imageStyle,
                    ),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("iconUrl", layout2SideColumns[1].item?.id);
                  }}
                >
                  <UniversalMedia
                    url={
                      layout2SideColumns[1].item?.iconUrl ||
                      layout2SideColumns[1].item?.icon ||
                      layout2SideColumns[1].item?.image
                    }
                    className="w-full"
                    alt="comparison image"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      ...getComparisonImageStyle(
                        layout2SideColumns[1].item?.imageStyle,
                      ),
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("iconUrl", layout2SideColumns[1].item?.id);
                    }}
                  />
                </div>
              </div>
              {Array.from({ length: layout2RowCount }).map((_, rowIdx) => {
                const middleRowStyle =
                  data[`rowLabel${rowIdx}Style`] || data.rowLabelStyle || {};
                return (
                  <div
                    key={rowIdx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: layout2GridTemplateColumns,
                      alignItems: "stretch",
                    }}
                  >
                    {layout2SideColumns.map((column, colIdx) => {
                      const descItem = column.descItems[rowIdx];
                      return (
                        <React.Fragment key={`${column.side}-${rowIdx}`}>
                          <div
                            className={`self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center ${comparisonLayout2GapClassName} ${comparisonTableCellPaddingClassName} cursor-pointer relative min-w-0 group/desc-cell`}
                            onDoubleClick={(e) =>
                              descItem
                                ? openComparisonDescItemEditor(
                                    e,
                                    column.side,
                                    rowIdx,
                                  )
                                : openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                            }
                          >
                            {rowIdx === 0 && (
                              <button
                                type="button"
                                className="absolute top-1 right-1 hidden group-hover/desc-cell:flex items-center bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
                                onClick={(e) =>
                                  openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                                }
                                onDoubleClick={(e) =>
                                  openComparisonDescManager(
                                    e,
                                    column.managerKey,
                                  )
                                }
                              >
                                항목 관리
                              </button>
                            )}
                            {descItem ? (
                              <SafeHtml
                                html={descItem.text || "프로그램 특징 내용 입력"}
                                className="text-center justify-start font-['Pretendard'] leading-8 w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getComparisonLayout2TextStyle(
                                  "itemDesc",
                                  column.item?.descStyle,
                                )}
                                onDoubleClick={(e) =>
                                  openComparisonDescItemEditor(
                                    e,
                                    column.side,
                                    rowIdx,
                                  )
                                }
                              />
                            ) : null}
                          </div>
                          {colIdx === 0 && (
                            <div
                              className={`self-stretch py-3 border-b border-시안-mode-gray1 bg-시안-mode-gray5 inline-flex justify-center items-center ${comparisonLayout2GapClassName} ${comparisonTableCellPaddingClassName}`}
                              style={{
                                backgroundColor:
                                  getElementStyle(
                                    middleRowStyle,
                                    viewport as any,
                                  ).backgroundColor || undefined,
                              }}
                            >
                              {!middleRowStyle?.isHidden && (
                                <SafeHtml
                                  html={
                                    layout2RowLabels[rowIdx] ||
                                    "프로그램 특징 내용 입력"
                                  }
                                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all break-keep"
                                  style={getComparisonLayout2TextStyle(
                                    "rowLabel",
                                    middleRowStyle,
                                  )}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "rowLabel",
                                      String(rowIdx),
                                    );
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback
  return null;
};
