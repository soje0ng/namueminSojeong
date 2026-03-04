import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  formatUnit,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
} from "./WidgetUtils";

export const TEXT_STRUCTURE_DEFAULTS = {
  layout: "1",
  itemColumns: 2,
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", fontWeight: "500", color: "#285DE1" },
  title: "타이틀명 입력",
  titleStyle: { fontSize: "36px", fontWeight: "700", color: "#111827" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  imageUrl: "/images/placeholder/section-image.jpg",
  imageStyle: { objectFit: "cover", borderRadius: "16px" },

  bgImageUrl: "/images/placeholder/bg-image.jpg",
  contentTitle: "USCIS 우선심사 프로젝트<br/>Copper Valley",
  contentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
  contentDesc:
    "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",

  cases: [
    {
      subTitle: "Case 01",
      title: "자녀 3명 공립 교육으로<br/>총 50억 원의 교육비 절감!",
      features: [
        "영주권 취득 후 온가족 어바인에 정착",
        "자녀 3명 모두 공립 학교 입학으로 학비 Zero!",
        "초, 중, 고 졸업 후 주립 대학 진학으로 In-State 학비 적용",
        "첫째 치대, 둘째 로스쿨, 셋째 아트스쿨 진학 성공",
      ],
      avatars: [
        "/images/placeholder/avatar.jpg",
        "/images/placeholder/avatar.jpg",
        "/images/placeholder/avatar.jpg",
      ],
      imageUrl: "/images/placeholder/section-image.jpg",
    },
    {
      subTitle: "Case 02",
      title: "국내 외고, 국제학교에서<br/>IVY리그 합격까지! ",
      features: [
        "부모님 사업 운영으로 미국 출국 불가, 학부모영주권 진행",
        "첫째는 외고 입학, 둘째는 국제학교 입학",
        "미국 영주권 대학 입시 혜택으로 IVY리그 합격",
        "대학 졸업 후 글로벌 기업 취업 성공 ",
      ],
      avatars: [
        "/images/placeholder/avatar.jpg",
        "/images/placeholder/avatar.jpg",
      ],
      imageUrl: "/images/placeholder/section-image.jpg",
    },
    {
      subTitle: "Case 03",
      title: "초등학교 때 영주권 취득 후<br/>엘리트 코스로 Yale 합격",
      features: [
        "초등학교 때 자녀 학부모영주권으로 영주권 획득",
        "영주권 입시 혜택으로 탑 주니어 보딩스쿨 입학",
        "명문 보딩스쿨도 영주권으로 쿼터 제한 해결",
        "명문 코스를 통해 Yale 대학까지 한번에 합격",
      ],
      avatars: [
        "/images/placeholder/avatar.jpg",
        "/images/placeholder/avatar.jpg",
        "/images/placeholder/avatar.jpg",
      ],
      imageUrl: "/images/placeholder/section-image.jpg",
    },
  ],

  items: [
    {
      id: "ts-1",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-2",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-3",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-4",
      icon: "task_alt",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
  ],
};

export const TEXT_STRUCTURE_6_DEFAULT_SECTIONS = [
  {
    id: "s6-img-1",
    type: "image",
    columns: 2,
    images: [
      "/images/placeholder/section-image.jpg",
      "/images/placeholder/section-image.jpg",
    ],
    imageHeight: "384",
  },
  {
    id: "s6-img-2",
    type: "image",
    columns: 4,
    images: [
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
    ],
    imageHeight: "192",
  },
  {
    id: "s6-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content: "내용을 입력하세요.",
  },
  {
    id: "s6-news-1",
    type: "newsletter",
    newsletterSubTitle: "서브 타이틀 입력",
    leftContent: "왼쪽 내용을 입력하세요.",
    rightContent: "오른쪽 내용을 입력하세요.",
  },
  {
    id: "s6-banner-1",
    type: "stripBanner",
    imageUrl: "/images/placeholder/strip-banner.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc: "내용을 입력하세요.",
  },
];

export const TEXT_STRUCTURE_7_DEFAULT_SECTIONS = [
  {
    id: "s7-img-1",
    type: "image",
    columns: 2,
    images: [
      "/images/placeholder/section-image.jpg",
      "/images/placeholder/section-image.jpg",
    ],
    imageHeight: "380",
  },
  {
    id: "s7-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content: "내용을 입력하세요.",
  },
  {
    id: "s7-news-1",
    type: "newsletter",
    newsletterSubTitle: "서브 타이틀 입력",
    leftContent: "왼쪽 내용을 입력하세요.",
    rightContent: "오른쪽 내용을 입력하세요.",
  },
  {
    id: "s7-banner-1",
    type: "stripBanner",
    imageUrl: "/images/placeholder/strip-banner.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc: "내용을 입력하세요.",
  },
];

export const TEXT_STRUCTURE_8_DEFAULT_SECTIONS = [
  {
    id: "s8-img-1",
    type: "image",
    columns: 1,
    images: ["/images/placeholder/wide-image.jpg"],
    imageHeight: "288",
  },
  {
    id: "s8-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
  {
    id: "s8-feat-1",
    type: "features",
    items: [
      {
        id: "f8-1",
        title: "첫째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
      {
        id: "f8-2",
        title: "둘째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
      {
        id: "f8-3",
        title: "셋째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
    ],
  },
  {
    id: "s8-basic-1",
    type: "basicText",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
];

export const TEXT_STRUCTURE_9_DEFAULT_SECTIONS = [
  {
    id: "s9-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
  {
    id: "s9-feat-1",
    type: "features",
    items: [
      {
        id: "f9-1",
        title: "첫째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
      {
        id: "f9-2",
        title: "둘째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
      {
        id: "f9-3",
        title: "셋째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
      },
    ],
  },
  {
    id: "s9-basic-1",
    type: "basicText",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
];

export const TEXT_STRUCTURE_11_DEFAULT_SECTIONS = [
  {
    id: "s11-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
  {
    id: "s11-img-1",
    type: "image",
    columns: 1,
    images: ["/images/template/text_structure_img11.png"],
    imageHeight: "358",
  },
  {
    id: "s11-feat-1",
    type: "features",
    items: [
      {
        id: "f11-1",
        number: "01.",
        title: "프로그램 특징",
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
      },
      {
        id: "f11-2",
        number: "02.",
        title: "프로그램 특징",
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
      },
      {
        id: "f11-3",
        number: "03.",
        title: "프로그램 특징",
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
      },
    ],
  },
  {
    id: "s11-banner-1",
    type: "banner",
    bannerSubTitle: "배너명 입력하는 부분",
    bannerDesc: "배너명에 대한 설명하는 부분의 텍스트 박스 부분",
  },
];

export const TextStructureRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as GenericNewWidget;
  const style = useWidgetStyle(w.style);
  const data = w.data;
  const layout = data.layout || "1";
  const reverseLayout = !!data.reverseLayout;

  if (layout === "2") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            <div
              className={`self-stretch flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center gap-10 xl:gap-20 w-full`}
            >
              <div
                className="w-full xl:w-[560px] relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden shrink-0 rounded-2xl flex justify-center items-center"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              >
                <img
                  src={data.imageUrl}
                  alt="Structure Image"
                  className="w-full h-auto object-contain"
                  style={getElementStyle(data.imageStyle, viewport)}
                />
              </div>

              <div className="flex-1 inline-flex flex-col justify-center items-start gap-14 w-full">
                <div className="flex flex-col justify-start items-start w-full">
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.subTitle || "( 서브타이틀 )"}
                      className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
                        color: "#285DE1",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("subTitle");
                      }}
                    />
                  )}
                  {!data.titleStyle?.isHidden && (
                    <div
                      className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    >
                      <SafeHtml
                        html={data.title || "타이틀명 입력"}
                        className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                        style={getElementStyle(data.titleStyle, viewport)}
                      />
                    </div>
                  )}
                  {!data.descStyle?.isHidden && (
                    <SafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={getElementStyle(data.descStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  {(data.items || []).map((item: any, i: number) => {
                    const isTitleHidden = item.titleStyle?.isHidden;
                    const isDescHidden = item.descStyle?.isHidden;

                    if (isTitleHidden && isDescHidden) return null;

                    return (
                      <div
                        key={item.id || i}
                        className="self-stretch inline-flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("items", i.toString());
                        }}
                      >
                        <div className="w-8 h-8 bg-시안-mode-Primary5 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-시안-mode-Primary50 flex justify-center items-center gap-2.5 shrink-0">
                          <div
                            data-property-1="Regular"
                            className="w-6 h-6 relative rounded-xl"
                          >
                            <div className="w-6 h-6 left-0 top-0 absolute flex justify-center items-center">
                              <div className="w-3 h-2.5 outline outline-2 outline-offset-[-1px] outline-시안-mode-Primary50"></div>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start gap-2 text-left">
                          {!isTitleHidden && (
                            <SafeHtml
                              html={item.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(item.titleStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", item.id);
                              }}
                            />
                          )}
                          {!isDescHidden && (
                            <SafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(item.descStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemDesc", item.id);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
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
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-[280px] py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            {/* Top Common Header Area */}
            <div
              className="flex flex-col justify-start items-center w-full cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("header");
              }}
            >
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1 text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Split Content Section */}
            <div
              className={`self-stretch border-t border-시안-mode-gray95 inline-flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center w-full overflow-hidden`}
            >
              {/* Left Image Area */}
              <div
                className={`w-full xl:w-[700px] px-5 xl:px-14 py-10 relative border-b xl:border-b-0 ${reverseLayout ? "xl:border-l" : "xl:border-r"} border-시안-mode-gray1 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden group/img hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              >
                <img
                  className="w-full h-full xl:w-[960px] xl:h-[800px] left-0 top-0 absolute mix-blend-overlay object-cover"
                  src={data.bgImageUrl}
                  alt="Background Overlay"
                />
                <div className="self-stretch flex-1 relative overflow-hidden flex justify-center items-center h-auto">
                  <img
                    className="w-full relative object-contain h-auto"
                    src={data.imageUrl}
                    alt="Main Content Image"
                    style={getElementStyle(data.imageStyle, viewport)}
                  />
                </div>
              </div>

              {/* Right Text Area */}
              <div className="flex-1 self-stretch px-5 xl:px-14 py-10 inline-flex flex-col justify-start items-start gap-12 w-full">
                <div className="self-stretch flex flex-col justify-start items-start gap-7 w-full">
                  <div className="self-stretch py-5 border-b border-시안-mode-gray95 flex flex-col justify-center items-start gap-2">
                    {!data.contentTitleStyle?.isHidden && (
                      <SafeHtml
                        html={
                          data.contentTitle ||
                          "USCIS 우선심사 프로젝트<br/>Copper Valley"
                        }
                        className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-[48px] break-keep text-left hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                        style={getElementStyle(
                          data.contentTitleStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("contentTitle");
                        }}
                      />
                    )}
                    {!data.contentSubTitleStyle?.isHidden && (
                      <SafeHtml
                        html={
                          data.contentSubTitle ||
                          "캘리포디나 대형 리조트 건설 프로젝트"
                        }
                        className="justify-start text-시안-mode-gray95 text-xl font-normal font-['Pretendard'] leading-8 break-keep text-left hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                        style={getElementStyle(
                          data.contentSubTitleStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("contentSubTitle");
                        }}
                      />
                    )}
                  </div>
                  {!data.contentDescStyle?.isHidden && (
                    <SafeHtml
                      html={
                        data.contentDesc ||
                        "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용"
                      }
                      className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep text-left"
                      style={getElementStyle(data.contentDescStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("contentDesc");
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "4") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            {(data.cases || []).map((c: any, i: number) => {
              const isEven = reverseLayout ? i % 2 !== 0 : i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`self-stretch p-5 bg-시안-mode-gray5 rounded-[20px] inline-flex flex-col ${
                    isEven ? "xl:flex-row" : "xl:flex-row-reverse"
                  } justify-start items-stretch gap-0 w-full`}
                >
                  <div
                    className="w-full xl:w-[600px] relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl shrink-0"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("imageUrl", i.toString());
                    }}
                  >
                    <img
                      src={c.imageUrl}
                      alt={`Case ${i + 1} Image`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div
                    className={`flex-1 ${
                      isEven ? "xl:pl-14 xl:pr-5" : "xl:pr-14 xl:pl-5"
                    } py-10 xl:py-0 inline-flex flex-col justify-start items-start gap-10 w-full`}
                  >
                    <div className="self-stretch pt-0 xl:pt-10 flex flex-col justify-center items-start w-full">
                      {!c.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={c.subTitle || `Case 0${i + 1}`}
                          className="text-center justify-start text-시안-mode-Primary70 text-xl font-bold font-['Pretendard'] leading-5 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          style={getElementStyle(
                            c.subTitleStyle,
                            viewport as any,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("subTitle", i.toString());
                          }}
                        />
                      )}
                      {!c.titleStyle?.isHidden && (
                        <SafeHtml
                          html={c.title || "케이스 타이틀 입력"}
                          className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-tight xl:leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          style={getElementStyle(c.titleStyle, viewport as any)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("title", i.toString());
                          }}
                        />
                      )}
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
                      {(c.features || []).map(
                        (feature: string, fIdx: number) => {
                          if (c.featureStyle?.isHidden) return null;
                          return (
                            <div
                              key={fIdx}
                              className="self-stretch inline-flex justify-start items-center gap-5"
                            >
                              <div className="w-8 h-8 bg-시안-mode-Primary5 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-시안-mode-Primary50 flex justify-center items-center gap-2.5 shrink-0">
                                <div className="w-6 h-6 relative rounded-xl">
                                  <div className="w-6 h-6 left-0 top-0 absolute flex justify-center items-center">
                                    <div className="w-3 h-2.5 outline outline-2 outline-offset-[-1px] outline-시안-mode-Primary50"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="inline-flex flex-col justify-start items-start gap-2">
                                <SafeHtml
                                  html={feature}
                                  className="justify-start text-zinc-950 text-xl font-medium font-['Pretendard'] leading-8 break-keep text-left hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    c.featureStyle,
                                    viewport as any,
                                  )}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      `casesFeature`,
                                      `${i}-${fIdx}`,
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                    <div className="self-stretch inline-flex justify-center xl:justify-start items-center gap-3 flex-wrap">
                      {(c.avatars || []).map((avatar: string, aIdx: number) => (
                        <div
                          key={aIdx}
                          className="p-6 bg-시안-mode-gray0 rounded-2xl outline outline-1 outline-offset-[-1px] outline-시안-mode-gray20 inline-flex flex-col justify-center items-center gap-5"
                        >
                          <UniversalMedia
                            className="w-24 h-24 rounded-[600px] object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 transition-all cursor-pointer"
                            url={avatar}
                            alt={`Avatar ${aIdx + 1}`}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`caseAvatar`, `${i}-${aIdx}`);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "1") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            <div
              className={`self-stretch flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center gap-10 xl:gap-20 w-full`}
            >
              {/* Left Column */}
              <div className="flex-1 self-stretch flex flex-col justify-between items-start w-full">
                {/* Header Group */}
                <div className="flex flex-col justify-start items-start w-full mb-10 xl:mb-0">
                  {!data.subTitleStyle?.isHidden && (
                    <SafeHtml
                      html={data.subTitle || "( 서브타이틀 )"}
                      className="text-center justify-start text-blue-500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.subTitleStyle, viewport),
                        color: "#285DE1",
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("subTitle");
                      }}
                    />
                  )}
                  {!data.titleStyle?.isHidden && (
                    <div
                      className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("title");
                      }}
                    >
                      <SafeHtml
                        html={data.title || "타이틀명 입력"}
                        className="justify-start text-시안-mode-gray90 text-3xl xl:text-4xl font-bold leading-tight xl:leading-[60px] break-keep"
                        style={getElementStyle(data.titleStyle, viewport)}
                      />
                    </div>
                  )}
                  {!data.descStyle?.isHidden && (
                    <SafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="text-center justify-start text-시안-mode-gray500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={getElementStyle(data.descStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>

                {/* Feature Cards Grid */}
                <div
                  className="self-stretch flex flex-row justify-start items-start flex-wrap mt-10"
                  style={{ gap: `${data.itemGap ?? 20}px` }}
                >
                  {(data.items || []).map((item: any, i: number) => {
                    const isTitleHidden = item.titleStyle?.isHidden;
                    const isDescHidden = item.descStyle?.isHidden;

                    if (isTitleHidden && isDescHidden) return null;

                    return (
                      <div
                        key={item.id || i}
                        className="px-6 py-10 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-시안-mode-gray20 flex flex-col justify-center items-center gap-3 hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                        style={{
                          width:
                            (data.itemColumns ?? 1) === 2
                              ? `calc(50% - ${(data.itemGap ?? 20) / 2}px)`
                              : "100%",
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("items", i.toString());
                        }}
                      >
                        {/* Icon Box */}
                        <div className="w-6 h-6 relative bg-blue-100 rounded-full flex items-center justify-center">
                          {/* Custom icon placeholder mirroring original HTML icon structure */}
                          <div className="w-3 h-2.5 outline outline-2 outline-offset-[-1px] outline-white rounded-sm bg-blue-500"></div>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-1 text-center">
                          {!isTitleHidden && (
                            <SafeHtml
                              html={item.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-xl xl:text-2xl font-bold leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(item.titleStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "itemTitle",
                                  item.id || i.toString(),
                                );
                              }}
                            />
                          )}
                          {!isDescHidden && (
                            <SafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="justify-start text-시안-mode-gray500 text-base xl:text-lg font-normal leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={getElementStyle(item.descStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "itemDesc",
                                  item.id || i.toString(),
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`w-full xl:w-[560px] relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden shrink-0 flex justify-center items-center h-auto`}
                style={{
                  borderRadius: data.imageStyle?.borderRadius
                    ? formatUnit(data.imageStyle.borderRadius)
                    : "16px",
                  minHeight: "0px",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
              >
                <img
                  src={data.imageUrl || "/images/placeholder/section-image.jpg"}
                  alt="Structure Image"
                  className="w-full h-auto object-contain"
                  style={{
                    objectFit:
                      (data.imageStyle
                        ?.objectFit as React.CSSProperties["objectFit"]) ||
                      "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "6") {
    const sections6 = data.sections6 || TEXT_STRUCTURE_6_DEFAULT_SECTIONS;
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full">
            {/* Fixed Header */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1 text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* Dynamic Sections */}
            <div className="self-stretch flex flex-col justify-center items-center gap-6 w-full">
              {sections6.map((section: any) => {
                /* ── IMAGE ── */
                if (section.type === "image") {
                  const cols = section.columns || 2;
                  const colClass =
                    cols === 1
                      ? "grid-cols-1"
                      : cols === 2
                        ? "grid-cols-2"
                        : cols === 3
                          ? "grid-cols-3"
                          : "grid-cols-4";
                  const imgH = `${section.imageHeight || (cols <= 2 ? 384 : 192)}px`;
                  const images: string[] =
                    section.images ||
                    Array(cols)
                      .fill("")
                      .map(
                        (_: any, i: number) =>
                          `/images/placeholder/section-image.jpg + 1}`,
                      );
                  return (
                    <div
                      key={section.id}
                      className={`grid ${colClass} gap-5 w-full`}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                          style={{ height: "auto" }}
                        >
                          <UniversalMedia
                            url={img}
                            className="w-full h-auto object-contain"
                            alt=""
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                `image`,
                                `s6img_${section.id}_${imgIdx}`,
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                }

                /* ── BASIC TEXT ── */
                if (section.type === "text") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionSubTitle`, section.id);
                          }}
                        />
                      )}
                      {!section.contentStyle?.isHidden && (
                        <SafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionContent`, section.id);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                /* ── NEWSLETTER (2-column) TEXT ── */
                if (section.type === "newsletter") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-center items-center gap-5 w-full"
                    >
                      {!section.newsletterSubTitleStyle?.isHidden && (
                        <SafeHtml
                          html={
                            section.newsletterSubTitle || "서브 타이틀 입력"
                          }
                          className="self-stretch text-center justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.newsletterSubTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `sectionNewsletterSubTitle`,
                              section.id,
                            );
                          }}
                        />
                      )}
                      <div className="self-stretch flex flex-col xl:flex-row justify-start items-start gap-14 w-full">
                        <div className="flex-1 text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                          {!section.leftContentStyle?.isHidden && (
                            <SafeHtml
                              html={section.leftContent || "내용을 입력하세요."}
                              style={getElementStyle(
                                section.leftContentStyle,
                                viewport,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterLeft`,
                                  section.id,
                                );
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                          {!section.rightContentStyle?.isHidden && (
                            <SafeHtml
                              html={
                                section.rightContent || "내용을 입력하세요."
                              }
                              style={getElementStyle(
                                section.rightContentStyle,
                                viewport,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterRight`,
                                  section.id,
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                /* ── STRIP BANNER ── */
                if (section.type === "stripBanner") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch bg-시안-mode-gray5 rounded-[20px] inline-flex flex-col md:flex-row justify-center items-center overflow-hidden w-full"
                    >
                      <UniversalMedia
                        url={
                          section.imageUrl ||
                          "/images/placeholder/strip-banner.jpg"
                        }
                        className="w-full md:w-96 h-60 object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        alt=""
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(`image`, `s6banner_${section.id}`);
                        }}
                      />
                      <div className="flex-1 self-stretch px-5 md:px-10 py-5 inline-flex flex-col justify-center items-start gap-3">
                        {!section.bannerSubTitleStyle?.isHidden && (
                          <SafeHtml
                            html={section.bannerSubTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.bannerSubTitleStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bannerSubTitle`, section.id);
                            }}
                          />
                        )}
                        {!section.bannerDescStyle?.isHidden && (
                          <SafeHtml
                            html={section.bannerDesc || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.bannerDescStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bannerDesc`, section.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "7") {
    const sections7 = data.sections7 || TEXT_STRUCTURE_7_DEFAULT_SECTIONS;
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
            {/* 고정 헤더 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1 text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2열 레이아웃: 왼쪽 고정 사이드바 + 오른쪽 동적 섹션 */}
            <div className="self-stretch inline-flex flex-col xl:flex-row justify-start items-start gap-14 w-full">
              {/* 왼쪽 사이드바 (고정) */}
              <div className="w-full xl:w-60 inline-flex flex-col justify-start items-start gap-2 shrink-0">
                {!data.contentTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.contentTitle || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                    style={getElementStyle(data.contentTitleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("contentTitle");
                    }}
                  />
                )}
                {!data.contentSubTitleStyle?.isHidden && (
                  <SafeHtml
                    html={data.contentSubTitle || "이민 프로그램명 입력"}
                    className="justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                    style={getElementStyle(data.contentSubTitleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("contentSubTitle");
                    }}
                  />
                )}
              </div>

              {/* 오른쪽: 동적 섹션 (sections7) */}
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-10 w-full">
                {sections7.map((section: any) => {
                  /* ── IMAGE ── */
                  if (section.type === "image") {
                    const cols = section.columns || 2;
                    const colClass =
                      cols === 1
                        ? "grid-cols-1"
                        : cols === 2
                          ? "grid-cols-2"
                          : cols === 3
                            ? "grid-cols-3"
                            : "grid-cols-4";
                    const imgH = `${section.imageHeight || (cols <= 2 ? 384 : 192)}px`;
                    const images: string[] =
                      section.images ||
                      Array(cols)
                        .fill("")
                        .map(
                          (_: any, i: number) =>
                            `/images/placeholder/section-image.jpg + 1}`,
                        );
                    return (
                      <div
                        key={section.id}
                        className={`grid ${colClass} gap-5 w-full`}
                      >
                        {images.map((img: string, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                            style={{
                              height: "auto",
                            }}
                          >
                            <UniversalMedia
                              url={img}
                              className="w-full h-auto object-contain"
                              alt=""
                              style={getElementStyle(
                                section.imageStyle,
                                viewport,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `image`,
                                  `s7img_${section.id}_${imgIdx}`,
                                );
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  /* ── BASIC TEXT ── */
                  if (section.type === "text") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start gap-2"
                      >
                        <SafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionSubTitle`, section.id);
                          }}
                        />
                        <SafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionContent`, section.id);
                          }}
                        />
                      </div>
                    );
                  }

                  /* ── NEWSLETTER (2-column) TEXT ── */
                  if (section.type === "newsletter") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-center items-center gap-5 w-full"
                      >
                        <SafeHtml
                          html={
                            section.newsletterSubTitle || "서브 타이틀 입력"
                          }
                          className="self-stretch text-center justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.newsletterSubTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `sectionNewsletterSubTitle`,
                              section.id,
                            );
                          }}
                        />
                        <div className="self-stretch flex flex-col xl:flex-row justify-start items-start gap-14 w-full">
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <SafeHtml
                              html={section.leftContent || "내용을 입력하세요."}
                              style={getElementStyle(
                                section.leftContentStyle,
                                viewport,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterLeft`,
                                  section.id,
                                );
                              }}
                            />
                          </div>
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <SafeHtml
                              html={
                                section.rightContent || "내용을 입력하세요."
                              }
                              style={getElementStyle(
                                section.rightContentStyle,
                                viewport,
                              )}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterRight`,
                                  section.id,
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* ── STRIP BANNER ── */
                  if (section.type === "stripBanner") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch bg-시안-mode-gray5 rounded-[20px] inline-flex flex-col md:flex-row justify-center items-center overflow-hidden w-full"
                      >
                        <UniversalMedia
                          url={
                            section.imageUrl ||
                            "/images/placeholder/strip-banner.jpg"
                          }
                          className="w-full md:w-96 h-60 object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                          alt=""
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s7banner_${section.id}`,
                            );
                          }}
                        />
                        <div className="flex-1 self-stretch px-5 md:px-10 py-5 inline-flex flex-col justify-center items-start gap-3">
                          <SafeHtml
                            html={section.bannerSubTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.bannerSubTitleStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bannerSubTitle`, section.id);
                            }}
                          />
                          <SafeHtml
                            html={section.bannerDesc || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.bannerDescStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bannerDesc`, section.id);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "8") {
    const sections8 = data.sections8 || TEXT_STRUCTURE_8_DEFAULT_SECTIONS;
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full">
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
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
                  className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 동적 섹션 */}
            <div className="self-stretch flex flex-col justify-center items-center gap-6 w-full">
              {sections8.map((section: any) => {
                /* ── IMAGE ── */
                if (section.type === "image") {
                  const cols = section.columns || 1;
                  const colClass =
                    cols === 1
                      ? "grid-cols-1"
                      : cols === 2
                        ? "grid-cols-2"
                        : cols === 3
                          ? "grid-cols-3"
                          : "grid-cols-4";
                  const images: string[] =
                    section.images ||
                    (section.imageUrl
                      ? [section.imageUrl]
                      : Array(cols)
                          .fill("")
                          .map(() => "/images/placeholder/wide-image.jpg"));
                  return (
                    <div
                      key={section.id}
                      className={`grid ${colClass} gap-5 w-full`}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-xl w-full flex justify-center items-center h-auto"
                          style={{ height: "auto" }}
                        >
                          <UniversalMedia
                            url={img}
                            className="w-full h-auto object-contain"
                            alt=""
                            style={getElementStyle(
                              section.imageStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                `image`,
                                `s8img_${section.id}_${imgIdx}`,
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                }

                /* ── TEXT ── */
                if (section.type === "text") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                        />
                      )}
                      {!section.contentStyle?.isHidden && (
                        <SafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                /* ── FEATURES ── */
                if (section.type === "features") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                    >
                      {(section.items || []).map((item: any, i: number) => {
                        const isTitleHidden = item.titleStyle?.isHidden;
                        const isDescHidden = item.descStyle?.isHidden;
                        if (isTitleHidden && isDescHidden) return null;

                        return (
                          <div
                            key={item.id || i}
                            className="self-stretch p-4 bg-시안-mode-gray5 inline-flex justify-start items-center gap-5"
                          >
                            {!isTitleHidden && (
                              <SafeHtml
                                html={item.title || `첫째. 타이틀`}
                                className="w-40 justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 shrink-0 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.titleStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", item.id);
                                }}
                              />
                            )}
                            <div className="w-6 h-6 relative shrink-0">
                              <div className="w-6 h-6 left-0 top-0 absolute">
                                <div className="w-2.5 h-3 left-[7px] top-[6px] absolute bg-시안-mode-gray95"></div>
                              </div>
                            </div>
                            {!isDescHidden && (
                              <SafeHtml
                                html={item.desc || "설명을 입력하세요."}
                                className="flex-1 justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.descStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", item.id);
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                /* ── BASIC TEXT ── */
                if (section.type === "basicText") {
                  if (section.contentStyle?.isHidden) return null;
                  return (
                    <SafeHtml
                      key={section.id}
                      html={section.content || "내용을 입력하세요."}
                      className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={getElementStyle(section.contentStyle, viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("sectionBasicText", section.id);
                      }}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "9") {
    const sections9 = data.sections9 || TEXT_STRUCTURE_9_DEFAULT_SECTIONS;
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full">
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1 text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <SafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2열 레이아웃: 왼쪽 고정 이미지 + 오른쪽 동적 섹션 */}
            <div className="self-stretch inline-flex flex-col xl:flex-row justify-center items-start gap-14 w-full">
              {/* 왼쪽: 고정 이미지 */}
              <div
                className="w-full xl:flex-1 relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl shrink-0 flex justify-center items-center h-auto"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("image");
                }}
              >
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/section-image.jpg"}
                  className="w-full h-auto object-contain"
                  alt="Text Structure 9 Image"
                  style={getElementStyle(data.imageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("image");
                  }}
                />
              </div>

              {/* 오른쪽: 동적 섹션 (sections9) */}
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-6 w-full">
                {sections9.map((section: any) => {
                  /* ── TEXT ── */
                  if (section.type === "text") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start gap-2"
                      >
                        {!section.subTitleStyle?.isHidden && (
                          <SafeHtml
                            html={section.subTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.subTitleStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("sectionSubTitle", section.id);
                            }}
                          />
                        )}
                        {!section.contentStyle?.isHidden && (
                          <SafeHtml
                            html={section.content || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.contentStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("sectionContent", section.id);
                            }}
                          />
                        )}
                      </div>
                    );
                  }

                  /* ── FEATURES ── */
                  if (section.type === "features") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start gap-2 w-full"
                      >
                        {(section.items || []).map((item: any, i: number) => {
                          const isTitleHidden = item.titleStyle?.isHidden;
                          const isDescHidden = item.descStyle?.isHidden;
                          if (isTitleHidden && isDescHidden) return null;

                          return (
                            <div
                              key={item.id || i}
                              className="self-stretch p-4 bg-시안-mode-gray5 inline-flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "sectionFeatItem",
                                  `${section.id}_${i}`,
                                );
                              }}
                            >
                              {!isTitleHidden && (
                                <SafeHtml
                                  html={item.title || "첫째. 타이틀"}
                                  className="w-40 justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 shrink-0 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    item.titleStyle,
                                    viewport,
                                  )}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.("itemTitle", item.id);
                                  }}
                                />
                              )}
                              <div className="w-6 h-6 relative shrink-0">
                                <div className="w-6 h-6 left-0 top-0 absolute">
                                  <div className="w-2.5 h-3 left-[7px] top-[6px] absolute bg-시안-mode-gray95"></div>
                                </div>
                              </div>
                              {!isDescHidden && (
                                <SafeHtml
                                  html={
                                    item.desc || "설명 텍스트를 입력하세요."
                                  }
                                  className="flex-1 justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    item.descStyle,
                                    viewport,
                                  )}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.("itemDesc", item.id);
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  /* ── BASIC TEXT ── */
                  if (section.type === "basicText") {
                    if (section.contentStyle?.isHidden) return null;
                    return (
                      <SafeHtml
                        key={section.id}
                        html={section.content || "내용을 입력하세요."}
                        className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(section.contentStyle, viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("sectionBasicText", section.id);
                        }}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "11") {
    const sections11 = data.sections11 || TEXT_STRUCTURE_11_DEFAULT_SECTIONS;
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full">
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <SafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
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
                  className="justify-start text-gray-900 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <SafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-gray-600 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 동적 섹션 */}
            <div className="self-stretch flex flex-col justify-center items-center gap-10 w-full">
              {sections11.map((section: any) => {
                /* ── TEXT ── */
                if (section.type === "text") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <SafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-gray-800 text-2xl font-medium font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                        />
                      )}
                      {!section.contentStyle?.isHidden && (
                        <SafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-gray-600 text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                /* ── IMAGE ── */
                if (section.type === "image") {
                  const cols = section.columns || 1;
                  const colClass =
                    cols === 1
                      ? "grid-cols-1"
                      : cols === 2
                        ? "grid-cols-2"
                        : cols === 3
                          ? "grid-cols-3"
                          : "grid-cols-4";
                  const imgH = `${section.imageHeight || (cols <= 2 ? 384 : 192)}px`;
                  const images: string[] =
                    section.images ||
                    Array(cols)
                      .fill("")
                      .map(
                        (_: any, i: number) =>
                          `/images/placeholder/section-image.jpg`,
                      );
                  return (
                    <div
                      key={section.id}
                      className={`grid ${colClass} gap-5 w-full`}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                          style={{
                            height: "auto",
                          }}
                        >
                          <UniversalMedia
                            url={img}
                            className="w-full h-auto object-contain"
                            alt=""
                            style={getElementStyle(
                              section.imageStyle,
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                `image`,
                                `s11img_${section.id}_${imgIdx}`,
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                }

                /* ── FEATURES ── */
                if (section.type === "features") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch inline-flex flex-col justify-start items-start gap-10"
                    >
                      {(section.items || []).map((item: any, i: number) => {
                        const isTitleHidden = item.titleStyle?.isHidden;
                        const isDescHidden = item.descStyle?.isHidden;
                        if (isTitleHidden && isDescHidden) return null;

                        return (
                          <div
                            key={item.id || i}
                            className="self-stretch pt-4 bg-시안-mode-gray0 border-t border-시안-mode-gray95 inline-flex justify-start items-center gap-6"
                          >
                            {/* 아이콘 영역 */}
                            <div
                              className="w-28 h-28 relative bg-시안-mode-gray5 rounded-[60px] shrink-0 overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer transition-all"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemIcon", item.id);
                              }}
                            >
                              {item.icon ? (
                                <img
                                  src={item.icon}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-8 h-8 bg-gradient-to-br from-시안-mode-Primary50 via-시안-mode-subColor30 to-시안-mode-subColor50 rounded-lg opacity-80" />
                                </div>
                              )}
                            </div>

                            {/* 텍스트 */}
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
                              <div className="flex flex-col justify-start items-start">
                                {!item.numberStyle?.isHidden && (
                                  <SafeHtml
                                    html={item.number || `0${i + 1}.`}
                                    className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                    style={getElementStyle(
                                      item.numberStyle,
                                      viewport,
                                    )}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.("itemNumber", item.id);
                                    }}
                                  />
                                )}
                                {!isTitleHidden && (
                                  <SafeHtml
                                    html={item.title || "프로그램 특징"}
                                    className="justify-start text-zinc-950 text-3xl font-bold font-['Pretendard'] leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                    style={getElementStyle(
                                      item.titleStyle,
                                      viewport,
                                    )}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.("itemTitle", item.id);
                                    }}
                                  />
                                )}
                              </div>
                              {!isDescHidden && (
                                <SafeHtml
                                  html={
                                    item.desc ||
                                    "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다."
                                  }
                                  className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    item.descStyle,
                                    viewport,
                                  )}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.("itemDesc", item.id);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                /* ── BANNER ── */
                if (section.type === "banner") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch px-5 xl:px-10 py-6 bg-시안-mode-gray5 rounded-2xl flex flex-col justify-start items-center gap-3"
                    >
                      <SafeHtml
                        html={section.bannerSubTitle || "배너명 입력하는 부분"}
                        className="text-center justify-start text-[#285DE1] text-2xl font-bold font-['Pretendard'] leading-9 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerSubTitleStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerSubTitle", section.id);
                        }}
                      />
                      <SafeHtml
                        html={
                          section.bannerDesc ||
                          "배너명에 대한 설명하는 부분의 텍스트 박스 부분"
                        }
                        className="self-stretch text-center justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerDescStyle,
                          viewport,
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerDesc", section.id);
                        }}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback Content

  return (
    <section
      style={style}
      className={`w-full relative overflow-hidden group hover:ring-2 hover:ring-blue-500 transition-all ${!data.imageUrl && !data.videoUrl ? "bg-white" : ""}`}
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 md:px-12 xl:px-32 py-12 md:py-24 relative z-10">
        <div className="flex flex-col max-w-4xl mx-auto items-center text-center opacity-50 p-10 bg-시안-mode-gray10 rounded-xl">
          <p className="text-시안-mode-gray50 font-bold mb-2">
            TextStructure 위젯 레이아웃 영역입니다.
          </p>
          <p className="text-시안-mode-gray40 text-sm">
            레이아웃 {layout} 번이 존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
};
