import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  formatUnit,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  getPaddingClass,
  getBorderRadiusClass,
  getBorderRadiusStyle,
} from "./WidgetUtils";
import {
  ImageIcon,
  Video,
  Upload,
  Smartphone,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
} from "lucide-react";

const stripInlineFontSize = (html?: string) => {
  if (!html || typeof html !== "string") return html;

  return html.replace(/style\s*=\s*(["'])(.*?)\1/gi, (_match, quote, css) => {
    const filteredCss = String(css)
      .split(";")
      .map((rule) => rule.trim())
      .filter((rule) => rule && !/^font-size\s*:/i.test(rule));

    return filteredCss.length
      ? `style=${quote}${filteredCss.join("; ")}${quote}`
      : "";
  });
};

const TextStructureSafeHtml: React.FC<
  React.ComponentProps<typeof SafeHtml>
> = ({ html, ...props }) => (
  <SafeHtml html={stripInlineFontSize(html)} {...props} />
);

const cloneTextStructureDefaults = <T,>(value: T): T =>
  JSON.parse(JSON.stringify(value));

const parseOpacityValue = (value: any) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  const normalized = parsed > 1 ? parsed / 100 : parsed;
  return Math.max(0, Math.min(1, normalized));
};

const getOpacityStyle = (value: any): React.CSSProperties | undefined => {
  const opacity = parseOpacityValue(value);
  if (opacity === undefined) return undefined;
  return { opacity };
};

const mergeWithOpacity = (
  base: React.CSSProperties | undefined,
  value: any,
): React.CSSProperties | undefined => {
  const opacityStyle = getOpacityStyle(value);
  if (!base) return opacityStyle;
  if (!opacityStyle) return base;
  return { ...base, ...opacityStyle };
};

export const TEXT_STRUCTURE_DEFAULTS = {
  layout: "1",
  itemColumns: 2,
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", fontWeight: "500", color: "#285DE1" },
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  imageUrl: "/images/placeholder/ts_main_image.jpg",
  layout2ImageUrl: "/images/placeholder/ts_layout2_img.jpg",
  layout3ImageUrl: "/images/placeholder/ts_main_image.jpg",
  imageStyle: { objectFit: "cover" },
  layout3ImageStyle: { objectFit: "cover" },

  layout3SubTitle: "( 서브타이틀 )",
  layout3SubTitleStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#285DE1",
  },
  layout3Title: "타이틀명 입력",
  layout3TitleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  layout3Desc: "이민 프로그램명 입력",
  layout3DescStyle: { fontSize: "20px", fontWeight: "500", color: "#6D7882" },

  l4CheckIconUrl: "/images/placeholder/check_bullet.png",

  bgImageUrl: "/images/placeholder/bg-image.jpg",
  contentTitle: "USCIS 우선심사 프로젝트<br/>Copper Valley",
  contentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
  contentDesc:
    "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
  contentTitleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#09090b",
  },
  contentSubTitleStyle: {
    fontSize: "20px",
    fontWeight: "400",
    color: "#09090b",
  },
  contentDescStyle: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#6D7882",
  },
  layout3ContentTitle: "USCIS 우선심사 프로젝트<br/>Copper Valley",
  layout3ContentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
  layout3ContentDesc:
    "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
  layout3ContentTitleStyle: {
    fontSize: "48px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#09090b",
  },
  layout3ContentSubTitleStyle: {
    fontSize: "20px",
    fontWeight: "400",
    color: "#09090b",
  },
  layout3ContentDescStyle: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#6D7882",
  },

  cases: [
    {
      id: "case-01",
      subTitle: "Case 01",
      title: "자녀 3명 공립 교육으로<br/>총 50억 원의 교육비 절감!",
      features: [
        "영주권 취득 후 온가족 어바인에 정착",
        "자녀 3명 모두 공립 학교 입학으로 학비 Zero!",
        "초, 중, 고 졸업 후 주립 대학 진학으로 In-State 학비 적용",
        "첫째 치대, 둘째 로스쿨, 셋째 아트스쿨 진학 성공",
      ],
      avatars: [
        "/images/placeholder/ts_avatar_01.png",
        "/images/placeholder/ts_avatar_02.png",
        "/images/placeholder/ts_avatar_03.png",
      ],
      imageUrl: "/images/placeholder/ts_case_image.jpg",
      imageOnRight: false,
    },
  ],

  items: [
    {
      id: "ts-1",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-2",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-3",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-4",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: { fontSize: "24px", fontWeight: "700", color: "#09090b" },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
  ],
};

