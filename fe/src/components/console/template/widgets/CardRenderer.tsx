import React from "react";
import { CardListWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
} from "./WidgetUtils";
import { WidgetHeader } from "./WidgetHeader";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 카드 리스트 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - 위젯 메인 타이틀: titleStyle (fontSize: "36px", fontSizeMobile: "28px")
// - 위젯 서브 타이틀: subTitleStyle (fontSize: "18px")
// - 개별 카드 제목: items[].titleStyle (fontSize: "20px")
// - 개별 카드 설명: items[].descStyle (fontSize: "18px")
// - 개별 카드 태그(교육 등): items[].tagStyle (fontSize: "14px")
// - 개별 카드 라벨(NEW 등): items[].labelStyle (fontSize: "16px")
// - 개별 카드 저자/설명(김철수 등): items[].authorStyle (fontSize: "18px")
export const CARD_LIST_DEFAULTS = {
  variant: "image-card",
  layout: "horizontal",
  title: "카드형 리스트 타이틀",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "카드형 리스트의 서브타이틀 영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  itemsPerRow: 3,
  style: { gap: "32px" },
  items: [
    {
      id: "1",
      image: "/images/template/img1.png",
      imageStyle: { borderRadius: "0px" },
      title: "콘텐츠 비즈니스 <br/>설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tag: "교육",
      tagStyle: { color: "#059669", fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        backgroundColor: "#104893",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        borderRadius: "0px",
      },
      author: "새로운 시대를 이끄는 기획자들의 비결",
      authorStyle: { fontSize: "18px", color: "#666666" },
      link: "#",
    },
    {
      id: "2",
      image: "/images/template/img2.png",
      imageStyle: { borderRadius: "0px" },
      title: "콘텐츠 비즈니스 <br/>설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tag: "비즈니스",
      tagStyle: { color: "#059669", fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        backgroundColor: "#104893",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        borderRadius: "0px",
      },
      author: "새로운 시대를 이끄는 기획자들의 비결",
      authorStyle: { fontSize: "18px", color: "#666666" },
      link: "#",
    },
    {
      id: "3",
      image: "/images/template/img3.png",
      imageStyle: { borderRadius: "0px" },
      title: "콘텐츠 비즈니스 <br/>설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tag: "자기계발",
      tagStyle: { color: "#059669", fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        backgroundColor: "#104893",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        borderRadius: "4px",
      },
      author: "새로운 시대를 이끄는 기획자들의 비결",
      authorStyle: { fontSize: "18px", color: "#666666" },
      link: "#",
    },
  ],
};

