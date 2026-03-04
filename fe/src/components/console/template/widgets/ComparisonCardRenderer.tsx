import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
} from "./WidgetUtils";

const DEFAULT_LEFT_DESC_ITEMS = [
  { id: "l1", text: "프로그램 특징 내용 입력" },
  { id: "l2", text: "프로그램 특징 내용 입력" },
  { id: "l3", text: "프로그램 특징 내용 입력" },
];
const DEFAULT_RIGHT_DESC_ITEMS = [
  { id: "r1", text: "프로그램 특징 내용 입력" },
  { id: "r2", text: "프로그램 특징 내용 입력" },
  { id: "r3", text: "프로그램 특징 내용 입력" },
];

export const COMPARISON_CARD_DEFAULTS = {
  layout: "1",
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "36px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", color: "#285DE1", fontWeight: "500" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", color: "#6D7882", fontWeight: "500" },
  middleTitle: "비교 head명",
  middleTitleStyle: { fontSize: "30px", color: "#ffffff", fontWeight: "500" },
  rowLabelStyle: { fontSize: "20px", color: "#131416", fontWeight: "600" },
  leftDescItems: DEFAULT_LEFT_DESC_ITEMS,
  rightDescItems: DEFAULT_RIGHT_DESC_ITEMS,
  items: [
    {
      id: "1",
      iconUrl: "/images/placeholder/card-lg.jpg",
      title: "프로그램 특징",
      titleStyle: { fontSize: "30px", fontWeight: "700", color: "#131416" },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: { fontSize: "20px", color: "#6D7882", fontWeight: "400" },
    },
    {
      id: "2",
      iconUrl: "/images/placeholder/section-image.jpg",
      title: "프로그램 특징",
      titleStyle: { fontSize: "30px", fontWeight: "700", color: "#ffffff" },
      desc: "프로그램 특징 내용 입력\n프로그램 특징 내용 입력\n프로그램 특징 내용 입력",
      descStyle: { fontSize: "20px", color: "#6D7882", fontWeight: "400" },
    },
  ],
};

