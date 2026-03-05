import { Widget, WidgetType } from "@/types/console/template";
import { VIDEO_DEFAULTS } from "@/components/console/template/widgets/VideoRenderer";
import { PROCESS_DEFAULTS } from "@/components/console/template/widgets/ProcessRenderer";
import { TEXT_SECTION_DEFAULTS } from "@/components/console/template/widgets/TextSectionRenderer";
import { ICON_CARD_DEFAULTS } from "@/components/console/template/widgets/IconCardRenderer";
import { FAQ_DEFAULTS } from "@/components/console/template/widgets/FaqRenderer";
import { MAIN_TITLE_DEFAULTS } from "@/components/console/template/widgets/MainTitleRenderer";
import { BANNER_SECTION_DEFAULTS } from "@/components/console/template/widgets/BannerSectionRenderer";
import { INFO_BANNER_DEFAULTS } from "@/components/console/template/widgets/InfoBannerRenderer";
import { GRID_CARD_DEFAULTS } from "@/components/console/template/widgets/GridCardRenderer";
import { TABLE_DEFAULTS } from "@/components/console/template/widgets/TableRenderer";
import { CARD_LIST_DEFAULTS } from "@/components/console/template/widgets/CardRenderer";
import { TITLE_BANNER_DEFAULTS } from "@/components/console/template/widgets/TitleBannerRenderer";
import { IMAGE_AREA_DEFAULTS } from "@/components/console/template/widgets/ImageAreaRenderer";
import { TITLE_TEXT_DEFAULTS } from "@/components/console/template/widgets/TitleTextRenderer";
import { TAB_BUTTON_DEFAULTS } from "@/components/console/template/widgets/TabButtonRenderer";
import { TEXT_STRUCTURE_DEFAULTS } from "@/components/console/template/widgets/TextStructureRenderer";
import {
  TEXT_STRUCTURE_11_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_5_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_6_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_7_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_8_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_9_DEFAULT_SECTIONS,
} from "@/components/console/template/widgets/TextStructureRenderer";
import { IMAGE_CARD_DEFAULTS } from "@/components/console/template/widgets/ImageCardRenderer";
import { COMPARISON_CARD_DEFAULTS } from "@/components/console/template/widgets/ComparisonCardRenderer";
import { STRIP_BANNER_DEFAULTS } from "@/components/console/template/widgets/StripBannerRenderer";

/**
 * 위젯 타입에 따른 기본 데이터를 생성합니다.
 */
export function createWidget(
  type: WidgetType,
  widgetId: string,
): Widget | null {
  const widget = _createWidget(type, widgetId);
  if (widget) {
    // 모든 새로운 디자인 섹션들에 대해 상하 패딩 60px 기본값 부여
    if (
      [
        "titleBanner",
        "imageArea",
        "infoBanner",
        "titleText",
        "tabButton",
        "textStructure",
        "iconCard",
        "imageCard",
        "comparisonCard",
        "processCard",
        "stripBanner",
        "faq",
        "table",
      ].includes(type)
    ) {
      widget.style = {
        paddingTop: "60px",
        paddingBottom: "60px",
        ...widget.style,
      };
    }
  }
  return widget;
}

function _createWidget(type: WidgetType, widgetId: string): Widget | null {
  const cloneDefaults = (defaults: any) => JSON.parse(JSON.stringify(defaults));

  switch (type) {
    case "mainTitle":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(MAIN_TITLE_DEFAULTS) as any,
      };

    case "textSection":
      return {
        id: widgetId,
        type: "textSection",
        data: cloneDefaults(TEXT_SECTION_DEFAULTS),
      } as any;

    case "bannerSection":
      return {
        id: widgetId,
        type: "bannerSection",
        data: cloneDefaults(BANNER_SECTION_DEFAULTS),
      } as any;

    case "video":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(VIDEO_DEFAULTS) as any,
      };

    case "infoBanner":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(INFO_BANNER_DEFAULTS) as any,
      };

    case "titleText":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(TITLE_TEXT_DEFAULTS) as any,
      };

    case "tabButton":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(TAB_BUTTON_DEFAULTS) as any,
      };

    case "textStructure":
      const textStructureDefaults = cloneDefaults(TEXT_STRUCTURE_DEFAULTS);
      textStructureDefaults.sections5 = textStructureDefaults.sections5
        ? cloneDefaults(textStructureDefaults.sections5)
        : cloneDefaults(TEXT_STRUCTURE_5_DEFAULT_SECTIONS);
      textStructureDefaults.sections6 = textStructureDefaults.sections6
        ? cloneDefaults(textStructureDefaults.sections6)
        : cloneDefaults(TEXT_STRUCTURE_6_DEFAULT_SECTIONS);
      textStructureDefaults.sections7 = textStructureDefaults.sections7
        ? cloneDefaults(textStructureDefaults.sections7)
        : cloneDefaults(TEXT_STRUCTURE_7_DEFAULT_SECTIONS);
      textStructureDefaults.sections8 = textStructureDefaults.sections8
        ? cloneDefaults(textStructureDefaults.sections8)
        : cloneDefaults(TEXT_STRUCTURE_8_DEFAULT_SECTIONS);
      textStructureDefaults.sections9 = textStructureDefaults.sections9
        ? cloneDefaults(textStructureDefaults.sections9)
        : cloneDefaults(TEXT_STRUCTURE_9_DEFAULT_SECTIONS);
      textStructureDefaults.sections11 = textStructureDefaults.sections11
        ? cloneDefaults(textStructureDefaults.sections11)
        : cloneDefaults(TEXT_STRUCTURE_11_DEFAULT_SECTIONS);

      // Ensure 모든 레이아웃의 디폴트 섹션도 각 위젯별로 독립 복사본을 가짐
      return {
        id: widgetId,
        type,
        data: textStructureDefaults as any,
      };

    case "gridCard":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(GRID_CARD_DEFAULTS) as any,
      };

    case "iconCard":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(ICON_CARD_DEFAULTS) as any,
      };

    case "table":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(TABLE_DEFAULTS) as any,
      };

    case "process":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(PROCESS_DEFAULTS) as any,
      };

    case "faq":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(FAQ_DEFAULTS) as any,
      };

    case "cardList":
      return {
        id: widgetId,
        type: "cardList",
        data: cloneDefaults(CARD_LIST_DEFAULTS),
      } as any;

    case "titleBanner":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(TITLE_BANNER_DEFAULTS),
      } as any;

    case "imageArea":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(IMAGE_AREA_DEFAULTS),
      } as any;

    case "titleText":
    case "tabButton":
    case "textStructure":
    case "processCard":
      return {
        id: widgetId,
        type,
        data: {
          ...cloneDefaults(PROCESS_DEFAULTS),
          layout: "1",
        },
      } as any;
    case "imageCard":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(IMAGE_CARD_DEFAULTS),
      } as any;
    case "comparisonCard":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(COMPARISON_CARD_DEFAULTS),
      } as any;

    case "stripBanner":
      return {
        id: widgetId,
        type,
        data: cloneDefaults(STRIP_BANNER_DEFAULTS),
        style: {
          backgroundColor: STRIP_BANNER_DEFAULTS.backgroundColor,
        },
      } as any;

    default:
      return null;
  }
}
