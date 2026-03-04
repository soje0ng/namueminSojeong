import React from "react";
import { GridCardWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 그리드 카드 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - 위젯 메인 타이틀: titleStyle (fontSize: "36px", fontSizeMobile: "28px")
// - 위젯 서브 타이틀: subTitleStyle (fontSize: "18px")
// - 개별 카드 제목: items[].titleStyle (fontSize: "20px")
// - 개별 카드 설명: items[].descStyle (fontSize: "18px")
// - 개별 카드 태그(교육 등): items[].tagStyle (fontSize: "14px")
// - 개별 카드 라벨(NEW 등): items[].labelStyle (fontSize: "16px")
export const GRID_CARD_DEFAULTS = {
  variant: "standard",
  layout: "top-title",
  title: "좌측타이틀영역",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "서브타이틀영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  items: [
    {
      id: "1",
      title: "콘텐츠 비즈니스 설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tags: ["교육"],
      tagStyle: { fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        backgroundColor: "#104893",
      },
      image: "/images/template/default_new.jpg",
    },
    {
      id: "2",
      title: "콘텐츠 비즈니스 설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tags: ["비즈니스"],
      tagStyle: { fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        backgroundColor: "#104893",
      },
      image: "/images/template/default_new.jpg",
    },
    {
      id: "3",
      title: "콘텐츠 비즈니스 설계자들 2024",
      titleStyle: { fontSize: "20px", fontWeight: "700" },
      desc: "새로운 시대를 이끄는 기획자들의 비결",
      descStyle: { fontSize: "18px", color: "#666666" },
      tags: ["자기계발"],
      tagStyle: { fontSize: "14px", fontWeight: "700" },
      label: "NEW",
      labelStyle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        backgroundColor: "#104893",
      },
      image: "/images/template/default_new.jpg",
    },
  ],
};

export const GridCardRenderer: React.FC<
  WidgetRendererProps<GridCardWidget>
> = ({ widget: w, onElementSelect, viewport = "desktop" }) => {
  const style = useWidgetStyle(w.style);
  return (
    <section
      style={style}
      className={`w-full h-auto ${w.data.variant === "large" ? "bg-시안-mode-gray5" : ""}`}
    >
      <div className="mx-auto w-full max-w-[1920px] px-[20px] md:px-[40px] xl:px-[260px] pb-[80px] md:pb-[120px]">
        <div
          className={`flex flex-col gap-[24px] ${w.data.layout === "left-title" ? "xl:flex-row xl:items-start xl:gap-0" : ""}`}
        >
          <div
            className={`${w.data.layout === "left-title" ? "text-left xl:sticky xl:top-[160px] xl:w-[500px]" : "text-center"}`}
          >
            <SafeHtml
              html={w.data.title}
              className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
              style={getElementStyle(w.data.titleStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <br />
            <SafeHtml
              html={w.data.subTitle}
              className="pt-[4px] text-[#666666] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
              style={getElementStyle(w.data.subTitleStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
          </div>

          <div
            className={`flex flex-col gap-[24px] ${w.data.layout === "left-title" ? "xl:flex-1" : ""}`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : undefined }}
          >
            <div
              className="flex flex-col gap-[24px]"
              style={{
                gap: w.style?.gap ? formatUnit(w.style.gap) : undefined,
              }}
            >
              {w.data.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-[20px] items-center"
                >
                  <div className="md:w-1/2 w-full flex items-center justify-center relative">
                    <UniversalMedia
                      url={item.image || ""}
                      style={{
                        width: "100%",
                        height: "auto",
                        ...getElementStyle(item.imageStyle, viewport as any),
                      }}
                      alt={item.title}
                      className=""
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("image", item.id);
                      }}
                    />
                    {item.label && (
                      <SafeHtml
                        html={item.label}
                        className="absolute top-4 left-4 p-[6px_12px] bg-[#104893] text-white font-bold text-[16px] shadow-sm hover:outline-dashed hover:outline-2 hover:outline-white/50 cursor-text"
                        style={getElementStyle(
                          item.labelStyle,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemLabel", item.id);
                        }}
                      />
                    )}
                  </div>
                  <div className="md:w-1/2 flex flex-col gap-4 w-full">
                    <div>
                      <SafeHtml
                        html={item.title}
                        className="font-bold hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded leading-tight"
                        style={getElementStyle(
                          item.titleStyle,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemTitle", item.id);
                        }}
                      />
                      <SafeHtml
                        html={item.desc}
                        className="text-시안-mode-gray60 mt-1 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded leading-snug"
                        style={getElementStyle(item.descStyle, viewport as any)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemDesc", item.id);
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag, i) => (
                        <SafeHtml
                          key={i}
                          html={tag}
                          className="border border-[#104893] text-[#104893] px-3 py-1 rounded-full font-bold hover:bg-blue-50 cursor-text"
                          style={getElementStyle(
                            item.tagStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("itemTag", `${item.id}-${i}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
