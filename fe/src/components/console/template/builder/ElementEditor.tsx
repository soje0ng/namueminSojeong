import React from "react";
import {
  Trash2,
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Upload,
  Smartphone,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Widget } from "@/types/console/template";
import { BANNER_SECTION_DEFAULTS } from "../widgets/BannerSectionRenderer";
import { updateItemInArray, findItem } from "@/utils/template/itemUtils";
import { isVideoUrl } from "../widgets/WidgetUtils";
import {
  TEXT_STRUCTURE_DEFAULTS,
  TEXT_STRUCTURE_5_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_6_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_7_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_8_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_9_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_10_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_11_DEFAULT_SECTIONS,
} from "../widgets/TextStructureRenderer";
import { CULTURE_LETTER_DEFAULTS } from "../widgets/CultureLetterRenderer";
import {
  COMPARISON_CARD_DEFAULTS,
  DEFAULT_LEFT_DESC_ITEMS,
  DEFAULT_RIGHT_DESC_ITEMS,
} from "../widgets/ComparisonCardRenderer";
import { INFO_BANNER_DEFAULTS } from "../widgets/InfoBannerRenderer";
import { TITLE_BANNER_DEFAULTS } from "../widgets/TitleBannerRenderer";
import ImgUploadPop from "@/components/console/popup/ImgUploadPop";
import { usePopupStore } from "@/store/console/usePopupStore";

export interface ElementEditorProps {
  widget: Widget;
  elementKey: string;
  itemId: string | null;
  updateWidgetData: (id: string, data: any) => void;
  setSelectedElementKey: (key: string | null) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (val: number) => void;
}

const getCultureLetterBackgroundFields = (layout: string) => {
  if (layout === "1") {
    return {
      desktopKey: "layout1BgImageUrl",
      mobileKey: "layout1MobileBgImageUrl",
    };
  }

  if (layout === "2") {
    return {
      desktopKey: "cl2BgUrl",
      mobileKey: "cl2MobileBgUrl",
    };
  }

  if (layout === "3") {
    return {
      desktopKey: "cl3BgUrl",
      mobileKey: "cl3MobileBgUrl",
    };
  }

  return null;
};

