import React from "react";
import { TableWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 테이블 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "36px"
// - 모바일 버전: fontSizeMobile: "28px"
export const TABLE_DEFAULTS = {
  variant: "standard",
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "36px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", color: "#285DE1" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", color: "#6B7280" },
  headers: ["내역", "내역", "내역"],
  headerStyle: {
    fontSize: "20px",
    fontWeight: "500",
    backgroundColor: "#E5F9FF",
    color: "#111827",
  },
  rows: [
    ["EB-5 투자금", "EB-5 투자금", "EB-5 투자금"],
    ["EB-5 투자금", "EB-5 투자금", "EB-5 투자금"],
    ["EB-5 투자금", "EB-5 투자금", "EB-5 투자금"],
    ["EB-5 투자금", "EB-5 투자금", "EB-5 투자금"],
  ],
  bodyStyle: { fontSize: "18px", color: "#6B7280", fontWeight: "500" },
  comparisonHeaders: ["구분", "구분", "구분"],
  comparisonRows: [
    ["구분", "구분", "구분"],
    ["구분", "구분", "구분"],
    ["구분", "구분", "구분"],
    ["구분", "구분", "구분"],
  ],
  image: "/images/placeholder/wide-image.jpg",
  bottomText:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  bottomTextStyle: { fontSize: "20px", color: "#6B7280", fontWeight: "400" },
};

export const TableRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as TableWidget;
  const style = useWidgetStyle(w.style);

  // 섹션 전체 배경색이 테이블 스타일과 충돌하지 않도록 투명하게 처리
  const sectionStyle = { ...style, backgroundColor: "transparent" };

  // Global Header & Body Styles (사용자가 설정한 배경색은 여기에 들어있습니다)
  const headerStyle = getElementStyle(w.data.headerStyle, viewport as any);
  const bodyStyle = getElementStyle(w.data.bodyStyle, viewport as any);

  const isSideBySide = w.data.layout !== "vertical";
  const isComparison = w.data.variant === "comparison";
  const isTable02 =
    w.data.variant === "table02" || (w.data as any).layout === "2";
  const isTable03 =
    w.data.variant === "table03" || (w.data as any).layout === "3";
  const isTable04 =
    w.data.variant === "table04" || (w.data as any).layout === "4";
  const containerPaddingClass =
    viewport === "tablet"
      ? "px-10"
      : viewport === "desktop"
        ? "px-5 xl:px-72"
        : "px-5";

  if (isTable04) {
    const tableHeaders = w.data.comparisonHeaders ||
      w.data.headers || ["구분", "구분", "구분"];
    const tableRows = w.data.comparisonRows ||
      w.data.rows || [
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
      ];

    return (
      <section style={sectionStyle} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className={`self-stretch ${containerPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}>
            <div className="flex flex-col justify-start items-center">
              {!w.data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={w.data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.subTitleStyle, viewport as any),
                    backgroundColor: "transparent",
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
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.titleStyle, viewport as any),
                    backgroundColor: "transparent",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!w.data.descStyle?.isHidden && (
                <SafeHtml
                  html={w.data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.descStyle, viewport as any),
                    backgroundColor: "transparent",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>
            <div className="self-stretch h-auto relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer overflow-hidden flex justify-center items-center">
              <UniversalMedia
                className="w-full h-auto object-contain"
                url={w.data.image || ""}
                alt="Table Image"
                style={{
                  ...getElementStyle(w.data.imageStyle, viewport as any),
                  height: "auto",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              />
            </div>
            {/* Table Area for Layout 04 - No Top/Bottom Borders, Rounded rows */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1 overflow-hidden w-full">
              {/* Header Row */}
              <div className="self-stretch inline-flex justify-start items-center overflow-hidden w-full rounded-lg">
                {tableHeaders.map((headerText, i) => (
                  <div
                    key={i}
                    className={`${i === 0 ? "w-24 xl:w-60" : "flex-1"} p-4 flex justify-center items-center gap-2.5 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
                    style={{
                      backgroundColor:
                        (w.data as any).headerCellStyles?.[i]
                          ?.backgroundColor || "#FFFFFF",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("tableHeader", i.toString());
                    }}
                  >
                    <SafeHtml
                      html={headerText}
                      className={`text-center justify-start text-시안-mode-gray95 text-xl font-bold font-['Pretendard'] leading-9`}
                      style={{ ...headerStyle, backgroundColor: "transparent" }}
                    />
                  </div>
                ))}
              </div>

              {/* Body Rows */}
              {tableRows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className={`self-stretch inline-flex justify-start items-center overflow-hidden w-full rounded-lg`}
                  style={{
                    backgroundColor:
                      (w.data as any).rowStyles?.[rIdx]?.backgroundColor ||
                      (rIdx % 2 === 0 ? "#F9FAFB" : "transparent"),
                  }}
                >
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`${cIdx === 0 ? "w-24 xl:w-60" : "flex-1"} p-4 flex justify-center items-center gap-2.5 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
                      style={{
                        backgroundColor:
                          (w.data as any).cellStyles?.[`${rIdx}-${cIdx}`]
                            ?.backgroundColor || "transparent",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("tableCell", `${rIdx}-${cIdx}`);
                      }}
                    >
                      <SafeHtml
                        html={cell}
                        className={`text-center justify-start ${cIdx === 0 ? "text-[#285DE1]" : "text-시안-mode-gray50"} text-xl font-medium font-['Pretendard'] leading-8`}
                        style={{ ...bodyStyle, backgroundColor: "transparent" }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {!w.data.bottomTextStyle?.isHidden && (
              <SafeHtml
                html={
                  w.data.bottomText ||
                  "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                }
                className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                style={{
                  ...getElementStyle(w.data.bottomTextStyle, viewport as any),
                  backgroundColor: "transparent",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("bottomText");
                }}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (isTable03) {
    const tableHeaders = w.data.comparisonHeaders ||
      w.data.headers || ["구분", "구분", "구분"];
    const tableRows = w.data.comparisonRows ||
      w.data.rows || [
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
        ["구분", "구분", "구분"],
      ];

    return (
      <section style={sectionStyle} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className={`self-stretch ${containerPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}>
            <div className="flex flex-col justify-start items-center">
              {!w.data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={w.data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.subTitleStyle, viewport as any),
                    backgroundColor: "transparent",
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
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.titleStyle, viewport as any),
                    backgroundColor: "transparent",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!w.data.descStyle?.isHidden && (
                <SafeHtml
                  html={w.data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={{
                    ...getElementStyle(w.data.descStyle, viewport as any),
                    backgroundColor: "transparent",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>
            <div className="self-stretch h-auto relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer overflow-hidden flex justify-center items-center">
              <UniversalMedia
                className="w-full h-auto object-contain"
                url={w.data.image || ""}
                alt="Table Image"
                style={{
                  ...getElementStyle(w.data.imageStyle, viewport as any),
                  height: "auto",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              />
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2 overflow-hidden w-full">
              <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden w-full">
                {tableHeaders.map((headerText, i) => (
                  <div
                    key={i}
                    className={`${i === 0 ? "w-24 xl:w-60" : i === 1 ? "flex-1" : "flex-1"} p-4 flex justify-center items-center gap-2.5 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
                    style={{
                      backgroundColor:
                        i === 0 ? "#E6E8EA" : i === 1 ? "#131416" : "#285DE1",
                      borderRadius: 8,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("tableHeader", i.toString());
                    }}
                  >
                    <SafeHtml
                      html={headerText}
                      className={`text-center justify-start ${i === 0 ? "text-[#131416]" : "text-[#FFFFFF]"} text-xl font-bold font-['Pretendard'] leading-8`}
                      style={{
                        ...headerStyle,
                        backgroundColor: "transparent",
                        color: i === 0 ? undefined : "#FFFFFF",
                      }}
                    />
                  </div>
                ))}
              </div>

              {tableRows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden w-full"
                >
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`${cIdx === 0 ? "w-24 xl:w-60" : cIdx === 1 ? "flex-1" : "flex-1"} p-4 flex justify-center items-center gap-2.5 cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all`}
                      style={{
                        backgroundColor:
                          (w.data as any).cellStyles?.[`${rIdx}-${cIdx}`]
                            ?.backgroundColor ||
                          (cIdx === 2 ? "#DDEFFE" : "#F6F7FB"),
                        borderRadius: 8,
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("tableCell", `${rIdx}-${cIdx}`);
                      }}
                    >
                      <SafeHtml
                        html={cell}
                        className={`text-center justify-start text-[#6D7882] text-xl font-medium font-['Pretendard'] leading-8`}
                        style={{ ...bodyStyle, backgroundColor: "transparent" }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {!w.data.bottomTextStyle?.isHidden && (
              <SafeHtml
                html={
                  w.data.bottomText ||
                  "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                }
                className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                style={getElementStyle(w.data.bottomTextStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("bottomText");
                }}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (isTable02) {
    return (
      <section style={sectionStyle} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className={`self-stretch ${containerPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}>
            <div className="flex flex-col justify-start items-center">
              {!w.data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={w.data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={getElementStyle(w.data.subTitleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!w.data.titleStyle?.isHidden && (
                <SafeHtml
                  html={w.data.title || "타이틀명 입력"}
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={getElementStyle(w.data.titleStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!w.data.descStyle?.isHidden && (
                <SafeHtml
                  html={w.data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                  style={getElementStyle(w.data.descStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>
            <div
              className={`self-stretch inline-flex flex-col xl:flex-row justify-center items-center gap-10 w-full ${(w.data as any).reverseLayout ? "xl:flex-row-reverse" : ""}`}
            >
              <div className="w-full xl:w-[660px] inline-flex flex-col justify-start items-start gap-6">
                {!w.data.bottomTextStyle?.isHidden && (
                  <SafeHtml
                    html={
                      w.data.bottomText ||
                      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                    }
                    className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                    style={getElementStyle(
                      w.data.bottomTextStyle,
                      viewport as any,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("bottomText");
                    }}
                  />
                )}
                <div className="self-stretch border-t-2 border-시안-mode-Primary50 flex flex-col justify-start items-start overflow-hidden w-full">
                  <div className="self-stretch border-b border-시안-mode-gray2 inline-flex justify-start items-center overflow-hidden w-full">
                    {w.data.headers.map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 p-4 flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer ${i !== w.data.headers.length - 1 ? "border-r border-시안-mode-gray2" : ""}`}
                        style={{
                          backgroundColor:
                            (w.data as any).headerCellStyles?.[i]
                              ?.backgroundColor || headerStyle?.backgroundColor,
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("tableHeader", i.toString());
                        }}
                      >
                        <SafeHtml
                          html={h}
                          className="text-center justify-start text-시안-mode-gray95 text-xl font-medium font-['Pretendard'] leading-8"
                          style={{
                            ...headerStyle,
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {w.data.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="self-stretch border-b border-시안-mode-gray2 inline-flex justify-start items-center overflow-hidden w-full"
                    >
                      {row.map((cell, cIdx) => (
                        <div
                          key={cIdx}
                          className={`flex-1 self-stretch p-4 flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer ${cIdx !== row.length - 1 ? "border-r border-시안-mode-gray2" : ""}`}
                          style={{
                            backgroundColor:
                              (w.data as any).cellStyles?.[`${rIdx}-${cIdx}`]
                                ?.backgroundColor || bodyStyle?.backgroundColor,
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("tableCell", `${rIdx}-${cIdx}`);
                          }}
                        >
                          <SafeHtml
                            html={cell}
                            className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8"
                            style={{
                              ...bodyStyle,
                              backgroundColor: "transparent",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 self-stretch h-auto xl:h-auto relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer overflow-hidden flex justify-center items-center">
                <UniversalMedia
                  className="w-full h-auto object-contain"
                  url={w.data.image || ""}
                  alt="Table Image"
                  style={getElementStyle(w.data.imageStyle, viewport as any)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("image");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isComparison) {
    const compHeaders = w.data.comparisonHeaders || [
      "베이직",
      "프리미엄",
      "플래티넘",
    ];
    const compRows = w.data.comparisonRows || [
      ["비용", "10,000원", "20,000원", "30,000원"],
      ["용량", "10GB", "50GB", "무제한"],
      ["지원전공", "전체", "전체", "전체"],
    ];

    return (
      <section style={sectionStyle} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="flex flex-col gap-[24px] md:gap-[40px]">
            <div className="text-left">
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
            <div className="group relative">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <table className="w-full table-fixed border-collapse leading-[1.5] border-spacing-0">
                  <colgroup>
                    <col
                      style={{
                        width: viewport === "desktop" ? "120px" : "80px",
                      }}
                    />
                    {compHeaders.map((_, i) => (
                      <col key={i} style={{ width: "auto" }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      <th
                        className="border p-[16px_5px] font-[400] text-[#060606] break-all hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
                        style={{
                          backgroundColor:
                            (w.data as any).headerGubunStyle?.backgroundColor ||
                            headerStyle?.backgroundColor ||
                            "#FCFDFE",
                          borderColor: headerStyle?.borderColor || "#D9D9D9",
                          textAlign: headerStyle?.textAlign || "center",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("tableHeaderGubun");
                        }}
                      >
                        <SafeHtml
                          html={w.data.comparisonGubun || "구분"}
                          className="w-full overflow-hidden"
                          style={{ backgroundColor: "transparent" }}
                        />
                      </th>
                      {compHeaders.map((h, i) => (
                        <th
                          key={i}
                          className="border p-[16px_5px] hover:bg-blue-50 cursor-pointer break-all hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                          style={{
                            ...headerStyle,
                            backgroundColor:
                              (w.data as any).headerCellStyles?.[i]
                                ?.backgroundColor ||
                              headerStyle?.backgroundColor ||
                              "#F2F3F8",
                            borderColor: headerStyle?.borderColor || "#D9D9D9",
                            textAlign: headerStyle?.textAlign || "center",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("tableHeader", i.toString());
                          }}
                        >
                          <SafeHtml
                            html={h}
                            className="header-content w-full overflow-hidden"
                            style={{ backgroundColor: "transparent" }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <th
                          className="border p-[16px_5px] font-[400] text-[#060606] hover:bg-blue-50 cursor-pointer break-all hover:outline-dashed hover:outline-2 hover:outline-blue-400"
                          style={{
                            ...bodyStyle,
                            backgroundColor:
                              (w.data as any).cellStyles?.[`${rIdx}-0`]
                                ?.backgroundColor ||
                              bodyStyle?.backgroundColor ||
                              "#F2F3F8",
                            borderColor: bodyStyle?.borderColor || "#D9D9D9",
                            textAlign: bodyStyle?.textAlign || "center",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("tableCell", `${rIdx}-0`);
                          }}
                        >
                          <SafeHtml
                            html={row[0]}
                            className="w-full overflow-hidden"
                            style={{ backgroundColor: "transparent" }}
                          />
                        </th>
                        {(row.length > 1 ? row.slice(1) : []).map(
                          (cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="border p-[16px_5px] text-[#666666] hover:bg-blue-50 cursor-pointer break-all hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all"
                              style={{
                                ...bodyStyle,
                                borderColor: bodyStyle.borderColor || "#D9D9D9",
                                textAlign: bodyStyle.textAlign || "center",
                                backgroundColor:
                                  (w.data as any).cellStyles?.[
                                    `${rIdx}-${cIdx + 1}`
                                  ]?.backgroundColor ||
                                  bodyStyle?.backgroundColor ||
                                  "transparent",
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "tableCell",
                                  `${rIdx}-${cIdx + 1}`,
                                );
                              }}
                            >
                              <SafeHtml
                                html={cell}
                                className="w-full overflow-hidden"
                                style={{ backgroundColor: "transparent" }}
                              />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="absolute left-1/2 top-[20%] -translate-x-1/2 transition-opacity duration-300 hover:opacity-0 group-hover:opacity-0 min-[1510px]:hidden pointer-events-none">
                <img src="/images/placeholder/arrow.png" alt="scroll" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout 01 (Default)
  return (
    <section style={sectionStyle} className="w-full h-auto">
      <div className="mx-auto w-full max-w-[1920px]">
        <div className={`self-stretch ${containerPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}>
          <div className="flex flex-col justify-start items-center">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                style={getElementStyle(w.data.subTitleStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                style={getElementStyle(w.data.titleStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!w.data.descStyle?.isHidden && (
              <SafeHtml
                html={w.data.desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
                style={getElementStyle(w.data.descStyle, viewport as any)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          <div className="self-stretch h-auto relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer overflow-hidden flex justify-center items-center">
            <UniversalMedia
              className="w-full h-auto object-contain"
              url={w.data.image || ""}
              alt="Table Image"
              style={{
                ...getElementStyle(w.data.imageStyle, viewport as any),
                height: "auto",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("image");
              }}
            />
          </div>

          <div className="self-stretch border-t-2 border-시안-mode-Primary50 flex flex-col justify-start items-start overflow-hidden w-full">
            {/* Table Header Row for Layout 01 */}
            <div className="self-stretch border-b border-시안-mode-gray2 inline-flex justify-start items-center overflow-hidden w-full">
              {w.data.headers.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 p-4 flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer ${i !== w.data.headers.length - 1 ? "border-r border-시안-mode-gray2" : ""}`}
                  style={{
                    backgroundColor:
                      (w.data as any).headerCellStyles?.[i]?.backgroundColor ??
                      headerStyle.backgroundColor,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("tableHeader", i.toString());
                  }}
                >
                  <SafeHtml
                    html={h}
                    className="text-center justify-start text-시안-mode-gray95 text-xl font-medium font-['Pretendard'] leading-8"
                    style={{ ...headerStyle, backgroundColor: "transparent" }}
                  />
                </div>
              ))}
            </div>

            {/* Table Body Rows for Layout 01 */}
            {w.data.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="self-stretch border-b border-시안-mode-gray2 inline-flex justify-start items-center overflow-hidden w-full"
              >
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    className={`flex-1 self-stretch p-4 flex justify-center items-center gap-2.5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer ${cIdx !== row.length - 1 ? "border-r border-시안-mode-gray2" : ""}`}
                    style={{
                      backgroundColor:
                        (w.data as any).cellStyles?.[`${rIdx}-${cIdx}`]
                          ?.backgroundColor || bodyStyle?.backgroundColor,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("tableCell", `${rIdx}-${cIdx}`);
                    }}
                  >
                    <SafeHtml
                      html={cell}
                      className="text-center justify-start text-시안-mode-gray50 text-lg font-medium font-['Pretendard'] leading-7"
                      style={{ ...bodyStyle, backgroundColor: "transparent" }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {!w.data.bottomTextStyle?.isHidden && (
            <SafeHtml
              html={
                w.data.bottomText ||
                "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
              }
              className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block cursor-pointer transition-all"
              style={getElementStyle(w.data.bottomTextStyle, viewport as any)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("bottomText");
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
