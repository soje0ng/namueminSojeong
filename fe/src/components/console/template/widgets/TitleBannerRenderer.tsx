import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  UniversalMedia,
  WidgetRendererProps,
  formatUnit,
  getImageUrl,
} from "./WidgetUtils";

export const TITLE_BANNER_DEFAULTS = {
  subTitle: "버지니아 해안 리조트 건설 프로젝트",
  subTitleStyle: { color: "#285DE1", fontSize: "20px", fontWeight: "700" }, // blue-600
  title:
    "2026년 <span style='color: #285DE1'>미국 투자이민,</span><br/>꼭 알아야 할 3가지 핵심 트렌드",
  titleStyle: { color: "#111111", fontSize: "48px", fontWeight: "700" },
  desc: "설명을 쓰는 곳입니다.",
  descStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "500" },
  textContentTitle: "서브 타이틀 입력",
  textContentTitleStyle: {
    color: "#111111",
    fontSize: "24px",
    fontWeight: "500",
  },
  textContent:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  textContentStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "500" },
  feature1Image: "/images/template/icon_program.png",
  feature1Title: "프로그램 특징",
  feature1TitleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
  feature1Desc: "프로그램 특징 내용 입력",
  feature1DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  feature2Image: "/images/template/icon_program.png",
  feature2Title: "프로그램 특징",
  feature2TitleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
  feature2Desc: "프로그램 특징 내용 입력",
  feature2DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  feature3Image: "/images/template/icon_program.png",
  feature3Title: "프로그램 특징",
  feature3TitleStyle: { color: "#0369a1", fontSize: "24px", fontWeight: "700" },
  feature3Desc: "프로그램 특징 내용 입력",
  feature3DescStyle: { color: "#6b7280", fontSize: "18px", fontWeight: "400" },
  backgroundImage: "/images/template/titlebanner_banckground.png",
  layout1Image: "/images/template/title_banner_img.png",
  layout2HeroImage: "/images/template/title_banner_img2.png",
  layout3Image: "/images/placeholder/hero-img.jpg",
  quoteLeftUrl: "/images/placeholder/icon-quote.jpg",
  quoteRightUrl: "/images/placeholder/icon-quote.jpg",
  layout3SmallTitle: "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!",
  layout3SmallTitleStyle: { color: "#111111", fontSize: "24px", fontWeight: "500" },
  layout3Title: "학부모 영주권 프로그램",
  layout3TitleStyle: { color: "#111111", fontSize: "48px", fontWeight: "700" },
  layout3Desc: "까다로운 자금 출처 없이 국내에서<br/>온가족이 미국 영주권을 취득할 수 있는 프로그램",
  layout3DescStyle: { color: "#6b7280", fontSize: "20px", fontWeight: "500" },
  layout: "1",
};

