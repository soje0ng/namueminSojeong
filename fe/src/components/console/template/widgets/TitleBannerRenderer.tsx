import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  UniversalMedia,
  WidgetRendererProps,
} from "./WidgetUtils";

export const TITLE_BANNER_DEFAULTS = {
  subTitle: "Program Name.",
  subTitleStyle: { color: "#0ea5e9", fontSize: "20px", fontWeight: "700" },
  title: "타이틀명 입력",
  titleStyle: { color: "#111111", fontSize: "48px", fontWeight: "700" },
  desc: "서브타이틀 입력 영역",
  descStyle: { color: "#6D7882", fontSize: "20px", fontWeight: "500" },
  textContentTitle: "서브 타이틀 입력",
  textContentTitleStyle: {
    color: "#111111",
    fontSize: "24px",
    fontWeight: "500",
  },
  textContent:
    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  textContentStyle: { color: "#6D7882", fontSize: "20px", fontWeight: "500" },
  image: "/images/placeholder/hero-image.jpg",
  feature1Title: "프로그램 특징",
  feature1TitleStyle: { color: "#0ea5e9", fontSize: "24px", fontWeight: "700" },
  feature1Desc: "프로그램 특징 내용 입력",
  feature1DescStyle: { color: "#6D7882", fontSize: "18px", fontWeight: "400" },
  feature2Title: "프로그램 특징",
  feature2TitleStyle: { color: "#0ea5e9", fontSize: "24px", fontWeight: "700" },
  feature2Desc: "프로그램 특징 내용 입력",
  feature2DescStyle: { color: "#6D7882", fontSize: "18px", fontWeight: "400" },
  feature3Title: "프로그램 특징",
  feature3TitleStyle: { color: "#0ea5e9", fontSize: "24px", fontWeight: "700" },
  feature3Desc: "프로그램 특징 내용 입력",
  feature3DescStyle: { color: "#6D7882", fontSize: "18px", fontWeight: "400" },
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

  /* ─────────────────────────────────────────── 레이아웃 1 ─── */
  if (layout === "1") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("style");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="w-full pl-72 py-14 relative inline-flex justify-start items-center gap-20">
            <div className="w-[818px] h-[800px] left-[694px] top-[-52px] absolute opacity-5 bg-zinc-800"></div>
            <div className="flex-1 h-[575px] inline-flex flex-col justify-between items-start">
              {/* 상단 텍스트 그룹 */}
              <div className="flex flex-col justify-start items-start gap-3">
                {/* 서브타이틀 */}
                <SafeHtml
                  className="justify-start font-['Pretendard'] leading-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#0ea5e9",
                    fontSize: "20px",
                    fontWeight: "700",
                    ...getElementStyle(data.subTitleStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                  html={data.subTitle || "버지니아 해안 리조트 건설 프로젝트"}
                />
                {/* 타이틀 */}
                <SafeHtml
                  className="justify-start font-['Pretendard'] leading-[72px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#111111",
                    fontSize: "48px",
                    fontWeight: "700",
                    ...getElementStyle(data.titleStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                  html={
                    data.title ||
                    '<span>2026년 </span><span style="color:#0ea5e9">미국 투자이민,<br/></span><span>꼭 알아야 할 3가지 핵심 트렌드</span>'
                  }
                />
                {/* 설명 */}
                <SafeHtml
                  className="justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#6D7882",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.descStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                  html={data.desc || "설명을 쓰는 곳입니다."}
                />
              </div>

              {/* 하단 콘텐츠 그룹 */}
              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                {/* 텍스트 콘텐츠 */}
                <SafeHtml
                  className="self-stretch justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#6D7882",
                    fontSize: "20px",
                    fontWeight: "400",
                    ...getElementStyle(data.textContentStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("textContent");
                  }}
                  html={
                    data.textContent ||
                    "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                  }
                />

                {/* 피처 3개 */}
                <div className="self-stretch inline-flex justify-center items-start">
                  {/* Feature 1 */}
                  <div className="flex-1 max-w-96 border-r border-gray-10 inline-flex flex-col justify-start items-center gap-4">
                    <div className="w-24 h-24 bg-gray-5 rounded-[50px] overflow-hidden">
                      <UniversalMedia
                        className="w-full h-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                        url={data.feature1Image || "/images/placeholder/icon-feature.jpg"}
                        style={getElementStyle(
                          (data as any).feature1ImageStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature1Image");
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#0ea5e9",
                          fontSize: "24px",
                          fontWeight: "700",
                          ...getElementStyle(
                            (data as any).feature1TitleStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature1Title");
                        }}
                        html={data.feature1Title || "프로그램 특징"}
                      />
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#6D7882",
                          fontSize: "18px",
                          fontWeight: "400",
                          ...getElementStyle(
                            (data as any).feature1DescStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature1Desc");
                        }}
                        html={data.feature1Desc || "프로그램 특징 내용 입력"}
                      />
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex-1 max-w-96 border-r border-gray-10 inline-flex flex-col justify-start items-center gap-4">
                    <div className="w-24 h-24 bg-gray-5 rounded-[50px] overflow-hidden">
                      <UniversalMedia
                        className="w-full h-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                        url={data.feature2Image || "/images/placeholder/icon-feature.jpg"}
                        style={getElementStyle(
                          (data as any).feature2ImageStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature2Image");
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#0ea5e9",
                          fontSize: "24px",
                          fontWeight: "700",
                          ...getElementStyle(
                            (data as any).feature2TitleStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature2Title");
                        }}
                        html={data.feature2Title || "프로그램 특징"}
                      />
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#6D7882",
                          fontSize: "18px",
                          fontWeight: "400",
                          ...getElementStyle(
                            (data as any).feature2DescStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature2Desc");
                        }}
                        html={data.feature2Desc || "프로그램 특징 내용 입력"}
                      />
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex-1 max-w-96 inline-flex flex-col justify-start items-center gap-4">
                    <div className="w-24 h-24 bg-gray-5 rounded-[50px] overflow-hidden">
                      <UniversalMedia
                        className="w-full h-full object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                        url={data.feature3Image || "/images/placeholder/icon-feature.jpg"}
                        style={getElementStyle(
                          (data as any).feature3ImageStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature3Image");
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#0ea5e9",
                          fontSize: "24px",
                          fontWeight: "700",
                          ...getElementStyle(
                            (data as any).feature3TitleStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature3Title");
                        }}
                        html={data.feature3Title || "프로그램 특징"}
                      />
                      <SafeHtml
                        className="text-center justify-start font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                        style={{
                          color: "#6D7882",
                          fontSize: "18px",
                          fontWeight: "400",
                          ...getElementStyle(
                            (data as any).feature3DescStyle,
                            viewport,
                          ),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("feature3Desc");
                        }}
                        html={data.feature3Desc || "프로그램 특징 내용 입력"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 이미지 */}
            <div className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all rounded-tl-2xl rounded-bl-2xl overflow-hidden">
              <UniversalMedia
                className="w-[820px] h-[575px] object-cover"
                url={data.image || "/images/placeholder/hero-image.jpg"}
                alt="banner"
                style={getElementStyle(data.imageStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────── 레이아웃 2 ─── */
  if (layout === "2") {
    return (
      <section
        style={style}
        className="w-full transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("style");
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-72 py-14 flex justify-between items-start">
          {/* 좌측 텍스트 */}
          <div className="inline-flex flex-col justify-start items-start gap-3">
            {/* Program Name */}
            <SafeHtml
              html={data.subTitle || "Program Name."}
              className="justify-start font-['Pretendard'] leading-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
              style={{
                color: "#0ea5e9",
                fontSize: "20px",
                fontWeight: "500",
                ...getElementStyle(data.subTitleStyle, viewport),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("subTitle");
              }}
            />
            {/* 타이틀 */}
            <SafeHtml
              html={data.title || "타이틀명 입력"}
              className="justify-start font-['Pretendard'] leading-[72px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
              style={{
                color: "#111111",
                fontSize: "48px",
                fontWeight: "700",
                ...getElementStyle(data.titleStyle, viewport),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            {/* 서브타이틀 */}
            <SafeHtml
              html={data.desc || "서브타이틀 입력 영역"}
              className="self-stretch justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
              style={{
                color: "#6D7882",
                fontSize: "20px",
                fontWeight: "500",
                ...getElementStyle(data.descStyle, viewport),
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("desc");
              }}
            />
          </div>

          {/* 우측 이미지 + 텍스트 */}
          <div className="w-[800px] flex justify-center items-end gap-10">
            <UniversalMedia
              url={data.image || "/images/placeholder/hero-portrait.jpg"}
              className="w-96 h-96 rounded-tl-[60px] object-cover hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
              style={getElementStyle(data.imageStyle, viewport)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("image");
              }}
            />
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
              {/* 서브 타이틀 */}
              <SafeHtml
                html={data.textContentTitle || "서브 타이틀 입력"}
                className="self-stretch justify-start font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={{
                  color: "#111111",
                  fontSize: "24px",
                  fontWeight: "500",
                  ...getElementStyle(data.textContentTitleStyle, viewport),
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("textContentTitle");
                }}
              />
              <div className="w-14 h-px bg-gray-10"></div>
              {/* 본문 텍스트 */}
              <SafeHtml
                html={
                  data.textContent ||
                  "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다."
                }
                className="self-stretch justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                style={{
                  color: "#6D7882",
                  fontSize: "20px",
                  fontWeight: "500",
                  ...getElementStyle(data.textContentStyle, viewport),
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("textContent");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────── 레이아웃 3 ─── */
  if (layout === "3") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("style");
        }}
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="w-full px-72 pt-28 pb-14 flex flex-col justify-center items-center gap-10">
            <div className="flex justify-center items-center gap-14 w-full">
              <div className="w-12 h-10 bg-gradient-to-r from-시안-mode-Primary30 to-시안-mode-Primary70"></div>
              <div className="flex flex-col justify-center items-center gap-2">
                {/* 서브타이틀 */}
                <SafeHtml
                  className="text-center justify-start font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#111111",
                    fontSize: "24px",
                    fontWeight: "500",
                    ...getElementStyle(data.subTitleStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                  html={
                    data.subTitle ||
                    "1명당 유학 비용 30억원의 시대, 가장 합리적인 선택!"
                  }
                />
                {/* 타이틀 */}
                <SafeHtml
                  className="text-center justify-start font-['Pretendard'] leading-[72px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#111111",
                    fontSize: "48px",
                    fontWeight: "700",
                    ...getElementStyle(data.titleStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                  html={data.title || "학부모 영주권 프로그램"}
                />
                {/* 설명 */}
                <SafeHtml
                  className="text-center justify-start font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                  style={{
                    color: "#6D7882",
                    fontSize: "20px",
                    fontWeight: "500",
                    ...getElementStyle(data.descStyle, viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                  html={
                    data.desc ||
                    "까다로운 자금 출처 없이 국내에서 <br/>온가족이 미국 영주권을 취득할 수 있는 프로그램"
                  }
                />
              </div>
              <div className="w-12 h-10 origin-top-left rotate-180 bg-gradient-to-r from-시안-mode-Primary30 to-시안-mode-Primary70"></div>
            </div>
            {/* 이미지 */}
            <div className="w-full h-96 hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all rounded overflow-hidden">
              <UniversalMedia
                className="w-full h-full object-cover"
                style={getElementStyle(data.imageStyle, viewport)}
                url={data.image || "/images/placeholder/wide-image.jpg"}
                alt="banner"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={style}
      className="w-full py-20 bg-시안-mode-gray5 flex items-center justify-center"
    >
      <div className="text-center font-bold text-gray-400">
        <p className="text-xl text-시안-mode-gray50">
          타이틀 배너 디자인 대기중
        </p>
        <p className="text-sm mt-2 font-mono bg-white px-3 py-1 inline-block shadow-sm">
          레이아웃 {layout}
        </p>
      </div>
    </section>
  );
};