export const TEXT_STRUCTURE_5_DEFAULT_SECTIONS = [
  {
    id: "s5-img-1",
    type: "image",
    columns: 2,
    images: [
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
    ],
  },
  {
    id: "s5-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
  },
  {
    id: "s5-checklist-1",
    type: "checklist",
    bojoTitle: "보조 타이틀 문구 입력",
    items: [
      {
        id: "cl-1",
        title: "프로그램 특징",
        desc: "프로그램 특징 내용 입력",
        iconUrl: "/images/placeholder/ts_checklist_icon.png",
      },
      {
        id: "cl-2",
        title: "프로그램 특징",
        desc: "프로그램 특징 내용 입력",
        iconUrl: "/images/placeholder/ts_checklist_icon.png",
      },
      {
        id: "cl-3",
        title: "프로그램 특징",
        desc: "프로그램 특징 내용 입력",
        iconUrl: "/images/placeholder/ts_checklist_icon.png",
      },
    ],
  },
  {
    id: "s5-labellist-1",
    type: "labelList",
    imageUrl: "/images/placeholder/card-sm.jpg",
    items: [
      { id: "ll-1", label: "라벨명", content: "프로그램 특징 내용 입력" },
      { id: "ll-2", label: "라벨명", content: "프로그램 특징 내용 입력" },
      { id: "ll-3", label: "라벨명", content: "프로그램 특징 내용 입력" },
      { id: "ll-4", label: "라벨명", content: "프로그램 특징 내용 입력" },
    ],
  },
  {
    id: "s5-banner-1",
    type: "imageBanner",
    imageUrl: "/images/placeholder/card-sm.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
  },
];

export const TEXT_STRUCTURE_6_DEFAULT_SECTIONS = [
  {
    id: "s6-img-1",
    type: "image",
    columns: 2,
    images: [
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
    ],
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
    imageUrl: "/images/placeholder/card-sm.jpg",
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
      "/images/placeholder/card-sm.jpg",
      "/images/placeholder/card-sm.jpg",
    ],
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
    imageUrl: "/images/placeholder/card-sm.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc: "내용을 입력하세요.",
  },
];

