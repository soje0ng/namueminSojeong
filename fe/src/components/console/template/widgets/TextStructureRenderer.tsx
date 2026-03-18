import React from "react";
import { GenericNewWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  mergeTextStyleWithFallback,
  formatUnit,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  getPaddingClass,
  getVerticalPaddingClass,
  isVideoUrl,
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

const getTextStructureBannerMediaProps = (
  url: string | undefined,
  style: React.CSSProperties,
  bannerHeight: string | null,
) => {
  const isVideoMedia = Boolean(url && isVideoUrl(url));

  return {
    className:
      !bannerHeight && isVideoMedia ? "w-full" : "w-full h-full object-cover",
    style: {
      ...style,
      ...(bannerHeight
        ? { height: bannerHeight, minHeight: bannerHeight }
        : isVideoMedia
          ? { height: "auto", minHeight: undefined }
          : { height: "100%", minHeight: undefined }),
    } as React.CSSProperties,
  };
};

const getTextStructureItemCardBackgroundStyle = (
  itemStyle: any,
  viewport: "mobile" | "tablet" | "desktop",
  baseStyle: React.CSSProperties = {},
) => {
  const resolvedStyle = getElementStyle(itemStyle, viewport) as any;
  const mergedBaseStyle = { ...baseStyle } as React.CSSProperties;

  if (resolvedStyle.backgroundColor && !resolvedStyle.backgroundImage) {
    delete (mergedBaseStyle as any).backgroundImage;
    delete (mergedBaseStyle as any).backgroundSize;
    delete (mergedBaseStyle as any).backgroundPosition;
    delete (mergedBaseStyle as any).backgroundRepeat;
  }

  return {
    ...mergedBaseStyle,
    ...(resolvedStyle.backgroundColor
      ? { backgroundColor: resolvedStyle.backgroundColor }
      : {}),
    ...(resolvedStyle.backgroundImage
      ? {
          backgroundImage: resolvedStyle.backgroundImage,
          backgroundSize: resolvedStyle.backgroundSize || "cover",
          backgroundPosition: resolvedStyle.backgroundPosition || "center",
          backgroundRepeat: resolvedStyle.backgroundRepeat || "no-repeat",
        }
      : {}),
  } as React.CSSProperties;
};

export const TEXT_STRUCTURE_DEFAULTS = {
  layout: "1",
  itemColumns: 2,
  subTitle: "( 서브타이틀 )",
  subTitleStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#285DE1",
    fontSizeMobile: "18px",
  },
  title: "타이틀명 입력",
  titleStyle: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#111827",
    fontSizeMobile: "28px",
  },
  desc: "이민 프로그램명 입력",
  descStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#6b7280",
    fontSizeMobile: "18px",
  },
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
    fontSizeMobile: "18px",
  },
  layout3Title: "타이틀명 입력",
  layout3TitleStyle: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#131416",
    fontSizeMobile: "28px",
  },
  layout3Desc: "이민 프로그램명 입력",
  layout3DescStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#6D7882",
    fontSizeMobile: "18px",
  },

  l4CheckIconUrl: "/images/placeholder/check_bullet.png",

  bgImageUrl: "/images/placeholder/bg-image.jpg",
  contentTitle: "타이틀명 입력",
  contentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
  contentDesc:
    "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
  contentTitleStyle: { fontSize: "48px", fontSizeMobile: "28px", fontWeight: "700", color: "#09090b" },
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
  layout3ContentTitle: "타이틀명 입력",
  layout3ContentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
  layout3ContentDesc:
    "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
  layout3ContentTitleStyle: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#09090b",
    fontSizeMobile: "28px",
  },
  layout3ContentSubTitleStyle: {
    fontSize: "20px",
    fontWeight: "400",
    color: "#09090b",
    fontSizeMobile: "18px",
  },
  layout3ContentDescStyle: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#6D7882",
  },
  l5SubTitle: "( 서브타이틀 )",
  l5SubTitleStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#285DE1",
    fontSizeMobile: "18px",
  },
  l5Title: "타이틀명 입력",
  l5TitleStyle: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#131416",
    fontSizeMobile: "28px",
  },
  l5Desc: "이민 프로그램명 입력",
  l5DescStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#6D7882",
    fontSizeMobile: "18px",
  },
  l5SideTitle: "타이틀명 입력",
  l5SideTitleStyle: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#131416",
    fontSizeMobile: "24px",
  },
  l5SideDesc: "이민 프로그램명 입력",
  l5SideDescStyle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#6D7882",
    fontSizeMobile: "18px",
  },

  cases: [
    {
      id: "case-01",
      subTitle: "Case 01",
      subTitleStyle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#295E92",
        fontSizeMobile: "18px",
      },
      title: "자녀 3명 공립 교육으로<br/>총 50억 원의 교육비 절감!",
      titleStyle: {
        fontSize: "36px",
        fontWeight: "700",
        color: "#131416",
        fontSizeMobile: "28px",
      },
      featureStyle: {
        fontSize: "20px",
        fontWeight: "400",
        color: "#060606",
        fontSizeMobile: "18px",
      },
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
      titleStyle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#09090b",
        fontSizeMobile: "20px",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-2",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#09090b",
        fontSizeMobile: "20px",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-3",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#09090b",
        fontSizeMobile: "20px",
      },
      desc: "프로그램 특징 내용 입력",
      descStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
    {
      id: "ts-4",
      iconUrl: "/images/placeholder/icon_checkbox.png",
      title: "프로그램 특징",
      titleStyle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#09090b",
        fontSizeMobile: "20px",
      },
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
        iconUrl: "/images/placeholder/check_bullet.png",
      },
      {
        id: "cl-2",
        title: "프로그램 특징",
        desc: "프로그램 특징 내용 입력",
        iconUrl: "/images/placeholder/check_bullet.png",
      },
      {
        id: "cl-3",
        title: "프로그램 특징",
        desc: "프로그램 특징 내용 입력",
        iconUrl: "/images/placeholder/check_bullet.png",
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
    subTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "500", color: "#131416" },
    content: "내용을 입력하세요.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
  {
    id: "s7-news-1",
    type: "newsletter",
    newsletterSubTitle: "보조 타이틀 문구 입력",
    newsletterSubTitleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
    leftContent: "왼쪽 내용을 입력하세요.",
    leftContentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
    rightContent: "오른쪽 내용을 입력하세요.",
    rightContentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
  {
    id: "s7-banner-1",
    type: "stripBanner",
    imageUrl: "/images/placeholder/card-sm.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerSubTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "700", color: "#131416" },
    bannerDesc: "내용을 입력하세요.",
    bannerDescStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "500", color: "#6D7882" },
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
    subTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "500", color: "#131416" },
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
  {
    id: "s8-feat-1",
    type: "features",
    items: [
      {
        id: "f8-1",
        title: "첫째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f8-2",
        title: "둘째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f8-3",
        title: "셋째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
    ],
  },
  {
    id: "s8-basic-1",
    type: "basicText",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
];

export const TEXT_STRUCTURE_9_DEFAULT_SECTIONS = [
  {
    id: "s9-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    subTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "500", color: "#131416" },
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
  {
    id: "s9-feat-1",
    type: "features",
    items: [
      {
        id: "f9-1",
        title: "첫째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon-arrow.png",
      },
      {
        id: "f9-2",
        title: "둘째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon_arrow_right.png",
      },
      {
        id: "f9-3",
        title: "셋째. 타이틀",
        titleStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        desc: "설명 텍스트를 입력하세요.",
        descStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        iconUrl: "/images/placeholder/icon_bullet.png",
      },
    ],
  },
  {
    id: "s9-basic-1",
    type: "basicText",
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
];

export const TEXT_STRUCTURE_11_DEFAULT_SECTIONS = [
  {
    id: "s11-text-1",
    type: "text",
    subTitle: "서브 타이틀 입력",
    subTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "700", color: "#131416" },
    content:
      "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    contentStyle: { fontSize: "20px", fontSizeMobile: "18px", fontWeight: "500", color: "#6D7882" },
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
        numberStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        title: "프로그램 특징",
        titleStyle: { fontSize: "28px", fontSizeMobile: "20px", fontWeight: "700", color: "#131416" },
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
        descStyle: { fontSize: "18px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        icon: "/images/placeholder/icon_program_thumb.png",
      },
      {
        id: "f11-2",
        number: "02.",
        numberStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        title: "프로그램 특징",
        titleStyle: { fontSize: "28px", fontSizeMobile: "20px", fontWeight: "700", color: "#131416" },
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
        descStyle: { fontSize: "18px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        icon: "/images/placeholder/icon_program_thumb.png",
      },
      {
        id: "f11-3",
        number: "03.",
        numberStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
        title: "프로그램 특징",
        titleStyle: { fontSize: "28px", fontSizeMobile: "20px", fontWeight: "700", color: "#131416" },
        desc: "프로그램을 설명하는 설명 문구를 2줄까지 적을 수 있습니다.",
        descStyle: { fontSize: "18px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
        icon: "/images/placeholder/icon_program_thumb.png",
      },
    ],
  },
  {
    id: "s11-banner-1",
    type: "banner",
    bannerSubTitle: "배너명 입력하는 부분",
    bannerSubTitleStyle: { fontSize: "24px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
    bannerDesc: "배너명에 대한 설명하는 부분의 텍스트 박스 부분",
    bannerDescStyle: { fontSize: "18px", fontSizeMobile: "18px", fontWeight: "400", color: "#6D7882" },
  },
];

export const TEXT_STRUCTURE_10_DEFAULT_SECTIONS = [
  {
    id: "s10-card-1",
    type: "card",
    number: "01.",
    numberStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
    title: "프로그램 특징",
    titleStyle: { fontSize: "28px", fontSizeMobile: "20px", fontWeight: "700", color: "#060606" },
    iconUrl: "/images/placeholder/textcard10.png",
    imageStyle: { width: "200px", height: "200px", objectFit: "cover" },
    subTitle: "서브 타이틀 입력",
    subTitleStyle: {
      isHidden: false,
      fontSize: "24px",
      fontSizeMobile: "20px",
      fontWeight: "500",
      color: "#131416",
    },
    desc: "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다. 또한, 반응형 그리드 시스템을 적용하여 데스크톱, 태블릿, 모바일에 최적화된 화면을 자동으로 구성합니다.",
    descStyle: {
      isHidden: false,
      fontSize: "20px",
      fontSizeMobile: "18px",
      fontWeight: "400",
      color: "#6D7882",
    },
    checkTitle: "첫째, 타이틀",
    checkTitleStyle: {
      isHidden: false,
      fontSize: "20px",
      fontSizeMobile: "18px",
      fontWeight: "700",
      color: "#285DE1",
    },
    checkIconUrl: "/images/placeholder/card_img6.png",
    checkIconStyle: { width: "24px", height: "24px", objectFit: "contain" },
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
    numberStyle: { fontSize: "20px", fontSizeMobile: "20px", fontWeight: "700", color: "#285DE1" },
    title: "프로그램 특징",
    titleStyle: { fontSize: "28px", fontSizeMobile: "20px", fontWeight: "700", color: "#060606" },
    iconUrl: "/images/placeholder/textcard10.png",
    imageStyle: { width: "200px", height: "200px", objectFit: "cover" },
    subTitle: "서브 타이틀 입력",
    subTitleStyle: {
      isHidden: false,
      fontSize: "24px",
      fontSizeMobile: "20px",
      fontWeight: "500",
      color: "#131416",
    },
    desc: "웹 빌더의 핵심은 속도와 안정성입니다. 우리는 자체 개발한 렌더링 엔진을 통해 기존 방식 대비 페이지 로딩 속도를 40% 이상 개선했습니다.",
    descStyle: {
      isHidden: false,
      fontSize: "20px",
      fontSizeMobile: "18px",
      fontWeight: "400",
      color: "#6D7882",
    },
    checkTitle: "둘째, 타이틀",
    checkTitleStyle: {
      isHidden: false,
      fontSize: "20px",
      fontSizeMobile: "18px",
      fontWeight: "700",
      color: "#285DE1",
    },
    checkIconUrl: "/images/placeholder/card_img6.png",
    checkIconStyle: { width: "24px", height: "24px", objectFit: "contain" },
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
  const style = useWidgetStyle(w.style, viewport as any);
  const data = w.data;
  const layout = data.layout || "1";
  const reverseLayout = !!data.reverseLayout;
  const layout2ImageUrl =
    (data as any).layout2ImageUrl || "/images/placeholder/ts_layout2_img.jpg";
  const layout2ImageStyle = (data as any).layout2ImageStyle;
  const sectionPaddingClass = getPaddingClass(viewport);
  const sectionPaddingWideClass = getPaddingClass(viewport, "xl:px-[280px]");
  const sectionPaddingFallbackClass = getPaddingClass(viewport, "xl:px-32");
  const sectionPaddingPanelClass = getPaddingClass(viewport, "xl:px-14");
  const sectionPadding40Class = getPaddingClass(viewport, "");
  const mobileImageRadiusStyle =
    viewport === "mobile" ? { borderRadius: "8px" } : undefined;

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
            className={`self-stretch ${sectionPaddingClass} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
            style={
              viewport === "tablet"
                ? { paddingLeft: "40px", paddingRight: "40px", paddingTop: "60px", paddingBottom: "60px", gap: "40px" }
                : viewport === "mobile"
                  ? { gap: "40px" }
                  : undefined
            }
          >
            {/* 헤더 영역 */}
            <div
              className="flex flex-col justify-start items-center"
              style={viewport === "mobile" || viewport === "tablet" ? { gap: "0px" } : undefined}
            >
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
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
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                      lineHeight: "1.5",
                      letterSpacing: viewport === "tablet" ? "-0.8px" : viewport === "mobile" ? "-0.56px" : undefined,
                    }}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 카드 리스트 */}
            <div className="self-stretch flex flex-col justify-start items-center w-full border-t border-[#131416]">
              {sections10.map((section: any, i: number) => (
                <div
                  key={section.id}
                  className="self-stretch py-10 bg-white border-b border-[#E6E8EA] flex flex-col xl:flex-row justify-center items-start gap-6 w-full group/card relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all"
                  style={{
                    ...getOpacityStyle(section.opacity),
                    ...(viewport === "tablet"
                      ? { flexDirection: "row", gap: "24px", paddingTop: "40px", paddingBottom: "40px" }
                      : viewport === "mobile"
                        ? { flexDirection: "column", gap: "24px", paddingTop: "12px", paddingBottom: "12px" }
                        : {}),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("sections10", i.toString());
                  }}
                >
                  {/* 좌측 이미지/제목 영역 */}
                  <div
                    className="w-full xl:w-[360px] flex flex-col justify-start items-start gap-3"
                    style={
                      viewport === "tablet"
                        ? { width: "240px", gap: "12px", flexShrink: 0 }
                        : viewport === "mobile"
                          ? { width: "240px", gap: "12px" }
                          : undefined
                    }
                  >
                    <div className="flex flex-col justify-start items-start">
                      {!section.numberStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={
                            section.number ||
                            `${(i + 1).toString().padStart(2, "0")}.`
                          }
                          className="text-center justify-start text-xl font-bold font-['Pretendard'] leading-[150%] tracking-[-0.4px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              {
                                fontSizeMobile: "20px",
                                ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                  ?.numberStyle || {}),
                                ...(section.numberStyle || {}),
                              },
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "tablet" || viewport === "mobile" ? "-0.4px" : undefined,
                            ...(!section.numberStyle?.color &&
                            !section.numberStyle?.backgroundImage
                              ? {
                                  background:
                                    "linear-gradient(133deg, #285DE1 -2.89%, #59A1B9 48.56%, #44A075 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }
                              : {}),
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_number", i.toString());
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_number", i.toString());
                          }}
                        />
                      )}
                      {!section.titleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.title || "프로그램 특징"}
                          className="text-center justify-start font-['Pretendard'] italic-normal hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              {
                                fontSizeMobile: "20px",
                                ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                  ?.titleStyle || {}),
                                ...(section.titleStyle || {}),
                              },
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "tablet" ? "-0.56px" : viewport === "mobile" ? "-0.4px" : undefined,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_title", i.toString());
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_title", i.toString());
                          }}
                        />
                      )}
                    </div>
                    {!section.iconUrlStyle?.isHidden && (
                      <div
                        className="w-[200px] h-[200px] shrink-0 relative flex justify-center items-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                        style={mobileImageRadiusStyle}
                      >
                        <UniversalMedia
                          url={
                            section.iconUrl ||
                            "/images/placeholder/textcard10.png"
                          }
                          className="w-full h-full object-cover"
                          alt="card image"
                          style={{
                            ...getElementStyle(
                              {
                                ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                  ?.imageStyle || {}),
                                ...(section.imageStyle || {}),
                              },
                              viewport,
                            ),
                            ...mobileImageRadiusStyle,
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_image", i.toString());
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.("sections10_image", i.toString());
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 우측 텍스트/상세 영역 (flex: 1) */}
                  <div
                    className="flex-1 flex flex-col justify-center items-start gap-4 w-full"
                    style={
                      viewport === "tablet"
                        ? { gap: "16px" }
                        : viewport === "mobile"
                          ? { gap: "12px" }
                          : undefined
                    }
                  >
                    {!section.subTitleStyle?.isHidden && (
                      <TextStructureSafeHtml
                        html={section.subTitle || "서브 타이틀 입력"}
                        className="self-stretch justify-start text-[#131416] text-2xl font-medium font-['Pretendard'] leading-[150%] tracking-[-0.48px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={{
                          ...getElementStyle(
                            {
                              fontSizeMobile: "20px",
                              ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                ?.subTitleStyle || {}),
                              ...(section.subTitleStyle || {}),
                            },
                            viewport,
                          ),
                          lineHeight: "1.5",
                          letterSpacing: viewport === "tablet" ? "-0.48px" : viewport === "mobile" ? "-0.4px" : undefined,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(
                            "sections10_subTitle",
                            i.toString(),
                          );
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(
                            "sections10_subTitle",
                            i.toString(),
                          );
                        }}
                      />
                    )}
                    {!section.descStyle?.isHidden && (
                      <TextStructureSafeHtml
                        html={section.desc || "내용을 입력하세요."}
                        className="self-stretch justify-start text-[#6D7882] text-xl font-normal font-['Pretendard'] leading-[150%] tracking-[-0.4px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={{
                          ...getElementStyle(
                            {
                              fontSizeMobile: "18px",
                              ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                ?.descStyle || {}),
                              ...(section.descStyle || {}),
                            },
                            viewport,
                          ),
                          lineHeight: "1.5",
                          letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("sections10_desc", i.toString());
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("sections10_desc", i.toString());
                        }}
                      />
                    )}

                    {/* 체크박스 영역 */}
                    {!section.checkTitleStyle?.isHidden && (
                      <div
                        className="inline-flex justify-start items-center gap-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.(
                            "sections10_checkTitle",
                            i.toString(),
                          );
                        }}
                      >
                        {!section.checkIconUrlStyle?.isHidden && (
                          <UniversalMedia
                            url={
                              section.checkIconUrl ||
                              "/images/placeholder/card_img6.png"
                            }
                            className="w-6 h-6 object-contain"
                            alt="check icon"
                            style={getElementStyle(
                              {
                                ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                  ?.checkIconStyle || {}),
                                ...(section.checkIconStyle || {}),
                              },
                              viewport,
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "sections10_checkIcon",
                                i.toString(),
                              );
                            }}
                          />
                        )}
                        <TextStructureSafeHtml
                          html={section.checkTitle || "첫째, 타이틀"}
                          className="justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-[150%] tracking-[-0.4px]"
                          style={{
                            ...getElementStyle(
                              {
                                fontSizeMobile: "18px",
                                ...(TEXT_STRUCTURE_10_DEFAULT_SECTIONS[i]
                                  ?.checkTitleStyle || {}),
                                ...(section.checkTitleStyle || {}),
                              },
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "sections10_checkTitle",
                              i.toString(),
                            );
                          }}
                        />
                      </div>
                    )}

                    {/* 배지 리스트 */}
                    {!section.badgesStyle?.isHidden && (
                      <div className="inline-flex items-center gap-1 flex-wrap">
                        {(section.badges || []).map(
                          (badge: any, bIdx: number) => (
                            <div
                              key={badge.id || bIdx}
                              className={`flex px-3 py-2 justify-center items-center gap-2.5 rounded-lg transition-all cursor-pointer hover:ring-2 hover:ring-blue-300 ${badge.active ? "bg-[#285DE1]" : "bg-[#F6F7FB]"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("", i.toString());
                              }}
                              onDoubleClick={(e) => e.stopPropagation()}
                            >
                              <TextStructureSafeHtml
                                html={badge.text || "라벨"}
                                className={`text-center font-['Pretendard'] text-base font-normal leading-none ${badge.active ? "text-white" : "text-[#6D7882]"}`}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "2") {
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingClass} ${getVerticalPaddingClass(viewport)}`} inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            <div
              className={`self-stretch flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center gap-10 xl:gap-20 w-full`}
              style={
                viewport === "mobile"
                  ? { flexDirection: "column", gap: "24px" }
                  : viewport === "tablet"
                    ? { flexDirection: "column", gap: "40px" }
                    : undefined
              }
            >
              <div
                className="w-full xl:w-[560px] shrink-0 relative flex justify-center items-center h-auto"
                style={
                  viewport === "mobile" || viewport === "tablet"
                    ? { width: "100%" }
                    : undefined
                }
              >
                <UniversalMedia
                  url={layout2ImageUrl}
                  className="w-full h-auto object-contain"
                  alt="Structure Image"
                  style={getElementStyle(layout2ImageStyle, viewport)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout2ImageUrl");
                  }}
                />
              </div>

              <div
                className="flex-1 inline-flex flex-col justify-center items-start gap-14 w-full"
                style={
                  viewport === "mobile"
                    ? { gap: "24px" }
                    : viewport === "tablet"
                      ? { gap: "40px" }
                      : undefined
                }
              >
                <div className="flex flex-col justify-start items-start w-full">
                  {!data.subTitleStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={data.subTitle || "( 서브타이틀 )"}
                      className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                        letterSpacing:
                          viewport === "mobile"
                            ? "-0.36px"
                            : viewport === "tablet"
                              ? "-0.4px"
                              : undefined,
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
                      <TextStructureSafeHtml
                        html={data.title || "타이틀명 입력"}
                        className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                          ...(viewport === "tablet"
                            ? { fontSize: "40px", letterSpacing: "-0.8px" }
                            : viewport === "mobile"
                              ? { letterSpacing: "-0.56px" }
                              : {}),
                        }}
                      />
                    </div>
                  )}
                  {!data.descStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                        letterSpacing:
                          viewport === "mobile"
                            ? "-0.36px"
                            : viewport === "tablet"
                              ? "-0.4px"
                              : undefined,
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>
                <div
                  className="self-stretch flex flex-col justify-start items-start gap-4"
                  style={viewport === "mobile" ? { gap: "16px" } : undefined}
                >
                  {(data.items || []).map((item: any, i: number) => {
                    const isTitleHidden = item.titleStyle?.isHidden;
                    const isDescHidden = item.descStyle?.isHidden;

                    if (isTitleHidden && isDescHidden) return null;

                    return (
                      <div
                        key={item.id || i}
                        className="self-stretch flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                        style={
                          viewport === "mobile" ? { gap: "12px" } : undefined
                        }
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("items", i.toString());
                        }}
                      >
                        <UniversalMedia
                          url={
                            item.iconUrl ||
                            "/images/placeholder/icon_checkbox.png"
                          }
                          className="w-6 h-6 object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer shrink-0"
                          alt="icon"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "itemIcon",
                              item.id || i.toString(),
                            );
                          }}
                        />
                        <div className="flex flex-col justify-start items-start gap-2 text-left">
                          {!isTitleHidden && (
                            <TextStructureSafeHtml
                              html={item.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(item.titleStyle, {
                                    fontSizeMobile: "20px",
                                    }), viewport),
                                ...(viewport !== "desktop"
                                  ? { letterSpacing: "-0.4px" }
                                  : {}),
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.("itemTitle", item.id);
                              }}
                            />
                          )}
                          {!isDescHidden && (
                            <TextStructureSafeHtml
                              html={item.desc || "프로그램 특징 내용 입력"}
                              className="justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(item.descStyle , { fontSizeMobile: "18px", }), viewport),
                                ...(viewport !== "desktop"
                                  ? { letterSpacing: "-0.36px" }
                                  : {}),
                              }}
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
    const l3ContentTitle = data.layout3ContentTitle;
    const l3ContentSubTitle = data.layout3ContentSubTitle;
    const l3ContentDesc = data.layout3ContentDesc;
    const l3ContentTitleStyle =
      data.layout3ContentTitleStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3ContentTitleStyle;
    const l3ContentSubTitleStyle =
      data.layout3ContentSubTitleStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3ContentSubTitleStyle;
    const l3ContentDescStyle =
      data.layout3ContentDescStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3ContentDescStyle;
    const l3SubTitle = data.layout3SubTitle;
    const l3SubTitleStyle =
      data.layout3SubTitleStyle ||
      data.subTitleStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3SubTitleStyle;
    const l3Title = data.layout3Title;
    const l3TitleStyle =
      data.layout3TitleStyle ||
      data.titleStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3TitleStyle;
    const l3Desc = data.layout3Desc;
    const l3DescStyle =
      data.layout3DescStyle ||
      data.descStyle ||
      TEXT_STRUCTURE_DEFAULTS.layout3DescStyle;
    const l3ImageUrl = data.layout3ImageUrl || data.imageUrl;
    const l3ImageStyle = getElementStyle(
      (data as any).layout3ImageStyle || data.imageStyle,
      viewport,
    );
    if (l3ImageStyle.width) {
      delete l3ImageStyle.width;
    }
    if (l3ImageStyle.height) {
      delete l3ImageStyle.height;
    }

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingWideClass} ${getVerticalPaddingClass(viewport)}`} inline-flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-[24px]" : viewport === "tablet" ? "gap-[40px]" : "gap-10"} w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            {/* Top Common Header Area */}
            <div
              className={`flex flex-col justify-start items-center w-full cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all ${viewport === "mobile" ? "gap-0" : ""}`}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("header");
              }}
            >
              {!l3SubTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={l3SubTitle || "( 서브타이틀 )"}
                  className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-[150%] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(l3SubTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    letterSpacing:
                      viewport === "mobile"
                        ? "-0.36px"
                        : viewport === "tablet"
                          ? "-0.4px"
                          : undefined,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3SubTitle");
                  }}
                />
              )}
              {!l3TitleStyle?.isHidden && (
                <div
                  className="justify-start hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full my-1 text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Title");
                  }}
                >
                  <TextStructureSafeHtml
                    html={l3Title || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[150%] break-keep"
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(l3TitleStyle , { fontSizeMobile: "28px", }), viewport),
                      ...(viewport === "tablet" ? { fontSize: "40px" } : {}),
                    }}
                  />
                </div>
              )}
              {!l3DescStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={l3Desc || "이민 프로그램명 입력"}
                  className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-[150%] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(l3DescStyle , { fontSizeMobile: "18px", }), viewport),
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("layout3Desc");
                  }}
                />
              )}
            </div>

            {/* Split Content Section */}
            <div
              className={`self-stretch border-t border-시안-mode-gray95 inline-flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center w-full overflow-hidden`}
              style={
                viewport === "mobile" || viewport === "tablet"
                  ? { flexDirection: "column" }
                  : undefined
              }
            >
              {/* Left Image Area */}
              <div
                className={`w-full xl:w-[700px] ${sectionPaddingPanelClass} py-10 relative border-b xl:border-b-0 ${reverseLayout ? "xl:border-l" : "xl:border-r"} border-시안-mode-gray1 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden group/img hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                style={
                  viewport === "mobile" || viewport === "tablet"
                    ? { width: "100%", padding: "0" }
                    : undefined
                }
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3ImageUrl");
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("layout3ImageUrl");
                }}
              >
                <div className="w-full relative overflow-hidden flex justify-center items-center">
                  <UniversalMedia
                    url={l3ImageUrl}
                    className="w-full object-contain h-auto"
                    alt="Main Content Image"
                    style={l3ImageStyle}
                  />
                </div>
              </div>

              {/* Right Text Area */}
              <div
                className={`flex-1 self-stretch ${sectionPaddingPanelClass} py-10 inline-flex flex-col justify-start items-start gap-12 w-full`}
                style={
                  viewport === "mobile"
                    ? {
                        paddingLeft: "0",
                        paddingRight: "0",
                        paddingTop: "24px",
                        paddingBottom: "0",
                        gap: "47px",
                      }
                    : viewport === "tablet"
                      ? {
                          paddingLeft: "0",
                          paddingRight: "0",
                          paddingTop: "20px",
                          paddingBottom: "20px",
                          gap: "47px",
                        }
                      : undefined
                }
              >
                <div
                  className="self-stretch flex flex-col justify-start items-start gap-7 w-full"
                  style={viewport === "mobile" ? { gap: "8px" } : undefined}
                >
                  <div
                    className="self-stretch py-5 border-b border-시안-mode-gray95 flex flex-col justify-center items-start gap-2"
                    style={
                      viewport === "mobile"
                        ? { paddingTop: "0", paddingBottom: "12px" }
                        : undefined
                    }
                  >
                    {!l3ContentTitleStyle?.isHidden && (
                      <TextStructureSafeHtml
                        html={
                          l3ContentTitle ||
                          "USCIS 우선심사 프로젝트<br/>Copper Valley"
                        }
                        className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-[150%] break-keep text-left hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(l3ContentTitleStyle , { fontSizeMobile: "24px", }), viewport),
                          ...(viewport === "tablet"
                            ? { fontSize: "32px" }
                            : {}),
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout3ContentTitle");
                        }}
                      />
                    )}
                    {!l3ContentSubTitleStyle?.isHidden && (
                      <TextStructureSafeHtml
                        html={
                          l3ContentSubTitle ||
                          "캘리포디나 대형 리조트 건설 프로젝트"
                        }
                        className="justify-start text-시안-mode-gray95 text-xl font-normal font-['Pretendard'] leading-[150%] break-keep text-left hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                        style={getElementStyle(mergeTextStyleWithFallback(l3ContentSubTitleStyle , { fontSizeMobile: "18px", }), viewport)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onElementSelect?.("layout3ContentSubTitle");
                        }}
                      />
                    )}
                  </div>
                  {!l3ContentDescStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={
                        l3ContentDesc ||
                        "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용"
                      }
                      className="self-stretch justify-start text-시안-mode-gray50 text-lg font-normal font-['Pretendard'] leading-[150%] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep text-left"
                      style={getElementStyle(mergeTextStyleWithFallback(l3ContentDescStyle , { fontSizeMobile: "18px", }), viewport)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("layout3ContentDesc");
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
          <div
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingClass} py-0`} inline-flex flex-col justify-start items-center gap-10 w-full`}
          >
            {/* 글로벌 헤더 */}
            <div
              className={`flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-0" : ""}`}
            >
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.subTitleStyle, viewport),
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
                  className="justify-start text-[#131416] text-4xl font-bold font-['Pretendard'] leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
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
                  className="justify-start text-[#6D7882] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(data.descStyle, viewport),
                  }}
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

            {/* 케이스 카드 목록 */}
            {(data.cases || []).map((c: any, i: number) => {
              const imageOnRight = c.imageOnRight || false;
              const isLastCase = i === (data.cases || []).length - 1;
              const isL4CheckIconHidden = Boolean(
                (data as any).l4CheckIconUrlStyle?.isHidden,
              );
              return (
                <div
                  key={c.id || i}
                  className={`self-stretch p-5 bg-[#F6F7FB] rounded-[20px] inline-flex flex-col ${
                    imageOnRight ? "xl:flex-row-reverse" : "xl:flex-row"
                  } justify-start items-stretch gap-0 w-full group/card relative mb-10 last:mb-0`}
                  style={
                    viewport === "mobile"
                      ? {
                          flexDirection: "column",
                          gap: "24px",
                          marginBottom: isLastCase ? "0" : "16px",
                        }
                      : viewport === "tablet"
                        ? { flexDirection: "column", gap: "24px" }
                        : undefined
                  }
                >
                  {/* 이미지 영역 */}
                  <div
                    className="w-full xl:w-[600px] relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl shrink-0 flex items-center"
                    style={
                      viewport === "mobile" || viewport === "tablet"
                        ? { width: "100%" }
                        : undefined
                    }
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("imageUrl", c.id || i.toString());
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("imageUrl", c.id || i.toString());
                    }}
                  >
                    <UniversalMedia
                      url={
                        c.imageUrl ||
                        c.caseImageUrl ||
                        "https://placehold.co/600x584"
                      }
                      alt={`Case ${i + 1} Image`}
                      className="w-full h-auto object-contain rounded-2xl"
                      style={getElementStyle(c.imageStyle, viewport)}
                    />
                  </div>

                  {/* 텍스트 컨텐츠 */}
                  <div
                    className={`flex-1 ${
                      imageOnRight ? "xl:pr-14 xl:pl-5" : "xl:pl-14 xl:pr-5"
                    } py-10 xl:py-0 inline-flex flex-col justify-start items-start gap-10 w-full`}
                    style={
                      viewport === "mobile"
                        ? { padding: "0", gap: "12px" }
                        : viewport === "tablet"
                          ? { padding: "0", gap: "20px" }
                          : undefined
                    }
                  >
                    {/* 케이스 레이블 + 타이틀 */}
                    <div
                      className="self-stretch pt-0 xl:pt-10 flex flex-col justify-center items-start w-full gap-1"
                      style={
                        viewport === "mobile" || viewport === "tablet"
                          ? { paddingTop: "0" }
                          : undefined
                      }
                    >
                      {!c.subTitleStyle?.isHidden && (
                        <div
                          className="text-center justify-start text-[#295E92] text-xl font-bold font-['Pretendard'] leading-5 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "caseSubTitle",
                              c.id || i.toString(),
                            );
                          }}
                        >
                          <TextStructureSafeHtml
                            html={c.subTitle || `Case 0${i + 1}`}
                            style={{
                              ...getElementStyle(c.subTitleStyle, viewport),
                              lineHeight: "1",
                              letterSpacing:
                                viewport === "mobile"
                                  ? "-0.36px"
                                  : viewport === "tablet"
                                    ? "-0.4px"
                                    : undefined,
                            }}
                          />
                        </div>
                      )}
                      {!c.titleStyle?.isHidden && (
                        <div
                          className="justify-start text-[#131416] text-4xl font-bold font-['Pretendard'] leading-tight xl:leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "caseTitle",
                              c.id || i.toString(),
                            );
                          }}
                        >
                          <TextStructureSafeHtml
                            html={c.title || "케이스 타이틀 입력"}
                            style={{
                              ...getElementStyle(mergeTextStyleWithFallback(c.titleStyle , { fontSizeMobile: "28px", }), viewport),
                              ...(viewport === "tablet"
                                ? { fontSize: "40px", letterSpacing: "-0.8px" }
                                : viewport === "mobile"
                                  ? { letterSpacing: "-0.56px" }
                                  : {}),
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* 체크리스트 */}
                    <div
                      className="self-stretch flex flex-col justify-start items-start gap-4 w-full group/feat relative hover:outline-dashed hover:outline-2 hover:outline-blue-300 rounded cursor-pointer p-1 transition-all"
                      style={viewport === "mobile" ? { gap: "0" } : undefined}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        // 이 패널 자체가 아니라 내부 항목을 편집하도록 selection 수정
                      }}
                    >
                      {(c.features || []).map(
                        (feature: string, fIdx: number) => (
                          <div
                            key={fIdx}
                            className="self-stretch inline-flex justify-start items-center gap-5 hover:outline-dashed hover:outline-2 hover:outline-blue-300 rounded cursor-pointer p-1 transition-all"
                            style={
                              viewport === "mobile" ? { gap: "8px" } : undefined
                            }
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "caseFeatureText",
                                `${c.id || i.toString()}:${fIdx}`,
                              );
                            }}
                          >
                            {!isL4CheckIconHidden && (
                              <div
                                className="w-8 h-8 flex justify-center items-center shrink-0 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("l4CheckIconUrl");
                                }}
                              >
                                <UniversalMedia
                                  url={
                                    data.l4CheckIconUrl ||
                                    "/images/placeholder/check_bullet.png"
                                  }
                                  alt="check"
                                  className="w-full h-full object-contain"
                                  style={getElementStyle(
                                    (data as any).l4CheckIconUrlStyle,
                                    viewport,
                                  )}
                                />
                              </div>
                            )}
                            <div
                              className={
                                isL4CheckIconHidden
                                  ? "flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-2"
                                  : "inline-flex flex-col justify-start items-start gap-2"
                              }
                            >
                              <TextStructureSafeHtml
                                html={feature}
                                className="justify-start text-zinc-950 text-xl font-normal font-['Pretendard'] leading-8 break-keep text-left"
                                style={{
                                  ...getElementStyle(c.featureStyle, viewport),
                                  ...(isL4CheckIconHidden
                                    ? { width: "100%" }
                                    : {}),
                                  letterSpacing:
                                    viewport === "mobile"
                                      ? "-0.36px"
                                      : viewport === "tablet"
                                        ? "-0.4px"
                                        : undefined,
                                  lineHeight: "1.5",
                                }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* 로고 그리드 (동적 폭) */}
                    <div
                      className={`self-stretch w-full grid gap-3 ${
                        (c.avatars || []).length === 1
                          ? "grid-cols-1"
                          : (c.avatars || []).length === 2
                            ? "grid-cols-2"
                            : (c.avatars || []).length === 3
                              ? "grid-cols-3"
                              : "grid-cols-2 md:grid-cols-4"
                      } group/logo relative hover:outline-dashed hover:outline-2 hover:outline-blue-300 rounded cursor-pointer p-1 transition-all`}
                      style={viewport === "mobile" ? { gap: "8px" } : undefined}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {(c.avatars || []).map((avatar: string, aIdx: number) => (
                        <div
                          key={aIdx}
                          className="w-full flex justify-center items-center p-6 bg-white/50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#20202020] hover:outline-dashed hover:outline-2 hover:outline-blue-300 cursor-pointer transition-all min-h-[120px]"
                          style={
                            viewport === "mobile"
                              ? {
                                  padding: "8px",
                                  borderRadius: "8px",
                                  minHeight: "unset",
                                }
                              : undefined
                          }
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              "caseLogoUrl",
                              `${c.id || i.toString()}:${aIdx}`,
                            );
                          }}
                        >
                          <img
                            className="object-contain"
                            style={{
                              ...getElementStyle(c.logoStyle, viewport),
                              width: "100%",
                              maxWidth: "140px",
                              maxHeight: "140px",
                            }}
                            src={avatar || "https://placehold.co/100x100"}
                            alt={`Logo ${aIdx + 1}`}
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

  if (layout === "5") {
    const sections5 =
      data.sections5 ||
      cloneTextStructureDefaults(TEXT_STRUCTURE_5_DEFAULT_SECTIONS);
    const l5SubTitleStyle: React.CSSProperties = {
      ...getElementStyle(mergeTextStyleWithFallback(data.l5SubTitleStyle , { fontSizeMobile: "18px", }), viewport),
      ...(data.l5SubTitleStyle?.textAlign
        ? {}
        : { textAlign: "center" as React.CSSProperties["textAlign"] }),
      color: data.l5SubTitleStyle?.color || "#285DE1",
      letterSpacing:
        viewport === "mobile"
          ? "-0.36px"
          : viewport === "tablet"
            ? "-0.4px"
            : undefined,
    };
    const l5TitleStyle: React.CSSProperties = {
      ...getElementStyle(mergeTextStyleWithFallback(data.l5TitleStyle , { fontSizeMobile: "28px", }), viewport),
      ...(data.l5TitleStyle?.textAlign
        ? {}
        : { textAlign: "center" as React.CSSProperties["textAlign"] }),
      ...(viewport === "tablet"
        ? { fontSize: "40px", letterSpacing: "-0.8px" }
        : viewport === "mobile"
          ? { letterSpacing: "-0.56px" }
          : {}),
    };
    const l5DescStyle: React.CSSProperties = {
      ...getElementStyle(mergeTextStyleWithFallback(data.l5DescStyle , { fontSizeMobile: "18px", }), viewport),
      ...(data.l5DescStyle?.textAlign
        ? {}
        : { textAlign: "center" as React.CSSProperties["textAlign"] }),
      letterSpacing:
        viewport === "mobile"
          ? "-0.36px"
          : viewport === "tablet"
            ? "-0.4px"
            : undefined,
    };
    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingClass} ${getVerticalPaddingClass(viewport)}`} inline-flex flex-col justify-start items-center gap-10 w-full`}
            style={
              viewport === "mobile"
                ? { gap: "40px" }
                : viewport === "tablet"
                  ? { gap: "40px" }
                  : undefined
            }
          >
            {/* 글로벌 헤더 (중앙 정렬) */}
            <div className="flex flex-col justify-start items-center w-full gap-1">
              {!data.l5SubTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.l5SubTitle || "( 서브타이틀 )"}
                  className="w-full text-center text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={l5SubTitleStyle}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("l5SubTitle");
                  }}
                />
              )}
              {!data.l5TitleStyle?.isHidden && (
                <div
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full text-center"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("l5Title");
                  }}
                >
                  <TextStructureSafeHtml
                    html={data.l5Title || "타이틀명 입력"}
                    className="text-[#131416] text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep"
                    style={l5TitleStyle}
                  />
                </div>
              )}
              {!data.l5DescStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.l5Desc || "이민 프로그램명 입력"}
                  className="w-full text-center text-[#6D7882] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={l5DescStyle}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("l5Desc");
                  }}
                />
              )}
            </div>

            {/* 본문: 좌측 사이드 컬럼 + 우측 섹션들 */}
            <div
              className="self-stretch pt-10 flex flex-col xl:flex-row justify-start items-start gap-14 w-full"
              style={
                viewport === "mobile"
                  ? {
                      paddingTop: "0",
                      gap: "24px",
                      flexDirection:
                        "column" as React.CSSProperties["flexDirection"],
                    }
                  : viewport === "tablet"
                    ? {
                        paddingTop: "0",
                        gap: "60px",
                        flexDirection:
                          "column" as React.CSSProperties["flexDirection"],
                      }
                    : undefined
              }
            >
              {/* 좌측 좁은 사이드 컬럼 */}
              <div className="w-full xl:w-60 inline-flex flex-col justify-start items-start gap-2 shrink-0">
                {!data.l5SideTitleStyle?.isHidden && (
                  <TextStructureSafeHtml
                    html={data.l5SideTitle || "타이틀명 입력"}
                    className="text-[#131416] text-3xl font-bold font-['Pretendard'] leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.l5SideTitleStyle , { fontSizeMobile: "24px", }), viewport),
                      ...(viewport === "tablet"
                        ? { fontSize: "28px", letterSpacing: "-0.56px" }
                        : viewport === "mobile"
                          ? { letterSpacing: "-0.48px" }
                          : {}),
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("l5SideTitle");
                    }}
                  />
                )}
                {!data.l5SideDescStyle?.isHidden && (
                  <TextStructureSafeHtml
                    html={data.l5SideDesc || "이민 프로그램명 입력"}
                    className="text-[#6D7882] text-xl font-medium font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text w-full"
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.l5SideDescStyle , { fontSizeMobile: "18px", }), viewport),
                      letterSpacing:
                        viewport === "mobile"
                          ? "-0.36px"
                          : viewport === "tablet"
                            ? "-0.4px"
                            : undefined,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("l5SideDesc");
                    }}
                  />
                )}
              </div>

              {/* 우측 동적 섹션들 */}
              <div
                className="flex-1 inline-flex flex-col justify-start items-start gap-10 w-full min-w-0"
                style={
                  viewport === "mobile"
                    ? { gap: "24px" }
                    : viewport === "tablet"
                      ? { gap: "40px" }
                      : undefined
                }
              >
                {sections5.map((section: any, sectionIdx: number) => {
                  const sectionRef =
                    section.id || `${section.type}-${sectionIdx}`;
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
                    const images: string[] = [...(section.images || [])].slice(
                      0,
                      cols,
                    );
                    while (images.length < cols) {
                      images.push("/images/placeholder/card-sm.jpg");
                    }
                    return (
                      <div
                        key={section.id}
                        className={`grid ${colClass} gap-5 w-full`}
                        style={{
                          ...getOpacityStyle(section.opacity),
                          ...(viewport === "mobile"
                            ? { gap: "8px" }
                            : viewport === "tablet"
                              ? { gap: "20px" }
                              : {}),
                        }}
                      >
                        {images.map((img: string, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className="relative overflow-hidden rounded-2xl w-full hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer"
                            style={{
                              height: section.imageHeight
                                ? formatUnit(section.imageHeight, "px")
                                : "auto",
                              ...mobileImageRadiusStyle,
                              ...getOpacityStyle(
                                section.imageOpacities?.[imgIdx],
                              ),
                            }}
                          >
                            <UniversalMedia
                              url={img || "/images/placeholder/card-sm.jpg"}
                              className="w-full h-auto object-contain"
                              alt=""
                              style={{
                                ...getElementStyle(
                                  section.imageStyle,
                                  viewport,
                                ),
                                ...mobileImageRadiusStyle,
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `image`,
                                  `s5img_${sectionRef}_${imgIdx}`,
                                );
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `image`,
                                  `s5img_${sectionRef}_${imgIdx}`,
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
                        className="self-stretch flex flex-col justify-start items-start gap-2 w-full"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          ...(viewport === "mobile" || viewport === "tablet"
                            ? { gap: "8px" }
                            : {}),
                        }}
                      >
                        {!section.subTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.subTitle || "서브 타이틀 입력"}
                            className="self-stretch text-[#131416] text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(mergeTextStyleWithFallback(section.subTitleStyle, {
                                  fontSizeMobile: "20px",
                                  }), viewport),
                              ...(viewport === "tablet"
                                ? { fontSize: "24px", letterSpacing: "-0.48px" }
                                : viewport === "mobile"
                                  ? { letterSpacing: "-0.4px" }
                                  : {}),
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`sectionSubTitle`, section.id);
                            }}
                          />
                        )}
                        {!section.contentStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.content || "내용을 입력하세요."}
                            className="self-stretch text-[#6D7882] text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(mergeTextStyleWithFallback(section.contentStyle, {
                                  fontSizeMobile: "18px",
                                  }), viewport),
                              letterSpacing:
                                viewport === "mobile"
                                  ? "-0.36px"
                                  : viewport === "tablet"
                                    ? "-0.4px"
                                    : undefined,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`sectionContent`, section.id);
                            }}
                          />
                        )}
                      </div>
                    );
                  }

                  /* ── CHECKLIST ── */
                  if (section.type === "checklist") {
                    const items = (section.items || []) as any[];
                    const itemCount = items.length;
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start gap-5 w-full"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          ...(viewport === "tablet"
                            ? { gap: "20px" }
                            : viewport === "mobile"
                              ? { gap: "12px" }
                              : {}),
                        }}
                      >
                        {!section.bojoTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.bojoTitle || "보조 타이틀 문구 입력"}
                            className="text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              letterSpacing:
                                viewport === "mobile" || viewport === "tablet"
                                  ? "-0.4px"
                                  : undefined,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bojoTitle`, section.id);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bojoTitle`, section.id);
                            }}
                          />
                        )}
                        <div
                          className={`self-stretch w-full ${
                            itemCount > 2
                              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                              : "flex flex-col gap-3"
                          }`}
                          style={
                            viewport === "tablet"
                              ? {
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "8px",
                                }
                              : viewport === "mobile"
                                ? {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }
                                : undefined
                          }
                        >
                          {items.map((item: any, itemIdx: number) => {
                            const checklistIconUrl =
                              !item.iconUrl ||
                              item.iconUrl ===
                                "/images/placeholder/ts_checklist_icon.png"
                                ? "/images/placeholder/check_bullet.png"
                                : item.iconUrl;

                            return (
                              <div
                                key={item.id || itemIdx}
                                className={`${itemCount <= 2 ? "w-full" : ""} flex justify-start items-start gap-4 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-2 transition-all cursor-pointer`}
                                style={{
                                  ...getOpacityStyle(item.opacity),
                                  ...(viewport === "tablet"
                                    ? {
                                        flex: "1 0 0",
                                        gap: "20px",
                                        alignItems: "center",
                                      }
                                    : viewport === "mobile"
                                      ? {
                                          width: "100%",
                                          gap: "20px",
                                          alignItems: "center",
                                        }
                                      : {}),
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemTitle",
                                    item.id || `${section.id}:${itemIdx}`,
                                  );
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    "itemTitle",
                                    item.id || `${section.id}:${itemIdx}`,
                                  );
                                }}
                              >
                                <UniversalMedia
                                  url={checklistIconUrl}
                                  className="w-8 h-8 object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer shrink-0 mt-0.5"
                                  alt="check icon"
                                  style={{
                                    ...getElementStyle(item.iconStyle, viewport),
                                    borderRadius: undefined,
                                    borderColor: undefined,
                                    borderWidth: undefined,
                                    borderStyle: undefined,
                                    backgroundColor: undefined,
                                    objectFit: "contain",
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemIcon",
                                      item.id || `${section.id}:${itemIdx}`,
                                    );
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemIcon",
                                      item.id || `${section.id}:${itemIdx}`,
                                    );
                                  }}
                                />
                                <div
                                  className="flex flex-col justify-start items-start gap-1"
                                  style={
                                    viewport === "mobile" ||
                                    viewport === "tablet"
                                      ? { gap: "8px" }
                                      : undefined
                                  }
                                >
                                  <TextStructureSafeHtml
                                    html={item.title || "프로그램 특징"}
                                    className="text-[#09090b] text-xl font-bold font-['Pretendard'] leading-8 break-keep"
                                    style={{
                                      ...getElementStyle(mergeTextStyleWithFallback(item.titleStyle, {
                                          fontSizeMobile: "20px",
                                          }), viewport),
                                      letterSpacing:
                                        viewport === "mobile" ||
                                        viewport === "tablet"
                                          ? "-0.4px"
                                          : undefined,
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemTitle",
                                        item.id || `${section.id}:${itemIdx}`,
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemTitle",
                                        item.id || `${section.id}:${itemIdx}`,
                                      );
                                    }}
                                  />
                                  <TextStructureSafeHtml
                                    html={item.desc || "프로그램 특징 내용 입력"}
                                    className="text-[#6D7882] text-lg font-normal font-['Pretendard'] leading-7 break-keep"
                                    style={{
                                      ...getElementStyle(mergeTextStyleWithFallback(item.descStyle, {
                                          fontSizeMobile: "18px",
                                          }), viewport),
                                      letterSpacing:
                                        viewport === "mobile" ||
                                        viewport === "tablet"
                                          ? "-0.36px"
                                          : undefined,
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemDesc",
                                        item.id || `${section.id}:${itemIdx}`,
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemDesc",
                                        item.id || `${section.id}:${itemIdx}`,
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  /* ── LABEL LIST ── */
                  if (section.type === "labelList") {
                    const items = (section.items || []) as any[];
                    const isStackedLabelListImage =
                      viewport === "mobile" || viewport === "tablet";
                    const labelListImageStyle = getElementStyle(
                      section.imageStyle,
                      viewport,
                    );
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col xl:flex-row justify-start items-start gap-10 w-full"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          ...(isStackedLabelListImage
                            ? {
                                flexDirection: "column-reverse",
                                gap: "24px",
                              }
                            : {}),
                        }}
                      >
                        <div
                          className="flex-1 inline-flex flex-col justify-start items-start min-w-0 w-full"
                        >
                          {items.map((item: any, itemIdx: number) => {
                            const itemLabelId =
                              item.id || `${sectionRef}:${itemIdx}`;
                            const isContentHidden = item.contentStyle?.isHidden;
                            return (
                              <div
                                key={item.id || itemIdx}
                                className="self-stretch py-3 border-b border-[#E6E8EA] inline-flex justify-start items-center gap-3 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                                style={{
                                  ...getOpacityStyle(item.opacity),
                                  ...(viewport === "mobile"
                                    ? {
                                        flexDirection:
                                          "column" as React.CSSProperties["flexDirection"],
                                        alignItems: "flex-start",
                                        paddingTop: "8px",
                                        paddingBottom: "8px",
                                        gap: "8px",
                                      }
                                    : viewport === "tablet"
                                      ? {
                                          flexDirection:
                                            "row" as React.CSSProperties["flexDirection"],
                                          alignItems: "center",
                                          paddingTop: "12px",
                                          paddingBottom: "12px",
                                        }
                                      : {}),
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", itemLabelId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.("itemTitle", itemLabelId);
                                }}
                              >
                                <div
                                  className={`${isContentHidden ? "flex-1 min-w-0 w-full" : "w-44 shrink-0"} flex justify-start items-center gap-3`}
                                >
                                  <UniversalMedia
                                    url={
                                      item.iconUrl ||
                                      item.icon ||
                                      "/images/placeholder/label_feature_icon.png"
                                    }
                                    className="w-10 h-10 object-contain hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer shrink-0"
                                    alt="icon"
                                    style={getElementStyle(
                                      item.iconStyle,
                                      viewport,
                                    )}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemIcon",
                                        item.id || itemLabelId,
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemIcon",
                                        item.id || itemLabelId,
                                      );
                                    }}
                                  />
                                  <TextStructureSafeHtml
                                    html={item.label || "라벨명"}
                                    className="flex-1 min-w-0 text-[#09090b] text-xl font-bold font-['Pretendard'] leading-8 break-keep cursor-text"
                                    style={{
                                      ...getElementStyle(mergeTextStyleWithFallback(item.labelStyle, {
                                          fontSizeMobile: "20px",
                                          }), viewport),
                                      ...(isContentHidden
                                        ? { width: "100%" }
                                        : {}),
                                      letterSpacing:
                                        viewport === "mobile" ||
                                        viewport === "tablet"
                                          ? "-0.4px"
                                          : undefined,
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemTitle",
                                        itemLabelId,
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemTitle",
                                        itemLabelId,
                                      );
                                    }}
                                  />
                                </div>
                                {!isContentHidden && (
                                  <TextStructureSafeHtml
                                    html={
                                      item.content || "프로그램 특징 내용 입력"
                                    }
                                    className="flex-1 text-[#6D7882] text-lg font-normal font-['Pretendard'] leading-7 break-keep"
                                    style={{
                                      ...getElementStyle(mergeTextStyleWithFallback(item.contentStyle, {
                                          fontSizeMobile: "18px",
                                          }), viewport),
                                      letterSpacing:
                                        viewport === "mobile" ||
                                        viewport === "tablet"
                                          ? "-0.36px"
                                          : undefined,
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemDesc",
                                        itemLabelId,
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onElementSelect?.(
                                        "itemDesc",
                                        itemLabelId,
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div
                          className={`w-full rounded-2xl overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer`}
                          style={{
                            width: isStackedLabelListImage ? "100%" : "480px",
                            maxWidth: "100%",
                            flexShrink: isStackedLabelListImage ? 1 : 0,
                            height: isStackedLabelListImage ? "auto" : undefined,
                            alignSelf:
                              isStackedLabelListImage
                                ? "auto"
                                : "stretch",
                            minHeight:
                              isStackedLabelListImage
                                ? "0"
                                : "240px",
                            ...mobileImageRadiusStyle,
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s5labelimg_${sectionRef}`,
                            );
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s5labelimg_${sectionRef}`,
                            );
                          }}
                        >
                          <UniversalMedia
                            url={
                              section.imageUrl ||
                              "/images/placeholder/card-sm.jpg"
                            }
                            className={
                              isStackedLabelListImage
                                ? "w-full"
                                : "w-full object-cover"
                            }
                            alt=""
                            naturalSize={isStackedLabelListImage}
                            style={{
                              ...labelListImageStyle,
                              ...(isStackedLabelListImage
                                ? {
                                    width: "100%",
                                    height: "auto",
                                    minHeight: "0",
                                    maxHeight: "none",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                    display: "block",
                                  }
                                : {}),
                              ...mobileImageRadiusStyle,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }

                  /* ── IMAGE BANNER ── */
                  if (
                    section.type === "imageBanner" ||
                    section.type === "stripBanner"
                  ) {
                    const bannerHeight = section.imageHeight
                      ? formatUnit(section.imageHeight, "px")
                      : null;
                    const bannerMediaUrl =
                      section.imageUrl || "/images/placeholder/card-sm.jpg";
                    const bannerMediaProps = getTextStructureBannerMediaProps(
                      bannerMediaUrl,
                      getElementStyle(section.imageStyle, viewport),
                      bannerHeight,
                    );
                    return (
                      <div
                        key={section.id}
                        className="self-stretch bg-[#F6F7FB] rounded-[20px] flex flex-col xl:flex-row justify-start xl:items-stretch items-center overflow-hidden w-full"
                        style={{
                          ...(bannerHeight
                            ? mergeWithOpacity(
                                {
                                  minHeight: bannerHeight,
                                  height: bannerHeight,
                                },
                                section.opacity,
                              )
                            : getOpacityStyle(section.opacity)),
                          ...(viewport === "tablet"
                            ? {
                                flexDirection:
                                  "row" as React.CSSProperties["flexDirection"],
                                alignItems: "stretch",
                              }
                            : viewport === "mobile"
                              ? {
                                  flexDirection:
                                    "column" as React.CSSProperties["flexDirection"],
                                  borderRadius: "8px",
                                }
                              : {}),
                        }}
                      >
                        <div
                          className="w-full xl:w-96 h-auto shrink-0 self-stretch hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden"
                          style={{
                            ...(bannerHeight
                              ? {
                                  minHeight: bannerHeight,
                                  height: bannerHeight,
                                }
                              : {}),
                            ...(viewport === "tablet"
                              ? { width: "240px" }
                              : viewport === "mobile"
                                ? { width: "100%" }
                                : {}),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s5banner_${section.id}`,
                            );
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `image`,
                              `s5banner_${section.id}`,
                            );
                          }}
                        >
                          <UniversalMedia
                            url={bannerMediaUrl}
                            className={bannerMediaProps.className}
                            alt=""
                            style={bannerMediaProps.style}
                          />
                        </div>
                        <div
                          className={`flex-1 self-stretch ${sectionPadding40Class} py-5 inline-flex flex-col justify-center items-start gap-3`}
                          style={
                            viewport === "tablet"
                              ? { padding: "24px 40px", gap: "12px" }
                              : viewport === "mobile"
                                ? { padding: "12px", gap: "12px" }
                                : undefined
                          }
                        >
                          {!section.bannerSubTitleStyle?.isHidden && (
                            <TextStructureSafeHtml
                              html={
                                section.bannerSubTitle ??
                                section.subTitle ??
                                "서브 타이틀 입력"
                              }
                              className="self-stretch text-[#131416] text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(section.bannerSubTitleStyle, {
                                    fontSizeMobile: "20px",
                                    }), viewport),
                                ...(viewport === "tablet"
                                  ? {
                                      fontSize: "24px",
                                      letterSpacing: "-0.48px",
                                    }
                                  : viewport === "mobile"
                                    ? { letterSpacing: "-0.4px" }
                                    : {}),
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(`bannerSubTitle`, section.id);
                              }}
                            />
                          )}
                          {!section.bannerDescStyle?.isHidden && (
                            <TextStructureSafeHtml
                              html={
                                section.bannerDesc ??
                                section.desc ??
                                "내용을 입력하세요."
                              }
                              className="self-stretch text-[#6D7882] text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(section.bannerDescStyle, {
                                    fontSizeMobile: "18px",
                                    }), viewport),
                                letterSpacing:
                                  viewport === "mobile"
                                    ? "-0.36px"
                                    : viewport === "tablet"
                                      ? "-0.4px"
                                      : undefined,
                              }}
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
        </div>
      </section>
    );
  }

  if (layout === "1") {
    const isTabletOrMobile = viewport === "mobile" || viewport === "tablet";
    const renderLayout1ImageBlock = () => (
      <div
        className="w-full xl:w-[560px] relative shrink-0 flex justify-center items-center h-auto"
        style={{
          borderRadius: data.imageStyle?.borderRadius
            ? formatUnit(data.imageStyle.borderRadius)
            : undefined,
          minHeight: "0px",
          ...(isTabletOrMobile ? { width: "100%" } : {}),
        }}
      >
        <UniversalMedia
          url={data.imageUrl || "/images/placeholder/card-sm.jpg"}
          className="w-full h-auto object-contain"
          alt="Structure Image"
          style={{
            ...getElementStyle(data.imageStyle, viewport),
            objectFit: (data.imageStyle?.objectFit as any) || "contain",
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
    );

    return (
      <section
        style={style}
        className="w-full relative overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1920px] relative">
          <div
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingClass} ${getVerticalPaddingClass(viewport)}`} inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
          >
            <div
              className={`self-stretch flex flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"} justify-start items-center gap-10 xl:gap-20 w-full`}
              style={
                viewport === "mobile"
                  ? { gap: "24px", flexDirection: "column" }
                  : viewport === "tablet"
                    ? { gap: "80px", flexDirection: "column" }
                    : undefined
              }
            >
              {/* Left Column */}
              <div
                className="flex-1 self-stretch flex flex-col justify-between items-start w-full"
                style={
                  viewport === "mobile" || viewport === "tablet"
                    ? { justifyContent: "flex-start", gap: "24px" }
                    : undefined
                }
              >
                {/* Header Group */}
                <div
                  className="flex flex-col justify-start items-start w-full mb-10 xl:mb-0"
                  style={
                    viewport === "mobile" || viewport === "tablet"
                      ? { marginBottom: 0 }
                      : undefined
                  }
                >
                  {!data.subTitleStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={data.subTitle || "( 서브타이틀 )"}
                      className="text-left justify-start text-blue-500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                        letterSpacing:
                          viewport === "mobile"
                            ? "-0.36px"
                            : viewport === "tablet"
                              ? "-0.4px"
                              : undefined,
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
                      <TextStructureSafeHtml
                        html={data.title || "타이틀명 입력"}
                        className="justify-start text-시안-mode-gray90 text-3xl xl:text-4xl font-bold leading-tight xl:leading-[60px] break-keep"
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                          ...(viewport === "tablet"
                            ? { fontSize: "40px", letterSpacing: "-0.8px" }
                            : viewport === "mobile"
                              ? { letterSpacing: "-0.56px" }
                              : {}),
                        }}
                      />
                    </div>
                  )}
                  {!data.descStyle?.isHidden && (
                    <TextStructureSafeHtml
                      html={data.desc || "이민 프로그램명 입력"}
                      className="text-left justify-start text-시안-mode-gray500 text-lg xl:text-xl font-medium leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                        letterSpacing:
                          viewport === "mobile"
                            ? "-0.36px"
                            : viewport === "tablet"
                              ? "-0.4px"
                              : undefined,
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("desc");
                      }}
                    />
                  )}
                </div>

                {isTabletOrMobile && renderLayout1ImageBlock()}

                {/* Feature Cards Grid */}
                <div
                  className="self-stretch flex flex-row justify-start items-start flex-wrap"
                  style={{
                    gap:
                      viewport === "mobile"
                        ? "8px"
                        : viewport === "tablet"
                          ? "20px"
                          : `${data.itemGap ?? 20}px`,
                    marginTop:
                      viewport === "mobile" || viewport === "tablet"
                        ? "0"
                        : "40px",
                    ...(viewport === "tablet"
                      ? { justifyContent: "center", alignItems: "center" }
                      : {}),
                  }}
                >
                  {(data.items || []).map((item: any, i: number) => {
                    const isTitleHidden = item.titleStyle?.isHidden;
                    const isDescHidden = item.descStyle?.isHidden;
                    const itemCardSelectId = item.id || `__idx_${i}`;
                    const itemCardBackgroundStyle =
                      getTextStructureItemCardBackgroundStyle(
                        item.itemStyle,
                        viewport,
                        {
                          backgroundColor: "#ffffff",
                        },
                      );
                    const resolvedItemIconStyle = getElementStyle(
                      item.iconStyle,
                      viewport,
                    );
                    const itemIconFrameStyle: React.CSSProperties = {
                      ...(resolvedItemIconStyle.width
                        ? { width: resolvedItemIconStyle.width }
                        : {}),
                      ...(resolvedItemIconStyle.height
                        ? { height: resolvedItemIconStyle.height }
                        : {}),
                      ...(resolvedItemIconStyle.backgroundColor
                        ? {
                            backgroundColor:
                              resolvedItemIconStyle.backgroundColor,
                          }
                        : {}),
                      ...(resolvedItemIconStyle.backgroundImage
                        ? {
                            backgroundImage:
                              resolvedItemIconStyle.backgroundImage,
                            backgroundSize:
                              resolvedItemIconStyle.backgroundSize || "cover",
                            backgroundPosition:
                              resolvedItemIconStyle.backgroundPosition ||
                              "center",
                            backgroundRepeat:
                              resolvedItemIconStyle.backgroundRepeat ||
                              "no-repeat",
                          }
                        : {}),
                      ...(resolvedItemIconStyle.borderRadius
                        ? { borderRadius: resolvedItemIconStyle.borderRadius }
                        : {}),
                      ...(resolvedItemIconStyle.opacity !== undefined
                        ? { opacity: resolvedItemIconStyle.opacity }
                        : {}),
                    };
                    const itemIconMediaStyle: React.CSSProperties = {
                      ...resolvedItemIconStyle,
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: resolvedItemIconStyle.objectFit || "contain",
                      backgroundColor: undefined,
                      backgroundImage: undefined,
                      backgroundSize: undefined,
                      backgroundPosition: undefined,
                      backgroundRepeat: undefined,
                      opacity: undefined,
                    };

                    if (isTitleHidden && isDescHidden) return null;

                    return (
                      <div
                        key={item.id || i}
                        className="bg-white outline outline-1 outline-offset-[-1px] outline-시안-mode-gray20 flex flex-col justify-center items-center gap-3 hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                        style={{
                          ...itemCardBackgroundStyle,
                          width:
                            viewport === "mobile"
                              ? "calc(50% - 4px)"
                              : viewport === "tablet"
                                ? `calc(50% - 10px)`
                                : (data.itemColumns ?? 2) === 2
                                  ? `calc(50% - ${(data.itemGap ?? 20) / 2}px)`
                                  : "100%",
                          padding:
                            viewport === "mobile" ? "16px 8px" : "40px 24px",
                          borderRadius: viewport === "mobile" ? "8px" : "16px",
                        }}
                        onClick={(e) => {
                          if (e.target !== e.currentTarget) return;
                          e.stopPropagation();
                          onElementSelect?.("itemStyle", itemCardSelectId);
                        }}
                        onDoubleClick={(e) => {
                          if (e.target !== e.currentTarget) return;
                          e.stopPropagation();
                          onElementSelect?.("itemStyle", itemCardSelectId);
                        }}
                      >
                        {/* 체크박스 이미지 */}
                        {!item.iconStyle?.isHidden && (
                          <div
                            className="w-6 h-6 flex items-center justify-center overflow-hidden hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                            style={itemIconFrameStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "itemIcon",
                                item.id || i.toString(),
                              );
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(
                                "itemIcon",
                                item.id || i.toString(),
                              );
                            }}
                          >
                            <UniversalMedia
                              url={
                                item.iconUrl ??
                                item.icon ??
                                "/images/placeholder/icon_checkbox.png"
                              }
                              className="w-full h-full"
                              style={itemIconMediaStyle}
                              alt="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "itemIcon",
                                  item.id || i.toString(),
                                );
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  "itemIcon",
                                  item.id || i.toString(),
                                );
                              }}
                            />
                          </div>
                        )}

                        <div className="flex flex-col justify-center items-center gap-1 text-center">
                          {!isTitleHidden && (
                            <TextStructureSafeHtml
                              html={item.title || "프로그램 특징"}
                              className="justify-start text-zinc-950 text-xl xl:text-2xl font-bold leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(item.titleStyle, {
                                    fontSizeMobile: "20px",
                                    }), viewport),
                                ...(viewport === "tablet"
                                  ? { letterSpacing: "-0.48px" }
                                  : viewport === "mobile"
                                    ? { letterSpacing: "-0.4px" }
                                    : {}),
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
                                ...getElementStyle(mergeTextStyleWithFallback(item.descStyle , { fontSizeMobile: "18px", }), viewport),
                                ...(viewport !== "desktop"
                                  ? { letterSpacing: "-0.36px" }
                                  : {}),
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

              {!isTabletOrMobile && renderLayout1ImageBlock()}
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
            className={`self-stretch ${viewport === "mobile" ? "px-5 py-[30px]" : viewport === "tablet" ? "px-[40px] py-[60px]" : `${sectionPaddingClass} ${getVerticalPaddingClass(viewport)}`} inline-flex flex-col justify-start items-center gap-10 w-full`}
            style={
              viewport === "mobile"
                ? { gap: "24px" }
                : viewport === "tablet"
                  ? { gap: "40px" }
                  : undefined
            }
          >
            {/* Fixed Header */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    letterSpacing:
                      viewport === "mobile"
                        ? "-0.36px"
                        : viewport === "tablet"
                          ? "-0.4px"
                          : undefined,
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
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                      ...(viewport === "tablet"
                        ? { fontSize: "40px", letterSpacing: "-0.8px" }
                        : viewport === "mobile"
                          ? { letterSpacing: "-0.56px" }
                          : {}),
                    }}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    letterSpacing:
                      viewport === "mobile"
                        ? "-0.36px"
                        : viewport === "tablet"
                          ? "-0.4px"
                          : undefined,
                  }}
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
                      style={{
                        ...getOpacityStyle(section.opacity),
                        ...(viewport === "mobile"
                          ? { gap: "8px" }
                          : viewport === "tablet"
                            ? { gap: "20px" }
                            : {}),
                      }}
                    >
                      {images.map((img: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                          style={{
                            height: "auto",
                            ...mobileImageRadiusStyle,
                            ...getOpacityStyle(
                              section.imageOpacities?.[imgIdx],
                            ),
                          }}
                        >
                          <UniversalMedia
                            url={img}
                            className="w-full h-auto object-contain"
                            alt=""
                            style={{
                              ...getElementStyle(section.imageStyle, viewport),
                              ...mobileImageRadiusStyle,
                            }}
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
                      style={{
                        ...getOpacityStyle(section.opacity),
                        ...(viewport === "mobile" || viewport === "tablet"
                          ? { gap: "8px" }
                          : {}),
                      }}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.subTitleStyle, {
                                fontSizeMobile: "20px",
                                }), viewport),
                            ...(viewport === "tablet"
                              ? { fontSize: "24px", letterSpacing: "-0.48px" }
                              : viewport === "mobile"
                                ? { letterSpacing: "-0.4px" }
                                : {}),
                          }}
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
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.contentStyle, {
                                fontSizeMobile: "18px",
                                }), viewport),
                            letterSpacing:
                              viewport === "mobile"
                                ? "-0.36px"
                                : viewport === "tablet"
                                  ? "-0.4px"
                                  : undefined,
                          }}
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
                  const showLeftContent = !section.leftContentStyle?.isHidden;
                  const showRightContent = !section.rightContentStyle?.isHidden;
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-center items-center gap-5 w-full"
                      style={{
                        ...getOpacityStyle(section.opacity),
                        ...(viewport === "mobile" ? { gap: "8px" } : {}),
                      }}
                    >
                      {!section.newsletterSubTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={
                            section.newsletterSubTitle || "서브 타이틀 입력"
                          }
                          className="self-stretch text-center justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.newsletterSubTitleStyle, {
                                fontSizeMobile: "20px",
                                }), viewport),
                            ...(viewport === "tablet"
                              ? { fontSize: "24px", letterSpacing: "-0.48px" }
                              : viewport === "mobile"
                                ? { letterSpacing: "-0.4px" }
                                : {}),
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `sectionNewsletterSubTitle`,
                              section.id,
                            );
                          }}
                        />
                      )}
                      <div
                        className="self-stretch flex flex-row justify-start items-start w-full"
                        style={{
                          gap:
                            viewport === "tablet"
                              ? "60px"
                              : viewport === "mobile"
                                ? "8px"
                                : "56px",
                        }}
                      >
                        {showLeftContent && (
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <TextStructureSafeHtml
                              html={section.leftContent || "내용을 입력하세요."}
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(section.leftContentStyle, {
                                    fontSizeMobile: "18px",
                                    }), viewport),
                                letterSpacing:
                                  viewport === "mobile"
                                    ? "-0.36px"
                                    : viewport === "tablet"
                                      ? "-0.4px"
                                      : undefined,
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterLeft`,
                                  section.id,
                                );
                              }}
                            />
                          </div>
                        )}
                        {showRightContent && (
                          <div className="flex-1 text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text">
                            <TextStructureSafeHtml
                              html={
                                section.rightContent || "내용을 입력하세요."
                              }
                              style={{
                                ...getElementStyle(mergeTextStyleWithFallback(section.rightContentStyle, {
                                    fontSizeMobile: "18px",
                                    }), viewport),
                                letterSpacing:
                                  viewport === "mobile"
                                    ? "-0.36px"
                                    : viewport === "tablet"
                                      ? "-0.4px"
                                      : undefined,
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onElementSelect?.(
                                  `sectionNewsletterRight`,
                                  section.id,
                                );
                              }}
                            />
                          </div>
                        )}
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
                              <div
                                className={
                                  isDescHidden
                                    ? "flex-1 min-w-0"
                                    : "w-40 shrink-0"
                                }
                              >
                                <TextStructureSafeHtml
                                  html={item.title || "첫째. 타이틀"}
                                  className="w-full justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={{
                                    ...getElementStyle(
                                      item.titleStyle,
                                      viewport,
                                    ),
                                    ...(isDescHidden ? { width: "100%" } : {}),
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                />
                              </div>
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
                  const bannerMediaUrl =
                    section.imageUrl || "/images/placeholder/card-sm.jpg";
                  const bannerMediaProps = getTextStructureBannerMediaProps(
                    bannerMediaUrl,
                    getElementStyle(section.imageStyle, viewport),
                    bannerHeight,
                  );
                  return (
                    <div
                      key={section.id}
                      className="self-stretch bg-시안-mode-gray5 rounded-[20px] inline-flex justify-center items-stretch overflow-hidden w-full"
                      style={{
                        ...(bannerHeight
                          ? mergeWithOpacity(
                              { minHeight: bannerHeight, height: bannerHeight },
                              section.opacity,
                            )
                          : getOpacityStyle(section.opacity)),
                        ...(viewport === "tablet"
                          ? { flexDirection: "row" }
                          : viewport === "mobile"
                            ? { flexDirection: "column", borderRadius: "8px" }
                            : { flexDirection: "row" }),
                      }}
                    >
                      <div
                        className="h-auto shrink-0 self-stretch cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                        style={{
                          ...(bannerHeight
                            ? { minHeight: bannerHeight, height: bannerHeight }
                            : {}),
                          ...(viewport === "tablet"
                            ? { width: "240px" }
                            : viewport === "mobile"
                              ? { width: "100%" }
                              : { width: "384px" }),
                        }}
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
                          url={bannerMediaUrl}
                          className={bannerMediaProps.className}
                          style={bannerMediaProps.style}
                          alt=""
                        />
                      </div>
                      <div
                        className="flex-1 self-stretch inline-flex flex-col justify-center items-start"
                        style={
                          viewport === "tablet"
                            ? { padding: "24px 40px", gap: "12px" }
                            : viewport === "mobile"
                              ? { padding: "12px", gap: "12px" }
                              : { padding: "20px 40px", gap: "12px" }
                        }
                      >
                        {!section.bannerSubTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.bannerSubTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(mergeTextStyleWithFallback(section.bannerSubTitleStyle, {
                                  fontSizeMobile: "20px",
                                  }), viewport),
                              ...(viewport === "tablet"
                                ? { fontSize: "24px", letterSpacing: "-0.48px" }
                                : viewport === "mobile"
                                  ? { letterSpacing: "-0.4px" }
                                  : {}),
                            }}
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
                            style={{
                              ...getElementStyle(mergeTextStyleWithFallback(section.bannerDescStyle, {
                                  fontSizeMobile: "18px",
                                  }), viewport),
                              letterSpacing:
                                viewport === "mobile"
                                  ? "-0.36px"
                                  : viewport === "tablet"
                                    ? "-0.4px"
                                    : undefined,
                            }}
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
            className={`self-stretch ${sectionPaddingClass} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all`}
            style={
              viewport === "tablet"
                ? { paddingLeft: "40px", paddingRight: "40px", paddingTop: "60px", paddingBottom: "60px", gap: "40px" }
                : viewport === "mobile"
                  ? { paddingLeft: "20px", paddingRight: "20px", gap: "24px" }
                  : undefined
            }
          >
            {/* 고정 헤더 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
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
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                      lineHeight: "1.5",
                      letterSpacing: viewport === "mobile" ? "-0.56px" : "-0.8px",
                    }}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                  }}
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
            <div
              className={`self-stretch inline-flex justify-start items-start w-full ${
                viewport === "tablet" || viewport === "mobile"
                  ? "flex-col"
                  : "flex-col xl:flex-row"
              }`}
              style={{
                gap: viewport === "tablet" ? "60px" : viewport === "mobile" ? "24px" : "56px",
              }}
            >
              {/* 왼쪽 사이드바 (고정) */}
              <div
                className={`inline-flex flex-col justify-start items-start gap-2 shrink-0 ${
                  viewport === "tablet" || viewport === "mobile" ? "w-full" : "w-full xl:w-60"
                }`}
                style={{ gap: "8px" }}
              >
                {!data.contentTitleStyle?.isHidden && (
                  <TextStructureSafeHtml
                    html={data.contentTitle || "타이틀명 입력"}
                    className="justify-start text-시안-mode-gray95 text-3xl font-bold font-['Pretendard'] leading-10 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.contentTitleStyle , { fontSizeMobile: "24px", }), viewport),
                      lineHeight: "1.5",
                      letterSpacing: viewport === "mobile" ? "-0.48px" : "-0.56px",
                    }}
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
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.contentSubTitleStyle , { fontSizeMobile: "18px", }), viewport),
                      lineHeight: "1.5",
                      letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("contentSubTitle");
                    }}
                  />
                )}
              </div>

              {/* 오른쪽: 동적 섹션 (sections7) */}
              <div
                className="flex-1 inline-flex flex-col justify-start items-start gap-10 w-full"
                style={{
                  gap: viewport === "tablet" ? "40px" : viewport === "mobile" ? "24px" : "40px",
                }}
              >
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
                        className={`grid ${colClass} w-full`}
                        style={{
                          ...getOpacityStyle(section.opacity),
                          gap: viewport === "mobile" ? "8px" : "20px",
                        }}
                      >
                        {images.map((img: string, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-2xl w-full flex justify-center items-center h-auto"
                            style={{
                              height: "auto",
                              ...mobileImageRadiusStyle,
                              ...getOpacityStyle(
                                section.imageOpacities?.[imgIdx],
                              ),
                            }}
                          >
                            <UniversalMedia
                              url={img}
                              className="w-full h-auto object-contain"
                              alt=""
                              style={{
                                ...getElementStyle(
                                  section.imageStyle,
                                  viewport,
                                ),
                                ...mobileImageRadiusStyle,
                              }}
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
                        style={{
                          ...getOpacityStyle(section.opacity),
                          gap: viewport === "mobile" ? "0px" : "8px",
                        }}
                      >
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              section.subTitleStyle,
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "mobile" ? "-0.4px" : "-0.48px",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(`sectionSubTitle`, section.id);
                          }}
                        />
                        <TextStructureSafeHtml
                          html={section.content || "내용을 입력하세요."}
                          className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              section.contentStyle,
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                          }}
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
                    const showLeftContent =
                      !section.leftContentStyle?.isHidden;
                    const showRightContent =
                      !section.rightContentStyle?.isHidden;
                    const isMobileView = viewport === "mobile";
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-center items-start w-full"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          gap: isMobileView ? "0px" : "20px",
                        }}
                      >
                        <TextStructureSafeHtml
                          html={
                            section.newsletterSubTitle || "보조 타이틀 문구 입력"
                          }
                          className="self-stretch text-left justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              section.newsletterSubTitleStyle,
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: "-0.4px",
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onElementSelect?.(
                              `sectionNewsletterSubTitle`,
                              section.id,
                            );
                          }}
                        />
                        <div
                          className="self-stretch flex flex-row justify-start items-start w-full"
                          style={{
                            gap: isMobileView ? "8px" : "8px",
                          }}
                        >
                          {showLeftContent && (
                            <div
                              className="text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                              style={{ flex: "1 0 0" }}
                            >
                              <TextStructureSafeHtml
                                html={section.leftContent || "내용을 입력하세요."}
                                style={{
                                  ...getElementStyle(
                                    section.leftContentStyle,
                                    viewport,
                                  ),
                                  lineHeight: "1.5",
                                  letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    `sectionNewsletterLeft`,
                                    section.id,
                                  );
                                }}
                              />
                            </div>
                          )}
                          {showRightContent && (
                            <div
                              className="text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                              style={{ flex: "1 0 0" }}
                            >
                              <TextStructureSafeHtml
                                html={
                                  section.rightContent || "내용을 입력하세요."
                                }
                                style={{
                                  ...getElementStyle(
                                    section.rightContentStyle,
                                    viewport,
                                  ),
                                  lineHeight: "1.5",
                                  letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  onElementSelect?.(
                                    `sectionNewsletterRight`,
                                    section.id,
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  /* ── STRIP BANNER ── */
                  if (section.type === "stripBanner") {
                    const bannerHeight = section.imageHeight
                      ? formatUnit(section.imageHeight, "px")
                      : null;
                    const isMobileView = viewport === "mobile";
                    const bannerMediaUrl =
                      section.imageUrl || "/images/placeholder/card-sm.jpg";
                    const bannerMediaProps = getTextStructureBannerMediaProps(
                      bannerMediaUrl,
                      getElementStyle(section.imageStyle, viewport),
                      isMobileView ? "120px" : bannerHeight,
                    );
                    return (
                      <div
                        key={section.id}
                        className="self-stretch bg-시안-mode-gray5 inline-flex justify-center items-center overflow-hidden w-full"
                        style={{
                          ...(bannerHeight && !isMobileView
                            ? mergeWithOpacity(
                                {
                                  minHeight: bannerHeight,
                                  height: bannerHeight,
                                },
                                section.opacity,
                              )
                            : getOpacityStyle(section.opacity)),
                          borderRadius: isMobileView ? "8px" : "20px",
                          flexDirection: isMobileView ? "column" : "row",
                        }}
                      >
                        <div
                          className="shrink-0 self-stretch cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                          style={
                            isMobileView
                              ? { width: "100%", height: "120px" }
                              : {
                                  width: "240px",
                                  ...(bannerHeight
                                    ? { minHeight: bannerHeight, height: bannerHeight }
                                    : {}),
                                }
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
                            url={bannerMediaUrl}
                            className={bannerMediaProps.className}
                            style={bannerMediaProps.style}
                            alt=""
                          />
                        </div>
                        <div
                          className="flex-1 self-stretch inline-flex flex-col justify-center items-start"
                          style={{
                            padding: isMobileView ? "12px" : "24px 40px",
                            gap: isMobileView ? "0px" : "12px",
                          }}
                        >
                          <TextStructureSafeHtml
                            html={section.bannerSubTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(
                                section.bannerSubTitleStyle,
                                viewport,
                              ),
                              lineHeight: "1.5",
                              letterSpacing: viewport === "mobile" ? "-0.4px" : "-0.48px",
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              onElementSelect?.(`bannerSubTitle`, section.id);
                            }}
                          />
                          <TextStructureSafeHtml
                            html={section.bannerDesc || "내용을 입력하세요."}
                            className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(
                                section.bannerDescStyle,
                                viewport,
                              ),
                              lineHeight: "1.5",
                              letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                            }}
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
            className={`self-stretch ${sectionPaddingClass} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full`}
            style={
              viewport === "tablet"
                ? { paddingLeft: "40px", paddingRight: "40px", paddingTop: "60px", paddingBottom: "60px", gap: "40px" }
                : viewport === "mobile"
                  ? { paddingLeft: "20px", paddingRight: "20px", gap: "24px" }
                  : undefined
            }
          >
            {/* 헤더 영역 */}
            <div
              className={`flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-0" : ""}`}
            >
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
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
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.56px" : "-0.8px",
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
                  className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 동적 섹션 */}
            <div
              className="self-stretch flex flex-col justify-center items-center gap-6 w-full"
              style={
                viewport === "tablet" || viewport === "mobile"
                  ? { gap: "24px" }
                  : undefined
              }
            >
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
                          className="relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden rounded-xl w-full flex justify-center items-center h-auto"
                          style={{
                            height: "auto",
                            ...mobileImageRadiusStyle,
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
                            style={{
                              ...getElementStyle(section.imageStyle, viewport),
                              ...mobileImageRadiusStyle,
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
                      style={{
                        ...getOpacityStyle(section.opacity),
                        gap: viewport === "mobile" ? "0px" : "8px",
                      }}
                    >
                      {!section.subTitleStyle?.isHidden && (
                        <TextStructureSafeHtml
                          html={section.subTitle || "서브 타이틀 입력"}
                          className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                          style={{
                            ...getElementStyle(
                              section.subTitleStyle,
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "mobile" ? "-0.4px" : "-0.48px",
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
                          style={{
                            ...getElementStyle(
                              section.contentStyle,
                              viewport,
                            ),
                            lineHeight: "1.5",
                            letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
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
                  const isMobileView = viewport === "mobile";
                  return (
                    <div
                      key={section.id}
                      className="self-stretch flex flex-col justify-start items-start w-full"
                      style={{
                        ...getOpacityStyle(section.opacity),
                        gap: "8px",
                      }}
                    >
                      {(section.items || []).map((item: any, i: number) => {
                        const isTitleHidden = item.titleStyle?.isHidden;
                        const isDescHidden = item.descStyle?.isHidden;
                        const featureItemId = item.id || `${section.id}:${i}`;
                        if (isTitleHidden && isDescHidden) return null;

                        return (
                          <div
                            key={item.id || i}
                            className="self-stretch bg-시안-mode-gray5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                            style={{
                              ...getOpacityStyle(item.opacity),
                              padding: isMobileView ? "12px" : "16px",
                              display: "flex",
                              flexDirection: isMobileView ? "column" : "row",
                              justifyContent: isMobileView ? "center" : "flex-start",
                              alignItems: isMobileView ? "flex-start" : "center",
                              gap: isMobileView ? "0px" : (isDescHidden ? "0px" : "20px"),
                            }}
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
                              <div
                                style={
                                  isMobileView
                                    ? { width: "100%" }
                                    : isDescHidden
                                      ? { flex: "1 1 0", minWidth: 0, width: "100%" }
                                      : { width: "160px", flexShrink: 0 }
                                }
                              >
                                <TextStructureSafeHtml
                                  html={item.title || `첫째. 타이틀`}
                                  className="w-full justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={{
                                    ...getElementStyle(
                                      item.titleStyle,
                                      viewport,
                                    ),
                                    lineHeight: "1.5",
                                    letterSpacing: "-0.4px",
                                    ...(isDescHidden && !isMobileView
                                      ? { width: "100%" }
                                      : {}),
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onElementSelect?.(
                                      "itemTitle",
                                      featureItemId,
                                    );
                                  }}
                                />
                              </div>
                            )}
                            {/* 아이콘: 모바일에서는 숨김 */}
                            {!isMobileView && (
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
                            )}
                            {!isDescHidden && (
                              <TextStructureSafeHtml
                                html={item.desc || "설명 텍스트를 입력하세요."}
                                className="justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                style={{
                                  ...getElementStyle(
                                    item.descStyle,
                                    viewport,
                                  ),
                                  flex: isMobileView ? undefined : "1 0 0",
                                  width: isMobileView ? "100%" : undefined,
                                  lineHeight: "1.5",
                                  letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                                }}
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
                      className="self-stretch justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                      style={{
                        ...mergeWithOpacity(
                          getElementStyle(section.contentStyle, viewport),
                          section.opacity,
                        ),
                        lineHeight: "1.5",
                        letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
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
            className={`self-stretch ${sectionPaddingClass} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full`}
            style={
              viewport === "tablet"
                ? { paddingLeft: "40px", paddingRight: "40px", paddingTop: "60px", paddingBottom: "60px", gap: "40px" }
                : viewport === "mobile"
                  ? { paddingLeft: "20px", paddingRight: "20px", paddingTop: "30px", paddingBottom: "30px", gap: "24px" }
                  : undefined
            }
          >
            {/* 헤더 영역 */}
            <div className="flex flex-col justify-start items-center w-full">
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
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
                    style={{
                      ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                      lineHeight: "1.5",
                      letterSpacing: viewport === "mobile" ? "-0.56px" : "-0.8px",
                    }}
                  />
                </div>
              )}
              {!data.descStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.desc || "이민 프로그램명 입력"}
                  className="text-left justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    lineHeight: "1.5",
                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              )}
            </div>

            {/* 2열 레이아웃: 왼쪽 고정 이미지 + 오른쪽 동적 섹션 */}
            <div
              className={`self-stretch inline-flex justify-center items-start w-full ${
                viewport === "tablet" || viewport === "mobile"
                  ? "flex-col items-center"
                  : `flex-col ${reverseLayout ? "xl:flex-row-reverse" : "xl:flex-row"}`
              }`}
              style={{
                gap: viewport === "tablet" || viewport === "mobile" ? "24px" : "56px",
              }}
            >
              {/* 왼쪽: 고정 이미지 */}
              <div
                className={`w-full xl:flex-1 relative hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer overflow-hidden shrink-0 flex justify-center items-center h-auto ${viewport === "desktop" ? "rounded-2xl" : ""}`}
                style={viewport === "mobile" ? { borderRadius: "0px" } : viewport === "tablet" ? { borderRadius: "0px" } : mobileImageRadiusStyle}
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
                  style={{
                    ...getElementStyle(data.imageStyle, viewport),
                    ...(viewport === "tablet" || viewport === "mobile" ? { borderRadius: "0px" } : mobileImageRadiusStyle),
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

              {/* 오른쪽: 동적 섹션 (sections9) */}
              <div
                className="flex-1 inline-flex flex-col justify-start items-start gap-6 w-full"
                style={
                  viewport === "tablet" || viewport === "mobile"
                    ? { gap: "24px" }
                    : undefined
                }
              >
                {sections9.map((section: any) => {
                  /* ── TEXT ── */
                  if (section.type === "text") {
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start gap-2"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          gap: viewport === "mobile" ? "0px" : "8px",
                        }}
                      >
                        {!section.subTitleStyle?.isHidden && (
                          <TextStructureSafeHtml
                            html={section.subTitle || "서브 타이틀 입력"}
                            className="self-stretch justify-start text-시안-mode-gray95 text-2xl font-bold font-['Pretendard'] leading-9 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded p-1 transition-all cursor-text"
                            style={{
                              ...getElementStyle(
                                section.subTitleStyle,
                                viewport,
                              ),
                              lineHeight: "1.5",
                              letterSpacing: viewport === "mobile" ? "-0.4px" : "-0.48px",
                            }}
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
                            style={{
                              ...getElementStyle(
                                section.contentStyle,
                                viewport,
                              ),
                              lineHeight: "1.5",
                              letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                            }}
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
                    const isMobileView = viewport === "mobile";
                    return (
                      <div
                        key={section.id}
                        className="self-stretch flex flex-col justify-start items-start w-full"
                        style={{
                          ...getOpacityStyle(section.opacity),
                          gap: "8px",
                        }}
                      >
                        {(section.items || []).map((item: any, i: number) => {
                          const isTitleHidden = item.titleStyle?.isHidden;
                          const isDescHidden = item.descStyle?.isHidden;
                          const featureItemId = item.id || `${section.id}:${i}`;
                          if (isTitleHidden && isDescHidden) return null;

                          return (
                            <div
                              key={item.id || i}
                              className="self-stretch bg-시안-mode-gray5 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer"
                              style={{
                                ...getOpacityStyle(item.opacity),
                                padding: "16px",
                                display: "flex",
                                flexDirection: isMobileView ? "column" : "row",
                                justifyContent: isMobileView ? "center" : "flex-start",
                                alignItems: isMobileView ? "flex-start" : "center",
                                gap: isMobileView ? "0px" : (isDescHidden ? "0px" : "20px"),
                              }}
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
                                <div
                                  style={
                                    isMobileView
                                      ? { width: "100%" }
                                      : isDescHidden
                                        ? { flex: "1 1 0", minWidth: 0, width: "100%" }
                                        : { width: "160px", flexShrink: 0 }
                                  }
                                >
                                  <TextStructureSafeHtml
                                    html={item.title || "첫째. 타이틀"}
                                    className="w-full justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                    style={{
                                      ...getElementStyle(
                                        item.titleStyle,
                                        viewport,
                                      ),
                                      lineHeight: "1.5",
                                      letterSpacing: "-0.4px",
                                      ...(isDescHidden && !isMobileView
                                        ? { width: "100%" }
                                        : {}),
                                    }}
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
                                </div>
                              )}
                              {/* 화살표 아이콘: 모바일에서는 숨김 */}
                              {!isMobileView && !isTitleHidden && !isDescHidden && (
                                <div style={{ width: "24px", height: "24px", flexShrink: 0 }} />
                              )}
                              {!isDescHidden && (
                                <TextStructureSafeHtml
                                  html={
                                    item.desc || "설명 텍스트를 입력하세요."
                                  }
                                  className="justify-start text-시안-mode-gray50 text-xl font-normal font-['Pretendard'] leading-8 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                  style={{
                                    ...getElementStyle(
                                      item.descStyle,
                                      viewport,
                                    ),
                                    flex: isMobileView ? undefined : "1 0 0",
                                    width: isMobileView ? "100%" : undefined,
                                    lineHeight: "1.5",
                                    letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                                  }}
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
                        style={{
                          ...mergeWithOpacity(
                            getElementStyle(section.contentStyle, viewport),
                            section.opacity,
                          ),
                          lineHeight: "1.5",
                          letterSpacing: viewport === "mobile" ? "-0.36px" : "-0.4px",
                        }}
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
            className={`self-stretch ${sectionPaddingClass} ${getVerticalPaddingClass(viewport)} inline-flex flex-col justify-start items-center gap-10 w-full`}
            style={
              viewport === "tablet"
                ? { paddingLeft: "40px", paddingRight: "40px", paddingTop: "60px", paddingBottom: "60px", gap: "40px" }
                : viewport === "mobile"
                  ? { gap: "24px" }
                  : undefined
            }
          >
            {/* 헤더 영역 */}
            <div
              className={`flex flex-col justify-start items-center ${viewport === "mobile" ? "gap-0" : ""}`}
            >
              {!data.subTitleStyle?.isHidden && (
                <TextStructureSafeHtml
                  html={data.subTitle || "( 서브타이틀 )"}
                  className="text-left justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.subTitleStyle , { fontSizeMobile: "18px", }), viewport),
                    letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
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
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.titleStyle , { fontSizeMobile: "28px", }), viewport),
                    letterSpacing: viewport === "tablet" ? "-0.8px" : viewport === "mobile" ? "-0.56px" : undefined,
                  }}
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
                  style={{
                    ...getElementStyle(mergeTextStyleWithFallback(data.descStyle , { fontSizeMobile: "18px", }), viewport),
                    letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                  }}
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
            <div
              className="self-stretch flex flex-col justify-center items-center gap-10 w-full"
              style={
                viewport === "mobile" ? { gap: "24px" } : viewport === "tablet" ? { gap: "40px" } : undefined
              }
            >
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
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.subTitleStyle , { fontSize: "24px", fontSizeMobile: "20px", }), viewport),
                            letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                          }}
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
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.contentStyle , { fontSize: "20px", fontSizeMobile: "18px", }), viewport),
                            letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                          }}
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
                      style={{
                        ...getOpacityStyle(section.opacity),
                        ...(viewport === "tablet" || viewport === "mobile" ? {
                          paddingLeft: "40px",
                          paddingRight: "40px",
                          paddingTop: "24px",
                          paddingBottom: "24px",
                          gap: viewport === "tablet" ? "12px" : "8px",
                          borderRadius: "16px",
                          backgroundColor: "#F6F7FB",
                        } : {}),
                      }}
                    >
                      <TextStructureSafeHtml
                        html={section.bannerSubTitle || "배너명 입력하는 부분"}
                        className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(section.bannerSubTitleStyle , { fontSize: "24px", fontSizeMobile: "20px", }), viewport),
                          letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                        }}
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
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(section.bannerDescStyle , { fontSize: "18px", fontSizeMobile: "18px", }), viewport),
                          letterSpacing: viewport === "tablet" || viewport === "mobile" ? "-0.36px" : undefined,
                          lineHeight: viewport === "tablet" || viewport === "mobile" ? "1.6" : undefined,
                        }}
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
                <div
                  className="self-stretch flex flex-col xl:flex-row justify-between items-start gap-10 w-full"
                  style={{
                    flexDirection: viewport === "tablet" || viewport === "mobile" ? "column" : undefined,
                    gap: viewport === "mobile" ? "24px" : viewport === "tablet" ? "40px" : undefined,
                  }}
                >
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
                                style={{
                                  ...mobileImageRadiusStyle,
                                  ...getOpacityStyle(
                                    section.imageOpacities?.[imgIdx],
                                  ),
                                  ...(viewport === "tablet" ? { height: "358px" } : viewport === "mobile" ? { height: "160px" } : {}),
                                }}
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
                                  style={{
                                    ...getElementStyle(
                                      section.imageStyle,
                                      viewport,
                                    ),
                                    ...mobileImageRadiusStyle,
                                    ...(viewport === "tablet" || viewport === "mobile" ? { objectFit: "cover", height: "100%" } : {}),
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })}
                  </div>

                  {/* 오른쪽: 특징 리스트 (Features 등) */}
                  <div
                    className="w-full xl:flex-1 flex flex-col gap-10"
                    style={viewport === "mobile" ? { gap: "24px" } : viewport === "tablet" ? { gap: "40px" } : undefined}
                  >
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
                              style={{
                                ...getOpacityStyle(section.opacity),
                                ...(viewport === "mobile" ? { gap: "24px" } : {}),
                              }}
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
                                      style={{
                                        ...getOpacityStyle(item.opacity),
                                        ...(viewport === "tablet" ? {
                                          paddingTop: "16px",
                                          paddingBottom: "0",
                                          gap: "24px",
                                          alignItems: "center",
                                          ...(i !== 0 ? { borderTopColor: "#131416" } : {}),
                                        } : viewport === "mobile" ? {
                                          paddingTop: "16px",
                                          paddingBottom: "0",
                                          gap: "12px",
                                          alignItems: "flex-start",
                                          borderTop: "1px solid #131416",
                                        } : {}),
                                      }}
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
                                      <div
                                        className="shrink-0 relative transition-all overflow-hidden flex items-center justify-center"
                                        style={
                                          viewport === "tablet"
                                            ? { width: "120px", height: "120px", backgroundColor: "#F6F7FB", borderRadius: "60px", flexShrink: 0 }
                                            : viewport === "mobile"
                                              ? { width: "60px", height: "60px", backgroundColor: "#F6F7FB", borderRadius: "60px", flexShrink: 0 }
                                              : { width: "80px", flexShrink: 0 }
                                        }
                                      >
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
                                      <div
                                        className="flex-1 flex flex-col justify-start items-start gap-1"
                                        style={
                                          viewport === "tablet"
                                            ? { gap: "12px" }
                                            : viewport === "mobile"
                                              ? { gap: "0px" }
                                              : undefined
                                        }
                                      >
                                        {!item.numberStyle?.isHidden && (
                                          <TextStructureSafeHtml
                                            html={item.number || `0${i + 1}.`}
                                            className="text-left justify-start text-[#285DE1] font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text"
                                            style={{
                                              ...getElementStyle(mergeTextStyleWithFallback(item.numberStyle , { fontSize: "20px", fontSizeMobile: "20px", }), viewport),
                                              letterSpacing: viewport === "tablet" || viewport === "mobile" ? "-0.4px" : undefined,
                                            }}
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
                                            style={{
                                              ...getElementStyle(mergeTextStyleWithFallback(item.titleStyle , { fontSize: "28px", fontSizeMobile: "20px", }), viewport),
                                              letterSpacing: viewport === "tablet" ? "-0.56px" : viewport === "mobile" ? "-0.4px" : undefined,
                                            }}
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
                                            style={{
                                              ...getElementStyle(mergeTextStyleWithFallback(item.descStyle , { fontSize: "18px", fontSizeMobile: "18px", }), viewport),
                                              letterSpacing: viewport === "tablet" || viewport === "mobile" ? "-0.36px" : undefined,
                                              lineHeight: viewport === "tablet" || viewport === "mobile" ? "1.6" : undefined,
                                              marginTop: viewport === "mobile" ? "12px" : undefined,
                                            }}
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
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.subTitleStyle , { fontSize: "24px", fontSizeMobile: "20px", }), viewport),
                            letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                          }}
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
                          style={{
                            ...getElementStyle(mergeTextStyleWithFallback(section.contentStyle , { fontSize: "20px", fontSizeMobile: "18px", }), viewport),
                            letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                          }}
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
                      style={{
                        ...getOpacityStyle(section.opacity),
                        ...(viewport === "tablet" || viewport === "mobile" ? {
                          paddingLeft: "40px",
                          paddingRight: "40px",
                          paddingTop: "24px",
                          paddingBottom: "24px",
                          gap: viewport === "tablet" ? "12px" : "8px",
                          borderRadius: "16px",
                          backgroundColor: "#F6F7FB",
                        } : {}),
                      }}
                    >
                      <TextStructureSafeHtml
                        html={section.bannerSubTitle || "배너명 입력하는 부분"}
                        className="text-center justify-start text-[#285DE1] text-xl font-bold font-['Pretendard'] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(section.bannerSubTitleStyle , { fontSize: "24px", fontSizeMobile: "20px", }), viewport),
                          letterSpacing: viewport === "tablet" ? "-0.4px" : viewport === "mobile" ? "-0.36px" : undefined,
                        }}
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
                        style={{
                          ...getElementStyle(mergeTextStyleWithFallback(section.bannerDescStyle , { fontSize: "18px", fontSizeMobile: "18px", }), viewport),
                          letterSpacing: viewport === "tablet" || viewport === "mobile" ? "-0.36px" : undefined,
                          lineHeight: viewport === "tablet" || viewport === "mobile" ? "1.6" : undefined,
                        }}
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