export const ElementEditor: React.FC<ElementEditorProps> = ({
  widget,
  elementKey,
  itemId,
  updateWidgetData,
  setSelectedElementKey,
  isUploading,
  setIsUploading,
  uploadProgress,
  setUploadProgress,
}) => {
  const data = widget.data as any;
  let textValue = "";
  let linkValue = "";
  let styleKey = "";
  let styleValue: any = {};
  let onTextChange = (val: string) => {};
  let onLinkChange = (val: string) => {};
  let onStyleChange = (key: string | any, val?: any) => {};
  let autoPlayValue = false;
  let mutedValue = true;
  let loopValue = false;
  let placeholder = "";
  let placeholderMobile = "";
  let onAutoPlayChange = (val: boolean) => {};
  let onMutedChange = (val: boolean) => {};
  let onLoopChange = (val: boolean) => {};
  const { setConfirmPop } = usePopupStore();
  const getEditorItemArray = (arrayName: string) => {
    if (widget.type === "comparisonCard" && arrayName === "items") {
      const currentItems = data[arrayName];
      return currentItems?.length >= 2
        ? currentItems
        : COMPARISON_CARD_DEFAULTS.items;
    }
    return data[arrayName] || [];
  };
  const getImageCardFeatureStorageKey = () => {
    if (widget.type !== "imageCard") return "features";
    const layoutVal = String((data as any).layout || "1").replace(
      /^layout/,
      "",
    );
    if (layoutVal === "3") return "layout3Features";
    if (layoutVal === "4") return "layout4Features";
    if (layoutVal === "6") return "layout6Features";
    return "features";
  };
  const imageCardFeatureStorageKey = getImageCardFeatureStorageKey();

  // Helper to update style for item or root property
  const updateStyle = (
    stylePropName: string,
    cssProp: string | any,
    val?: any,
  ) => {
    const updates = typeof cssProp === "object" ? cssProp : { [cssProp]: val };

    if (itemId) {
      // Nested Item Style
      let arrayName = "items";
      if (widget.type === "process" || widget.type === "processCard")
        arrayName = "steps";
      else if (widget.type === "tabCarousel") arrayName = "tabs";
      else if (
        widget.type === "textSplit" &&
        data.variant === "image-left-list"
      )
        arrayName = "listItems";
      else if (widget.type === "textSection") {
        if (data.variant === "text2" || data.variant === "text3")
          arrayName = "items";
        else arrayName = "blocks";
      } else if (widget.type === "imageCard") {
        arrayName = "items";
      }

      const currentItems = getEditorItemArray(arrayName);
      const updatedItems = currentItems.map((item: any) => {
        if (item.id === itemId) {
          const oldStyle = item[stylePropName] || {};
          return { ...item, [stylePropName]: { ...oldStyle, ...updates } };
        }
        return item;
      });
      updateWidgetData(widget.id, { [arrayName]: updatedItems });
    } else {
      // Root Property Style (e.g. mainTitleStyle)
      const oldStyle = data[stylePropName] || {};
      updateWidgetData(widget.id, {
        [stylePropName]: { ...oldStyle, ...updates },
      });
    }
  };

  const getTextStructureMappedFallbackStyle = (
    layoutVal: string,
    sectionType?: string,
    key?: string,
  ) => {
    const textStyle = (
      fontSize: string,
      fontWeight: string,
      color: string,
      fontSizeMobile?: string,
    ) => ({
      fontSize,
      fontWeight,
      color,
      ...(fontSizeMobile ? { fontSizeMobile } : {}),
    });

    if (layoutVal === "4") {
      if (key === "caseSubTitle") return { ...textStyle("20px", "700", "#295E92"), fontSizeMobile: "18px" };
      if (key === "caseTitle") return { ...textStyle("36px", "700", "#131416"), fontSizeMobile: "28px" };
      if (key === "caseFeatureText") return { ...textStyle("20px", "400", "#060606"), fontSizeMobile: "18px" };
    }

    if (layoutVal === "5") {
      if (key === "bojoTitle") return textStyle("20px", "700", "#285DE1", "20px");
      if (key === "l5SubTitle") return textStyle("20px", "500", "#285DE1", "18px");
      if (key === "l5Title") return textStyle("36px", "700", "#131416", "28px");
      if (key === "l5Desc") return textStyle("20px", "500", "#6D7882", "18px");
      if (key === "l5SideTitle") return textStyle("30px", "700", "#131416", "24px");
      if (key === "l5SideDesc") return textStyle("20px", "500", "#6D7882", "18px");
      if (sectionType === "text") {
        if (key === "sectionSubTitle")
          return textStyle("24px", "700", "#131416", "20px");
        if (key === "sectionContent")
          return textStyle("20px", "400", "#6D7882", "18px");
      }
      if (sectionType === "checklist") {
        if (key === "itemTitle") return textStyle("20px", "700", "#09090b", "20px");
        if (key === "itemDesc") return textStyle("18px", "400", "#6D7882", "18px");
      }
      if (sectionType === "labelList") {
        if (key === "itemTitle") return textStyle("20px", "700", "#09090b", "20px");
        if (key === "itemDesc") return textStyle("18px", "400", "#6D7882", "18px");
      }
      if (sectionType === "imageBanner") {
        if (key === "bannerSubTitle")
          return textStyle("24px", "700", "#131416", "20px");
        if (key === "bannerDesc") return textStyle("20px", "400", "#6D7882", "18px");
      }
    }

    if (layoutVal === "6") {
      if (sectionType === "text") {
        if (key === "sectionSubTitle")
          return textStyle("24px", "700", "#131416", "20px");
        if (key === "sectionContent")
          return textStyle("20px", "400", "#6D7882", "18px");
      }
      if (sectionType === "newsletter") {
        if (key === "sectionNewsletterSubTitle")
          return textStyle("24px", "700", "#131416", "20px");
        if (key === "sectionNewsletterLeft" || key === "sectionNewsletterRight")
          return textStyle("20px", "400", "#6D7882", "18px");
      }
      if (sectionType === "features") {
        if (key === "itemTitle") return textStyle("20px", "700", "#285DE1", "20px");
        if (key === "itemDesc") return textStyle("20px", "400", "#6D7882", "20px");
      }
      if (sectionType === "stripBanner") {
        if (key === "bannerSubTitle")
          return textStyle("24px", "700", "#131416", "20px");
        if (key === "bannerDesc") return textStyle("20px", "400", "#6D7882", "18px");
      }
    }

    if (layoutVal === "7") {
      if (sectionType === "text") {
        if (key === "sectionSubTitle")
          return textStyle("24px", "700", "#131416", "24px");
        if (key === "sectionContent")
          return textStyle("20px", "400", "#6D7882", "20px");
      }
      if (sectionType === "newsletter") {
        if (key === "sectionNewsletterSubTitle")
          return textStyle("24px", "700", "#131416", "24px");
        if (key === "sectionNewsletterLeft" || key === "sectionNewsletterRight")
          return textStyle("20px", "400", "#6D7882", "20px");
      }
      if (sectionType === "stripBanner") {
        if (key === "bannerSubTitle")
          return textStyle("24px", "700", "#131416", "24px");
        if (key === "bannerDesc") return textStyle("20px", "400", "#6D7882", "20px");
      }
    }

    if (["8", "9"].includes(layoutVal)) {
      if (sectionType === "text") {
        if (key === "sectionSubTitle")
          return textStyle("24px", "700", "#131416");
        if (key === "sectionContent")
          return textStyle("20px", "400", "#6D7882");
      }
      if (sectionType === "basicText") {
        if (layoutVal === "8" && key === "sectionBasicText")
          return textStyle("20px", "400", "#6D7882");
        if (layoutVal === "9" && key === "sectionBasicText")
          return textStyle("20px", "400", "#6D7882");
      }
    }

    if (layoutVal === "10") {
      if (key === "sections10_number")
        return textStyle("20px", "700", "#285DE1");
      if (key === "sections10_title")
        return textStyle("28px", "700", "#060606");
      if (key === "sections10_subTitle")
        return textStyle("24px", "500", "#131416");
      if (key === "sections10_desc") return textStyle("20px", "400", "#6D7882");
      if (key === "sections10_checkTitle")
        return textStyle("20px", "700", "#285DE1");
      if (key === "sections10_image" || key === "sections10_checkIcon")
        return { objectFit: "contain" };
    }

    if (layoutVal === "11") {
      if (sectionType === "text") {
        if (key === "sectionSubTitle")
          return textStyle("24px", "700", "#1F2937");
        if (key === "sectionContent")
          return textStyle("18px", "400", "#6B7280");
      }
      if (sectionType === "features") {
        if (key === "itemNumber") return textStyle("16px", "700", "#285DE1");
        if (key === "itemTitle") return textStyle("24px", "700", "#111827");
        if (key === "itemDesc") return textStyle("18px", "400", "#9CA3AF");
      }
      if (sectionType === "banner") {
        if (key === "bannerSubTitle")
          return textStyle("20px", "700", "#285DE1");
        if (key === "bannerDesc") return textStyle("18px", "400", "#9CA3AF");
      }
    }

    return {};
  };

  const getTextStructureFallbackStyle = () => {
    if (widget.type !== "textStructure") return {};

    const layoutVal = String(data.layout || "1").replace(/^layout/, "");
    const rootStyle = (TEXT_STRUCTURE_DEFAULTS as any)[`${elementKey}Style`];
    if (!itemId) {
      if (layoutVal === "7" && elementKey === "contentTitle")
        return {
          ...(rootStyle ? { ...rootStyle } : {}),
          fontSizeMobile: rootStyle?.fontSizeMobile || rootStyle?.fontSize || "48px",
        };
      if (layoutVal === "7" && elementKey === "contentSubTitle")
        return {
          ...(rootStyle ? { ...rootStyle } : {}),
          fontSizeMobile: rootStyle?.fontSizeMobile || rootStyle?.fontSize || "20px",
        };
      return rootStyle ? { ...rootStyle } : {};
    }

    if (
      layoutVal === "4" &&
      ["caseTitle", "caseSubTitle"].includes(elementKey)
    ) {
      return getTextStructureMappedFallbackStyle(
        layoutVal,
        undefined,
        elementKey,
      );
    }

    if (elementKey.startsWith("sections10_")) {
      const idx = Number.parseInt(itemId, 10);
      const defaultSection =
        TEXT_STRUCTURE_10_DEFAULT_SECTIONS[idx] ||
        TEXT_STRUCTURE_10_DEFAULT_SECTIONS[0];
      const styleFieldMap: Record<string, string> = {
        number: "numberStyle",
        title: "titleStyle",
        image: "imageStyle",
        subTitle: "subTitleStyle",
        desc: "descStyle",
        checkTitle: "checkTitleStyle",
        checkIcon: "checkIconStyle",
      };
      const fieldRef = elementKey.replace("sections10_", "");
      const fallback = (defaultSection as any)?.[styleFieldMap[fieldRef]];
      return fallback
        ? { ...fallback }
        : getTextStructureMappedFallbackStyle(layoutVal, undefined, elementKey);
    }

    const sectionConfigs: Record<string, { key: string; defaults: any[] }> = {
      "5": { key: "sections5", defaults: TEXT_STRUCTURE_5_DEFAULT_SECTIONS },
      "6": { key: "sections6", defaults: TEXT_STRUCTURE_6_DEFAULT_SECTIONS },
      "7": { key: "sections7", defaults: TEXT_STRUCTURE_7_DEFAULT_SECTIONS },
      "8": { key: "sections8", defaults: TEXT_STRUCTURE_8_DEFAULT_SECTIONS },
      "9": { key: "sections9", defaults: TEXT_STRUCTURE_9_DEFAULT_SECTIONS },
      "11": { key: "sections11", defaults: TEXT_STRUCTURE_11_DEFAULT_SECTIONS },
    };

    const config = sectionConfigs[layoutVal];
    if (!config) return {};

    const sections = (data as any)[config.key] || config.defaults;
    const sectionStyleMap: Record<string, string> = {
      bojoTitle: "bojoTitleStyle",
      sectionSubTitle: "subTitleStyle",
      sectionContent: "contentStyle",
      sectionNewsletterSubTitle: "newsletterSubTitleStyle",
      sectionNewsletterLeft: "leftContentStyle",
      sectionNewsletterRight: "rightContentStyle",
      sectionBasicText: "contentStyle",
      bannerSubTitle: "bannerSubTitleStyle",
      bannerDesc: "bannerDescStyle",
    };

    if (sectionStyleMap[elementKey]) {
      const sectionIndex = sections.findIndex(
        (section: any) => section.id === itemId,
      );
      const section = sectionIndex >= 0 ? sections[sectionIndex] : null;
      const defaultSection =
        config.defaults.find((candidate: any) => candidate.id === itemId) ||
        config.defaults[sectionIndex];
      const fallback = defaultSection?.[sectionStyleMap[elementKey]];
      return {
        ...getTextStructureMappedFallbackStyle(
          layoutVal,
          section?.type,
          elementKey,
        ),
        ...(fallback ? { ...fallback } : {}),
      };
    }

    if (
      !["itemTitle", "itemDesc", "itemIcon", "itemNumber"].includes(elementKey)
    )
      return {};

    let sectionIndex = -1;
    let itemIndex = -1;
    let section: any = null;
    let item: any = null;

    for (let sIdx = 0; sIdx < sections.length; sIdx += 1) {
      const currentSection = sections[sIdx];
      if (!currentSection?.items) continue;

      const directIndex = (currentSection.items || []).findIndex(
        (candidate: any) => candidate.id === itemId,
      );
      if (directIndex >= 0) {
        sectionIndex = sIdx;
        itemIndex = directIndex;
        section = currentSection;
        item = currentSection.items[directIndex];
        break;
      }

      if (typeof itemId === "string" && itemId.includes(":")) {
        const [sectionId, rawIdx] = itemId.split(":");
        const parsedIdx = Number.parseInt(rawIdx, 10);
        if (
          currentSection.id === sectionId &&
          Number.isInteger(parsedIdx) &&
          parsedIdx >= 0 &&
          parsedIdx < currentSection.items.length
        ) {
          sectionIndex = sIdx;
          itemIndex = parsedIdx;
          section = currentSection;
          item = currentSection.items[parsedIdx];
          break;
        }
      }
    }

    const defaultSection =
      (section &&
        config.defaults.find(
          (candidate: any) => candidate.id === section.id,
        )) ||
      config.defaults[sectionIndex];
    const defaultItem =
      defaultSection?.items?.find(
        (candidate: any) => candidate.id === item?.id,
      ) || defaultSection?.items?.[itemIndex];
    const styleProp =
      elementKey === "itemTitle"
        ? item?.title !== undefined
          ? "titleStyle"
          : "labelStyle"
        : elementKey === "itemDesc"
          ? item?.desc !== undefined
            ? "descStyle"
            : "contentStyle"
          : elementKey === "itemNumber"
            ? "numberStyle"
            : "iconStyle";
    const fallback = defaultItem?.[styleProp];

    return {
      ...getTextStructureMappedFallbackStyle(
        layoutVal,
        section?.type,
        elementKey,
      ),
      ...(fallback ? { ...fallback } : {}),
    };
  };

  const getImageCardFallbackStyle = () => {
    if (widget.type !== "imageCard") return {};

    const layoutVal = String(data.layout || "1").replace(/^layout/, "");
    const overlayTitle = layoutVal === "2";
    const largeTitle = ["3", "4", "5", "6"].includes(layoutVal);
    const imageCardFallbackMap: Record<string, any> = {
      subTitle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#285DE1",
      },
      title: {
        fontSize: "40px",
        fontSizeMobile: "28px",
        fontWeight: "700",
        color: "#131416",
      },
      desc: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6D7882",
      },
      itemSubTitle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#285DE1",
      },
      itemTitle: largeTitle
        ? {
            fontSize: "30px",
            fontSizeMobile: "24px",
            fontWeight: "700",
            color: "#131416",
          }
        : overlayTitle
          ? {
              fontSize: "20px",
              fontSizeMobile: "18px",
              fontWeight: "700",
              color: "#FFFFFF",
            }
          : {
              fontSize: "20px",
              fontSizeMobile: "18px",
              fontWeight: "700",
              color: "#131416",
            },
      itemDesc: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "400",
        color: "#6D7882",
      },
      itemFeatureLabel: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#285DE1",
      },
      itemFeatureValue: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "400",
        color: "#6D7882",
      },
      itemBadge1: {
        fontSize: "14px",
        fontWeight: "600",
      },
      itemBadge2: {
        fontSize: "14px",
        fontWeight: "600",
      },
      itemBadge3: {
        fontSize: "14px",
        fontWeight: "600",
      },
    };

    if (/^itemFeatureLabel:\d+$/.test(elementKey)) {
      return imageCardFallbackMap.itemFeatureLabel;
    }
    if (/^itemFeatureValue:\d+$/.test(elementKey)) {
      return imageCardFallbackMap.itemFeatureValue;
    }

    return imageCardFallbackMap[elementKey] || {};
  };
  const getIconCardFallbackStyle = () => {
    if (widget.type !== "iconCard") return {};

    const iconCardFallbackMap: Record<string, any> = {
      subTitle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#285DE1",
      },
      title: {
        fontSize: "40px",
        fontSizeMobile: "28px",
        fontWeight: "700",
        color: "#131416",
      },
      desc: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6D7882",
      },
      itemSubTitle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "700",
        color: "#285DE1",
      },
    };

    return iconCardFallbackMap[elementKey] || {};
  };
  const getProcessFallbackStyle = () => {
    if (widget.type !== "process" && widget.type !== "processCard") return {};

    const processFallbackMap: Record<string, any> = {
      subTitle: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#285DE1",
      },
      title: {
        fontSize: "40px",
        fontSizeMobile: "28px",
        fontWeight: "700",
        color: "#131416",
      },
      desc: {
        fontSize: "20px",
        fontSizeMobile: "18px",
        fontWeight: "500",
        color: "#6D7882",
      },
    };

    return processFallbackMap[elementKey] || {};
  };
  const getComparisonCardFallbackStyle = () => {
    if (widget.type !== "comparisonCard") return {};

    if (elementKey === "subTitle") return { ...COMPARISON_CARD_DEFAULTS.subTitleStyle };
    if (elementKey === "title") return { ...COMPARISON_CARD_DEFAULTS.titleStyle };
    if (elementKey === "desc") return { ...COMPARISON_CARD_DEFAULTS.descStyle };
    if (elementKey === "middleTitle")
      return { ...COMPARISON_CARD_DEFAULTS.middleTitleStyle };
    if (elementKey === "rowLabel")
      return {
        ...COMPARISON_CARD_DEFAULTS.rowLabelStyle,
        fontSizeMobile:
          COMPARISON_CARD_DEFAULTS.rowLabelStyle.fontSizeMobile || "18px",
      };
    if (elementKey === "itemTitle") {
      const currentItems = getEditorItemArray("items");
      const currentItem = itemId ? findItem(currentItems, itemId) : null;
      const defaultItem =
        COMPARISON_CARD_DEFAULTS.items.find((it: any) => it.id === itemId) ||
        COMPARISON_CARD_DEFAULTS.items[0];
      const fallbackItem =
        currentItem || defaultItem;
      return {
        ...(defaultItem?.titleStyle || {}),
        ...(fallbackItem?.titleStyle || {}),
      };
    }
    if (elementKey === "leftDescItems" || elementKey === "rightDescItems") {
      const sideIndex = elementKey === "leftDescItems" ? 0 : 1;
      const items =
        data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;
      const sideItem = items[sideIndex] || {};
      const fallbackDescStyle = {
        ...(COMPARISON_CARD_DEFAULTS.items[sideIndex]?.descStyle || {}),
        ...(sideItem.descStyle || {}),
      };
      return {
        ...fallbackDescStyle,
        fontSizeMobile: fallbackDescStyle.fontSizeMobile || "18px",
      };
    }

    return {};
  };

  const getCultureLetterFallbackStyle = () => {
    if (widget.type !== "cultureLetter" || !styleKey) return {};

    const fallback = (CULTURE_LETTER_DEFAULTS as any)[styleKey];
    return fallback && typeof fallback === "object" ? { ...fallback } : {};
  };
  const getTitleBannerFallbackStyle = () => {
    if (widget.type !== "titleBanner" || !styleKey || itemId) return {};

    const fallback = (TITLE_BANNER_DEFAULTS as any)[styleKey];
    return fallback && typeof fallback === "object" ? { ...fallback } : {};
  };
  const getInfoBannerFallbackStyle = () => {
    if (widget.type !== "infoBanner") return {};

    const layoutVal = String(data.layout || "1").replace(/^layout/, "");
    if (layoutVal !== "5") return {};

    const cloneStyle = (value: any) =>
      value && typeof value === "object" ? { ...value } : {};

    if (elementKey === "layout5SubTitle") {
      return cloneStyle(
        data.layout5SubTitleStyle || INFO_BANNER_DEFAULTS.layout5SubTitleStyle,
      );
    }

    if (elementKey === "layout5Title") {
      return cloneStyle(
        data.layout5TitleStyle || INFO_BANNER_DEFAULTS.layout5TitleStyle,
      );
    }

    if (elementKey === "layout5Desc") {
      return cloneStyle(
        data.layout5DescStyle || INFO_BANNER_DEFAULTS.layout5DescStyle,
      );
    }

    if (elementKey === "layout5Card1Title") {
      return cloneStyle(
        data.layout5Card1TitleStyle ||
          INFO_BANNER_DEFAULTS.layout5Card1TitleStyle,
      );
    }

    if (elementKey === "layout5Card1Desc") {
      return cloneStyle(
        data.layout5Card1DescStyle ||
          INFO_BANNER_DEFAULTS.layout5Card1DescStyle,
      );
    }

    if (elementKey === "layout5Card2Title") {
      return cloneStyle(
        data.layout5Card2TitleStyle ||
          INFO_BANNER_DEFAULTS.layout5Card2TitleStyle,
      );
    }

    if (elementKey === "layout5Card2Desc") {
      return cloneStyle(
        data.layout5Card2DescStyle ||
          INFO_BANNER_DEFAULTS.layout5Card2DescStyle,
      );
    }

    if (elementKey === "itemTitle") {
      return cloneStyle(
        data.layout5Card1TitleStyle ||
          INFO_BANNER_DEFAULTS.layout5Card1TitleStyle,
      );
    }

    if (elementKey === "itemDesc") {
      return cloneStyle(
        data.layout5Card1DescStyle ||
          INFO_BANNER_DEFAULTS.layout5Card1DescStyle,
      );
    }

    return {};
  };

  if (elementKey === "tableHeaderGubun") {
    textValue = data.comparisonGubun || "구분";
    styleKey = "headerStyle";
    styleValue = data.headerStyle || {};
    // Direct update for simple string property
    onTextChange = (val) =>
      updateWidgetData(widget.id, { comparisonGubun: val });
    onStyleChange = (k, v) =>
      updateWidgetData(widget.id, {
        [styleKey]: { ...(data[styleKey] || {}), ...(typeof k === "object" ? k : { [k]: v }) },
      });
  } else if (elementKey === "tableHeader") {
    const idx = parseInt(itemId || "0");
    const isComparison = data.variant === "comparison";
    const hKey = isComparison ? "comparisonHeaders" : "headers";
    const currentHeaders =
      data[hKey] || (isComparison ? ["베이직", "프리미엄", "플래티넘"] : []);

    textValue = currentHeaders[idx] || "";
    styleKey = "headerStyle";
    styleValue = {
      ...(data.headerStyle || {}),
      backgroundColor:
        data.headerCellStyles?.[idx]?.backgroundColor ??
        (data.headerStyle || {}).backgroundColor,
    };
    onTextChange = (val) => {
      const newHeaders = [...currentHeaders];
      newHeaders[idx] = val;
      updateWidgetData(widget.id, { [hKey]: newHeaders });
    };
    onStyleChange = (k, v) => {
      if (k === "backgroundColor") {
        const current = { ...(data.headerCellStyles || {}) };
        current[idx] = { ...(current[idx] || {}), backgroundColor: v };
        updateWidgetData(widget.id, { headerCellStyles: current });
      } else {
        updateWidgetData(widget.id, {
          headerStyle: { ...(data.headerStyle || {}), ...(typeof k === "object" ? k : { [k]: v }) },
        });
      }
    };
  } else if (elementKey === "tableCell") {
    const [r, c] = (itemId || "0-0").split("-").map(Number);
    const isComparison = data.variant === "comparison";
    const rKey = isComparison ? "comparisonRows" : "rows";
    const currentRows =
      data[rKey] ||
      (isComparison
        ? [
            ["비용", "10,000원", "20,000원", "30,000원"],
            ["용량", "10GB", "50GB", "무제한"],
            ["지원구분 1", "전체", "전체", "전체"],
          ]
        : []);

    const cellKey = `${r}-${c}`;
    textValue = currentRows[r]?.[c] || "";
    styleKey = "bodyStyle";
    styleValue = {
      ...(data.bodyStyle || {}),
      backgroundColor:
        data.cellStyles?.[cellKey]?.backgroundColor ??
        (data.bodyStyle || {}).backgroundColor,
    };
    onTextChange = (val) => {
      const newRows = [...currentRows];
      newRows[r] = [...(newRows[r] || [])];
      newRows[r][c] = val;
      updateWidgetData(widget.id, { [rKey]: newRows });
    };
    onStyleChange = (k, v) => {
      if (k === "backgroundColor") {
        const current = { ...(data.cellStyles || {}) };
        current[cellKey] = { ...(current[cellKey] || {}), backgroundColor: v };
        updateWidgetData(widget.id, { cellStyles: current });
      } else {
        updateWidgetData(widget.id, {
          bodyStyle: { ...(data.bodyStyle || {}), ...(typeof k === "object" ? k : { [k]: v }) },
        });
      }
    };
  } else if (elementKey === "middleTitle") {
    textValue = data.middleTitle || "비교 head명";
    onTextChange = (val) => updateWidgetData(widget.id, { middleTitle: val });
    styleKey = "middleTitleStyle";
    styleValue = data.middleTitleStyle || {};
    onStyleChange = (k, v) =>
      updateWidgetData(widget.id, {
        [styleKey]: { ...(data[styleKey] || {}), ...(typeof k === "object" ? k : { [k]: v }) },
      });
  } else if (elementKey === "rowLabel") {
    const idx = parseInt(itemId || "0");
    const currentLabels = data.rowLabels || [];
    textValue = currentLabels[idx] || "프로그램 특징 내용 입력";
    onTextChange = (val) => {
      const newLabels = [...currentLabels];
      while (newLabels.length <= idx) newLabels.push("");
      newLabels[idx] = val;
      updateWidgetData(widget.id, { rowLabels: newLabels });
    };
    styleKey = "rowLabelStyle";
    styleValue = data.rowLabelStyle || {};
    onStyleChange = (k, v) =>
      updateWidgetData(widget.id, {
        [styleKey]: { ...(data[styleKey] || {}), ...(typeof k === "object" ? k : { [k]: v }) },
      });
  } else if (
    widget.type === "comparisonCard" &&
    (elementKey === "leftDescItems" || elementKey === "rightDescItems")
  ) {
    const listKey = elementKey;
    const currentList =
      data[listKey] ||
      (elementKey === "leftDescItems"
        ? DEFAULT_LEFT_DESC_ITEMS
        : DEFAULT_RIGHT_DESC_ITEMS);
    const items =
      data.items?.length >= 2 ? data.items : COMPARISON_CARD_DEFAULTS.items;
    const sideIndex = elementKey === "leftDescItems" ? 0 : 1;
    const sideItem = items[sideIndex] || {};
    const match =
      typeof itemId === "string"
        ? itemId.match(/^(left|right):(\d+)$/)
        : null;
    const targetIndex =
      match &&
      ((elementKey === "leftDescItems" && match[1] === "left") ||
        (elementKey === "rightDescItems" && match[1] === "right"))
        ? Number.parseInt(match[2], 10)
        : -1;

    styleKey = "descStyle";
    styleValue = sideItem.descStyle || {};

    if (targetIndex >= 0) {
      textValue =
        currentList[targetIndex]?.text || "프로그램 특징 내용 입력";
      onTextChange = (val) => {
        const nextList = [...currentList];
        while (nextList.length <= targetIndex) {
          nextList.push({ id: `${sideIndex}-${nextList.length}`, text: "" });
        }
        nextList[targetIndex] = {
          ...(nextList[targetIndex] || {
            id: `${sideIndex}-${targetIndex}`,
          }),
          text: val,
        };
        updateWidgetData(widget.id, { [listKey]: nextList });
      };
    } else {
      textValue = currentList.map((it: any) => it?.text || "").join("\n");
      onTextChange = (val) => {
        const lines = String(val)
          .replace(/\r\n?/g, "\n")
          .split("\n");
        const nextList = currentList.map((it: any, idx: number) => ({
          ...(it || { id: `${sideIndex}-${idx}` }),
          text: lines[idx] ?? "",
        }));
        updateWidgetData(widget.id, { [listKey]: nextList });
      };
    }

    onStyleChange = (k, v) => {
      const nextItems = [...items];
      nextItems[sideIndex] = {
        ...sideItem,
        descStyle: {
          ...(sideItem.descStyle || {}),
          ...(typeof k === "object" ? k : { [k]: v }),
        },
      };
      updateWidgetData(widget.id, { items: nextItems });
    };
  } else if (
    widget.type === "textStructure" &&
    [
      "bojoTitle",
      "sectionSubTitle",
      "sectionContent",
      "sectionNewsletterSubTitle",
      "sectionNewsletterLeft",
      "sectionNewsletterRight",
      "sectionBasicText",
      "bannerSubTitle",
      "bannerDesc",
    ].includes(elementKey) &&
    itemId
  ) {
    // 레이아웃 5/6/7/8/9/11 동적 섹션 텍스트 편집 처리
    const sections5: any[] =
      data.sections5 || TEXT_STRUCTURE_5_DEFAULT_SECTIONS;
    const sections6: any[] =
      data.sections6 || TEXT_STRUCTURE_6_DEFAULT_SECTIONS;
    const sections7: any[] =
      data.sections7 || TEXT_STRUCTURE_7_DEFAULT_SECTIONS;
    const sections8: any[] =
      data.sections8 || TEXT_STRUCTURE_8_DEFAULT_SECTIONS;
    const sections9: any[] =
      data.sections9 || TEXT_STRUCTURE_9_DEFAULT_SECTIONS;
    const sections11: any[] =
      data.sections11 || TEXT_STRUCTURE_11_DEFAULT_SECTIONS;
    let sectionsArr = sections5;
    let sectionsKey = "sections5";
    let section = sections5.find((s: any) => s.id === itemId);
    if (!section) {
      const sec6 = sections6.find((s: any) => s.id === itemId);
      if (sec6) {
        section = sec6;
        sectionsArr = sections6;
        sectionsKey = "sections6";
      }
    }
    if (!section) {
      const sec7 = sections7.find((s: any) => s.id === itemId);
      if (sec7) {
        section = sec7;
        sectionsArr = sections7;
        sectionsKey = "sections7";
      }
    }
    if (!section) {
      const sec8 = sections8.find((s: any) => s.id === itemId);
      if (sec8) {
        section = sec8;
        sectionsArr = sections8;
        sectionsKey = "sections8";
      }
    }
    if (!section) {
      const sec9 = sections9.find((s: any) => s.id === itemId);
      if (sec9) {
        section = sec9;
        sectionsArr = sections9;
        sectionsKey = "sections9";
      }
    }
    if (!section) {
      const sec11 = sections11.find((s: any) => s.id === itemId);
      if (sec11) {
        section = sec11;
        sectionsArr = sections11;
        sectionsKey = "sections11";
      }
    }

    const textPropMap: Record<string, string> = {
      bojoTitle: "bojoTitle",
      sectionSubTitle: "subTitle",
      sectionContent: "content",
      sectionBasicText: "content",
      sectionNewsletterSubTitle: "newsletterSubTitle",
      sectionNewsletterLeft: "leftContent",
      sectionNewsletterRight: "rightContent",
      bannerSubTitle: "bannerSubTitle",
      bannerDesc: "bannerDesc",
    };
    const stylePropMap: Record<string, string> = {
      bojoTitle: "bojoTitleStyle",
      sectionSubTitle: "subTitleStyle",
      sectionContent: "contentStyle",
      sectionBasicText: "contentStyle",
      sectionNewsletterSubTitle: "newsletterSubTitleStyle",
      sectionNewsletterLeft: "leftContentStyle",
      sectionNewsletterRight: "rightContentStyle",
      bannerSubTitle: "bannerSubTitleStyle",
      bannerDesc: "bannerDescStyle",
    };

    const textProp = textPropMap[elementKey];
    const styleProp = stylePropMap[elementKey];
    textValue = section?.[textProp] || "";
    styleKey = styleProp;
    styleValue = section?.[styleProp] || {};

    onTextChange = (val) => {
      const updated = sectionsArr.map((s: any) =>
        s.id === itemId ? { ...s, [textProp]: val } : s,
      );
      updateWidgetData(widget.id, { [sectionsKey]: updated });
    };
    onStyleChange = (k, v) => {
      const updated = sectionsArr.map((s: any) =>
        s.id === itemId
          ? { ...s, [styleProp]: { ...(s[styleProp] || {}), ...(typeof k === "object" ? k : { [k]: v }) } }
          : s,
      );
      updateWidgetData(widget.id, { [sectionsKey]: updated });
    };
  } else if (
    widget.type === "textStructure" &&
    elementKey.startsWith("sections10_") &&
    itemId
  ) {
    // [레이아웃 10 전용] sections10 내부 요소 편집 (number, title, subTitle, desc, checkTitle, checkIcon)
    const sections10: any[] = data.sections10 || TEXT_STRUCTURE_10_DEFAULT_SECTIONS;
    const idx = parseInt(itemId);
    const section = sections10[idx];

    if (section) {
      const fieldRef = elementKey.replace("sections10_", "");
      // 필드 명칭 매핑 (텍스트 및 이미지 소스용)
      const textFieldMap: Record<string, string> = {
        number: "number",
        title: "title",
        image: "iconUrl", // renderer: iconUrl
        subTitle: "subTitle",
        desc: "desc",
        checkTitle: "checkTitle",
        checkIcon: "checkIconUrl", // renderer: checkIconUrl
      };
      // 스타일 필드 명칭 매핑
      const styleFieldMap: Record<string, string> = {
        number: "numberStyle",
        title: "titleStyle",
        image: "imageStyle",
        subTitle: "subTitleStyle",
        desc: "descStyle",
        checkTitle: "checkTitleStyle",
        checkIcon: "checkIconStyle",
      };

      const textField = textFieldMap[fieldRef];
      const styleField = styleFieldMap[fieldRef];

      textValue = section[textField] || "";
      styleKey = styleField || "";
      styleValue = section[styleField] || {};

      onTextChange = (val) => {
        const updated = [...sections10];
        updated[idx] = { ...updated[idx], [textField]: val };
        updateWidgetData(widget.id, { sections10: updated });
      };

      onStyleChange = (k, v) => {
        if (!styleField) return;
        const updated = [...sections10];
        const oldStyle = updated[idx][styleField] || {};
        updated[idx] = {
          ...updated[idx],
          [styleField]: { ...oldStyle, ...(typeof k === "object" ? k : { [k]: v }) },
        };
        updateWidgetData(widget.id, { sections10: updated });
      };
    }
  } else if (
    widget.type === "textStructure" &&
    String(data.layout || "1").replace(/^layout/, "") === "4" &&
    ["caseTitle", "caseSubTitle"].includes(elementKey) &&
    itemId
  ) {
    const cases = data.cases || (TEXT_STRUCTURE_DEFAULTS as any).cases || [];
    const caseItem = cases.find((candidate: any) => candidate.id === itemId);
    if (caseItem) {
      const textProp = elementKey === "caseTitle" ? "title" : "subTitle";
      const caseStyleKey =
        elementKey === "caseTitle" ? "titleStyle" : "subTitleStyle";

      textValue = caseItem[textProp] || "";
      styleKey = caseStyleKey;
      styleValue = caseItem[caseStyleKey] || {};

      onTextChange = (val) => {
        const updatedCases = cases.map((candidate: any) =>
          candidate.id === itemId
            ? { ...candidate, [textProp]: val }
            : candidate,
        );
        updateWidgetData(widget.id, { cases: updatedCases });
      };
      onStyleChange = (k, v) => {
        const updatedCases = cases.map((candidate: any) =>
          candidate.id !== itemId
            ? candidate
            : {
                ...candidate,
                [caseStyleKey]: {
                  ...(candidate[caseStyleKey] || {}),
                  ...(typeof k === "object" ? k : { [k]: v }),
                },
              },
        );
        updateWidgetData(widget.id, { cases: updatedCases });
      };
    }
  } else if (
    widget.type === "textStructure" &&
    String(data.layout || "1").replace(/^layout/, "") === "4" &&
    elementKey === "caseFeatureText" &&
    itemId
  ) {
    const [caseId, featureIdxStr] = String(itemId).split(":");
    const featureIdx = parseInt(featureIdxStr, 10);
    const cases = data.cases || (TEXT_STRUCTURE_DEFAULTS as any).cases || [];
    const caseItem = cases.find((candidate: any) => candidate.id === caseId);
    if (caseItem && !isNaN(featureIdx)) {
      textValue = (caseItem.features || [])[featureIdx] || "";
      styleKey = "featureStyle";
      styleValue = caseItem.featureStyle || {};

      onTextChange = (val) => {
        const updatedCases = cases.map((candidate: any) => {
          if (candidate.id !== caseId) return candidate;
          const features = [...(candidate.features || [])];
          features[featureIdx] = val;
          return { ...candidate, features };
        });
        updateWidgetData(widget.id, { cases: updatedCases });
      };
      onStyleChange = (k, v) => {
        const updatedCases = cases.map((candidate: any) =>
          candidate.id !== caseId
            ? candidate
            : {
                ...candidate,
                featureStyle: {
                  ...(candidate.featureStyle || {}),
                  ...(typeof k === "object" ? k : { [k]: v }),
                },
              },
        );
        updateWidgetData(widget.id, { cases: updatedCases });
      };
    }
  } else if (itemId) {
    let arrayName = "items";
    if (widget.type === "process" || widget.type === "processCard")
      arrayName = "steps";
    else if (widget.type === "tabCarousel") arrayName = "tabs";
    else if (widget.type === "textSplit" && data.variant === "image-left-list")
      arrayName = "listItems";
    else if (widget.type === "textSection") {
      if (data.variant === "text2" || data.variant === "text3")
        arrayName = "items";
      else arrayName = "blocks";
    } else if (widget.type === "textStructure") {
      const layoutVal = String(data.layout || "1");

      if (elementKey === "image") {
        const multiImageMatch = String(itemId).match(
          /^s([5-8])img_(.+)_(\d+)$/,
        );
        const bannerImageMatch = String(itemId).match(/^s([5-7])banner_(.+)$/);
        const labelImageMatch = String(itemId).match(/^s5labelimg_(.+)$/);

        if (multiImageMatch || bannerImageMatch || labelImageMatch) {
          const sectionKey = multiImageMatch
            ? (`sections${multiImageMatch[1]}` as const)
            : bannerImageMatch
              ? (`sections${bannerImageMatch[1]}` as const)
              : "sections5";
          const sectionId = multiImageMatch
            ? multiImageMatch[2]
            : bannerImageMatch
              ? bannerImageMatch[2]
              : labelImageMatch![1];
          const imageIdx = multiImageMatch
            ? Number.parseInt(multiImageMatch[3], 10)
            : -1;
          const sections = (data as any)[sectionKey] || [];
          const section = sections.find((s: any) => s.id === sectionId);

          if (section) {
            const isGridImage = imageIdx >= 0;
            const imageList = isGridImage ? [...(section.images || [])] : [];

            textValue = isGridImage
              ? imageList[imageIdx] || "/images/placeholder/card-sm.jpg"
              : section.imageUrl || "/images/placeholder/card-sm.jpg";
            styleKey = "imageStyle";
            styleValue = section.imageStyle || {};

            onTextChange = (val) => {
              const updatedSections = sections.map((s: any) => {
                if (s.id !== sectionId) return s;
                if (isGridImage) {
                  const nextImages = [...(s.images || [])];
                  while (nextImages.length <= imageIdx) {
                    nextImages.push("/images/placeholder/card-sm.jpg");
                  }
                  nextImages[imageIdx] = val;
                  return { ...s, images: nextImages };
                }
                return { ...s, imageUrl: val };
              });
              updateWidgetData(widget.id, { [sectionKey]: updatedSections });
            };

            onStyleChange = (k, v) => {
              const updatedSections = sections.map((s: any) =>
                s.id !== sectionId
                  ? s
                  : {
                      ...s,
                      imageStyle: {
                        ...(s.imageStyle || {}),
                        ...(typeof k === "object" ? k : { [k]: v }),
                      },
                    },
              );
              updateWidgetData(widget.id, { [sectionKey]: updatedSections });
            };
          }
        }
      }

      if (
        (layoutVal === "5" ||
          layoutVal === "6" ||
          layoutVal === "8" ||
          layoutVal === "9" ||
          layoutVal === "layout5" ||
          layoutVal === "layout6" ||
          layoutVal === "layout8" ||
          layoutVal === "layout9") &&
        ["itemTitle", "itemDesc", "itemIcon"].includes(elementKey)
      ) {
        const layoutSectionConfig =
          layoutVal === "5" || layoutVal === "layout5"
            ? {
                key: "sections5",
                defaults: TEXT_STRUCTURE_5_DEFAULT_SECTIONS,
              }
            : layoutVal === "6" || layoutVal === "layout6"
              ? {
                  key: "sections6",
                  defaults: TEXT_STRUCTURE_6_DEFAULT_SECTIONS,
                }
              : layoutVal === "8" || layoutVal === "layout8"
                ? {
                    key: "sections8",
                    defaults: TEXT_STRUCTURE_8_DEFAULT_SECTIONS,
                  }
                : {
                    key: "sections9",
                    defaults: TEXT_STRUCTURE_9_DEFAULT_SECTIONS,
                  };
        const sections =
          data[layoutSectionConfig.key] || layoutSectionConfig.defaults;
        let matchedSectionId: string | null = null;
        let matchedItem: any = null;
        let matchedItemIndex = -1;

        for (const section of sections) {
          if (!section?.items) continue;
          const foundIndex = (section.items || []).findIndex(
            (it: any) => it.id === itemId,
          );
          if (foundIndex >= 0) {
            matchedSectionId = section.id;
            matchedItem = section.items[foundIndex];
            matchedItemIndex = foundIndex;
            break;
          }
          if (typeof itemId === "string" && itemId.includes(":")) {
            const [sectionIdFromRef, itemIdxRaw] = itemId.split(":");
            const itemIdx = Number.parseInt(itemIdxRaw, 10);
            if (
              sectionIdFromRef === section.id &&
              Number.isInteger(itemIdx) &&
              itemIdx >= 0 &&
              itemIdx < section.items.length
            ) {
              matchedSectionId = section.id;
              matchedItem = section.items[itemIdx];
              matchedItemIndex = itemIdx;
              break;
            }
          }
        }

        if (matchedSectionId && matchedItem && matchedItemIndex >= 0) {
          const targetProp =
            elementKey === "itemTitle"
              ? matchedItem.title !== undefined
                ? "title"
                : "label"
              : elementKey === "itemDesc"
                ? matchedItem.desc !== undefined
                  ? "desc"
                  : "content"
                : matchedItem.iconUrl !== undefined
                  ? "iconUrl"
                  : "icon";
          const targetStyleProp =
            elementKey === "itemTitle"
              ? targetProp === "label"
                ? "labelStyle"
                : "titleStyle"
              : elementKey === "itemDesc"
                ? targetProp === "content"
                  ? "contentStyle"
                  : "descStyle"
                : "iconStyle";

          textValue = matchedItem[targetProp] || "";
          styleKey = targetStyleProp;
          styleValue = matchedItem[targetStyleProp] || {};

          onTextChange = (val) => {
            const updatedSections = sections.map((section: any) =>
              section.id !== matchedSectionId
                ? section
                : {
                    ...section,
                    items: (section.items || []).map((it: any, idx: number) =>
                      idx === matchedItemIndex ||
                      (it.id !== undefined && it.id === itemId)
                        ? { ...it, [targetProp]: val }
                        : it,
                    ),
                  },
            );
            updateWidgetData(widget.id, {
              [layoutSectionConfig.key]: updatedSections,
            });
          };
          onStyleChange = (k, v) => {
            const updatedSections = sections.map((section: any) =>
              section.id !== matchedSectionId
                ? section
                : {
                    ...section,
                    items: (section.items || []).map((it: any, idx: number) =>
                      idx === matchedItemIndex ||
                      (it.id !== undefined && it.id === itemId)
                        ? {
                            ...it,
                            [targetStyleProp]: {
                              ...(it[targetStyleProp] || {}),
                              ...(typeof k === "object" ? k : { [k]: v }),
                            },
                          }
                        : it,
                    ),
                  },
            );
            updateWidgetData(widget.id, {
              [layoutSectionConfig.key]: updatedSections,
            });
          };
        }
      }

      if (layoutVal === "4") arrayName = "cases";
      else if (layoutVal === "5" || layoutVal === "layout5")
        arrayName = "sections5";
      else if (layoutVal === "6" || layoutVal === "layout6")
        arrayName = "sections6";
      else if (layoutVal === "7" || layoutVal === "layout7")
        arrayName = "sections7";
      else if (layoutVal === "8" || layoutVal === "layout8")
        arrayName = "sections8";
      else if (layoutVal === "9" || layoutVal === "layout9")
        arrayName = "sections9";
      else if (layoutVal === "11" || layoutVal === "layout11") {
        if (
          [
            "itemNumber",
            "itemTitle",
            "itemDesc",
            "itemIcon",
            "sectionImage",
          ].includes(elementKey)
        ) {
          // Find which section and which item the element belongs to
          // sectionImage is direct in section, others are in section.items
          const sections =
            data.sections11 || TEXT_STRUCTURE_11_DEFAULT_SECTIONS;
          if (elementKey === "sectionImage") {
            const section = sections.find((s: any) => s.id === itemId);
            if (section) {
              textValue = section.imageUrl || "";
              onTextChange = (val) => {
                const updated = sections.map((s: any) =>
                  s.id === itemId ? { ...s, imageUrl: val } : s,
                );
                updateWidgetData(widget.id, { sections11: updated });
              };
            }
          } else if (elementKey === "image" && itemId?.startsWith("s11img_")) {
            // [Multi-Image Grid Support for Layout 11]
            // itemId: s11img_{sectionId}_{imgIdx}
            const [, sectionId, imgIdxStr] = itemId.split("_");
            const imgIdx = parseInt(imgIdxStr);
            const sections =
              data.sections11 || TEXT_STRUCTURE_11_DEFAULT_SECTIONS;
            const section = sections.find((s: any) => s.id === sectionId);
            if (section) {
              const images = section.images || [
                section.imageUrl ||
                  "/images/placeholder/text_structure_img11.png",
              ];
              textValue = images[imgIdx] || "";
              onTextChange = (val) => {
                const newImages = [...images];
                newImages[imgIdx] = val;
                const updatedSections = sections.map((s: any) =>
                  s.id === sectionId ? { ...s, images: newImages } : s,
                );
                updateWidgetData(widget.id, { sections11: updatedSections });
              };
            }
          } else {
            // For nested items in sections
            for (const section of sections) {
              if (section.items) {
                let itemIndex = (section.items || []).findIndex(
                  (it: any) => it.id === itemId,
                );
                if (
                  itemIndex < 0 &&
                  typeof itemId === "string" &&
                  itemId.includes(":")
                ) {
                  const [sectionIdFromRef, itemIdxRaw] = itemId.split(":");
                  const parsedIdx = Number.parseInt(itemIdxRaw, 10);
                  if (
                    sectionIdFromRef === section.id &&
                    Number.isInteger(parsedIdx) &&
                    parsedIdx >= 0 &&
                    parsedIdx < section.items.length
                  ) {
                    itemIndex = parsedIdx;
                  }
                }
                const item = itemIndex >= 0 ? section.items[itemIndex] : null;
                if (item) {
                  const targetPropMap: Record<string, string> = {
                    itemNumber: "number",
                    itemTitle: "title",
                    itemDesc: "desc",
                    itemIcon: "icon",
                  };
                  const stylePropMap: Record<string, string> = {
                    itemNumber: "numberStyle",
                    itemTitle: "titleStyle",
                    itemDesc: "descStyle",
                    itemIcon: "iconStyle",
                  };
                  const targetProp = targetPropMap[elementKey];
                  const styleProp = stylePropMap[elementKey];

                  textValue = item[targetProp] || "";
                  styleKey = styleProp;
                  styleValue = item[styleProp] || {};

                  onTextChange = (val) => {
                    const updatedSections = sections.map((s: any) => {
                      if (s.id === section.id) {
                        const updatedItems = s.items.map(
                          (it: any, idx: number) =>
                            idx === itemIndex ||
                            (it.id !== undefined && it.id === itemId)
                              ? { ...it, [targetProp]: val }
                              : it,
                        );
                        return { ...s, items: updatedItems };
                      }
                      return s;
                    });
                    updateWidgetData(widget.id, {
                      sections11: updatedSections,
                    });
                  };
                  onStyleChange = (k, v) => {
                    const updatedSections = sections.map((s: any) => {
                      if (s.id === section.id) {
                        const updatedItems = s.items.map(
                          (it: any, idx: number) =>
                            idx === itemIndex ||
                            (it.id !== undefined && it.id === itemId)
                              ? {
                                  ...it,
                                  [styleProp]: {
                                    ...(it[styleProp] || {}),
                                    ...(typeof k === "object" ? k : { [k]: v }),
                                  },
                                }
                              : it,
                        );
                        return { ...s, items: updatedItems };
                      }
                      return s;
                    });
                    updateWidgetData(widget.id, {
                      sections11: updatedSections,
                    });
                  };
                  break;
                }
              }
            }
          }
        }
        arrayName = "sections11";
      }
    }

    const currentItems = getEditorItemArray(arrayName);
    let item = findItem(currentItems, itemId);
    if (
      !item &&
      typeof itemId === "string" &&
      itemId.startsWith("__idx_") &&
      Number.isInteger(Number.parseInt(itemId.replace("__idx_", ""), 10))
    ) {
      const fallbackIndex = Number.parseInt(itemId.replace("__idx_", ""), 10);
      item = currentItems[fallbackIndex];
    }
    if (item) {
      linkValue = item.link || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, {
          [arrayName]: updateItemInArray(currentItems, itemId, "link", val),
        });

      // Detect the correct property to edit for 'item' or generic element keys
      const itemTextProp =
        item.question !== undefined
          ? "question"
          : item.label !== undefined
            ? "label"
            : item.title !== undefined
              ? "title"
              : "text";
      const styleProp =
        itemTextProp === "title"
          ? "titleStyle"
          : itemTextProp === "label"
            ? "style"
            : itemTextProp === "text"
              ? "textStyle"
              : "style";
      const getImageCardFeatureRows = (targetItem: any) => {
        const defaultLabel = (idx: number) =>
          `${targetItem?.featureLabel || "특징"} ${String(idx + 1).padStart(2, "0")}`;
        const parseLines = (value: any) => {
          const source = typeof value === "string" ? value : "";
          const lines = source
            .replace(/\r\n?/g, "\n")
            .split(/\n|<br\s*\/?>/gi)
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);

          return lines.length > 0 ? lines : [""];
        };

        const rawFeatures = Array.isArray(targetItem?.[imageCardFeatureStorageKey])
          ? targetItem[imageCardFeatureStorageKey]
          : Array.isArray(targetItem?.features)
            ? targetItem.features
          : [];

        if (!rawFeatures.length) {
          return parseLines(targetItem?.desc || "프로그램 특징 내용 입력").map(
            (line: string, idx: number) => ({
              label: defaultLabel(idx),
              value: line,
            }),
          );
        }

        let idx = 0;
        return rawFeatures.flatMap((feature: any) => {
          if (!feature) {
            const emptyRow = {
              label: defaultLabel(idx),
              value: "",
            };
            idx += 1;
            return [emptyRow];
          }

          if (typeof feature === "string") {
            const row = {
              label: defaultLabel(idx),
              value: feature,
              labelStyle: undefined,
              valueStyle: undefined,
            };
            idx += 1;
            return [row];
          }

          if (typeof feature !== "object") return [];

          const baseLabel = (feature.label || "").trim();
          const row = {
            label: baseLabel || defaultLabel(idx),
            value: typeof feature.value === "string" ? feature.value : "",
            labelStyle: feature.labelStyle,
            valueStyle: feature.valueStyle,
          };
          idx += 1;
          return [row];
        });
      };

      if (elementKey === "itemStyle") {
        styleKey = "itemStyle";
        styleValue = item[styleKey] || {};
        onStyleChange = (k, v) => {
          const updates = typeof k === "object" ? k : { [k]: v };
          const currentItems = data[arrayName] || [];
          const fallbackIndex =
            typeof itemId === "string" && itemId.startsWith("__idx_")
              ? Number.parseInt(itemId.replace("__idx_", ""), 10)
              : -1;
          const updatedItems = currentItems.map((it: any, idx: number) => {
            const isTarget =
              fallbackIndex >= 0 ? idx === fallbackIndex : it.id === itemId;
            if (!isTarget) return it;
            const oldStyle = it[styleKey] || {};
            return { ...it, [styleKey]: { ...oldStyle, ...updates } };
          });
          updateWidgetData(widget.id, { [arrayName]: updatedItems });
        };
      } else if (
        widget.type === "imageCard" &&
        /^itemFeature(Label|Value)(:\d+)?$/.test(elementKey)
      ) {
        const [, featureField = "Label", featureIndexRaw] =
          elementKey.match(/^itemFeature(Label|Value)(?::(\d+))?$/) || [];
        const featureIndex = Number.parseInt(featureIndexRaw || "0", 10) || 0;
        const featureRows = getImageCardFeatureRows(item);
        const defaultLabel = (idx: number) =>
          `${item?.featureLabel || "특징"} ${String(idx + 1).padStart(2, "0")}`;
        const safeRows =
          featureRows.length > 0
            ? [...featureRows]
            : [
                {
                  label: defaultLabel(0),
                  value: "프로그램 특징 내용 입력",
                  labelStyle: undefined,
                  valueStyle: undefined,
                },
              ];

        while (safeRows.length <= featureIndex) {
          safeRows.push({
            label: defaultLabel(safeRows.length),
            value: "",
          });
        }

        const targetProp = featureField === "Label" ? "label" : "value";
        styleKey = featureField === "Label" ? "featureLabelStyle" : "descStyle";
        const featureStyleProp =
          featureField === "Label" ? "labelStyle" : "valueStyle";
        styleValue = {
          ...(item[styleKey] || {}),
          ...(safeRows[featureIndex]?.[featureStyleProp] || {}),
        };
        textValue =
          safeRows[featureIndex]?.[targetProp] ||
          (targetProp === "label"
            ? defaultLabel(featureIndex)
            : "프로그램 특징 내용 입력");

        onTextChange = (val) => {
          const nextRows = [...safeRows];
          nextRows[featureIndex] = {
            ...nextRows[featureIndex],
            [targetProp]: val,
          };

          const normalizedRows = nextRows.map((row, idx) => ({
            label: (row.label || defaultLabel(idx)).trim(),
            value: (row.value || "").trim(),
            labelStyle: row.labelStyle,
            valueStyle: row.valueStyle,
          }));
          const descFromRows = normalizedRows
            .map((row) => row.value)
            .filter((row) => row.length > 0)
            .join("<br/>");
          const currentItems = data[arrayName] || [];
          const fallbackIndex =
            typeof itemId === "string" && itemId.startsWith("__idx_")
              ? Number.parseInt(itemId.replace("__idx_", ""), 10)
              : -1;
          const updatedItems = currentItems.map((it: any, idx: number) => {
            const isTarget =
              fallbackIndex >= 0 ? idx === fallbackIndex : it.id === itemId;
            if (!isTarget) return it;
            return {
              ...it,
              [imageCardFeatureStorageKey]: normalizedRows.map((row) => ({
                label: row.label,
                value: row.value,
                ...(row.labelStyle ? { labelStyle: row.labelStyle } : {}),
                ...(row.valueStyle ? { valueStyle: row.valueStyle } : {}),
              })),
              desc: descFromRows || "프로그램 특징 내용 입력",
            };
          });
          updateWidgetData(widget.id, { [arrayName]: updatedItems });
        };
        onStyleChange = (k, v) => {
          const updates = typeof k === "object" ? k : { [k]: v };
          const currentItems = data[arrayName] || [];
          const fallbackIndex =
            typeof itemId === "string" && itemId.startsWith("__idx_")
              ? Number.parseInt(itemId.replace("__idx_", ""), 10)
              : -1;
          const updatedItems = currentItems.map((it: any, idx: number) => {
            const isTarget =
              fallbackIndex >= 0 ? idx === fallbackIndex : it.id === itemId;
            if (!isTarget) return it;
            const currentRows = getImageCardFeatureRows(it);
            while (currentRows.length <= featureIndex) {
              currentRows.push({
                label: defaultLabel(currentRows.length),
                value: "",
                labelStyle: undefined,
                valueStyle: undefined,
              });
            }
            const nextRows = [...currentRows];
            nextRows[featureIndex] = {
              ...nextRows[featureIndex],
              [featureStyleProp]: {
                ...(nextRows[featureIndex]?.[featureStyleProp] || {}),
                ...updates,
              },
            };
            return {
              ...it,
              [imageCardFeatureStorageKey]: nextRows.map((row) => ({
                label: row.label,
                value: row.value,
                ...(row.labelStyle ? { labelStyle: row.labelStyle } : {}),
                ...(row.valueStyle ? { valueStyle: row.valueStyle } : {}),
              })),
            };
          });
          updateWidgetData(widget.id, { [arrayName]: updatedItems });
        };
      } else if (
        elementKey === "item" ||
        elementKey === "itemText" ||
        elementKey === "text" ||
        elementKey === "itemTitle" ||
        elementKey === "title" ||
        elementKey === "stepTitle" ||
        elementKey === "contentTitle" ||
        elementKey === "label" ||
        elementKey === "stepLabel" ||
        elementKey === "itemLabel" ||
        elementKey === "itemTag" ||
        elementKey === "itemAuthor" ||
        elementKey === "faqQuestion" ||
        elementKey === "itemNumber" ||
        elementKey === "number" ||
        elementKey === "blockText" ||
        elementKey === "buttonText" ||
        elementKey === "bannerButton"
      ) {
        const targetProp =
          elementKey === "stepTitle" ||
          elementKey === "itemTitle" ||
          elementKey === "title" ||
          elementKey === "contentTitle"
            ? "title"
            : elementKey === "label" ||
                elementKey === "stepLabel" ||
                elementKey === "itemLabel"
              ? "label"
              : elementKey === "itemTag"
                ? "tag"
                : elementKey === "itemAuthor"
                  ? "author"
                  : elementKey === "faqQuestion"
                    ? "question"
                    : elementKey === "itemNumber" || elementKey === "number"
                      ? "number"
                      : elementKey === "itemText" ||
                          elementKey === "text" ||
                          elementKey === "blockText"
                        ? "text"
                        : elementKey === "buttonText" ||
                            elementKey === "bannerButton"
                          ? (widget.data as any).variant !== "banner3"
                            ? "buttonText"
                            : "text"
                          : itemTextProp;

        const getDefaultItemText = () => {
          if (widget.type === "process") {
            if (targetProp === "title") return "프로그램 특징";
          }
          if (widget.type === "comparisonCard" && targetProp === "title") {
            return "프로그램 특징";
          }
          if (elementKey === "itemTitle" || targetProp === "title")
            return "타이틀명 입력";
          if (elementKey === "itemText" || targetProp === "text")
            return "항목 텍스트";
          return "";
        };
        const rawItemText = item[targetProp];
        textValue =
          widget.type === "comparisonCard"
            ? rawItemText || getDefaultItemText()
            : rawItemText !== undefined
              ? rawItemText
              : getDefaultItemText();

        // Banner 2 Exception: buttonText is in main data, not item
        if (
          elementKey === "bannerButton" &&
          (widget.data as any).variant === "banner2"
        ) {
          textValue =
            (widget.data as any).buttonText || "무료 자격판정 양식 받기";
          onTextChange = (val) =>
            updateWidgetData(widget.id, { buttonText: val });
        }
        if (widget.type === "video" && targetProp === "title") {
          styleKey = "itemTitleStyle";
        } else if (elementKey === "blockText" || elementKey === "buttonText") {
          styleKey = "style";
        } else {
          styleKey =
            targetProp === "title"
              ? "titleStyle"
              : targetProp === "label"
                ? widget.type === "process" || widget.type === "cardList"
                  ? "labelStyle"
                  : "style"
                : targetProp === "tag"
                  ? "tagStyle"
                  : targetProp === "author"
                    ? "authorStyle"
                    : targetProp === "number"
                      ? "numberStyle"
                      : targetProp === "question"
                        ? "questionStyle"
                        : targetProp === "text"
                          ? "textStyle"
                          : "style";
        }

        styleValue = item[styleKey] || {};
        onTextChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, targetProp, val),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, styleKey, {
              ...(item[styleKey] || {}),
              ...(typeof k === "object" ? k : { [k]: v }),
            }),
          });
      } else if (
        elementKey === "itemBadge1" ||
        elementKey === "itemBadge2" ||
        elementKey === "itemBadge3" ||
        elementKey === "itemFeatureLabel"
      ) {
        const badgeProp =
          elementKey === "itemBadge1"
            ? "badge1"
            : elementKey === "itemBadge2"
              ? "badge2"
              : elementKey === "itemBadge3"
                ? "badge3"
                : "featureLabel";

        // 배지 텍스트 기본값 동기화 (렌더러와 동일하게)
        const badgeDefaultText =
          elementKey === "itemBadge1"
            ? "우선심사"
            : elementKey === "itemBadge2"
              ? "I-956F"
              : elementKey === "itemBadge3"
                ? "높은 고용창출"
                : "";

        textValue = item[badgeProp] || badgeDefaultText;

        // 배지 스타일 키 교정 (렌더러와 100% 일치: badge1Style -> badgeStyle1)
        styleKey =
          elementKey === "itemBadge1"
            ? "badgeStyle1"
            : elementKey === "itemBadge2"
              ? "badgeStyle2"
              : elementKey === "itemBadge3"
                ? "badgeStyle3"
                : "featureLabelStyle";

        // 현재 아이템에서 실제 스타일 객체 로드 (빈칸 문제 해결 핵심)
        styleValue = item[styleKey] || {};

        onTextChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, badgeProp, val),
          });
        onStyleChange = (k, v) => {
          const currentItem = findItem(currentItems, itemId!);
          const currentStyle = currentItem?.[styleKey] || {};
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, styleKey, {
              ...currentStyle,
              ...(typeof k === "object" ? k : { [k]: v }),
            }),
          });
        };
      } else if (
        elementKey === "stepDesc" ||
        elementKey === "itemDesc" ||
        elementKey === "itemDesc1" ||
        elementKey === "itemDesc2" ||
        elementKey === "itemDesc3" ||
        elementKey === "desc" ||
        elementKey === "contentDesc" ||
        elementKey === "faqAnswer" ||
        elementKey === "itemSubTitle" ||
        elementKey === "subTitle"
      ) {
        const targetProp =
          elementKey === "faqAnswer"
            ? "answer"
            : elementKey === "itemSubTitle" || elementKey === "subTitle"
              ? "subTitle"
              : elementKey === "itemDesc1"
                ? "desc1"
                : elementKey === "itemDesc2"
                  ? "desc2"
                : elementKey === "itemDesc3"
                  ? "desc3"
                  : "desc";
        textValue =
          item[targetProp] ||
          (targetProp === "subTitle" ? "( 서브타이틀 )" : "");
        styleKey =
          widget.type === "video" && targetProp === "desc"
            ? "itemDescStyle"
            : targetProp === "subTitle"
              ? "subTitleStyle"
              : targetProp === "answer"
                ? "answerStyle"
                : "descStyle";
        styleValue = item[styleKey] || {}; // Ensure existing style is read
        onTextChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, targetProp, val),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, styleKey, {
              ...(item[styleKey] || {}),
              ...(typeof k === "object" ? k : { [k]: v }),
            }),
          });
      } else if (
        elementKey === "iconUrl" ||
        elementKey === "icon" ||
        elementKey === "image" ||
        elementKey === "itemIcon" ||
        elementKey === "itemImage" ||
        elementKey === "imageUrl" ||
        elementKey === "mobileImageUrl" ||
        elementKey === "videoUrl" ||
        elementKey === "url" ||
        elementKey === "blockUrl"
      ) {
        // Normalize key for data access
        const propName =
          elementKey === "itemIcon" || elementKey === "iconUrl"
            ? "iconUrl"
            : elementKey === "itemImage"
              ? "image"
              : elementKey === "icon"
                ? "icon"
                : elementKey === "imageUrl"
                  ? "imageUrl"
                  : elementKey === "videoUrl"
                    ? "videoUrl"
                    : elementKey === "blockUrl"
                      ? "url"
                      : elementKey === "url"
                        ? "url"
                        : elementKey;
        const mediaPropName =
          widget.type === "imageCard" &&
          propName === "image" &&
          item.imageUrl !== undefined &&
          !item.image
            ? "imageUrl"
            : propName;

        textValue =
          item[mediaPropName] ||
          item[propName] ||
          item.imageUrl ||
          item.icon ||
          item.image ||
          item.iconUrl ||
          "";
        // For blocks (blockUrl), use 'style'. For others, use specific style keys.
        if (elementKey === "blockUrl") styleKey = "style";
        else
          styleKey =
            elementKey === "itemIcon" || elementKey === "icon"
              ? "iconStyle"
              : "imageStyle";

        styleValue = item[styleKey] || {};

        onTextChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(
              currentItems,
              itemId,
              mediaPropName,
              val,
            ),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(currentItems, itemId, styleKey, {
              ...(item[styleKey] || {}),
              ...(typeof k === "object" ? k : { [k]: v }),
            }),
          });

        autoPlayValue = item.autoPlay || false;
        mutedValue = item.muted !== undefined ? item.muted : true;
        loopValue = item.loop || false;
        onAutoPlayChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              "autoPlay",
              val,
            ),
          });
        onMutedChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              "muted",
              val,
            ),
          });
        onLoopChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              "loop",
              val,
            ),
          });
      } else {
        const propName = elementKey;
        styleKey =
          propName.includes("image") || propName.includes("url")
            ? "imageStyle"
            : propName + "Style";

        textValue = item[propName] || "";
        styleValue = item[styleKey] || {};

        onTextChange = (val) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              propName,
              val,
            ),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(data[arrayName], itemId, styleKey, {
              ...(item[styleKey] || {}),
              ...(typeof k === "object" ? k : { [k]: v }),
            }),
          });
      }

      // Allow styleOnly updates if not caught above but styleKey is defined
      if (!onStyleChange && styleKey)
        onStyleChange = (k, v) => updateStyle(styleKey, k, v);
    }
  } else {
    const getRootDefaultText = () => {
      if (widget.type === "cultureLetter") {
        const cultureLetterDefault = (CULTURE_LETTER_DEFAULTS as any)[
          elementKey
        ];
        if (typeof cultureLetterDefault === "string")
          return cultureLetterDefault;
      }
      const keyLower = elementKey.toLowerCase();
      if (keyLower.includes("subtitle")) return "( 서브타이틀 )";
      if (keyLower.includes("title")) return "타이틀명 입력";
      if (keyLower.includes("desc") || keyLower.includes("content"))
        return widget.type === "process" ||
          widget.type === "processCard" ||
          widget.type === "textStructure"
          ? "이민 프로그램명 입력"
          : "설명 내용을 입력하세요";
      return "";
    };
    // For cultureLetter URL/image keys, treat empty string same as undefined
    // so the CULTURE_LETTER_DEFAULTS (e.g. YouTube thumbnail URLs) show as value
    const isCultureLetterMediaKey =
      widget.type === "cultureLetter" &&
      (elementKey.toLowerCase().includes("url") ||
        elementKey.toLowerCase().includes("image") ||
        elementKey.toLowerCase().includes("icon") ||
        elementKey.toLowerCase().includes("media"));
    textValue =
      data[elementKey] !== undefined &&
      (!isCultureLetterMediaKey || data[elementKey])
        ? data[elementKey]
        : getRootDefaultText();
    // Convention: property 'mainTitle' -> style 'mainTitleStyle'
    styleKey =
      elementKey === "contentTitle"
        ? "contentTitleStyle"
        : elementKey === "layout3ContentTitle"
          ? "layout3ContentTitleStyle"
          : elementKey === "contentDesc"
            ? "contentDescStyle"
            : elementKey === "layout3ContentDesc"
              ? "layout3ContentDescStyle"
          : elementKey === "layout3LeftImageUrl"
            ? "layout3LeftImageUrlStyle"
            : elementKey === "layout3RightImageUrl"
              ? "layout3RightImageUrlStyle"
          : elementKey === "image" ||
              elementKey === "imageUrl" ||
              elementKey === "imageMobile"
            ? "imageStyle"
            : elementKey === "videoUrl" || elementKey === "url"
              ? "videoStyle"
              : elementKey === "buttonText" && widget.type === "stripBanner"
                ? "buttonStyle"
                : elementKey + "Style";
    styleValue = data[styleKey] || {};

    onTextChange = (val) => updateWidgetData(widget.id, { [elementKey]: val });
    onStyleChange = (k, v) => updateStyle(styleKey, k, v);
    // cultureLetter Layout 4: 썸네일 URL 자체가 클릭 링크 (YouTube 비디오 URL)
    if (
      widget.type === "cultureLetter" &&
      (elementKey === "cl4C1ThumbUrl" ||
        elementKey === "cl4C2ThumbUrl" ||
        elementKey === "cl4C3ThumbUrl")
    ) {
      // linkValue = 썸네일 URL 자체 (YouTube URL → 클릭 시 이동)
      linkValue = data[elementKey] || CULTURE_LETTER_DEFAULTS[elementKey] || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, { [elementKey]: val });
    }
    // cultureLetter Layout 5: 카드별 전용 링크 키 사용 (타이틀/설명/배경이미지 모두)
    else if (
      widget.type === "cultureLetter" &&
      (elementKey === "layout5Card1Title" ||
        elementKey === "layout5Card1Desc" ||
        elementKey === "cl5C1CardBgUrl")
    ) {
      linkValue = data.layout5Card1Link || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, { layout5Card1Link: val });
    } else if (
      widget.type === "cultureLetter" &&
      (elementKey === "layout5Card2Title" ||
        elementKey === "layout5Card2Desc" ||
        elementKey === "cl5C2CardBgUrl")
    ) {
      linkValue = data.layout5Card2Link || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, { layout5Card2Link: val });
    } else if (
      widget.type === "cultureLetter" &&
      (elementKey === "layout5Card3Title" ||
        elementKey === "layout5Card3Desc" ||
        elementKey === "cl5C3CardBgUrl")
    ) {
      linkValue = data.layout5Card3Link || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, { layout5Card3Link: val });
    } else {
      linkValue = data.link || "";
      onLinkChange = (val) => updateWidgetData(widget.id, { link: val });
    }

    autoPlayValue = data.autoPlay || false;
    mutedValue = data.muted !== undefined ? data.muted : true;
    loopValue = data.loop || false;
    onAutoPlayChange = (val) => updateWidgetData(widget.id, { autoPlay: val });
    onMutedChange = (val) => updateWidgetData(widget.id, { muted: val });
    onLoopChange = (val) => updateWidgetData(widget.id, { loop: val });
  }

  const textStructureFallbackStyle = getTextStructureFallbackStyle();
  if (widget.type === "textStructure" && textStructureFallbackStyle) {
    styleValue = { ...textStructureFallbackStyle, ...styleValue };
  }
  const imageCardFallbackStyle = getImageCardFallbackStyle();
  if (widget.type === "imageCard" && imageCardFallbackStyle) {
    styleValue = { ...imageCardFallbackStyle, ...styleValue };
  }
  const iconCardFallbackStyle = getIconCardFallbackStyle();
  if (widget.type === "iconCard" && iconCardFallbackStyle) {
    styleValue = { ...iconCardFallbackStyle, ...styleValue };
  }
  const cultureLetterFallbackStyle = getCultureLetterFallbackStyle();
  if (widget.type === "cultureLetter" && cultureLetterFallbackStyle) {
    styleValue = { ...cultureLetterFallbackStyle, ...styleValue };
  }
  const titleBannerFallbackStyle = getTitleBannerFallbackStyle();
  if (widget.type === "titleBanner" && titleBannerFallbackStyle) {
    styleValue = { ...titleBannerFallbackStyle, ...styleValue };
  }
  const infoBannerFallbackStyle = getInfoBannerFallbackStyle();
  if (widget.type === "infoBanner" && infoBannerFallbackStyle) {
    styleValue = { ...infoBannerFallbackStyle, ...styleValue };
  }
  if (
    (widget.type === "process" || widget.type === "processCard") &&
    elementKey === "subTitle" &&
    styleValue?.fontSize === "18px" &&
    !styleValue?.fontSizeMobile &&
    styleValue?.fontWeight == null &&
    styleValue?.color == null
  ) {
    const restStyleValue = { ...styleValue };
    delete restStyleValue.fontSize;
    styleValue = restStyleValue;
  }
  const processFallbackStyle = getProcessFallbackStyle();
  if (
    (widget.type === "process" || widget.type === "processCard") &&
    processFallbackStyle
  ) {
    styleValue = { ...processFallbackStyle, ...styleValue };
  }
  const comparisonCardFallbackStyle = getComparisonCardFallbackStyle();
  if (widget.type === "comparisonCard" && comparisonCardFallbackStyle) {
    styleValue = { ...comparisonCardFallbackStyle, ...styleValue };
  }

  const isImageAreaMediaEditor =
    widget.type === "imageArea" &&
    (elementKey === "imageUrl" || elementKey === "mobileImageUrl");
  const cultureLetterBackgroundFields =
    widget.type === "cultureLetter"
      ? getCultureLetterBackgroundFields(
          String((widget.data as any).layout || "1"),
        )
      : null;
  const isCultureLetterBackgroundMediaEditor = Boolean(
    cultureLetterBackgroundFields &&
    [
      cultureLetterBackgroundFields.desktopKey,
      cultureLetterBackgroundFields.mobileKey,
    ].includes(elementKey),
  );

  const isMediaKey =
    elementKey.toLowerCase().includes("url") ||
    elementKey.toLowerCase().includes("image") ||
    elementKey.toLowerCase().includes("icon") ||
    elementKey.toLowerCase().includes("media") ||
    elementKey.toLowerCase().includes("thumb") || // Added for cultureLetter YouTube thumbs
    elementKey.toLowerCase().includes("svg") || // Added for cultureLetter layout 5 icons
    elementKey === "url" ||
    elementKey === "topImage" ||
    isImageAreaMediaEditor ||
    isCultureLetterBackgroundMediaEditor;

  const isItemBackgroundKey = elementKey === "itemStyle";
  const isTitleBannerLayout3ImageEditor =
    widget.type === "titleBanner" &&
    String((widget.data as any).layout || "1") === "3" &&
    ["layout3Image", "layout3MobileImage"].includes(elementKey);
  const isTextStructureLayout1ItemIconFrameEditor =
    widget.type === "textStructure" &&
    String((widget.data as any).layout || "1").replace(/^layout/, "") ===
      "1" &&
    elementKey === "itemIcon";

  // [Banner Section] Default Placeholder Logic
  if (widget.type === "bannerSection") {
    const defaults = BANNER_SECTION_DEFAULTS as any;
    if (defaults[styleKey]) {
      placeholder = defaults[styleKey].fontSize?.replace("px", "") || "";
      placeholderMobile =
        defaults[styleKey].fontSizeMobile?.replace("px", "") || "";
    }
  }

  // Ensure default objectFit is 'contain' for new media items
  if (isMediaKey) {
    if (styleValue.objectFit === undefined)
      styleValue = { ...styleValue, objectFit: "contain" };
    if (
      styleValue.width === undefined &&
      !isTextStructureLayout1ItemIconFrameEditor
    )
      styleValue = { ...styleValue, width: "100%" };
  }
  // Inject sensible defaults so inputs are never completely blank.
  const getFallbackStyles = () => {
    const keyLower = elementKey.toLowerCase();
    const isTitle =
      keyLower.includes("title") ||
      keyLower.includes("question") ||
      keyLower === "number";
    const isDesc =
      keyLower.includes("desc") ||
      keyLower.includes("answer") ||
      keyLower.includes("text");
    const isLabel =
      keyLower.includes("label") ||
      keyLower.includes("tag") ||
      keyLower.includes("badge");

    let fontSize = "";
    let fontWeight = "";
    let color = "";

    if (isTitle) {
      fontSize = "24px";
      fontWeight = "700";
      color = "#111111";
    } else if (isDesc) {
      fontSize = "20px";
      fontWeight = "400";
      color = "#666666";
    } else if (isLabel) {
      fontSize = "14px";
      fontWeight = "700";
      color = "#ffffff";
    }

    if (widget.type === "cultureLetter") {
      const k = elementKey.toLowerCase();
      if (k.endsWith("cultureletter")) {
        fontSize = "40px";
        fontWeight = "400";
        color = "#FFFFFF";
      } else if (k.endsWith("issueno") || k.endsWith("issuedate")) {
        fontSize = "24px";
        fontWeight = k.endsWith("issuedate") ? "700" : "400";
        color = "#FFFFFF";
      } else if (k.endsWith("title")) {
        fontSize = "48px";
        fontWeight = "700";
        color = "#FFFFFF";
      } else if (k.endsWith("desc")) {
        fontSize = "24px";
        fontWeight = "500";
        color = "#FFFFFF";
      }
    }

    if (widget.type === "process") {
      if (isTitle) color = "#000000";
      if (elementKey === "number") {
        fontSize = "20px";
        fontWeight = "700";
        color = "#285DE1";
      }
    }

    return { fontSize, fontWeight, color };
  };

  if (!isMediaKey && elementKey !== "bannerButton" && !isItemBackgroundKey) {
    const fb = getFallbackStyles();
    styleValue = {
      ...styleValue,
      fontSize: styleValue.fontSize ?? "",
      fontWeight: styleValue.fontWeight ?? fb.fontWeight ?? "400",
      color: styleValue.color ?? fb.color ?? "#000000",
    };
  }

  const getPlaceholderText = () => {
    if (isMediaKey) {
      if (widget.type === "process" || widget.type === "processCard")
        return "/images/placeholder/like_cat.jpg";
      // cultureLetter: 레이아웃별 이미지 키명 힌트
      if (widget.type === "cultureLetter") {
        const cultureLetterImageHints: Record<string, string> = {
          layout1BgImageUrl:
            "/images/placeholder/culture_letter_layout1_bg.jpg",
          layout1MobileBgImageUrl:
            "/images/placeholder/culture_letter_layout1_bg.jpg",
          layout1LogoImageUrl:
            "/images/placeholder/culture_letter_layout1_logo.png",
          cl2BgUrl: "/images/placeholder/culture_letter_layout2_bg.jpg",
          cl2MobileBgUrl: "/images/placeholder/culture_letter_layout2_bg.jpg",
          cl2LogoUrl: "/images/placeholder/culture_letter_layout2_logo.png",
          cl3BgUrl: "/images/placeholder/img1.png",
          cl3MobileBgUrl: "/images/placeholder/img1.png",
          cl3LogoUrl: "/images/placeholder/culture_letter_layout3_logo.png",
          cl3CardImgUrl: "/images/placeholder/culture_letter_layout3_card.jpg",
          cl4C1LogoUrl:
            "/images/placeholder/culture_letter_layout4_card1_logo.png",
          cl4C1ThumbUrl: "https://www.youtube.com/watch?v=bfeCmROrjXw",
          cl4C2LogoUrl:
            "/images/placeholder/culture_letter_layout4_card2_logo.png",
          cl4C2ThumbUrl: "https://www.youtube.com/watch?v=YAGU3YSwrTU&t=64s",
          cl4C3LogoUrl:
            "/images/placeholder/culture_letter_layout4_card3_logo.png",
          cl4C3ThumbUrl: "https://www.youtube.com/watch?v=DOPXQMX0rio&t=2s",
          cl5C1SvgUrl: "/images/placeholder/cl5_icon1.svg",
          cl5C1CardBgUrl:
            "/images/placeholder/culture_letter_layout5_card1_bg.jpg",
          cl5C2SvgUrl: "/images/placeholder/cl5_icon2.svg",
          cl5C2CardBgUrl:
            "/images/placeholder/culture_letter_layout5_card2_bg.jpg",
          cl5C3SvgUrl: "/images/placeholder/cl5_icon3.svg",
          cl5C3CardBgUrl:
            "/images/placeholder/culture_letter_layout5_card3_bg.jpg",
        };
        if (elementKey in cultureLetterImageHints)
          return cultureLetterImageHints[elementKey];
      }
      return "/images/placeholder/img1.png";
    }
    const keyLower = elementKey.toLowerCase();
    if (keyLower.includes("subtitle")) return "( 서브타이틀 )";
    if (keyLower.includes("title")) return "타이틀명 입력";
    if (keyLower.includes("desc") || keyLower.includes("content"))
      return "설명 내용을 입력하세요";
    if (keyLower.includes("itemText") || keyLower.includes("text"))
      return "항목 텍스트";
    return "텍스트를 입력하세요...";
  };

  const currentPlaceholder = getPlaceholderText();

  const displayValue = textValue ? textValue.replace(/<br\s*\/?>/gi, "\n") : "";
  const normalizeFontSizeStyleValue = (value: any) => {
    if (value === undefined || value === null || value === "") return "";
    const normalized = String(value).trim();
    if (!normalized) return "";
    return !isNaN(Number(normalized)) ? `${normalized}px` : normalized;
  };
  const getNextFontSizeValue = (value: string) => {
    if (value === "") return "";
    return !isNaN(Number(value)) && value.trim() !== "" ? `${value}px` : value;
  };
  const shouldSyncMobileFontSizeWithDesktop = () => {
    const currentDesktop = normalizeFontSizeStyleValue(styleValue.fontSize);
    const currentMobile = normalizeFontSizeStyleValue(styleValue.fontSizeMobile);
    const defaultMobile = normalizeFontSizeStyleValue(placeholderMobile);

    return (
      !currentMobile ||
      currentMobile === defaultMobile ||
      (currentDesktop !== "" && currentMobile === currentDesktop)
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-center gap-2 mb-2 border-b pb-2">
        <button
          onClick={() => {
            setSelectedElementKey(null);
          }}
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium mt-[0.5px] leading-none">
            이전
          </span>
        </button>
        <h3 className="font-bold text-gray-800">
          {isMediaKey
            ? "이미지/영상 편집"
            : isItemBackgroundKey
              ? "카드 배경 편집"
              : elementKey === "itemFeatures"
                ? "특징 항목 관리"
                : elementKey === "bannerButton"
                  ? "버튼 편집"
                  : "텍스트 편집"}
        </h3>
      </div>

      {/* Editor Body */}
      <div>
        {/* Banner Button Link Editor (Exclusive) */}
        {/* Button (Banner/Process Step) Editor */}
        {elementKey === "itemFeatures" && itemId ? (
          <div className="space-y-4 p-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                특징 매니저
              </label>
              <button
                onClick={() => {
                  let arrayName = "items";
                  const itemsList = data[arrayName] || [];
                  const targetItem =
                    itemsList.find((i: any) => i.id === itemId) || {};
                  const currentFeatures =
                    targetItem[imageCardFeatureStorageKey] ||
                    targetItem.features || [
                    {
                      label: targetItem.featureLabel || "특징 01",
                      value: "프로그램 특징 내용 입력",
                    },
                    {
                      label: targetItem.featureLabel || "특징 01",
                      value: "2줄 입력",
                    },
                  ];
                  const newFeatures = [
                    ...currentFeatures,
                    { label: "특징", value: "새로운 내용 입력" },
                  ];
                  const newItems = itemsList.map((it: any) =>
                    it.id === itemId
                      ? { ...it, [imageCardFeatureStorageKey]: newFeatures }
                      : it,
                  );
                  updateWidgetData(widget.id, { [arrayName]: newItems });
                }}
                className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                + 슬롯 추가
              </button>
            </div>

            <div className="space-y-3">
              {(() => {
                let arrayName = "items";
                const itemsList = data[arrayName] || [];
                const targetItem =
                  itemsList.find((i: any) => i.id === itemId) || {};
                const features =
                  targetItem[imageCardFeatureStorageKey] ||
                  targetItem.features || [
                  {
                    label: targetItem.featureLabel || "특징 01",
                    value: "프로그램 특징 내용 입력",
                  },
                  {
                    label: targetItem.featureLabel || "특징 01",
                    value: "2줄 입력",
                  },
                ];

                return features.map((feat: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm relative group animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-400">
                        항목 {idx + 1}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const newFeatures = [...features];
                              [newFeatures[idx - 1], newFeatures[idx]] = [
                                newFeatures[idx],
                                newFeatures[idx - 1],
                              ];
                              const newItems = itemsList.map((it: any) =>
                                it.id === itemId
                                  ? {
                                      ...it,
                                      [imageCardFeatureStorageKey]: newFeatures,
                                    }
                                  : it,
                              );
                              updateWidgetData(widget.id, {
                                [arrayName]: newItems,
                              });
                            }}
                            className="p-1 bg-gray-50 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                            title="위로 이동"
                          >
                            <ArrowUp size={14} />
                          </button>
                        )}
                        {idx < features.length - 1 && (
                          <button
                            onClick={() => {
                              const newFeatures = [...features];
                              [newFeatures[idx + 1], newFeatures[idx]] = [
                                newFeatures[idx],
                                newFeatures[idx + 1],
                              ];
                              const newItems = itemsList.map((it: any) =>
                                it.id === itemId
                                  ? {
                                      ...it,
                                      [imageCardFeatureStorageKey]: newFeatures,
                                    }
                                  : it,
                              );
                              updateWidgetData(widget.id, {
                                [arrayName]: newItems,
                              });
                            }}
                            className="p-1 bg-gray-50 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                            title="아래로 이동"
                          >
                            <ArrowDown size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const newFeatures = features.filter(
                              (_: any, i: number) => i !== idx,
                            );
                            const newItems = itemsList.map((it: any) =>
                              it.id === itemId
                                ? {
                                    ...it,
                                    [imageCardFeatureStorageKey]: newFeatures,
                                  }
                                : it,
                            );
                            updateWidgetData(widget.id, {
                              [arrayName]: newItems,
                            });
                          }}
                          className="p-1 bg-gray-50 rounded text-gray-500 hover:text-red-500 hover:bg-red-50"
                          title="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 w-8 shrink-0 text-center">
                        라벨
                      </span>
                      <input
                        type="text"
                        value={feat.label || ""}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[idx] = {
                            ...newFeatures[idx],
                            label: e.target.value,
                          };
                          const newItems = itemsList.map((it: any) =>
                            it.id === itemId
                              ? {
                                  ...it,
                                  [imageCardFeatureStorageKey]: newFeatures,
                                }
                              : it,
                          );
                          updateWidgetData(widget.id, {
                            [arrayName]: newItems,
                          });
                        }}
                        className="flex-1 min-w-0 w-full bg-gray-50 border border-gray-100 p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-700 placeholder-gray-300"
                        placeholder="라벨"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-gray-400 w-8 shrink-0 pt-2 text-center">
                        내용
                      </span>
                      <textarea
                        value={feat.value || ""}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[idx] = {
                            ...newFeatures[idx],
                            value: e.target.value,
                          };
                          const newItems = itemsList.map((it: any) =>
                            it.id === itemId
                              ? {
                                  ...it,
                                  [imageCardFeatureStorageKey]: newFeatures,
                                }
                              : it,
                          );
                          updateWidgetData(widget.id, {
                            [arrayName]: newItems,
                          });
                        }}
                        className="flex-1 min-w-0 w-full bg-gray-50 border border-gray-100 p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 resize-none min-h-[50px] text-gray-600 placeholder-gray-300 leading-relaxed"
                        placeholder="특징 내용을 입력하세요."
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ) : elementKey === "bannerButton" || elementKey === "stepLabel" ? (
          <div className="space-y-5 p-2">
            {/* 1. Text & Typography Settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                버튼 텍스트 & 스타일
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border-none p-2.5 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 font-medium placeholder-gray-400"
                value={
                  elementKey === "stepLabel"
                    ? textValue
                    : (widget.data as any).items?.find(
                        (i: any) => i.id === itemId,
                      )?.text ||
                      (widget.data as any).items?.[0]?.text ||
                      (widget.data as any).buttonText ||
                      "버튼 텍스트"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (elementKey === "stepLabel") {
                    onTextChange(val);
                  } else {
                    let items = (widget.data as any).items || [];
                    if (
                      items.length === 0 &&
                      (widget.data as any).variant === "banner2"
                    ) {
                      items = [
                        {
                          id: "b2-1",
                          link: "#",
                          icon: "download",
                          text: val,
                        },
                      ];
                    }
                    const newItems = itemId
                      ? items.map((it: any) =>
                          it.id === itemId ? { ...it, text: val } : it,
                        )
                      : items.map((it: any, idx: number) =>
                          idx === 0 ? { ...it, text: val } : it,
                        );

                    updateWidgetData(widget.id, {
                      items: newItems,
                      buttonText: val,
                    });
                  }
                }}
                placeholder="버튼 텍스트 입력"
              />
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs font-medium outline-none text-gray-700 text-center placeholder-gray-400"
                    placeholder="Size (px)"
                    value={
                      styleValue.fontSize?.toString().replace("px", "") || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      const finalVal =
                        val === "" ? "" : isNaN(Number(val)) ? val : val + "px";
                      onStyleChange("fontSize", finalVal);
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <select
                    className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs font-medium outline-none text-gray-700"
                    value={styleValue.fontWeight || "500"}
                    onChange={(e) =>
                      onStyleChange("fontWeight", e.target.value)
                    }
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">SemiBold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="w-[50px] space-y-1">
                  <input
                    type="color"
                    className="w-full h-[32px] rounded-lg cursor-pointer border-none bg-gray-50 p-1"
                    value={styleValue.color || "#060606"}
                    onChange={(e) => onStyleChange("color", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* 2. Button Background & Shape Settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    배경색
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-full h-10 rounded-lg cursor-pointer border border-gray-100 p-0.5 bg-white"
                      value={
                        styleValue.backgroundColor ||
                        (elementKey === "stepLabel" ? "#2563EB" : "#ffffff")
                      }
                      onChange={(e) =>
                        onStyleChange("backgroundColor", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    라운딩(px)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs font-medium outline-none text-gray-700 text-center"
                      placeholder="Pill"
                      value={
                        styleValue.borderRadius?.toString().replace("px", "") ||
                        ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const finalVal =
                          val === ""
                            ? ""
                            : isNaN(Number(val))
                              ? val
                              : val + "px";
                        onStyleChange("borderRadius", finalVal);
                      }}
                    />
                    <button
                      onClick={() => onStyleChange("borderRadius", "9999px")}
                      className="shrink-0 text-[10px] bg-gray-100 hover:bg-gray-200 px-2 h-8 rounded-lg font-bold"
                    >
                      Pill
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* 3. Link Settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                버튼 링크 설정
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-50 border-none p-2.5 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-blue-600 font-medium placeholder-gray-400"
                  value={linkValue || ""}
                  onChange={(e) => onLinkChange && onLinkChange(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                * 버튼 클릭 시 이동할 주소를 입력하세요.
              </p>
            </div>

            {/* 4. Icon Settings (Only for bannerButton) */}
            {elementKey === "bannerButton" && (
              <>
                <div className="h-px bg-gray-100"></div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    아이콘 설정
                  </label>
                  <div className="flex gap-2 w-full items-center">
                    <input
                      type="text"
                      className="flex-1 min-w-0 bg-gray-50 border-none p-2.5 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 font-medium placeholder-gray-400"
                      value={
                        (widget.data as any).items?.find(
                          (i: any) => i.id === itemId,
                        )?.icon ||
                        (widget.data as any).items?.[0]?.icon ||
                        "download"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        let items = (widget.data as any).items || [];
                        if (
                          items.length === 0 &&
                          (widget.data as any).variant === "banner2"
                        )
                          items = [{ id: "b2-1" }];
                        const newItems = itemId
                          ? items.map((it: any) =>
                              it.id === itemId ? { ...it, icon: val } : it,
                            )
                          : items.map((it: any, idx: number) =>
                              idx === 0 ? { ...it, icon: val } : it,
                            );
                        updateWidgetData(widget.id, { items: newItems });
                      }}
                      placeholder="download, home..."
                    />
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg shadow-sm text-gray-600 shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        {(widget.data as any).items?.find(
                          (i: any) => i.id === itemId,
                        )?.icon ||
                          (widget.data as any).items?.[0]?.icon ||
                          "download"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : isItemBackgroundKey ? (
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                배경 이미지
              </label>
              <ImgUploadPop
                onSelect={(url) => {
                  onStyleChange({
                    backgroundImage: url,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  });
                }}
                button={
                  <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                      <Upload size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-700 text-sm">
                        배경 이미지 선택
                      </p>
                      <p className="text-[10px] text-gray-400">
                        서버에 업로드된 이미지 선택
                      </p>
                    </div>
                  </div>
                }
              />
              <input
                type="text"
                className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                value={styleValue.backgroundImage || ""}
                onChange={(e) =>
                  onStyleChange("backgroundImage", e.target.value)
                }
                placeholder="배경 이미지 URL 입력"
              />
              <p className="text-[11px] text-gray-400">
                * 배경 이미지는 카드 영역에 Cover로 적용됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                배경색
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-12 h-10 rounded-lg cursor-pointer border border-gray-100 p-0.5 bg-white shrink-0"
                  value={styleValue.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    onStyleChange("backgroundColor", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="flex-1 bg-gray-50 border-none p-2.5 rounded-lg text-sm font-mono outline-none text-gray-700"
                  value={styleValue.backgroundColor || ""}
                  onChange={(e) =>
                    onStyleChange("backgroundColor", e.target.value)
                  }
                  placeholder="#ffffff"
                />
                <button
                  onClick={() => onStyleChange("backgroundColor", "")}
                  className="shrink-0 text-[10px] bg-gray-100 hover:bg-red-50 hover:text-red-500 px-2.5 py-2 rounded-lg font-bold transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onStyleChange("backgroundImage", "")}
                className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
              >
                이미지 제거
              </button>
            </div>
          </div>
        ) : isMediaKey ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {isTitleBannerLayout3ImageEditor ? (
                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <ImageIcon size={14} className="text-blue-500" /> PC
                      이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, { layout3Image: url })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              PC 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={(widget.data as any).layout3Image || ""}
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          layout3Image: e.target.value,
                        })
                      }
                      placeholder="PC 이미지 URL을 입력하세요"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <Smartphone size={14} className="text-blue-500" /> 모바일
                      이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, {
                          layout3MobileImage: url,
                        })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              모바일 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={(widget.data as any).layout3MobileImage || ""}
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          layout3MobileImage: e.target.value,
                        })
                      }
                      placeholder="모바일 이미지 URL을 입력하세요 (선택)"
                    />
                    <p className="text-[10px] text-gray-400 leading-tight">
                      * 태블릿/모바일 뷰에서는 모바일 이미지가 우선 노출되며,
                      없으면 PC 이미지가 공통으로 노출됩니다.
                    </p>
                  </div>
                </div>
              ) : isCultureLetterBackgroundMediaEditor &&
                cultureLetterBackgroundFields ? (
                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <ImageIcon size={14} className="text-blue-500" /> PC 배경
                      이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, {
                          [cultureLetterBackgroundFields.desktopKey]: url,
                        })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              PC 배경 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={
                        ((widget.data as any)[
                          cultureLetterBackgroundFields.desktopKey
                        ] as string) || ""
                      }
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          [cultureLetterBackgroundFields.desktopKey]:
                            e.target.value,
                        })
                      }
                      placeholder="PC 배경 이미지 URL을 입력하세요"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <Smartphone size={14} className="text-blue-500" />
                      모바일 배경 이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, {
                          [cultureLetterBackgroundFields.mobileKey]: url,
                        })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              모바일 배경 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={
                        ((widget.data as any)[
                          cultureLetterBackgroundFields.mobileKey
                        ] as string) || ""
                      }
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          [cultureLetterBackgroundFields.mobileKey]:
                            e.target.value,
                        })
                      }
                      placeholder="모바일 배경 이미지 URL을 입력하세요 (선택)"
                    />
                    <p className="text-[10px] text-gray-400 leading-tight">
                      * 태블릿/모바일 뷰에서는 모바일 배경 이미지가 우선
                      노출되며, 없으면 PC 배경 이미지가 공통으로 노출됩니다.
                    </p>
                  </div>
                </div>
              ) : isImageAreaMediaEditor ? (
                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <ImageIcon size={14} className="text-blue-500" /> PC
                      이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, { imageUrl: url })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              PC 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={(widget.data as any).imageUrl || ""}
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          imageUrl: e.target.value,
                        })
                      }
                      placeholder="PC 이미지 URL을 입력하세요"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide flex items-center gap-1">
                      <Smartphone size={14} className="text-blue-500" /> 모바일
                      이미지 설정
                    </label>
                    <ImgUploadPop
                      onSelect={(url) =>
                        updateWidgetData(widget.id, {
                          mobileImageUrl: url,
                        })
                      }
                      button={
                        <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <Upload size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700 text-sm">
                              모바일 이미지 선택
                            </p>
                            <p className="text-[10px] text-gray-400">
                              서버에 업로드된 이미지 선택
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={(widget.data as any).mobileImageUrl || ""}
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          mobileImageUrl: e.target.value,
                        })
                      }
                      placeholder="모바일 이미지 URL을 입력하세요 (선택)"
                    />
                    <p className="text-[10px] text-gray-400 leading-tight">
                      * 태블릿/모바일 뷰에서는 모바일 이미지가 우선 노출되며,
                      없으면 PC 이미지가 공통으로 노출됩니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                      좌우 여백
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                      value={
                        (() => {
                          const value = (widget.data as any).desktopHorizontalPadding;
                          if (
                            value === undefined ||
                            value === null ||
                            value === ""
                          ) {
                            return "";
                          }
                          return value.toString().replace("px", "");
                        })()
                      }
                      onChange={(e) =>
                        updateWidgetData(widget.id, {
                          desktopHorizontalPadding: e.target.value,
                        })
                      }
                      placeholder="PC 여백(px)"
                    />
                    <p className="text-[14px] text-gray-400 leading-tight">
                      * PC에만 입력값이 적용되며, 태블릿은 40px, 모바일은
                      20px로 고정 적용됩니다. 비우면 전체 0px입니다.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Culture Letter 전용 미디어 업데이터 (Atomic Data Update) */}
                  {widget.type === "cultureLetter" ? (
                    <>
                      <ImgUploadPop
                        onSelect={(url) =>
                          updateWidgetData(widget.id, { [elementKey]: url })
                        }
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 text-sm">
                                이미지 선택하기
                              </p>
                              <p className="text-[10px] text-gray-400">
                                서버에 업로드된 이미지 선택
                              </p>
                            </div>
                          </div>
                        }
                      />
                      <div className="flex items-center gap-2 py-2">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                          또는 URL 직접 입력
                        </span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                        value={(data as any)[elementKey] || ""}
                        onChange={(e) =>
                          updateWidgetData(widget.id, {
                            [elementKey]: e.target.value,
                          })
                        }
                        placeholder={currentPlaceholder}
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-xs font-bold text-gray-400 block uppercase tracking-wide">
                        콘텐츠 업로드 또는 주소
                      </label>

                      <ImgUploadPop
                        onSelect={(url) => onTextChange(url)}
                        button={
                          <div className="flex flex-row items-center justify-center gap-4 w-full bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-md transition-all">
                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 text-sm">
                                이미지 선택하기
                              </p>
                              <p className="text-[10px] text-gray-400">
                                서버에 업로드된 이미지 선택
                              </p>
                            </div>
                          </div>
                        }
                      />

                      <div className="flex items-center gap-2 py-2">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                          또는 URL 직접 입력
                        </span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>

                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all text-blue-600 font-medium placeholder-gray-400"
                        value={textValue || ""}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder={currentPlaceholder}
                      />
                    </>
                  )}
                </>
              )}

              {/* 비교 카드: 배경색 선택 UI */}
              {widget.type === "comparisonCard" &&
                elementKey === "imageUrl" && (
                  <>
                    <div className="flex items-center gap-2 py-1">
                      <div className="h-px bg-gray-100 flex-1"></div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase">
                        또는 배경색 선택
                      </span>
                      <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 block uppercase tracking-wide">
                        배경 색상
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="w-12 h-10 rounded-lg cursor-pointer border border-gray-100 p-0.5 bg-white shrink-0"
                          value={(() => {
                            const items = (widget.data as any).items || [];
                            const it = items.find((i: any) => i.id === itemId);
                            return it?.titleStyle?.backgroundColor || "#ffffff";
                          })()}
                          onChange={(e) => {
                            const color = e.target.value;
                            const items = (widget.data as any).items || [];
                            const newItems = items.map((it: any) =>
                              it.id !== itemId
                                ? it
                                : {
                                    ...it,
                                    titleStyle: {
                                      ...(it.titleStyle || {}),
                                      backgroundColor: color,
                                    },
                                  },
                            );
                            updateWidgetData(widget.id, { items: newItems });
                          }}
                        />
                        <input
                          type="text"
                          className="flex-1 bg-gray-50 border-none p-2.5 rounded-lg text-sm font-mono outline-none text-gray-700"
                          value={(() => {
                            const items = (widget.data as any).items || [];
                            const it = items.find((i: any) => i.id === itemId);
                            return it?.titleStyle?.backgroundColor || "";
                          })()}
                          onChange={(e) => {
                            const color = e.target.value;
                            const items = (widget.data as any).items || [];
                            const newItems = items.map((it: any) =>
                              it.id !== itemId
                                ? it
                                : {
                                    ...it,
                                    titleStyle: {
                                      ...(it.titleStyle || {}),
                                      backgroundColor: color,
                                    },
                                  },
                            );
                            updateWidgetData(widget.id, { items: newItems });
                          }}
                          placeholder="#ffffff"
                        />
                        <button
                          onClick={() => {
                            const items = (widget.data as any).items || [];
                            const newItems = items.map((it: any) => {
                              if (it.id !== itemId) return it;
                              const newStyle = { ...(it.titleStyle || {}) };
                              delete newStyle.backgroundColor;
                              return { ...it, titleStyle: newStyle };
                            });
                            updateWidgetData(widget.id, { items: newItems });
                          }}
                          className="shrink-0 text-[10px] bg-gray-100 hover:bg-red-50 hover:text-red-500 px-2.5 py-2 rounded-lg font-bold transition-colors"
                        >
                          초기화
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        * 이미지 URL이 있으면 이미지가 우선 적용됩니다. 색상만
                        사용하려면 이미지 URL을 비워주세요.
                      </p>
                    </div>
                  </>
                )}

              {isVideoUrl(textValue) && (
                <div className="flex gap-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* AutoPlay Toggle */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const newAutoPlay = !autoPlayValue;
                      const updates: any = { autoPlay: newAutoPlay };
                      if (newAutoPlay) updates.muted = true;

                      if (!itemId) {
                        // Root Atomic Update
                        updateWidgetData(widget.id, updates);
                      } else {
                        // Item Atomic Update
                        let arrayName = "items";
                        const d = widget.data as any;
                        if (widget.type === "process") arrayName = "steps";
                        else if (widget.type === "tabCarousel")
                          arrayName = "tabs";
                        else if (
                          widget.type === "textSplit" &&
                          d.variant === "image-left-list"
                        )
                          arrayName = "listItems";
                        else if (widget.type === "textSection") {
                          if (d.variant === "text2" || d.variant === "text3")
                            arrayName = "items";
                          else arrayName = "blocks";
                        }

                        const currentItems = d[arrayName] || [];
                        const updatedItems = currentItems.map((item: any) => {
                          if (item.id === itemId)
                            return { ...item, ...updates };
                          return item;
                        });
                        updateWidgetData(widget.id, {
                          [arrayName]: updatedItems,
                        });
                      }
                    }}
                    className="flex-1 flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-blue-700 transition-colors">
                      자동재생
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full relative transition-colors ${
                        autoPlayValue ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          autoPlayValue ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const isSoundOn = !mutedValue;
                      const newSoundOn = !isSoundOn;
                      const updates: any = { muted: !newSoundOn };
                      if (newSoundOn) updates.autoPlay = false;

                      if (!itemId) {
                        // Root Atomic Update
                        updateWidgetData(widget.id, updates);
                      } else {
                        // Item Atomic Update
                        let arrayName = "items";
                        const d = widget.data as any;
                        if (widget.type === "process") arrayName = "steps";
                        else if (widget.type === "tabCarousel")
                          arrayName = "tabs";
                        else if (
                          widget.type === "textSplit" &&
                          d.variant === "image-left-list"
                        )
                          arrayName = "listItems";
                        else if (widget.type === "textSection") {
                          if (d.variant === "text2" || d.variant === "text3")
                            arrayName = "items";
                          else arrayName = "blocks";
                        }

                        const currentItems = d[arrayName] || [];
                        const updatedItems = currentItems.map((item: any) => {
                          if (item.id === itemId)
                            return { ...item, ...updates };
                          return item;
                        });
                        updateWidgetData(widget.id, {
                          [arrayName]: updatedItems,
                        });
                      }
                    }}
                    className="flex-1 flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-blue-700 transition-colors">
                      소리 켬
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full relative transition-colors ${
                        !mutedValue ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          !mutedValue ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Widget Specific Options (Layout Swap, Height) */}
            {(widget.type === "comparisonCard" ||
              widget.type === "imageCard") &&
              elementKey === "style" &&
              !itemId && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block uppercase">
                      추가 옵션
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="card-reverse-layout"
                        checked={!!data.reverseLayout}
                        onChange={(e) =>
                          updateWidgetData(widget.id, {
                            reverseLayout: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label
                        htmlFor="card-reverse-layout"
                        className="text-xs text-gray-600 font-medium cursor-pointer"
                      >
                        좌우 레이아웃 위치 바꾸기 (스왑)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block uppercase">
                      대표 이미지 영역 높이
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 bg-white pr-8"
                        value={data.imageHeight || "320px"}
                        onChange={(e) =>
                          updateWidgetData(widget.id, {
                            imageHeight: e.target.value,
                          })
                        }
                        placeholder="예) 320px, 400px"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
                        px
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Image/Media Visibility Toggle */}
            <div className="pt-4 border-t border-gray-100 mb-4">
              <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-700">이미지 표시</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    화면에서 이 이미지를 노출할지 설정합니다.
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onStyleChange("isHidden", !styleValue.isHidden);
                  }}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                    !styleValue.isHidden ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      !styleValue.isHidden ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Image Size / Fill Controls - Hidden for Video and CardList Widget as requested */}
            {widget.type !== "video" && widget.type !== "cardList" && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 block uppercase">
                    이미지 표현 방식
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded p-1">
                    {[
                      { mode: "cover", label: "꽉 채우기", desc: "Cover" },
                      {
                        mode: "contain",
                        label: "다 보이기",
                        desc: "Contain",
                      },
                    ].map(({ mode, label, desc }) => (
                      <button
                        key={mode}
                        onClick={() => onStyleChange("objectFit", mode)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded transition-all ${
                          styleValue.objectFit === mode
                            ? "bg-white shadow-sm ring-1 ring-blue-500 text-blue-600"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                        }`}
                        title={desc}
                      >
                        <span className="text-[11px] font-bold">{label}</span>
                        <span className="text-[9px] opacity-70 scale-90">
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 block uppercase mb-3">
                    크기 설정
                    <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">
                      (
                      {styleValue.width === "100%"
                        ? "100%"
                        : styleValue.width || "Auto"}{" "}
                      x {styleValue.height || "Auto"})
                    </span>
                  </label>

                  {/* 100% 전체 너비 토글 */}
                  {!isTextStructureLayout1ItemIconFrameEditor && (
                    <div className="mb-3 flex items-center justify-between p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                      <span className="text-[10px] font-bold text-gray-600">
                        전체 너비 (100%)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const isCurrently100 = styleValue.width === "100%";
                          const newWidth = isCurrently100 ? "" : "100%";
                          const newHeight = "auto"; // 항상 auto로 리셋

                          const updates = {
                            width: newWidth,
                            height: newHeight,
                          };

                          if (itemId) {
                            let arrayName = "items";
                            if (widget.type === "process") arrayName = "steps";
                            else if (widget.type === "tabCarousel")
                              arrayName = "tabs";
                            else if (
                              widget.type === "textSplit" &&
                              data.variant === "image-left-list"
                            )
                              arrayName = "listItems";
                            else if (widget.type === "textSection") {
                              if (
                                data.variant === "text2" ||
                                data.variant === "text3"
                              )
                                arrayName = "items";
                              else arrayName = "blocks";
                            }

                            const currentItems = data[arrayName] || [];
                            const updatedItems = currentItems.map(
                              (item: any) => {
                                if (item.id === itemId) {
                                  const oldStyle = item[styleKey] || {};
                                  return {
                                    ...item,
                                    [styleKey]: { ...oldStyle, ...updates },
                                  };
                                }
                                return item;
                              },
                            );
                            updateWidgetData(widget.id, {
                              [arrayName]: updatedItems,
                            });
                          } else {
                            const oldStyle = data[styleKey] || {};
                            updateWidgetData(widget.id, {
                              [styleKey]: { ...oldStyle, ...updates },
                            });
                          }
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          styleValue.width === "100%"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            styleValue.width === "100%"
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  <div className="space-y-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-black tracking-wider">
                          <span className="text-gray-400">↔</span>
                          <span>가로 너비</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder=""
                            value={
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                                ? ""
                                : styleValue.width
                                    ?.toString()
                                    .replace("px", "")
                                    .replace("%", "")
                                    .replace("auto", "") || ""
                            }
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              if (val === "") onStyleChange("width", "");
                              else onStyleChange("width", val + "px");
                            }}
                            disabled={
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                            }
                            className={`w-full border border-gray-300 p-2.5 pr-8 rounded-lg text-xs font-bold focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white"
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
                            px
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-black tracking-wider">
                          <span className="text-gray-400">↕</span>
                          <span>세로 높이</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder=""
                            value={
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                                ? ""
                                : styleValue.height
                                    ?.toString()
                                    .replace("px", "")
                                    .replace("%", "")
                                    .replace("auto", "") || ""
                            }
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              if (val === "") onStyleChange("height", "auto");
                              else onStyleChange("height", val + "px");
                            }}
                            disabled={
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                            }
                            className={`w-full border border-gray-300 p-2.5 pr-8 rounded-lg text-xs font-bold focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
                              !isTextStructureLayout1ItemIconFrameEditor &&
                              styleValue.width === "100%"
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white"
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
                            px
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-tight font-medium">
                      *{" "}
                      {!isTextStructureLayout1ItemIconFrameEditor &&
                      styleValue.width === "100%"
                        ? "전체 너비로 설정되었습니다. 토글을 해제하면 픽셀 단위로 조정할 수 있습니다."
                        : isTextStructureLayout1ItemIconFrameEditor
                          ? "아이콘 박스 영역의 크기를 픽셀 단위로 직접 변경합니다."
                          : "이미지 영역(Container)의 크기를 픽셀 단위로 직접 변경합니다."}
                    </p>

                    {/* 설정 초기화 버튼 */}
                    <button
                      onClick={() => {
                        onStyleChange(
                          "width",
                          isTextStructureLayout1ItemIconFrameEditor
                            ? ""
                            : "100%",
                        );
                        onStyleChange(
                          "height",
                          isTextStructureLayout1ItemIconFrameEditor
                            ? ""
                            : "auto",
                        );
                        onStyleChange("objectFit", "contain");
                      }}
                      className="w-full mt-2 py-2 px-3 text-[10px] font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      설정 초기화
                    </button>
                  </div>

                  <div className="space-y-2 pt-3">
                    <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-tight">
                      모서리 곡률 (Border Radius)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          styleValue.borderRadius
                            ?.toString()
                            .replace("px", "") || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (val === "") onStyleChange("borderRadius", "");
                          else onStyleChange("borderRadius", val + "px");
                        }}
                        className="w-full border border-gray-100 bg-gray-50/30 p-2 pr-8 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-bold italic">
                        px
                      </span>
                    </div>
                  </div>

                  {isTextStructureLayout1ItemIconFrameEditor && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-tight">
                          아이콘 박스 배경 이미지
                        </label>
                        <ImgUploadPop
                          onSelect={(url) => {
                            onStyleChange("backgroundImage", url);
                            onStyleChange("backgroundSize", "cover");
                            onStyleChange("backgroundPosition", "center");
                            onStyleChange("backgroundRepeat", "no-repeat");
                          }}
                          button={
                            <div className="flex flex-row items-center justify-center gap-3 w-full bg-gray-50 border border-dashed border-gray-200 p-3 rounded-xl text-sm cursor-pointer hover:bg-white hover:border-blue-400 transition-all">
                              <div className="w-9 h-9 shrink-0 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                <Upload size={18} />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-700 text-xs">
                                  배경 이미지 선택
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  아이콘 박스에 적용됩니다
                                </p>
                              </div>
                            </div>
                          }
                        />
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2.5 rounded-lg text-xs font-medium outline-none text-blue-600"
                          value={styleValue.backgroundImage || ""}
                          onChange={(e) =>
                            onStyleChange("backgroundImage", e.target.value)
                          }
                          placeholder="배경 이미지 URL 입력"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-tight">
                          아이콘 박스 배경색
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            className="w-12 h-10 rounded-lg cursor-pointer border border-gray-100 p-0.5 bg-white shrink-0"
                            value={styleValue.backgroundColor || "#ffffff"}
                            onChange={(e) =>
                              onStyleChange("backgroundColor", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none p-2.5 rounded-lg text-xs font-mono outline-none text-gray-700"
                            value={styleValue.backgroundColor || ""}
                            onChange={(e) =>
                              onStyleChange("backgroundColor", e.target.value)
                            }
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onStyleChange("backgroundImage", "")}
                          className="flex-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
                        >
                          배경 이미지 제거
                        </button>
                        <button
                          onClick={() => onStyleChange("backgroundColor", "")}
                          className="flex-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
                        >
                          배경색 초기화
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Link URL Control */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-500 block uppercase">
                    클릭 시 이동할 링크
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                    value={linkValue || ""}
                    onChange={(e) =>
                      onLinkChange && onLinkChange(e.target.value)
                    }
                    placeholder="https://... (비워둘 경우 링크 없음)"
                  />
                  {!isMediaKey && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="link-target-blank"
                        checked={styleValue.target === "_blank"}
                        onChange={(e) =>
                          onStyleChange(
                            "target",
                            e.target.checked ? "_blank" : "_self",
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label
                        htmlFor="link-target-blank"
                        className="text-xs text-gray-600 cursor-pointer select-none font-medium"
                      >
                        새 창에서 열기
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <textarea
              className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-inner resize-none transition-all placeholder-gray-400"
              value={displayValue}
              onChange={(e) => {
                const val = e.target.value.replace(/\n/g, "<br/>");
                onTextChange(val);
              }}
              placeholder={currentPlaceholder}
            />
            <div className="mt-2 pl-2 space-y-1">
              <p className="text-xs text-blue-400/80 font-medium">
                💡 줄바꿈은 엔터(Enter)를 입력하세요.
              </p>
              <p className="text-[10px] text-gray-500">
                ✔️ 일부 디자인 레이아웃(특징 리스트 등)의 경우{" "}
                <strong>줄바꿈을 기준</strong>으로 개별 특징 항목이 분리되어
                렌더링 됩니다.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Typography Settings Panel */}
      {!isMediaKey && elementKey !== "bannerButton" && !isItemBackgroundKey && (
        <div className="space-y-6 pt-6 border-t border-gray-100/50">
          {/* Text Visibility Toggle */}
          <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100 mb-4">
            <div>
              <p className="text-xs font-bold text-gray-700">텍스트 표시</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                화면에서 이 텍스트를 숨길 수 있습니다.
              </p>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onStyleChange("isHidden", !styleValue.isHidden);
              }}
              className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                !styleValue.isHidden ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  !styleValue.isHidden ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Font Size & Weight */}
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-gray-400 block mb-1.5 font-bold uppercase tracking-wider">
                PC 크기
              </label>
              <input
                type="text"
                placeholder="Size"
                value={styleValue.fontSize?.toString().replace("px", "") || ""}
                onChange={(e) => {
                  const nextFontSize = getNextFontSizeValue(e.target.value);
                  if (shouldSyncMobileFontSizeWithDesktop()) {
                    onStyleChange({
                      fontSize: nextFontSize,
                      fontSizeMobile: nextFontSize,
                    });
                    return;
                  }
                  onStyleChange("fontSize", nextFontSize);
                }}
                className="w-full bg-gray-50 border-none p-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-100 outline-none text-center placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-gray-400 block mb-1.5 font-bold uppercase tracking-wider">
                Mobile 크기
              </label>
              <input
                type="text"
                placeholder="Size"
                value={
                  styleValue.fontSizeMobile?.toString().replace("px", "") || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") onStyleChange("fontSizeMobile", "");
                  else if (!isNaN(Number(val)) && val.trim() !== "")
                    onStyleChange("fontSizeMobile", val + "px");
                  else onStyleChange("fontSizeMobile", val);
                }}
                className="w-full bg-gray-50 border-none p-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-100 outline-none text-center placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-gray-400 block mb-1.5 font-bold uppercase tracking-wider">
              굵기
            </label>
            <select
              value={styleValue.fontWeight || "400"}
              onChange={(e) => onStyleChange("fontWeight", e.target.value)}
              className="w-full bg-gray-50 border-none p-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer"
            >
              <option value="100">100</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="700">700</option>
              <option value="900">900</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-2 font-bold uppercase tracking-wider">
              색상
            </label>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-50 hover:bg-gray-100 transition-colors">
              <div className="relative w-10 h-10 rounded-lg border-none shadow-sm overflow-hidden shrink-0 ring-1 ring-gray-100">
                <input
                  type="color"
                  value={styleValue.color || "#000000"}
                  onChange={(e) => onStyleChange("color", e.target.value)}
                  className="absolute inset-[0] w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                />
              </div>
              <input
                type="text"
                value={styleValue.color || "#000000"}
                onChange={(e) => onStyleChange("color", e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none p-1 text-xs font-bold uppercase font-mono focus:ring-0 text-gray-600"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Background & Border Color */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-2 font-bold uppercase tracking-wider">
                배경색
              </label>
              <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-xl border border-gray-50 hover:bg-gray-100 transition-colors">
                <div className="relative w-8 h-8 rounded-lg border-none shadow-sm overflow-hidden shrink-0 ring-1 ring-gray-100">
                  <input
                    type="color"
                    value={styleValue.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onStyleChange("backgroundColor", e.target.value)
                    }
                    className="absolute inset-[0] w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                  />
                </div>
                <input
                  type="text"
                  value={styleValue.backgroundColor || ""}
                  onChange={(e) =>
                    onStyleChange("backgroundColor", e.target.value)
                  }
                  className="flex-1 min-w-0 bg-transparent border-none p-0 text-[10px] font-bold uppercase font-mono focus:ring-0 text-gray-500"
                  placeholder="None"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-2 font-bold uppercase tracking-wider">
                테두리색
              </label>
              <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-xl border border-gray-50 hover:bg-gray-100 transition-colors">
                <div className="relative w-8 h-8 rounded-lg border-none shadow-sm overflow-hidden shrink-0 ring-1 ring-gray-100">
                  <input
                    type="color"
                    value={styleValue.borderColor || "#D9D9D9"}
                    onChange={(e) =>
                      onStyleChange("borderColor", e.target.value)
                    }
                    className="absolute inset-[0] w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                  />
                </div>
                <input
                  type="text"
                  value={styleValue.borderColor || ""}
                  onChange={(e) => onStyleChange("borderColor", e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-none p-0 text-[10px] font-bold uppercase font-mono focus:ring-0 text-gray-500"
                  placeholder="None"
                />
              </div>
            </div>
          </div>

          {/* Link & New Window Control for Typography */}
          {linkValue !== undefined && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                클릭 시 이동할 링크
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                value={linkValue || ""}
                onChange={(e) => onLinkChange && onLinkChange(e.target.value)}
                placeholder="https://... (비워둘 경우 링크 없음)"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="text-link-target"
                  checked={styleValue.target === "_blank"}
                  onChange={(e) =>
                    onStyleChange(
                      "target",
                      e.target.checked ? "_blank" : "_self",
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label
                  htmlFor="text-link-target"
                  className="text-xs text-gray-600 font-medium cursor-pointer"
                >
                  새 창에서 열기 (링크 있으면)
                </label>
              </div>
            </div>
          )}

          {/* Table Alignment Controls (New) */}
          {(elementKey === "tableHeader" || elementKey === "tableCell") && (
            <div className="pt-2">
              <label className="text-[10px] text-gray-400 block mb-2 font-bold uppercase tracking-wider">
                정렬
              </label>
              <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    onClick={() => onStyleChange("textAlign", align)}
                    className={`flex-1 py-1.5 rounded flex justify-center items-center ${
                      styleValue.textAlign === align
                        ? "bg-white shadow text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {align === "left" ? (
                      <AlignLeft size={16} />
                    ) : align === "center" ? (
                      <AlignCenter size={16} />
                    ) : (
                      <AlignRight size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Item Extras */}
      {elementKey === "item" && (
        <div className="space-y-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-xs font-bold text-gray-700 uppercase">
              활성화 상태
            </span>
            <button
              onClick={() => {
                const items = (data as any).items || [];
                const newItems = items.map((it: any) => ({
                  ...it,
                  isActive: it.id === itemId,
                }));
                updateWidgetData(widget.id, { items: newItems });
              }}
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                (data as any).items?.find((it: any) => it.id === itemId)
                  ?.isActive
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  (data as any).items?.find((it: any) => it.id === itemId)
                    ?.isActive
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase block">
              이동 링크
            </label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={
                (data as any).items?.find((it: any) => it.id === itemId)?.url ||
                ""
              }
              onChange={(e) => {
                const items = (data as any).items || [];
                const newItems = items.map((it: any) =>
                  it.id === itemId ? { ...it, url: e.target.value } : it,
                );
                updateWidgetData(widget.id, { items: newItems });
              }}
              placeholder="https://example.com"
            />
          </div>
        </div>
      )}

      {/* Element Management: Hide/Delete */}
      {!isMediaKey && !itemId && (elementKey as string) !== "mainTitle" && (
        <div className="pt-6 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <label className="text-xs text-gray-500 font-bold uppercase">
              요소 관리
            </label>
            <button
              onClick={() => {
                setConfirmPop(
                  true,
                  "이 요소를 숨기시겠습니까? <br/>(텍스트 내용을 비우면 보이지 않습니다)",
                  2,
                  () => {
                    onTextChange("");
                    setSelectedElementKey(null);
                  },
                );
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-100 bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-all"
            >
              <Trash2 size={14} /> 이 요소 숨기기
            </button>
            <p className="text-[10px] text-gray-400">
              데이터는 유지되나 화면에서 보이지 않게 됩니다. 다시 노출하려면
              내용을 입력하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementEditor;