export const TEXT_STRUCTURE_8_DEFAULT_SECTIONS = [
  {
    id: "s8-img-1",
    type: "image",
    columns: 1,
    images: ["/images/placeholder/card-sm.jpg"],
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
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f8-2",
        title: "둘째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f8-3",
        title: "셋째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
        iconUrl: "/images/placeholder/icon_arrow_right.png",
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
        iconUrl: "/images/placeholder/icon-arrow.png",
      },
      {
        id: "f9-2",
        title: "둘째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f9-3",
        title: "셋째. 타이틀",
        desc: "설명 텍스트를 입력하세요.",
        iconUrl: "/images/placeholder/icon_bullet.png",
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
    images: ["/images/placeholder/card-sm.jpg"],
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
        icon: "/images/placeholder/icon_program_thumb.png",
      },
      {
        id: "f11-2",
        number: "02.",
        title: "프로그램 특징",
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
        icon: "/images/placeholder/icon_program_thumb.png",
      },
      {
        id: "f11-3",
        number: "03.",
        title: "프로그램 특징",
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
        icon: "/images/placeholder/icon_program_thumb.png",
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

export const TEXT_STRUCTURE_10_DEFAULT_SECTIONS = [
  {
    id: "s10-card-1",
    type: "card",
    number: "01.",
    title: "프로그램 특징",
    iconUrl: "/images/placeholder/textcard10.png",
    subTitle: "서브 타이틀 입력",
    subTitleStyle: { isHidden: false },
    desc: "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
    descStyle: { isHidden: false },
    checkTitle: "첫째, 타이틀",
    checkTitleStyle: { isHidden: false },
    checkIconUrl: "/images/placeholder/card_img6.png",
    badges: [
      { id: "b1", text: "우선심사", active: true },
      { id: "b2", text: "I-956F", active: false },
      { id: "b3", text: "높은 고용창출", active: false },
    ],
    badgesStyle: { isHidden: false },
  },
  {
    id: "s10-card-2",
    type: "card",
    number: "02.",
    title: "프로그램 특징",
    iconUrl: "/images/placeholder/textcard10.png",
    subTitle: "서브 타이틀 입력",
    subTitleStyle: { isHidden: false },
    desc: "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    descStyle: { isHidden: false },
    checkTitle: "둘째, 타이틀",
    checkTitleStyle: { isHidden: false },
    checkIconUrl: "/images/placeholder/card_img6.png",
    badges: [
      { id: "b4", text: "배지1", active: true },
      { id: "b5", text: "배지2", active: false },
    ],
    badgesStyle: { isHidden: false },
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
  const layout2ImageUrl =
    (data as any).layout2ImageUrl || "/images/placeholder/ts_layout2_img.jpg";
  const layout2ImageStyle = (data as any).layout2ImageStyle;
  const sectionPaddingClass = getPaddingClass(viewport);
  const sectionPaddingWideClass = getPaddingClass(viewport);
  const sectionPaddingFallbackClass = getPaddingClass(viewport);
  const sectionPaddingPanelClass = getPaddingClass(viewport);
  const sectionPadding40Class = getPaddingClass(viewport);

  if (layout === "10") {
    const sections10 =
      data.sections10 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_10_DEFAULT_SECTIONS);

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                        }}
                      />
                    </div>
                  )}
                  {!data.descStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="text-center justify-start text-시안-mode-gray500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(data.descStyle, viewport),
                        ...(isTablet1 ? {
                          fontSize: "20px",
                          fontWeight: "500",
                          color: "#6d7882",
                          letterSpacing: "-0.4px",
                          lineHeight: 1.5,
                        } : {}),
                      }}
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
                  style={{
                    gap: `${data.itemGap ?? 20}px`,
                    marginTop: (isTablet1 || isMobile1) ? "0" : undefined,
                    justifyContent: isTablet1 ? "center" : undefined,
                    alignItems: isTablet1 ? "flex-start" : undefined,
                  }}
                >
                  {(data.items || []).map((item: any, i: number) => {
                    const isTitleHidden = item.titleStyle?.isHidden;
                    const isDescHidden = item.descStyle?.isHidden;

                    if (isTitleHidden && isDescHidden) return null;

                    return (
                      <div
                        key={item.id || i}
                        className={`px-6 py-10 bg-white ${getBorderRadiusClass(viewport, "rounded-2xl")} outline outline-1 outline-offset-[-1px] outline-시안-mode-gray20 flex flex-col justify-center items-center gap-3 hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer`}
                        style={isTablet1 ? {
                          flex: "1 0 0",
                          minWidth: "320px",
                          padding: "40px 24px",
                          borderRadius: "16px",
                          gap: "12px",
                        } : {
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
                        {/* 체크박스 이미지 */}
                        <UniversalMedia
                          url={
                            item.iconUrl ||
                            "/images/placeholder/icon_checkbox.png"
                          }
                          className="w-6 h-6 object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                          alt="icon"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemIcon",
                              item.id || i.toString(),
                            );
                          }}
                        />

                        <div className="flex flex-col justify-center items-center gap-1 text-center">
                          {!isTitleHidden && (
                            <TextStructureSafeHtml
                              html={item.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-xl xl:text-2xl font-bold leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={{
                                ...getElementStyle(item.titleStyle, viewport),
                                ...(isTablet1 ? {
                                  fontSize: "24px",
                                  fontWeight: "700",
                                  color: "#060606",
                                  letterSpacing: "-0.48px",
                                  lineHeight: 1.5,
                                } : {}),
                              }}
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
                            <TextStructureSafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="justify-start text-시안-mode-gray500 font-normal leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={{
                                ...getElementStyle(item.descStyle, viewport),
                                ...(isTablet1 ? {
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#6d7882",
                                  letterSpacing: "-0.36px",
                                  lineHeight: 1.5,
                                } : {}),
                              }}
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
                className="w-full xl:w-[560px] relative shrink-0 flex justify-center items-center h-auto"
                style={{
                  borderRadius: getBorderRadiusStyle(
                    viewport,
                    data.imageStyle?.borderRadius || "",
                  )
                    ? formatUnit(data.imageStyle.borderRadius)
                    : undefined,
                  minHeight: "0px",
                  width: (isTablet1 || isMobile1) ? "100%" : undefined,
                }}
              >
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/card-sm.jpg"}
                  className="w-full h-auto object-contain"
                  alt="Structure Image"
                  style={{
                    ...getElementStyle(data.imageStyle, viewport),
                    objectFit: isTablet1 ? "cover" : ((data.imageStyle?.objectFit as any) || "contain"),
                    width: (isTablet1 || isMobile1) ? "100%" : undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
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
    const sections6 =
      data.sections6 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_6_DEFAULT_SECTIONS);
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* Fixed Header */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <TextStructureSafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
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
                  const sourceImages =
                    section.images && section.images.length > 0
                      ? section.images
                      : section.imageUrl
                        ? [section.imageUrl]
                        : [];
                  const colClass =
                    cols === 1
                      ? "grid-cols-1"
                      : cols === 2
                        ? "grid-cols-2"
                        : cols === 3
                          ? "grid-cols-3"
                          : "grid-cols-4";
                  const images: string[] = Array.from(
                    { length: cols },
                    (_, i) =>
                      sourceImages[i] || "/images/placeholder/card-sm.jpg",
                  );
                  return (
                    <div
                      key={section.id}
                      className={`grid ${colClass} gap-5 w-full`}
                      style={getOpacityStyle(section.opacity)}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                          style={{
                            height: "auto",
                            ...getOpacityStyle(
                              section.imageOpacities?.[imgIdx],
                            ),
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
                                `s6img_${section.id}_${imgIdx}`,
                              );
                            }}
                            onClick={(e) => {
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
                      style={getOpacityStyle(section.opacity)}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                      style={getOpacityStyle(section.opacity)}
                    >
                      {!section.newsletterSubTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={
                            section.newsletterSubTitle || "서브 타이틀 입력"
                          }
                          className="self-stretch text-center justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                        <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                          {!section.leftContentStyle?.isHidden && (
                            <TextStructureSafeHtml
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
                        <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                          {!section.rightContentStyle?.isHidden && (
                            <TextStructureSafeHtml
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

                /* ── FEATURES ── */
                if (section.type === "features") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2 w-full"
                      style={getOpacityStyle(section.opacity)}
                    >
                      {(section.items || []).map((item: any, i: number) => {
                        const isTitleHidden = item.titleStyle?.isHidden;
                        const isDescHidden = item.descStyle?.isHidden;
                        const featureItemId = item.id || `${section.id}:${i}`;
                        if (isTitleHidden && isDescHidden) return null;

                        return (
                          <div
                            key={item.id || i}
                            className="self-stretch p-4 bg-시안-mode-gray5 inline-flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                            style={getOpacityStyle(item.opacity)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", featureItemId);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", featureItemId);
                            }}
                          >
                            {!isTitleHidden && (
                              <TextStructureSafeHtml
                                html={item.title || "첫째. 타이틀"}
                                className="w-40 justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 shrink-0 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.titleStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", featureItemId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", featureItemId);
                                }}
                              />
                            )}
                            <UniversalMedia
                              url={
                                item.iconUrl ||
                                "/images/placeholder/icon_arrow_right.png"
                              }
                              className="w-6 h-6 object-contain shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                              alt="feature icon"
                              style={getElementStyle(item.iconStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemIcon", featureItemId);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemIcon", featureItemId);
                              }}
                            />
                            {!isDescHidden && (
                              <TextStructureSafeHtml
                                html={item.desc || "설명 텍스트를 입력하세요."}
                                className="flex-1 justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.descStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", featureItemId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", featureItemId);
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                /* ── STRIP BANNER ── */
                if (section.type === "stripBanner") {
                  const bannerHeight = section.imageHeight
                    ? formatUnit(section.imageHeight, "px")
                    : null;
                  return (
                    <div
                      key={section.id}
                      className={`self-stretch bg-시안-mode-gray5 ${getBorderRadiusClass(viewport, "rounded-[20px]")} inline-flex flex-col md:flex-row justify-center md:items-stretch items-center overflow-hidden w-full`}
                      style={
                        bannerHeight
                          ? mergeWithOpacity(
                              { minHeight: bannerHeight, height: bannerHeight },
                              section.opacity,
                            )
                          : getOpacityStyle(section.opacity)
                      }
                    >
                      <div
                        className="w-full md:w-96 h-auto shrink-0 self-stretch cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                        style={
                          bannerHeight
                            ? { minHeight: bannerHeight, height: bannerHeight }
                            : undefined
                        }
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(`image`, `s6banner_${section.id}`);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(`image`, `s6banner_${section.id}`);
                        }}
                      >
                        <UniversalMedia
                          url={
                            section.imageUrl ||
                            "/images/placeholder/card-sm.jpg"
                          }
                          className="w-full h-full object-cover"
                          style={{
                            ...getElementStyle(section.imageStyle, viewport),
                            height: bannerHeight || "100%",
                            minHeight: bannerHeight || undefined,
                          }}
                          alt=""
                        />
                      </div>
                      <div
                        className={`flex-1 self-stretch ${sectionPadding40Class} py-5 inline-flex flex-col justify-center items-start gap-3`}
                      >
                        {!section.bannerSubTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
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
                          <TextStructureSafeHtml
                            html={section.bannerDesc || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
    const sections7 =
      data.sections7 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_7_DEFAULT_SECTIONS);
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            {/* 고정 헤더 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                >
                  <TextStructureSafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
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
                  <TextStructureSafeHtml
                    html={data.contentTitle || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-2xl xl:text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                    style={getElementStyle(data.contentTitleStyle, viewport)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("contentTitle");
                    }}
                  />
                )}
                {!data.contentSubTitleStyle?.isHidden && (
                  <TextStructureSafeHtml
                    html={data.contentSubTitle || "이민 프로그램명 입력"}
                    className="justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                    const images: string[] =
                      section.images ||
                      Array(cols)
                        .fill("")
                        .map(
                          (_: any, i: number) =>
                            `/images/placeholder/card-sm.jpg`,
                        );
                    return (
                      <div
                        key={section.id}
                        className={`grid ${colClass} gap-5 w-full`}
                        style={getOpacityStyle(section.opacity)}
                      >
                        {images.map((img: string, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className={`relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden ${getBorderRadiusClass(viewport, "rounded-2xl")} w-full flex justify-center items-center h-auto`}
                            style={{
                              height: "auto",
                              ...getOpacityStyle(
                                section.imageOpacities?.[imgIdx],
                              ),
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
                              onClick={(e) => {
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
                        style={getOpacityStyle(section.opacity)}
                      >
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionSubTitle`, section.id);
                          }}
                        />
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                        style={getOpacityStyle(section.opacity)}
                      >
                        <TextStructureSafeHtml
                          html={
                            section.newsletterSubTitle || "서브 타이틀 입력"
                          }
                          className="self-stretch text-center justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <TextStructureSafeHtml
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
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <TextStructureSafeHtml
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
                    const bannerHeight = section.imageHeight
                      ? formatUnit(section.imageHeight, "px")
                      : null;
                    return (
                      <div
                        key={section.id}
                        className={`self-stretch bg-시안-mode-gray5 ${getBorderRadiusClass(viewport, "rounded-[20px]")} inline-flex flex-col md:flex-row justify-center md:items-stretch items-center overflow-hidden w-full`}
                        style={
                          bannerHeight
                            ? mergeWithOpacity(
                                {
                                  minHeight: bannerHeight,
                                  height: bannerHeight,
                                },
                                section.opacity,
                              )
                            : getOpacityStyle(section.opacity)
                        }
                      >
                        <div
                          className="w-full md:w-96 h-auto shrink-0 self-stretch cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                          style={
                            bannerHeight
                              ? {
                                  minHeight: bannerHeight,
                                  height: bannerHeight,
                                }
                              : undefined
                          }
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s7banner_${section.id}`,
                            );
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s7banner_${section.id}`,
                            );
                          }}
                        >
                          <UniversalMedia
                            url={
                              section.imageUrl ||
                              "/images/placeholder/card-sm.jpg"
                            }
                            className="w-full h-full object-cover"
                            style={{
                              ...getElementStyle(section.imageStyle, viewport),
                              height: bannerHeight || "100%",
                              minHeight: bannerHeight || undefined,
                            }}
                            alt=""
                          />
                        </div>
                        <div
                          className={`flex-1 self-stretch ${sectionPadding40Class} py-5 inline-flex flex-col justify-center items-start gap-3`}
                        >
                          <TextStructureSafeHtml
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
                          <TextStructureSafeHtml
                            html={section.bannerDesc || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
    const sections8 =
      data.sections8 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_8_DEFAULT_SECTIONS);
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                <TextStructureSafeHtml
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
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                          .map(() => "/images/placeholder/card-sm.jpg"));
                  return (
                    <div
                      key={section.id}
                      className={`grid ${colClass} gap-5 w-full`}
                      style={getOpacityStyle(section.opacity)}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className={`relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden ${getBorderRadiusClass(viewport, "rounded-xl")} w-full flex justify-center items-center h-auto`}
                          style={{
                            height: "auto",
                            ...getOpacityStyle(
                              section.imageOpacities?.[imgIdx],
                            ),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "image",
                              `s8img_${section.id}_${imgIdx}`,
                            );
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "image",
                              `s8img_${section.id}_${imgIdx}`,
                            );
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
                      style={getOpacityStyle(section.opacity)}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
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
                      style={getOpacityStyle(section.opacity)}
                    >
                      {(section.items || []).map((item: any, i: number) => {
                        const isTitleHidden = item.titleStyle?.isHidden;
                        const isDescHidden = item.descStyle?.isHidden;
                        const featureItemId = item.id || `${section.id}:${i}`;
                        if (isTitleHidden && isDescHidden) return null;

                        return (
                          <div
                            key={item.id || i}
                            className="self-stretch p-4 bg-시안-mode-gray5 inline-flex justify-start items-center gap-5"
                            style={getOpacityStyle(item.opacity)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", featureItemId);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("itemTitle", featureItemId);
                            }}
                          >
                            {!isTitleHidden && (
                              <TextStructureSafeHtml
                                html={item.title || `첫째. 타이틀`}
                                className="w-40 justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 shrink-0 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.titleStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", featureItemId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", featureItemId);
                                }}
                              />
                            )}
                            <UniversalMedia
                              url={
                                item.iconUrl ||
                                "/images/placeholder/icon_arrow_right.png"
                              }
                              className="w-6 h-6 object-contain shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                              alt="feature icon"
                              style={getElementStyle(item.iconStyle, viewport)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemIcon", featureItemId);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemIcon", featureItemId);
                              }}
                            />
                            {!isDescHidden && (
                              <TextStructureSafeHtml
                                html={item.desc || "설명 텍스트를 입력하세요."}
                                className="flex-1 justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={getElementStyle(
                                  item.descStyle,
                                  viewport,
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", featureItemId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemDesc", featureItemId);
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
                    <TextStructureSafeHtml
                      key={section.id}
                      html={section.content || "내용을 입력하세요."}
                      className="self-stretch justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={mergeWithOpacity(
                        getElementStyle(section.contentStyle, viewport),
                        section.opacity,
                      )}
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
    const sections9 =
      data.sections9 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_9_DEFAULT_SECTIONS);
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                  <TextStructureSafeHtml
                    html={data.title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={getElementStyle(data.titleStyle, viewport)}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2열 레이아웃: 왼쪽 고정 이미지 + 오른쪽 동적 섹션 */}
            <div
              className={`self-stretch inline-flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-center items-start gap-14 w-full`}
            >
              {/* 왼쪽: 고정 이미지 */}
              <div
                className={`w-full xl:flex-1 relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden ${getBorderRadiusClass(viewport, "rounded-2xl")} shrink-0 flex justify-center items-center h-auto`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("imageUrl");
                }}
              >
                <UniversalMedia
                  url={data.imageUrl || "/images/placeholder/card-sm.jpg"}
                  className="w-full h-auto object-contain"
                  alt="Text Structure 9 Image"
                  style={getElementStyle(data.imageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("imageUrl");
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
                        style={getOpacityStyle(section.opacity)}
                      >
                        {!section.subTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.subTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.subTitleStyle,
                              viewport,
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("sectionSubTitle", section.id);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("sectionSubTitle", section.id);
                            }}
                          />
                        )}
                        {!section.contentStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.content || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={getElementStyle(
                              section.contentStyle,
                              viewport,
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.("sectionContent", section.id);
                            }}
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
                        style={getOpacityStyle(section.opacity)}
                      >
                        {(section.items || []).map((item: any, i: number) => {
                          const isTitleHidden = item.titleStyle?.isHidden;
                          const isDescHidden = item.descStyle?.isHidden;
                          const featureItemId = item.id || `${section.id}:${i}`;
                          if (isTitleHidden && isDescHidden) return null;

                          return (
                            <div
                              key={item.id || i}
                              className="self-stretch p-4 bg-시안-mode-gray5 inline-flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                              style={getOpacityStyle(item.opacity)}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", featureItemId);
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", featureItemId);
                              }}
                            >
                              {!isTitleHidden && (
                                <TextStructureSafeHtml
                                  html={item.title || "첫째. 타이틀"}
                                  className="w-40 justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 shrink-0 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    item.titleStyle,
                                    viewport,
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                />
                              )}
                              {!isDescHidden && (
                                <TextStructureSafeHtml
                                  html={
                                    item.desc || "설명 텍스트를 입력하세요."
                                  }
                                  className="flex-1 justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={getElementStyle(
                                    item.descStyle,
                                    viewport,
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemDesc",
                                      featureItemId,
                                    );
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemDesc",
                                      featureItemId,
                                    );
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
                      <TextStructureSafeHtml
                        key={section.id}
                        html={section.content || "내용을 입력하세요."}
                        className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={mergeWithOpacity(
                          getElementStyle(section.contentStyle, viewport),
                          section.opacity,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("sectionBasicText", section.id);
                        }}
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
    const sections11 =
      data.sections11 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_11_DEFAULT_SECTIONS);
    const isLayout11MiddleSection = (s: any) =>
      s.type === "image" || s.type === "features" || s.type === "basicText";
    const middleStartIndex = sections11.findIndex(isLayout11MiddleSection);
    const topRenderableSections = (
      middleStartIndex >= 0 ? sections11.slice(0, middleStartIndex) : sections11
    ).filter((s: any) => s.type === "text" || s.type === "banner");
    const bottomRenderableSections =
      middleStartIndex >= 0
        ? sections11
            .slice(middleStartIndex)
            .filter((s: any) => s.type === "text" || s.type === "banner")
        : [];
    const hasMiddleSections = sections11.some(isLayout11MiddleSection);
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${sectionPaddingClass} py-14 inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-lg xl:text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
                    color: "#285DE1",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("subTitle");
                  }}
                />
              )}
              {!data.titleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.title || "타이틀명 입력"}
                  className="justify-start text-gray-900 text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.titleStyle, viewport)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("title");
                  }}
                />
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-gray-600 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={getElementStyle(data.descStyle, viewport)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 동적 섹션 */}
            <div className="self-stretch flex flex-col justify-center items-center gap-10 w-full">
              {/* 상단/선행 영역: 순서에 따라 텍스트/배너 렌더 */}
              {topRenderableSections.map((section: any) => {
                if (section.type === "text") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                      style={getOpacityStyle(section.opacity)}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-gray-800 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                        />
                      )}
                      {!section.contentStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-gray-500 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                if (section.type === "banner") {
                  return (
                    <div
                      key={section.id}
                      className={`self-stretch ${sectionPadding40Class} py-6 bg-slate-50 rounded-2xl flex flex-col justify-start items-center gap-3 w-full`}
                      style={getOpacityStyle(section.opacity)}
                    >
                      <TextStructureSafeHtml
                        html={section.bannerSubTitle || "배너명 입력하는 부분"}
                        className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerSubTitleStyle,
                          viewport,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerSubTitle", section.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerSubTitle", section.id);
                        }}
                      />
                      <TextStructureSafeHtml
                        html={
                          section.bannerDesc ||
                          "배너명에 대한 설명하는 부분의 텍스트 박스 부분"
                        }
                        className="self-stretch text-center justify-start text-gray-400 text-lg font-normal font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerDescStyle,
                          viewport,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerDesc", section.id);
                        }}
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

              {/* 중앙 콘텐츠: 좌-이미지, 우-특징목록 (Grid/Flex-row 적용) */}
              {hasMiddleSections && (
                <div className="self-stretch flex flex-col xl:flex-row justify-between items-start gap-10 w-full">
                  {/* 왼쪽: 이미지 영역 */}
                  <div className="w-full xl:flex-1 shrink-0 flex flex-col gap-5">
                    {sections11
                      .filter((s: any) => s.type === "image")
                      .map((section: any) => {
                        const cols = section.columns || 1;
                        const colClass =
                          cols === 1 ? "grid-cols-1" : "grid-cols-2";
                        const images: string[] =
                          section.images ||
                          Array(cols)
                            .fill("")
                            .map(() => `/images/placeholder/card-sm.jpg`);
                        return (
                          <div
                            key={section.id}
                            className={`grid ${colClass} gap-5 w-full`}
                            style={getOpacityStyle(section.opacity)}
                          >
                            {images.map((img: string, imgIdx: number) => (
                              <div
                                key={imgIdx}
                                className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-md w-full flex justify-center items-center h-auto"
                                style={getOpacityStyle(
                                  section.imageOpacities?.[imgIdx],
                                )}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "image",
                                    `s11img_${section.id}_${imgIdx}`,
                                  );
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "image",
                                    `s11img_${section.id}_${imgIdx}`,
                                  );
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
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })}
                  </div>

                  {/* 오른쪽: 특징 리스트 (Features 등) */}
                  <div className="w-full xl:flex-1 flex flex-col gap-10">
                    {sections11
                      .filter(
                        (s: any) =>
                          s.type === "features" || s.type === "basicText",
                      )
                      .map((section: any) => {
                        if (section.type === "features") {
                          return (
                            <div
                              key={section.id}
                              className="self-stretch inline-flex flex-col justify-start items-start gap-0"
                              style={getOpacityStyle(section.opacity)}
                            >
                              {(section.items || []).map(
                                (item: any, i: number) => {
                                  const isTitleHidden =
                                    item.titleStyle?.isHidden;
                                  const isDescHidden = item.descStyle?.isHidden;
                                  const featureItemId =
                                    item.id || `${section.id}:${i}`;
                                  if (isTitleHidden && isDescHidden)
                                    return null;

                                  return (
                                    <div
                                      key={item.id || i}
                                      className={`self-stretch py-6 flex justify-start items-center gap-6 ${i !== 0 ? "border-t border-gray-300" : ""}`}
                                      style={getOpacityStyle(item.opacity)}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.(
                                          "itemTitle",
                                          featureItemId,
                                        );
                                      }}
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        onElementSelect?.(
                                          "itemTitle",
                                          featureItemId,
                                        );
                                      }}
                                    >
                                      {/* 이미지 영역 (기존 아이콘) */}
                                      <div className="w-20 h-auto shrink-0 relative transition-all">
                                        <UniversalMedia
                                          url={
                                            item.iconUrl ||
                                            item.icon ||
                                            "/images/placeholder/icon_program_thumb.png"
                                          }
                                          className="w-full h-auto object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
                                          alt="item image"
                                          onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            onElementSelect?.(
                                              "itemIcon",
                                              featureItemId,
                                            );
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onElementSelect?.(
                                              "itemIcon",
                                              featureItemId,
                                            );
                                          }}
                                        />
                                      </div>

                                      {/* 텍스트 */}
                                      <div className="flex-1 flex flex-col justify-start items-start gap-1">
                                        {!item.numberStyle?.isHidden && (
                                          <TextStructureSafeHtml
                                            html={item.number || `0${i + 1}.`}
                                            className="text-left justify-start text-[#285DE1] font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                            style={getElementStyle(
                                              item.numberStyle,
                                              viewport,
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemNumber",
                                                featureItemId,
                                              );
                                            }}
                                            onDoubleClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemNumber",
                                                featureItemId,
                                              );
                                            }}
                                          />
                                        )}
                                        {!isTitleHidden && (
                                          <TextStructureSafeHtml
                                            html={item.title || "프로그램 특징"}
                                            className="justify-start text-gray-900 text-2xl font-bold font-['Pretendard'] break-keep mt-1 mb-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                            style={getElementStyle(
                                              item.titleStyle,
                                              viewport,
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemTitle",
                                                featureItemId,
                                              );
                                            }}
                                            onDoubleClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemTitle",
                                                featureItemId,
                                              );
                                            }}
                                          />
                                        )}
                                        {!isDescHidden && (
                                          <TextStructureSafeHtml
                                            html={
                                              item.desc ||
                                              "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다."
                                            }
                                            className="self-stretch justify-start text-gray-400 text-lg font-normal font-['Pretendard'] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                            style={getElementStyle(
                                              item.descStyle,
                                              viewport,
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemDesc",
                                                featureItemId,
                                              );
                                            }}
                                            onDoubleClick={(e) => {
                                              e.stopPropagation();
                                              onElementSelect?.(
                                                "itemDesc",
                                                featureItemId,
                                              );
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          );
                        }

                        /* ── BASIC TEXT ── */
                        if (section.type === "basicText") {
                          if (section.contentStyle?.isHidden) return null;
                          return (
                            <TextStructureSafeHtml
                              key={section.id}
                              html={section.content || "내용을 입력하세요."}
                              className="self-stretch justify-start text-시안-mode-gray50 text-lg font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                              style={mergeWithOpacity(
                                getElementStyle(section.contentStyle, viewport),
                                section.opacity,
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "sectionBasicText",
                                  section.id,
                                );
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "sectionBasicText",
                                  section.id,
                                );
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>
              )}

              {/* 하단/후행 영역: 순서에 따라 텍스트/배너 렌더 */}
              {bottomRenderableSections.map((section: any) => {
                if (section.type === "text") {
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start gap-2"
                      style={getOpacityStyle(section.opacity)}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-gray-800 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.subTitleStyle,
                            viewport,
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionSubTitle", section.id);
                          }}
                        />
                      )}
                      {!section.contentStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-gray-500 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={getElementStyle(
                            section.contentStyle,
                            viewport,
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sectionContent", section.id);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                if (section.type === "banner") {
                  return (
                    <div
                      key={section.id}
                      className={`self-stretch ${sectionPadding40Class} py-6 bg-slate-50 rounded-2xl flex flex-col justify-start items-center gap-3 w-full`}
                      style={getOpacityStyle(section.opacity)}
                    >
                      <TextStructureSafeHtml
                        html={section.bannerSubTitle || "배너명 입력하는 부분"}
                        className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerSubTitleStyle,
                          viewport,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerSubTitle", section.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerSubTitle", section.id);
                        }}
                      />
                      <TextStructureSafeHtml
                        html={
                          section.bannerDesc ||
                          "배너명에 대한 설명하는 부분의 텍스트 박스 부분"
                        }
                        className="self-stretch text-center justify-start text-gray-400 text-lg font-normal font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={getElementStyle(
                          section.bannerDescStyle,
                          viewport,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("bannerDesc", section.id);
                        }}
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
      <div
        className={`mx-auto w-full max-w-[1920px] ${sectionPaddingFallbackClass} py-12 md:py-24 relative z-10`}
      >
        <div
          className={`flex flex-col max-w-4xl mx-auto items-center text-center opacity-50 p-10 bg-시안-mode-gray10 ${getBorderRadiusClass(viewport, "rounded-xl")}`}
        >
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
