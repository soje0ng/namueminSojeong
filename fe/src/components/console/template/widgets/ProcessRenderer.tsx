import React from "react";
import { ProcessWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  formatUnit,
  UniversalMedia,
} from "./WidgetUtils";
import { Check, ChevronRight, ChevronDown } from "lucide-react";
import { WidgetHeader } from "./WidgetHeader";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 프로세스 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "20px"
// - 모바일 버전: fontSizeMobile: "20px"
export const PROCESS_DEFAULTS = {
  variant: "horizontal",
  title: "좌측타이틀영역",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "서브타이틀영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  steps: [
    {
      id: "1",
      number: "1",
      title: "상담 신청",
      desc: "홈페이지를 통해 상담을 신청합니다.",
      icon: "/images/template/like_cat.jpg",
      label: "평균 1~2일 소요",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px" },
    },
    {
      id: "2",
      number: "2",
      title: "계약 체결",
      desc: "전문가와 상세 상담 후 계약을 체결합니다.",
      icon: "/images/template/like_cat.jpg",
      label: "평균 3~5일 소요",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px" },
    },
    {
      id: "3",
      number: "3",
      title: "서비스 진행",
      desc: "체계적인 절차에 따라 업무를 수행합니다.",
      icon: "/images/template/like_cat.jpg",
      label: "평균 2~4주 소요",
      titleStyle: {
        fontWeight: "700",
        fontSize: "20px",
        fontSizeMobile: "20px",
      },
      descStyle: { fontSize: "18px" },
    },
  ],
};

export const PROCESS_STEP_DEFAULT = {
  number: "01",
  title: "새 단계",
  desc: "설명",
  icon: "/images/template/like_cat.jpg",
  label: "안내 문구",
  titleStyle: { fontWeight: "700", fontSize: "20px", fontSizeMobile: "20px" },
  descStyle: { fontSize: "18px" },
};