export const CardRenderer: React.FC<WidgetRendererProps<CardListWidget>> = ({
  widget: w,
  onElementSelect,
  viewport = "desktop",
}) => {
  const style = useWidgetStyle(w.style);

  const isHorizontal = w.data.layout === "horizontal";
  const itemsPerRow = w.data.itemsPerRow || 3;

  // Grid Column Logic
  let gridCols = "grid-cols-1";
  if (viewport === "desktop") {
    if (itemsPerRow === 1) gridCols = "grid-cols-1";
    else if (itemsPerRow === 2) gridCols = "grid-cols-2";
    else if (itemsPerRow === 3) gridCols = "grid-cols-3";
    else gridCols = "grid-cols-4";
  } else if (viewport === "tablet") {
    gridCols = "grid-cols-2";
  }

  const renderCard = (item: any) => {
    const itemImageStyle = getElementStyle(item.imageStyle, viewport as any);
    const cardBorderRadius = item.imageStyle?.borderRadius || "inherit";

    const cardContent = () => {
      if (w.data.variant === "bg-image") {
        const aspectRatio = itemsPerRow >= 4 ? "2/3" : "4/5";
        return (
          <div
            className={`relative overflow-hidden group shadow-sm cursor-pointer w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
            style={{ borderRadius: cardBorderRadius, aspectRatio }}
          >
            <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
              <UniversalMedia
                url={item.image || "/images/template/img1.png"}
                className="w-auto h-auto max-w-full max-h-full transition-transform duration-700 group-hover:scale-105 object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("itemImage", item.id);
                }}
              />
            </div>
            {/* Readability Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 group-hover:from-black/70 transition-all duration-500" />

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-start text-white text-left overflow-hidden">
              <div className="flex-1 flex flex-col gap-1 min-h-0">
                {item.tag && (
                  <SafeHtml
                    html={item.tag}
                    className="tracking-wider font-bold opacity-90 shrink-0"
                    style={{
                      ...getElementStyle(item.tagStyle, viewport as any),
                      color: "#ffffff",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTag", item.id);
                    }}
                  />
                )}
                <SafeHtml
                  html={item.title}
                  className="font-extrabold line-clamp-3 leading-tight shrink-0"
                  style={{
                    ...getElementStyle(item.titleStyle, viewport as any),
                    color: "#ffffff",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("itemTitle", item.id);
                  }}
                />
                <SafeHtml
                  html={item.desc}
                  className="line-clamp-4 opacity-80 overflow-hidden"
                  style={{
                    ...getElementStyle(item.descStyle, viewport as any),
                    color: "#ffffff",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("itemDesc", item.id);
                  }}
                />
              </div>

              <div className="mt-4 flex justify-end shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/40 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all group-hover:scale-110">
                  <span className="material-symbols-outlined text-white group-hover:text-black text-[20px] md:text-[24px]">
                    arrow_outward
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (w.data.variant === "text-card") {
        return (
          <div
            className="bg-white p-8 border border-시안-mode-gray10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col min-h-[220px]"
            style={{ borderRadius: cardBorderRadius }}
          >
            <SafeHtml
              html={item.title}
              className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
              style={getElementStyle(item.titleStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("itemTitle", item.id);
              }}
            />
            <SafeHtml
              html={item.desc}
              className="text-시안-mode-gray50 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded line-clamp-3"
              style={getElementStyle(item.descStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("itemDesc", item.id);
              }}
            />

            <div className="mt-auto flex items-center justify-between">
              {item.label && (
                <div
                  className="bg-[#2B82FF] text-white px-4 py-1.5 text-sm font-bold cursor-pointer"
                  style={getElementStyle(item.labelStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("itemLabel", item.id);
                  }}
                >
                  {item.label}
                </div>
              )}
              <div className="w-[100px] h-auto absolute bottom-2 right-2 opacity-80 pointer-events-none">
                {item.icon ? (
                  <span
                    className="material-symbols-outlined text-[60px] text-blue-100"
                    style={getElementStyle(item.iconStyle, viewport as any)}
                  >
                    {item.icon}
                  </span>
                ) : (
                  <img
                    src="/images/template/icon_house.png"
                    alt="icon"
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col group text-left h-full">
          <div
            className="relative mb-4 overflow-hidden flex justify-center items-center h-auto"
            style={{ borderRadius: cardBorderRadius }}
          >
            <UniversalMedia
              url={item.image || "/images/template/img1.png"}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105 object-contain"
              style={{ width: "100%", height: "auto" }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("itemImage", item.id);
              }}
            />
            {item.label && (
              <div
                className="absolute top-4 left-4 p-[6px_12px] bg-[#104893] text-white font-bold text-[11px] shadow-sm"
                style={getElementStyle(item.labelStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("itemLabel", item.id);
                }}
              >
                {item.label}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {item.tag && (
              <SafeHtml
                html={item.tag}
                className="text-[#059669] font-medium"
                style={getElementStyle(item.tagStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("itemTag", item.id);
                }}
              />
            )}
            <SafeHtml
              html={item.title}
              className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded leading-snug"
              style={getElementStyle(item.titleStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("itemTitle", item.id);
              }}
            />
            {item.author && (
              <SafeHtml
                html={item.author}
                className="text-시안-mode-gray50 text-sm"
                style={getElementStyle(item.authorStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("itemAuthor", item.id);
                }}
              />
            )}
          </div>
        </div>
      );
    };

    if (item.link) {
      return (
        <a key={item.id} href={item.link} className="block h-full no-underline">
          {cardContent()}
        </a>
      );
    }

    return (
      <div key={item.id} className="h-full">
        {cardContent()}
      </div>
    );
  };

  return (
    <section style={style} className="w-full h-auto">
      <div className="mx-auto w-full max-w-[1920px]">
        <div
          className={`flex flex-col gap-[32px] ${isHorizontal && viewport === "desktop" ? "xl:flex-row xl:items-start" : ""}`}
        >
          <WidgetHeader
            title={w.data.title}
            subTitle={w.data.subTitle}
            titleStyle={w.data.titleStyle}
            subTitleStyle={w.data.subTitleStyle}
            viewport={viewport as any}
            onElementSelect={onElementSelect}
            className={`${isHorizontal ? `text-left ${viewport === "desktop" ? "xl:sticky xl:top-[160px] xl:w-[500px]" : ""}` : "text-center mb-10"}`}
          />

          <div
            className={`flex-1 grid ${gridCols}`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "32px" }}
          >
            {w.data.items.map((item) => renderCard(item))}
          </div>
        </div>
      </div>
    </section>
  );
};
