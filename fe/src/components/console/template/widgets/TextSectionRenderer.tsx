import React from "react";
import { TextSectionWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
} from "./WidgetUtils";
import { Check } from "lucide-react";
import { WidgetHeader } from "./WidgetHeader";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 텍스트 섹션 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "36px"
// - 모바일 버전: fontSizeMobile: "28px"
export const TEXT_SECTION_DEFAULTS = {
  variant: "sticky-left",
  title: "좌측타이틀영역",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "서브타이틀영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  blocks: [
    {
      id: "b1",
      type: "image",
      url: "/images/placeholder/like_cat.jpg",
      style: { objectFit: "cover" },
    },
    {
      id: "b2",
      type: "text",
      text: "텍스트를 더블클릭해서 마음껏 바꿔보세요! 기획부터 꼼꼼한 유지보수까지, 라이크웹이 늘 곁에서 함께할게요.",
      style: { fontSize: "18px" },
    },
    {
      id: "b3",
      type: "heading",
      text: "라이크웹의 프로젝트명",
      iconType: "check",
      style: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "600" },
    },
    {
      id: "b4",
      type: "text",
      text: "여기서부터 당신의 이야기가 시작돼요. ✨ 기획부터 완성 후 관리까지 모든 과정을 라이크웹이 친절하게 가이드해 드립니다. 더블클릭 한 번으로 문구를 직접 바꿔보세요! 기획에서 유지보수까지 고민할 필요 없도록, 라이크웹이 알아서 다 해드릴게요.",
      style: { fontSize: "18px" },
    },
  ],
};

export const TEXT_SECTION_BLOCK_DEFAULTS = {
  type: "text",
  text: "새로운 텍스트 블록입니다.",
  style: { fontSize: "18px" },
};