export const TitleBannerRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = String(data.layout || "1");

  /* ─────────────────────────────────────────── 레이아웃 1 (구조 원복) ─── */
  if (layout === "1") {
    return (
      <section
        style={{
          ...style,
          backgroundImage: data.backgroundImage
            ? `url(${data.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full relative overflow-hidden transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("backgroundImage");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch pl-72 py-14 inline-flex justify-start items-center gap-20">
            <div className="flex-1 h-[575px] inline-flex flex-col justify-between items-start">
              {/* 상단 텍스트 그룹 */}
              <div className="flex flex-col justify-start items-start gap-3">
                {/* 버지니아 해안 리조트 건설 프로젝트 */}
                <SafeHtml
                  className="justify-start text-blue-600 text-xl font-bold font-['Pretendard'] leading-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                  html={data.subTitle || "버지니아 해안 리조트 건설 프로젝트"}
                />
                {/* 타이틀 영역 */}
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    className="font-['Pretendard'] leading-[72px]"
                    style={{
                      fontSize: "48px",
                      fontWeight: "700",
                      ...getElementStyle(data.titleStyle, viewport),
                    }}
                    html={
                      data.title ||
                      `<span class="text-gray-950 font-bold">2026년 </span><span class="text-[#285DE1] font-bold">미국 투자이민,<br/></span><span class="text-gray-950 font-bold">꼭 알아야 할 3가지 핵심 트렌드</span>`
                    }
                  />
                </div>
                {/* 설명을 쓰는 곳입니다. */}
                <SafeHtml
                  className="justify-start text-gray-500 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                  html={data.desc || "설명을 쓰는 곳입니다."}
                />
              </div>

              {/* 하단 특징 및 본문 그룹 */}
              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                <SafeHtml
                  className="self-stretch justify-start text-gray-500 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                  style={getElementStyle(data.textContentStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContent");
                  }}
                  html={
                    data.textContent ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                />

                <div className="self-stretch inline-flex justify-center items-start">
                  {[1, 2, 3].map((idx) => {
                    const fImg = (data as any)[
                      `feature${idx}Image` ||
                        "/images/template/icon_program.png"
                    ];
                    const fTitle = (data as any)[
                      `feature${idx}Title` || "프로그램 특징"
                    ];
                    const fDesc = (data as any)[
                      `feature${idx}Desc` || "프로그램 특징 내용 입력"
                    ];
                    const fTitleStyle = (data as any)[
                      `feature${idx}TitleStyle`
                    ];
                    const fDescStyle = (data as any)[`feature${idx}DescStyle`];
                    const isLast = idx === 3;

                    return (
                      <div
                        key={idx}
                        className={`flex-1 max-w-96 ${!isLast ? "border-r border-gray-200" : ""} inline-flex flex-col justify-start items-center gap-4`}
                      >
                        <div className="w-24 h-24 relative bg-gray-50 rounded-[50px] overflow-hidden flex items-center justify-center">
                          <UniversalMedia
                            className="w-14 h-14 object-contain"
                            url={fImg}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`feature${idx}Image`);
                            }}
                          />
                        </div>
                        <div className="flex flex-col justify-start items-center gap-2">
                          <SafeHtml
                            className="text-center justify-start text-[#0369a1] text-2xl font-bold font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                            style={getElementStyle(fTitleStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`feature${idx}Title`);
                            }}
                            html={fTitle || "프로그램 특징"}
                          />
                          <SafeHtml
                            className="text-center justify-start text-gray-500 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-text"
                            style={getElementStyle(fDescStyle, viewport)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`feature${idx}Desc`);
                            }}
                            html={fDesc || "프로그램 특징 내용 입력"}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <UniversalMedia
              className="w-[820px] h-[575px] rounded-tl-2xl rounded-bl-2xl object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
              url={getImageUrl(
                data.layout1ImageStyle,
                viewport,
                data.layout1Image,
              )}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("layout1Image");
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    return (
      <section
        style={style}
        className="w-full relative transition-all cursor-pointer"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("backgroundImage");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            style={{
              display: "flex",
              padding: "60px 280px",
              justifyContent: "space-between",
              alignItems: "flex-start",
              alignSelf: "stretch",
            }}
            className="w-full"
          >
            <div className="inline-flex flex-col justify-start items-start gap-3">
              <div
                className="justify-start text-시안-mode-Primary70 text-xl font-medium font-['Pretendard'] leading-5"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              >
                Program Name.
              </div>
              <div
                className="justify-start text-gray-95 text-5xl font-bold font-['Pretendard'] leading-[72px]"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              >
                타이틀명 입력
              </div>
              <div
                style={{ color: "#6b7280" }}
                className="self-stretch justify-start text-xl font-medium font-['Pretendard'] leading-8"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              >
                서브타이틀 입력 영역
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "800px",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "40px",
              }}
            >
              <img
                className="w-[360px] h-auto max-h-[440px] rounded-tl-[60px] object-cover"
                src={
                  data.layout2HeroImage ||
                  "/images/template/title_banner_img2.png"
                }
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout2HeroImage");
                }}
              />
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div
                  className="self-stretch justify-start text-gray-95 text-2xl font-medium font-['Pretendard'] leading-9"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContentTitle");
                  }}
                >
                  서브 타이틀 입력
                </div>
                <div className="w-14 h-px bg-gray-10"></div>
                <div
                  style={{ color: "#6b7280" }}
                  className="self-stretch justify-start text-xl font-medium font-['Pretendard'] leading-8"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContent");
                  }}
                >
                  웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한
                  렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상
                  개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱,
                  태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "3") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-100 transition-all"
        onDoubleClick={() => onElementSelect?.("style")}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-14 pt-28 pb-14 inline-flex flex-col justify-start items-center gap-10 w-full">

            {/* 상단: 따옴표 + 텍스트 */}
            <div className="inline-flex justify-start items-start gap-14">
              {/* 좌측 따옴표 이미지 */}
              <div
                className="w-12 h-10 shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteLeftUrl");
                }}
              >
                <UniversalMedia
                  url={data.quoteLeftUrl}
                  className="w-full h-full object-contain"
                  alt="Left Quote"
                />
              </div>

              {/* 텍스트 그룹 */}
              <div className="inline-flex flex-col justify-start items-center gap-2">
                <SafeHtml
                  html={data.layout3SmallTitle || "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!"}
                  className="text-center justify-start text-gray-95 text-2xl font-medium font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(data.layout3SmallTitleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3SmallTitle");
                  }}
                />
                <SafeHtml
                  html={data.layout3Title || "학부모 영주권 프로그램"}
                  className="text-center justify-start text-gray-95 text-5xl font-bold font-['Pretendard'] leading-[72px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(data.layout3TitleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Title");
                  }}
                />
                <SafeHtml
                  html={data.layout3Desc || "까다로운 자금 출처 없이 국내에서<br/>온가족이 미국 영주권을 취득할 수 있는 프로그램"}
                  className="text-center justify-start text-gray-50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-text transition-all"
                  style={getElementStyle(data.layout3DescStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Desc");
                  }}
                />
              </div>

              {/* 우측 따옴표 이미지 */}
              <div
                className="w-12 h-10 shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("quoteRightUrl");
                }}
              >
                <UniversalMedia
                  url={data.quoteRightUrl}
                  className="w-full h-full object-contain"
                  alt="Right Quote"
                />
              </div>
            </div>

            {/* 하단: 통이미지 배너 */}
            <div className="self-stretch h-96 relative rounded-3xl overflow-hidden">
              <UniversalMedia
                className="w-full h-full object-cover"
                url={data.layout3Image || "/images/placeholder/hero-img.jpg"}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3Image");
                }}
              />
              <div className="w-full h-96 left-0 top-0 absolute bg-gradient-to-b from-black/0 to-시안-mode-subColor30/60 pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-gray-0 text-7xl font-normal font-['Tenor_Sans'] leading-[96px] [text-shadow:_0px_0px_8px_rgb(0_0_0_/_0.25)]">
                  Green Card Program
                </span>
                <span className="text-gray-0 text-6xl font-normal font-['Tenor_Sans'] leading-[72px] [text-shadow:_0px_0px_8px_rgb(0_0_0_/_0.25)]">
                  for Parents
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={style}
      className="w-full relative py-20 bg-gray-50 flex items-center justify-center transition-all cursor-pointer"
      onDoubleClick={(e) => {
        e.stopPropagation();
        onElementSelect?.("backgroundImage");
      }}
    >
      <div className="text-center font-bold text-gray-400">
        <p className="text-xl">타이틀 배너 디자인 대기중</p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