export const ComparisonCardRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";

  if (layout === "1" || layout === "layout1") {
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;
    const leftDescItems: { id: string; text: string }[] =
      data.leftDescItems || DEFAULT_LEFT_DESC_ITEMS;
    const rightDescItems: { id: string; text: string }[] =
      data.rightDescItems || DEFAULT_RIGHT_DESC_ITEMS;

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
            className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center gap-3">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    color: "#285DE1",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.subTitleStyle, viewport as any),
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
                  className="justify-start font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    color: "#131416",
                    fontSize: "36px",
                    fontWeight: "700",
                    ...getElementStyle(data.titleStyle, viewport as any),
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
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    color: "#6D7882",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.descStyle, viewport as any),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className={`self-stretch inline-flex justify-center items-center flex-wrap xl:flex-nowrap ${!!data.reverseLayout ? "xl:flex-row-reverse flex-col-reverse" : "flex-row"}`}
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "56px" }}
            >
              {items.slice(0, 2).map((item: any, idx: number) => (
                <React.Fragment key={item.id || idx}>
                  <div
                    className={`flex-1 inline-flex flex-col justify-center items-center w-full ${idx === 0 ? "max-w-[440px]" : "max-w-[560px]"}`}
                  >
                    <div
                      className="self-stretch w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center"
                      style={{ height: "auto" }}
                    >
                      <UniversalMedia
                        url={item.iconUrl || item.icon || item.image}
                        className="w-full"
                        alt="comparison image"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("iconUrl", item.id);
                        }}
                      />
                    </div>
                    {!item.titleStyle?.isHidden && (
                      <div
                        style={{
                          backgroundColor:
                            getElementStyle(item.titleStyle, viewport as any)
                              .backgroundColor || undefined,
                          backgroundImage: item.imageUrl
                            ? `url(${item.imageUrl})`
                            : idx === 1 &&
                                !getElementStyle(
                                  item.titleStyle,
                                  viewport as any,
                                ).backgroundColor
                              ? "linear-gradient(to bottom right, #3b82f6, #2dd4bf, #22c55e)"
                              : "none",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                        className={`self-stretch py-5 ${idx === 0 ? "bg-시안-mode-gray5" : ""} inline-flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("imageUrl", item.id);
                        }}
                      >
                        <SafeHtml
                          html={item.title || "프로그램 특징"}
                          className={`justify-start font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text`}
                          style={{
                            color: idx === 0 ? "#131416" : "#ffffff",
                            fontSize: "30px",
                            fontWeight: "700",
                            ...getElementStyle(
                              item.titleStyle,
                              viewport as any,
                            ),
                            backgroundColor: "transparent",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemTitle", item.id);
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="self-stretch flex flex-col justify-start items-start w-full group/desc relative hover:outline-dashed hover:outline-2 hover:outline-blue-300 cursor-pointer"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.(
                          idx === 0 ? "leftDescItems" : "rightDescItems",
                        );
                      }}
                    >
                      <span className="absolute top-1 right-1 hidden group-hover/desc:flex items-center bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                        항목 관리
                      </span>
                      {(idx === 0 ? leftDescItems : rightDescItems).map(
                        (descItem) => (
                          <div
                            key={descItem.id}
                            className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                          >
                            <SafeHtml
                              html={descItem.text || "프로그램 특징 내용 입력"}
                              className="text-center justify-start font-['Pretendard'] leading-8 w-full"
                              style={{
                                color: "#6D7882",
                                fontSize: "20px",
                                fontWeight: "400",
                                ...getElementStyle(
                                  item.descStyle,
                                  viewport as any,
                                ),
                                backgroundColor: "transparent",
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  {idx === 0 && (
                    <div
                      className="hidden xl:block shrink-0"
                      style={{
                        background: "var(--gray-20, #CDD1D5)",
                        width: "1px",
                        alignSelf: "stretch",
                        margin: "0 20px",
                      }}
                    ></div>
                  )}
                </React.Fragment>
              ))}
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
            className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center gap-3">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={{
                    color: "#285DE1",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.subTitleStyle, viewport as any),
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
                  className="justify-start font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={{
                    color: "#131416",
                    fontSize: "36px",
                    fontWeight: "700",
                    ...getElementStyle(data.titleStyle, viewport as any),
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
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text break-keep"
                  style={{
                    color: "#6D7882",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.descStyle, viewport as any),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className={`self-stretch border-t border-시안-mode-gray95 inline-flex justify-center items-start overflow-hidden flex-wrap xl:flex-nowrap ${!!data.reverseLayout ? "xl:flex-row-reverse" : "flex-row"}`}
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "0px" }}
            >
              {/* Left Item */}
              <div className="flex-1 inline-flex flex-col justify-center items-center w-full">
                <div
                  className="self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
                  style={{
                    backgroundImage: items[0]?.imageUrl
                      ? `url(${items[0].imageUrl})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor:
                      getElementStyle(items[0]?.titleStyle, viewport as any)
                        .backgroundColor || undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl", items[0]?.id);
                  }}
                >
                  <SafeHtml
                    html={items[0]?.title || "프로그램 특징"}
                    className="justify-start font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={{
                      color: "#6D7882",
                      fontSize: "30px",
                      fontWeight: "700",
                      ...getElementStyle(items[0]?.titleStyle, viewport as any),
                      backgroundColor: "transparent",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", items[0]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center h-auto"
                  style={{ height: "auto" }}
                >
                  <UniversalMedia
                    url={items[0]?.iconUrl || items[0]?.icon || items[0]?.image}
                    className="w-full"
                    alt="left comparison image"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("iconUrl", items[0]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch flex flex-col justify-start items-start w-full group/desc relative hover:outline-dashed hover:outline-2 hover:outline-blue-300 cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("leftDescItems");
                  }}
                >
                  <span className="absolute top-1 right-1 hidden group-hover/desc:flex items-center bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                    항목 관리
                  </span>
                  {leftDescItems.map((descItem) => (
                    <div
                      key={descItem.id}
                      className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                    >
                      <SafeHtml
                        html={descItem.text || "프로그램 특징 내용 입력"}
                        className="text-center justify-start font-['Pretendard'] leading-8 w-full"
                        style={{
                          color: "#6D7882",
                          fontSize: "20px",
                          fontWeight: "400",
                          ...getElementStyle(items[0]?.descStyle, viewport as any),
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Label Column */}
              <div className="hidden xl:inline-flex bg-시안-mode-gray5 flex-col justify-center items-start self-stretch">
                {!data.middleTitleStyle?.isHidden && (
                  <div
                    className="w-60 flex-1 py-3 bg-시안-mode-subColor50 outline outline-1 outline-offset-[-1px] outline-시안-mode-gray1 inline-flex justify-center items-center gap-2.5"
                    style={{
                      backgroundColor:
                        getElementStyle(
                          data.middleTitleStyle || {},
                          viewport as any,
                        ).backgroundColor || undefined,
                    }}
                  >
                    <SafeHtml
                      html={data.middleTitle || "비교 head명"}
                      className="text-center justify-start font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-white/50 rounded cursor-text transition-all break-keep"
                      style={{
                        color: "#ffffff",
                        fontSize: "30px",
                        fontWeight: "500",
                        ...getElementStyle(
                          data.middleTitleStyle || {},
                          viewport as any,
                        ),
                        backgroundColor: "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("middleTitle");
                      }}
                    />
                  </div>
                )}
                <div className="self-stretch flex flex-col justify-start items-start">
                  {(items[0]?.desc || "\n\n")
                    .split("\n")
                    .map((_: any, lIdx: number) => {
                      const dynRowLabelStyle =
                        data[`rowLabel${lIdx}Style`] ||
                        data.rowLabelStyle ||
                        {};

                      if (dynRowLabelStyle?.isHidden) return null;

                      return (
                        <div
                          key={lIdx}
                          className="self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5"
                          style={{
                            backgroundColor:
                              getElementStyle(dynRowLabelStyle, viewport as any)
                                .backgroundColor || undefined,
                          }}
                        >
                          <SafeHtml
                            html={
                              data.rowLabels?.[lIdx] ||
                              "프로그램 특징 내용 입력"
                            }
                            className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text transition-all break-keep"
                            style={{
                              color: "#131416",
                              fontSize: "20px",
                              fontWeight: "600",
                              ...getElementStyle(
                                dynRowLabelStyle,
                                viewport as any,
                              ),
                              backgroundColor: "transparent",
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("rowLabel", String(lIdx));
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Item */}
              <div className="flex-1 inline-flex flex-col justify-center items-center w-full">
                <div
                  className="self-stretch py-3 bg-시안-mode-subColor10 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
                  style={{
                    backgroundImage: items[1]?.imageUrl
                      ? `url(${items[1].imageUrl})`
                      : getElementStyle(items[1]?.titleStyle, viewport as any)
                            .backgroundColor
                        ? "none"
                        : !items[1]?.imageUrl &&
                            !getElementStyle(
                              items[1]?.titleStyle,
                              viewport as any,
                            ).backgroundColor
                          ? "linear-gradient(to bottom right, #3b82f6, #2dd4bf, #22c55e)"
                          : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor:
                      getElementStyle(items[1]?.titleStyle, viewport as any)
                        .backgroundColor || undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl", items[1]?.id);
                  }}
                >
                  <SafeHtml
                    html={items[1]?.title || "프로그램 특징"}
                    className="justify-start font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded cursor-text"
                    style={{
                      color: "#285DE1",
                      fontSize: "30px",
                      fontWeight: "700",
                      ...getElementStyle(items[1]?.titleStyle, viewport as any),
                      backgroundColor: "transparent",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", items[1]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative flex justify-center items-center h-auto"
                  style={{ height: "auto" }}
                >
                  <UniversalMedia
                    url={items[1]?.iconUrl || items[1]?.icon || items[1]?.image}
                    className="w-full"
                    alt="right comparison image"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("iconUrl", items[1]?.id);
                    }}
                  />
                </div>
                <div
                  className="self-stretch flex flex-col justify-start items-start w-full group/desc relative hover:outline-dashed hover:outline-2 hover:outline-blue-300 cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("rightDescItems");
                  }}
                >
                  <span className="absolute top-1 right-1 hidden group-hover/desc:flex items-center bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                    항목 관리
                  </span>
                  {rightDescItems.map((descItem) => (
                    <div
                      key={descItem.id}
                      className="self-stretch py-3 border-b border-시안-mode-gray10 inline-flex justify-center items-center gap-2.5"
                    >
                      <SafeHtml
                        html={descItem.text || "프로그램 특징 내용 입력"}
                        className="text-center justify-start font-['Pretendard'] leading-8 w-full"
                        style={{
                          color: "#6D7882",
                          fontSize: "20px",
                          fontWeight: "400",
                          ...getElementStyle(items[1]?.descStyle, viewport as any),
                          backgroundColor: "transparent",
                        }}
                      />
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

  // Fallback
  return null;
};