export const TextSectionRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as TextSectionWidget;
  const style = useWidgetStyle(w.style);

  const renderBlock = (item: any) => {
    const blockStyle = getElementStyle(item.style, viewport as any);
    switch (item.type) {
      case "heading":
        return (
          <div key={item.id} className="group">
            <div className="flex flex-row items-center gap-[4px] md:gap-[8px]">
              {item.iconType === "check" && (
                <Check className="w-[20px] h-[20px] shrink-0 text-blue-500" />
              )}
              {item.iconType === "circle" && (
                <div className="w-[8px] h-[8px] rounded-full bg-blue-500 mt-[10px] shrink-0" />
              )}
              {item.iconType === "square" && (
                <div className="w-[8px] h-[8px] bg-시안-mode-gray40 mt-[10px] shrink-0" />
              )}
              <SafeHtml
                html={(() => {
                  const html = item.text ?? "";
                  return html.replace(
                    /style\s*=\s*["'][^"']*font-size[^"']*["']/gi,
                    "",
                  );
                })()}
                placeholder="헤드 텍스트를 입력하세요"
                className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                style={blockStyle}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("blockText", item.id);
                }}
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div key={item.id}>
            <SafeHtml
              html={(() => {
                const html = item.text ?? "";
                return html.replace(
                  /style\s*=\s*["'][^"']*font-size[^"']*["']/gi,
                  "",
                );
              })()}
              placeholder="텍스트를 입력하세요"
              className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded whitespace-pre-wrap`}
              style={blockStyle}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("blockText", item.id);
              }}
            />
          </div>
        );
      case "image":
        return (
          <div
            key={item.id}
            className="relative overflow-hidden group cursor-pointer flex justify-center items-center"
          >
            <UniversalMedia
              url={item.url}
              alt="content"
              className="w-full h-auto object-contain transition-transform"
              style={blockStyle}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("blockUrl", item.id);
              }}
            />
            <div className="absolute inset-0 group-hover:outline-dashed group-hover:outline-2 group-hover:outline-blue-400 pointer-events-none" />
          </div>
        );
      case "video":
        return (
          <div
            key={item.id}
            className="relative aspect-[16/9] overflow-hidden shadow-sm group"
          >
            <UniversalMedia
              url={item.url}
              autoPlay={item.autoPlay}
              muted={item.muted}
              style={{ width: "100%", height: "100%" }}
              onDoubleClick={(e: any) => {
                e.stopPropagation();
                onElementSelect?.("blockUrl", item.id);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (w.data.variant === "text2") {
    return (
      <section style={style} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="w-full h-auto flex justify-center items-center overflow-hidden">
            <UniversalMedia
              url={w.data.topImage || ""}
              alt="banner"
              className="w-full h-auto object-contain cursor-pointer"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("topImage");
              }}
            />
          </div>
          <div
            className="-mt-[20px] flex flex-col gap-[16px] px-5 md:px-10 md:-mt-[60px] xl:-mt-[140px] xl:px-72"
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : undefined }}
          >
            {(w.data.items || []).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-[16px] rounded-[30px] bg-[rgba(255,255,255,0.80)] p-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.10)] backdrop-blur md:gap-[24px] md:p-[24px] xl:flex-row xl:items-center xl:p-[40px]"
              >
                <div className="flex flex-col items-start gap-[4px] md:flex-row md:gap-[20px] xl:w-1/3">
                  <SafeHtml
                    html={item.number}
                    placeholder="01"
                    className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.numberStyle, viewport as any)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemNumber", item.id);
                    }}
                  />
                  <SafeHtml
                    html={item.title}
                    placeholder="타이틀을 입력하세요"
                    className="font-bold text-[#104893] md:flex-1 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.titleStyle, viewport as any)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", item.id);
                    }}
                  />
                </div>
                <div className="xl:w-2/3">
                  <SafeHtml
                    html={item.subTitle}
                    placeholder="서브타이틀을 입력하세요"
                    className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.subTitleStyle, viewport as any)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemSubTitle", item.id);
                    }}
                  />
                  <SafeHtml
                    html={item.desc}
                    placeholder="설명을 입력하세요"
                    className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                    style={getElementStyle(item.descStyle, viewport as any)}
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
      </section>
    );
  }

  if (w.data.variant === "text3") {
    return (
      <section style={style} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px] px-5 md:px-10">
          <div
            className={`flex flex-col gap-[16px] ${viewport === "desktop" ? "xl:flex-row xl:items-start xl:gap-0" : "md:gap-[24px]"}`}
          >
            <WidgetHeader
              title={w.data.title}
              subTitle={w.data.subTitle}
              titleStyle={w.data.titleStyle}
              subTitleStyle={w.data.subTitleStyle}
              viewport={viewport as any}
              onElementSelect={onElementSelect}
              className="text-left xl:sticky xl:top-[160px] xl:w-[500px]"
            />

            {/* Right Content Area */}
            <div
              className="flex flex-col gap-[24px] xl:flex-1 xl:gap-[24px]"
              style={{
                gap: w.style?.gap ? formatUnit(w.style.gap) : undefined,
              }}
            >
              {(w.data.items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-[16px] border-t border-[#666] py-[24px] md:flex-row md:gap-[24px]"
                >
                  <div className="flex size-[100px] items-center justify-center rounded-full md:size-[120px] shrink-0 overflow-hidden cursor-pointer flex justify-center items-center h-auto">
                    <UniversalMedia
                      url={(item as any).iconUrl || item.icon || ""}
                      alt="Service"
                      className="w-full h-auto object-contain"
                      style={getElementStyle(item.iconStyle, viewport as any)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemIcon", item.id);
                      }}
                    />
                  </div>
                  <div className="md:flex-1">
                    <div className="flex gap-[8px]">
                      <SafeHtml
                        html={item.number}
                        placeholder="1"
                        className="mt-[2px] size-[24px] rounded-full bg-[#104893] text-center font-[600] leading-[24px] text-white md:mt-[4px] shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                        style={getElementStyle(
                          item.numberStyle,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemNumber", item.id);
                        }}
                      />
                      <SafeHtml
                        html={item.title}
                        placeholder="타이틀을 입력하세요"
                        className="flex-1 font-[600] text-[#104893] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                        style={getElementStyle(
                          item.titleStyle,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("itemTitle", item.id);
                        }}
                      />
                    </div>
                    <SafeHtml
                      html={item.desc}
                      placeholder="설명을 입력하세요"
                      className="pt-[8px] text-[#666666] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                      style={getElementStyle(item.descStyle, viewport as any)}
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
    <section style={style} className="w-full h-auto">
      <div className="mx-auto w-full max-w-[1920px] px-5 md:px-10 text-center">
        <div
          className={`flex flex-col gap-[16px] md:gap-[24px] ${w.data.variant === "sticky-left" && viewport === "desktop" ? "xl:flex-row xl:items-start xl:gap-0" : ""}`}
        >
          <WidgetHeader
            title={w.data.title}
            subTitle={w.data.subTitle}
            titleStyle={w.data.titleStyle}
            subTitleStyle={w.data.subTitleStyle}
            viewport={viewport as any}
            onElementSelect={onElementSelect}
            className={`${w.data.variant === "sticky-left" ? `text-left ${viewport === "desktop" ? "xl:sticky xl:top-[160px] xl:w-[500px]" : ""}` : "text-center mb-10"}`}
          />
          {/* Content List Column */}
          <div
            className={`flex flex-col gap-[16px] md:gap-[24px] text-left ${w.data.variant === "sticky-left" && viewport === "desktop" ? "xl:flex-1" : "w-full max-w-[1000px] mx-auto"}`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : undefined }}
          >
            {w.data.blocks?.map((block) => renderBlock(block))}
          </div>
        </div>
      </div>
    </section>
  );
};