export const ProcessRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as ProcessWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || (data as any).variant;
  const isVertical = (w.data as any).variant === "vertical";
  const isNumber = (w.data as any).variant === "number";
  const typeStr = w.type as string;
  const isLayout1 =
    (layout === "1" || layout === "layout1" || typeStr === "processCard") &&
    typeStr !== "comparisonCard";
  const isLayout2 = layout === "2" || layout === "layout2";
  const isLayout3 = layout === "3" || layout === "layout3";
  const isComparisonCard =
    typeStr === "comparisonCard" && (layout === "1" || layout === "layout1");

  const pcCols = w.data.itemsPerRow || 3;
  const gridColsClass =
    pcCols === 4
      ? "xl:grid-cols-4"
      : pcCols === 3
        ? "xl:grid-cols-3"
        : pcCols === 2
          ? "xl:grid-cols-2"
          : "xl:grid-cols-1";

  if (isComparisonCard) {
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
            className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementSelect?.("style");
            }}
          >
            {/* Header Area */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!(data as any).descStyle?.isHidden && (
                <SafeHtml
                  html={(data as any).desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    (data as any).descStyle,
                    viewport as any,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Comparison Area */}
            <div
              className="self-stretch inline-flex justify-center items-center flex-wrap xl:flex-nowrap"
              style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : "56px" }}
            >
              {data.steps.slice(0, 2).map((step: any, idx: number) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex-1 inline-flex flex-col justify-center items-center w-full ${idx === 0 ? "max-w-[440px]" : "max-w-[560px]"}`}
                  >
                    <div
                      className={`${idx === 0 ? "w-96" : "w-full"} h-auto hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative`}
                      style={{
                        display: step.iconStyle?.isHidden ? "none" : undefined,
                      }}
                    >
                      <UniversalMedia
                        url={step.icon}
                        className="w-full h-auto object-contain"
                        alt="step icon"
                        style={getElementStyle(
                          step.iconStyle as any,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("icon", step.id);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        backgroundImage:
                          idx === 1
                            ? "linear-gradient(to bottom right, #3b82f6, #2dd4bf, #22c55e)"
                            : "none",
                      }}
                      className={`self-stretch py-5 ${idx === 0 ? "bg-시안-mode-gray5" : ""} inline-flex justify-center items-center gap-2.5`}
                    >
                      {!step.titleStyle?.isHidden && (
                        <SafeHtml
                          html={step.title || "프로그램 특징"}
                          className={`justify-start ${idx === 0 ? "text-시안-mode-gray7" : "text-시안-mode-gray0"} text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text`}
                          style={getElementStyle(
                            step.titleStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("stepTitle", step.id);
                          }}
                        />
                      )}
                    </div>
                    {!step.descStyle?.isHidden && (
                      <div className="self-stretch flex flex-col justify-start items-start w-full">
                        {(step.desc || "프로그램 특징 내용 입력")
                          .split("\n")
                          .map((line: string, lIdx: number) => (
                            <div
                              key={lIdx}
                              className="self-stretch py-3 border-b border-시안-mode-gray1 inline-flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer w-full"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("stepDesc", step.id);
                              }}
                            >
                              <SafeHtml
                                html={line}
                                className="text-center justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8"
                                style={getElementStyle(
                                  step.descStyle,
                                  viewport as any,
                                )}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  {idx === 0 && (
                    <div className="hidden xl:block w-px self-stretch bg-시안-mode-gray2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLayout2) {
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
            {/* 1. Header Area: 3-tier */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!(data as any).descStyle?.isHidden && (
                <SafeHtml
                  html={(data as any).desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    (data as any).descStyle,
                    viewport as any,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2. Body Area: Steps Grid Layout 2 */}
            <div
              className={`self-stretch w-full grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-y-12 mt-6`}
            >
              {(() => {
                const stepsArr = data.steps || (data as any).items || [];
                return stepsArr.map((step: any, idx: number) => (
                  <div
                    key={step.id || idx}
                    className="w-full flex flex-col justify-start items-center gap-6"
                  >
                    <div
                      className="w-40 h-40 rounded-full bg-slate-50 flex justify-center items-center hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative"
                      style={{
                        display: step.iconStyle?.isHidden ? "none" : undefined,
                      }}
                    >
                      <UniversalMedia
                        url={step.icon}
                        className="w-full h-full object-cover"
                        alt="step icon"
                        style={getElementStyle(
                          step.iconStyle as any,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("icon", step.id);
                        }}
                      />
                    </div>

                    <div className="w-full flex flex-col justify-start items-center">
                      <div className="w-full relative py-2 flex justify-center items-center">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-px bg-zinc-300 z-0"
                          style={{
                            left: idx === 0 ? "50%" : 0,
                            right: idx === stepsArr.length - 1 ? "50%" : 0,
                          }}
                        ></div>
                        {!step.numberStyle?.isHidden && (
                          <div className="px-5 py-1 bg-[#285DE1] rounded-full inline-flex justify-center items-center gap-2.5 relative z-10 ring-8 ring-white">
                            <SafeHtml
                              html={step.number || `0${idx + 1}`}
                              className="justify-start text-white text-lg md:text-xl font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-white/50 rounded transition-all cursor-text min-w-[1.5rem] text-center"
                              style={getElementStyle(
                                step.numberStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("number", step.id);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-start items-center gap-2 mt-4 px-6 w-full">
                        {!step.titleStyle?.isHidden && (
                          <SafeHtml
                            html={step.title || "과정명 01"}
                            className="justify-center text-center text-시안-mode-gray95 text-xl font-bold font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                            style={getElementStyle(
                              step.titleStyle,
                              viewport as any,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("stepTitle", step.id);
                            }}
                          />
                        )}
                        {!step.descStyle?.isHidden && (
                          <SafeHtml
                            html={step.desc || "내용 입력 01"}
                            className="text-center justify-center text-gray-500 text-base font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep w-full"
                            style={getElementStyle(
                              step.descStyle,
                              viewport as any,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("stepDesc", step.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLayout3) {
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
            {/* 1. Header Area: 3-tier */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!(data as any).descStyle?.isHidden && (
                <SafeHtml
                  html={(data as any).desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    (data as any).descStyle,
                    viewport as any,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2. Body Area: Steps Grid Layout 3 */}
            <div
              className={`self-stretch w-full grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-10`}
            >
              {(data.steps || (data as any).items || []).map(
                (step: any, idx: number) => (
                  <div
                    key={step.id || idx}
                    className="w-full bg-시안-mode-gray0 border-t border-시안-mode-gray95 inline-flex flex-col justify-start items-start"
                  >
                    <div
                      className="self-stretch bg-zinc-300 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden relative"
                      style={{
                        height: "auto",
                        display: step.iconStyle?.isHidden ? "none" : undefined,
                      }}
                    >
                      <UniversalMedia
                        url={step.icon}
                        className="w-full h-auto object-contain"
                        alt="step icon"
                        style={getElementStyle(
                          step.iconStyle as any,
                          viewport as any,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("icon", step.id);
                        }}
                      />
                    </div>
                    <div className="self-stretch pt-4 border-t border-시안-mode-gray95 flex flex-col justify-start items-start gap-3">
                      <div className="flex flex-col justify-start items-start">
                        <div className="inline-flex justify-start items-center gap-2">
                          {!step.numberStyle?.isHidden && (
                            <SafeHtml
                              html={step.number || `0${idx + 1}.`}
                              className="text-center justify-start text-[#285DE1] text-2xl font-bold font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(
                                step.numberStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("number", step.id);
                              }}
                            />
                          )}
                          {!step.titleStyle?.isHidden && (
                            <SafeHtml
                              html={step.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-2xl font-bold font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(
                                step.titleStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("stepTitle", step.id);
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {!step.descStyle?.isHidden && (
                        <SafeHtml
                          html={
                            step.desc ||
                            "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다."
                          }
                          className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          style={getElementStyle(
                            step.descStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("stepDesc", step.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLayout1) {
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
            {/* 1. Header Area (3-tier) */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <SafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!(data as any).descStyle?.isHidden && (
                <SafeHtml
                  html={(data as any).desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(
                    (data as any).descStyle,
                    viewport as any,
                  )}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2. Body Area (Steps Grid with Arrows) */}
            <div
              className={`self-stretch w-full grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-x-5 gap-y-10`}
            >
              {(data.steps || (data as any).items || []).map(
                (step: any, idx: number) => {
                  const arr = data.steps || (data as any).items || [];
                  const isLastInRow =
                    (idx + 1) % pcCols === 0 || idx === arr.length - 1;
                  return (
                    <div
                      key={step.id || idx}
                      className="relative w-full flex flex-col justify-start items-center gap-3"
                    >
                      <div
                        className="self-stretch bg-zinc-300 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer relative flex justify-center items-center aspect-video w-full rounded-t-lg"
                        style={{
                          display: step.iconStyle?.isHidden
                            ? "none"
                            : undefined,
                        }}
                      >
                        <UniversalMedia
                          url={step.icon}
                          className="w-full h-full object-cover"
                          alt="step icon"
                          style={getElementStyle(
                            step.iconStyle as any,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("icon", step.id);
                          }}
                        />
                        {/* Arrow logic */}
                        {idx !== arr.length - 1 && (
                          <>
                            {/* PC (xl) Arrow */}
                            {!isLastInRow && (
                              <div className="hidden xl:flex absolute top-1/2 -right-2.5 translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-10 pointer-events-none">
                                <img
                                  src="/images/template/arrow.png"
                                  alt="next"
                                  className="w-full h-full object-contain opacity-40 max-w-none"
                                />
                              </div>
                            )}
                            {/* Tablet (md) Arrow */}
                            {(idx + 1) % 2 !== 0 && (
                              <div className="hidden md:flex xl:hidden absolute top-1/2 -right-2.5 translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-10 pointer-events-none">
                                <img
                                  src="/images/template/arrow.png"
                                  alt="next"
                                  className="w-full h-full object-contain opacity-40 max-w-none"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="inline-flex justify-start items-center gap-3">
                        {!step.numberStyle?.isHidden && (
                          <div className="px-4 py-1 bg-시안-mode-Primary50 rounded-[30px] flex justify-center items-center gap-2.5">
                            <SafeHtml
                              html={step.number || `0${idx + 1}`}
                              className="justify-start text-white text-xl font-bold font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-white/50 rounded transition-all cursor-text"
                              style={getElementStyle(
                                step.numberStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("number", step.id);
                              }}
                            />
                          </div>
                        )}
                        {!step.titleStyle?.isHidden && (
                          <SafeHtml
                            html={step.title || "과정명 01"}
                            className="justify-start text-시안-mode-gray95 text-xl font-bold font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                            style={getElementStyle(
                              step.titleStyle,
                              viewport as any,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("stepTitle", step.id);
                            }}
                          />
                        )}
                      </div>
                      {!step.descStyle?.isHidden && (
                        <SafeHtml
                          html={step.desc || "내용 입력 01"}
                          className="text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                          style={getElementStyle(
                            step.descStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("stepDesc", step.id);
                          }}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={style} className="w-full h-auto">
      <div className="mx-auto w-full max-w-[1920px]">
        <div
          className={`flex flex-col ${!isVertical && viewport === "desktop" ? "xl:flex-row xl:items-start" : ""}`}
        >
          <WidgetHeader
            title={w.data.title}
            subTitle={w.data.subTitle}
            titleStyle={w.data.titleStyle}
            subTitleStyle={w.data.subTitleStyle}
            viewport={viewport as any}
            onElementSelect={onElementSelect}
            className={`${!isVertical ? `text-left ${viewport === "desktop" ? "xl:sticky xl:top-[160px] xl:w-[500px]" : ""}` : "text-center mb-10"}`}
          />
          {/* PC/Mobile View State Constants */}
          {(() => {
            const isPc = viewport === "desktop";
            const isTablet = viewport === "tablet";
            const isMobile = viewport === "mobile";

            return (
              <div
                className={`flex-1 flex flex-wrap items-stretch ${isNumber && isMobile ? "gap-y-16" : "gap-y-10"} ${isNumber ? (isPc ? "gap-x-16" : isTablet ? "gap-x-12" : "gap-x-0") : "gap-x-4"} ${!isVertical ? "" : "justify-center"}`}
                style={{
                  gap: w.style?.gap ? formatUnit(w.style.gap) : undefined,
                }}
              >
                {w.data.steps.map((step, idx) => {
                  // Responsive columns: PC (4 or 3), Tablet (2), Mobile (1)
                  const cols = isPc
                    ? w.data.itemsPerRow || (isVertical ? 4 : 3)
                    : isTablet
                      ? 2
                      : 1;
                  const currentGap = isNumber
                    ? isPc
                      ? 64
                      : isTablet
                        ? 48
                        : 0
                    : 16;

                  // inline style로 width 계산
                  let itemWidthStyle: string | undefined;
                  if (isPc)
                    itemWidthStyle = `calc(${100 / cols}% - ${((cols - 1) * currentGap) / cols}px)`;
                  else if (isTablet) itemWidthStyle = `calc(50% - 24px)`;
                  else itemWidthStyle = "100%";

                  return (
                    <React.Fragment key={step.id}>
                      <div
                        className={`relative group bg-white border border-시안-mode-gray10 p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col ${isNumber ? "items-center text-center" : "items-start text-left"}`}
                        style={{ width: itemWidthStyle }}
                      >
                        {/* 1. Header Area: Differentiated by variant */}
                        {isNumber ? (
                          /* Emphasis Variant: STEP Capsule Badge */
                          !step.numberStyle?.isHidden && (
                            <div
                              className="mb-6 px-4 py-1.5 bg-blue-600 text-white font-black tracking-widest text-[14px] md:text-[16px] transition-all cursor-pointer shadow-md shadow-blue-200 ring-4 ring-blue-50"
                              style={getElementStyle(
                                step.numberStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("number", step.id);
                              }}
                            >
                              STEP. {step.number || idx + 1}
                            </div>
                          )
                        ) : (
                          /* Normal/Vertical Variant: Small Badge & Background Number */
                          <>
                            {!step.numberStyle?.isHidden && (
                              <div
                                className="inline-flex items-center justify-center min-w-[56px] h-[32px] px-3 bg-[#EEF2FF] text-[#2563EB] font-black tracking-tight text-[14px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer shadow-sm border border-blue-100/50 mb-4"
                                style={getElementStyle(
                                  step.numberStyle,
                                  viewport as any,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("number", step.id);
                                }}
                              >
                                {step.number || `0${idx + 1}`}
                              </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 text-8xl font-black text-시안-mode-gray40/5 select-none pointer-events-none italic group-hover:text-blue-500/10 transition-colors uppercase">
                              {step.number || idx + 1}
                            </div>
                          </>
                        )}

                        {/* 2. Image Area (Common toggle) */}
                        {w.data.showImage !== false && (
                          <div
                            className={`w-full mb-6 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden${isNumber ? " max-w-[140px]" : ""}`}
                            style={{
                              display: step.iconStyle?.isHidden
                                ? "none"
                                : undefined,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("icon", step.id);
                            }}
                          >
                            <UniversalMedia
                              url={step.icon || "/images/template/like_cat.jpg"}
                              className="w-full h-auto block mx-auto hover:scale-110 transition-transform duration-500"
                              alt="step icon"
                              style={getElementStyle(
                                step.iconStyle as any,
                                viewport as any,
                              )}
                            />
                          </div>
                        )}

                        {/* 3. Text Area: Title & Description Grouped with 0px gap */}
                        <div
                          className={`w-full flex flex-col gap-0 ${isNumber ? "mb-6" : "mb-4"}`}
                        >
                          {!step.titleStyle?.isHidden && (
                            <SafeHtml
                              html={step.title}
                              className={`font-bold text-시안-mode-gray90 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded block w-full leading-tight`}
                              style={getElementStyle(
                                step.titleStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("stepTitle", step.id);
                              }}
                            />
                          )}

                          {!step.descStyle?.isHidden && (
                            <div
                              className={`w-full transition-all${isNumber ? " space-y-2" : ""}`}
                              style={getElementStyle(
                                step.descStyle,
                                viewport as any,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("stepDesc", step.id);
                              }}
                            >
                              {isNumber ? (
                                /* Number Variant: Check-list style description */
                                (step.desc || "")
                                  .split("\n")
                                  .map((line, lIdx) => (
                                    <div
                                      key={lIdx}
                                      className="flex items-start gap-2 text-시안-mode-gray60 leading-snug"
                                    >
                                      <div className="mt-0.5 bg-blue-100 p-0.5 text-blue-600 shrink-0">
                                        <Check size={10} strokeWidth={4} />
                                      </div>
                                      <span
                                        className="text-left font-medium"
                                        style={getElementStyle(
                                          step.descStyle,
                                          viewport as any,
                                        )}
                                      >
                                        {line || "항목 내용을 입력하세요"}
                                      </span>
                                    </div>
                                  ))
                              ) : (
                                /* Normal/Vertical Variant: Standard paragraph description */
                                <SafeHtml
                                  html={step.desc}
                                  className="text-시안-mode-gray50 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded whitespace-pre-wrap leading-relaxed text-left block w-full"
                                  style={getElementStyle(
                                    step.descStyle,
                                    viewport as any,
                                  )}
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* 4. Bottom Label (Only for Number variant) */}
                        {isNumber && (
                          <div
                            className={`mt-auto w-full py-3 text-white text-[13px] md:text-[14px] font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg active:scale-95 text-center${!step.labelStyle?.backgroundColor ? " bg-blue-600 shadow-blue-100" : ""}`}
                            style={getElementStyle(
                              step.labelStyle,
                              viewport as any,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("stepLabel", step.id);
                            }}
                          >
                            {step.label || "상세 정보 입력"}
                          </div>
                        )}

                        {/* 5. Responsive Arrows: ONLY for Number Variant */}
                        {isNumber && idx < w.data.steps.length - 1 && (
                          <>
                            {/* PC/Tablet Arrow - Right side flow */}
                            {(isPc || isTablet) && (idx + 1) % cols !== 0 && (
                              <div
                                className={`flex absolute transition-all ${isPc ? "-right-[54px]" : "-right-[40px]"}top-1/2 -translate-y-1/2 z-10 text-시안-mode-gray30 pointer-events-none group-hover:text-blue-400`}
                              >
                                <ChevronRight
                                  size={isPc ? 32 : 24}
                                  strokeWidth={2.5}
                                />
                              </div>
                            )}
                            {/* Mobile Arrow - Down side flow */}
                            {isMobile && (
                              <div className="flex absolute -bottom-11 left-1/2 -translate-x-1/2 z-10 text-시안-mode-gray30 pointer-events-none">
                                <ChevronDown size={28} strokeWidth={2.5} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
};
