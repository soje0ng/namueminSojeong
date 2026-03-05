import React from "react";
import {
  Trash2,
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

import { Widget } from "@/types/console/template";
import { BANNER_SECTION_DEFAULTS } from "../widgets/BannerSectionRenderer";
import { updateItemInArray, findItem } from "@/utils/template/itemUtils";
import { isVideoUrl } from "../widgets/WidgetUtils";
import {
  TEXT_STRUCTURE_5_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_6_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_7_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_8_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_9_DEFAULT_SECTIONS,
  TEXT_STRUCTURE_11_DEFAULT_SECTIONS,
} from "../widgets/TextStructureRenderer";
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

  const cloneTextStructureDefaults = (value: any) =>
    JSON.parse(JSON.stringify(value));

  const textStructureFallbackText = (
    key: string,
    sectionType?: string,
  ): string => {
    const fallbackMap: Record<string, string> = {
      subTitle: "( 서브타이틀 )",
      title: "타이틀명 입력",
      desc: "이민 프로그램명 입력",
      l5SubTitle: "( 서브타이틀 )",
      l5Title: "타이틀명 입력",
      l5Desc: "이민 프로그램명 입력",
      l5SideTitle: "타이틀명 입력",
      l5SideDesc: "이민 프로그램명 입력",
      sectionSubTitle: "서브 타이틀 입력",
      sectionContent: "내용을 입력하세요.",
      sectionBasicText: "내용을 입력하세요.",
      bojoTitle: "보조 타이틀 문구 입력",
      sectionNewsletterSubTitle: "서브 타이틀 입력",
      sectionNewsletterLeft: "내용을 입력하세요.",
      sectionNewsletterRight: "내용을 입력하세요.",
      contentTitle: "USCIS 우선심사 프로젝트<br/>Copper Valley",
      contentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
      contentDesc:
        "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
      layout3ContentTitle: "USCIS 우선심사 프로젝트<br/>Copper Valley",
      layout3ContentSubTitle: "캘리포디나 대형 리조트 건설 프로젝트",
      layout3ContentDesc:
        "캘리포디나 대형 리조트 건설 프로젝트 서브 텍스트<br/>내용 적는 곳 에디터로 활용",
    };

    if (key === "bannerSubTitle") {
      return sectionType === "banner" ? "배너명 입력하는 부분" : "서브 타이틀 입력";
    }
    if (key === "bannerDesc") {
      return sectionType === "banner"
        ? "배너명에 대한 설명하는 부분의 텍스트 박스 부분"
        : "내용을 입력하세요.";
    }

    return fallbackMap[key] || "";
  };

  const textStructureSections = {
    sections5:
      data.sections5 || cloneTextStructureDefaults(TEXT_STRUCTURE_5_DEFAULT_SECTIONS),
    sections6:
      data.sections6 || cloneTextStructureDefaults(TEXT_STRUCTURE_6_DEFAULT_SECTIONS),
    sections7:
      data.sections7 || cloneTextStructureDefaults(TEXT_STRUCTURE_7_DEFAULT_SECTIONS),
    sections8:
      data.sections8 || cloneTextStructureDefaults(TEXT_STRUCTURE_8_DEFAULT_SECTIONS),
    sections9:
      data.sections9 || cloneTextStructureDefaults(TEXT_STRUCTURE_9_DEFAULT_SECTIONS),
    sections11:
      data.sections11 || cloneTextStructureDefaults(TEXT_STRUCTURE_11_DEFAULT_SECTIONS),
  };

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

      const currentItems = data[arrayName] || [];
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

  if (elementKey === "tableHeaderGubun") {
    textValue = data.comparisonGubun || "구분";
    styleKey = "headerStyle";
    styleValue = data.headerStyle || {};
    // Direct update for simple string property
    onTextChange = (val) =>
      updateWidgetData(widget.id, { comparisonGubun: val });
    onStyleChange = (k, v) =>
      updateWidgetData(widget.id, { [styleKey]: { ...styleValue, [k]: v } });
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
          headerStyle: { ...(data.headerStyle || {}), [k]: v },
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
          bodyStyle: { ...(data.bodyStyle || {}), [k]: v },
        });
      }
    };
  } else if (elementKey === "middleTitle") {
    textValue = data.middleTitle || "비교 head명";
    onTextChange = (val) => updateWidgetData(widget.id, { middleTitle: val });
    styleKey = "middleTitleStyle";
    styleValue = data.middleTitleStyle || {};
    onStyleChange = (k, v) =>
      updateWidgetData(widget.id, { [styleKey]: { ...styleValue, [k]: v } });
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
      updateWidgetData(widget.id, { [styleKey]: { ...styleValue, [k]: v } });
  } else if (
    widget.type === "textStructure" &&
    [
      "sectionSubTitle",
      "sectionContent",
      "bojoTitle",
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
    const sections5: any[] = textStructureSections.sections5;
    const sections6: any[] = textStructureSections.sections6;
    const sections7: any[] = textStructureSections.sections7;
    const sections8: any[] = textStructureSections.sections8;
    const sections9: any[] = textStructureSections.sections9;
    const sections11: any[] = textStructureSections.sections11;
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
      sectionSubTitle: "subTitle",
      sectionContent: "content",
      bojoTitle: "bojoTitle",
      sectionBasicText: "content",
      sectionNewsletterSubTitle: "newsletterSubTitle",
      sectionNewsletterLeft: "leftContent",
      sectionNewsletterRight: "rightContent",
      bannerSubTitle: "bannerSubTitle",
      bannerDesc: "bannerDesc",
    };
    const stylePropMap: Record<string, string> = {
      sectionSubTitle: "subTitleStyle",
      sectionContent: "contentStyle",
      bojoTitle: "bojoTitleStyle",
      sectionBasicText: "contentStyle",
      sectionNewsletterSubTitle: "newsletterSubTitleStyle",
      sectionNewsletterLeft: "leftContentStyle",
      sectionNewsletterRight: "rightContentStyle",
      bannerSubTitle: "bannerSubTitleStyle",
      bannerDesc: "bannerDescStyle",
    };

    const textProp = textPropMap[elementKey];
    const styleProp = stylePropMap[elementKey];
    textValue =
      section?.[textProp] ??
      (elementKey === "bannerSubTitle"
        ? section?.subTitle
        : elementKey === "bannerDesc"
          ? section?.desc
          : undefined) ??
      textStructureFallbackText(elementKey, section?.type);
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
          ? { ...s, [styleProp]: { ...(s[styleProp] || {}), [k]: v } }
          : s,
      );
      updateWidgetData(widget.id, { [sectionsKey]: updated });
    };
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
        if (
          [
            "itemNumber",
            "itemTitle",
            "itemDesc",
            "itemIcon",
            "itemLabel",
            "itemText",
            "s5labelItem",
            "s5checkItem",
          ].includes(elementKey)
        ) {
        const parseSectionIdxFromGeneratedKey = (value: string, type: string) => {
          const match = new RegExp(`^${type}-(\\d+)$`).exec(value || "");
          if (!match) return -1;
          const parsed = Number.parseInt(match[1], 10);
          return Number.isNaN(parsed) ? -1 : parsed;
        };
        const sectionBuckets: Array<{ key: string; list: any[] }> = [
          { key: "sections5", list: textStructureSections.sections5 },
          { key: "sections6", list: textStructureSections.sections6 },
          { key: "sections7", list: textStructureSections.sections7 },
          { key: "sections8", list: textStructureSections.sections8 },
          { key: "sections9", list: textStructureSections.sections9 },
          { key: "sections11", list: textStructureSections.sections11 },
        ];

        const colonIndex = itemId.indexOf(":");
        const hasCompositeRef = colonIndex > -1;
        const compositeSectionId = hasCompositeRef
          ? itemId.slice(0, colonIndex)
          : "";
        const compositeItemIdx = hasCompositeRef
          ? Number.parseInt(itemId.slice(colonIndex + 1), 10)
          : -1;
        const isCompositeItemRef =
          hasCompositeRef &&
          Number.isFinite(compositeItemIdx) &&
          !Number.isNaN(compositeItemIdx);
        const allowedSectionTypes =
          elementKey === "itemLabel" || elementKey === "itemText" || elementKey === "s5labelItem"
            ? ["labelList"]
            : elementKey === "s5checkItem"
              ? ["checklist"]
            : elementKey === "itemNumber" || elementKey === "itemTitle" || elementKey === "itemDesc"
              ? ["checklist", "features"]
              : elementKey === "itemIcon"
                ? ["checklist", "labelList", "features"]
                : undefined;

        for (const bucket of sectionBuckets) {
          for (let sectionIdx = 0; sectionIdx < bucket.list.length; sectionIdx++) {
            const section = bucket.list[sectionIdx];
            if (
              allowedSectionTypes &&
              !allowedSectionTypes.includes(section.type)
            ) {
              continue;
            }
            const items = section?.items || [];
            let foundIdx = -1;
            const fallbackSectionIndex =
              isCompositeItemRef && !section.id
                ? parseSectionIdxFromGeneratedKey(compositeSectionId, section.type)
                : -1;
            if (
              isCompositeItemRef &&
              (section.id === compositeSectionId &&
                compositeItemIdx >= 0 &&
                compositeItemIdx < items.length)
            ) {
              foundIdx = compositeItemIdx;
            } else if (
              isCompositeItemRef &&
              !section.id &&
              fallbackSectionIndex >= 0 &&
              fallbackSectionIndex === sectionIdx &&
              compositeItemIdx >= 0 &&
              compositeItemIdx < items.length
            ) {
              foundIdx = compositeItemIdx;
            } else if (
              isCompositeItemRef &&
              !compositeSectionId &&
              (elementKey === "itemLabel" ||
                elementKey === "itemText" ||
                elementKey === "s5labelItem") &&
              compositeItemIdx >= 0 &&
              compositeItemIdx < items.length
            ) {
              foundIdx = compositeItemIdx;
            } else if (
              isCompositeItemRef &&
              !compositeSectionId &&
              (elementKey === "itemIcon" ||
                elementKey === "itemTitle" ||
                elementKey === "itemDesc" ||
                elementKey === "itemNumber") &&
              compositeItemIdx >= 0 &&
              compositeItemIdx < items.length
            ) {
              foundIdx = compositeItemIdx;
            } else {
              foundIdx = items.findIndex((it: any) => it.id === itemId);
            }
            if (foundIdx < 0) continue;
            const found = items[foundIdx];

            const iconProp =
              found.iconUrl !== undefined
                ? "iconUrl"
                : found.icon !== undefined
                  ? "icon"
                  : "iconUrl";
            const targetPropMap: Record<string, string> = {
              itemNumber: "number",
              itemTitle: "title",
              itemDesc: "desc",
              itemIcon: iconProp,
              itemLabel: "label",
              itemText: "content",
              s5labelItem: "label",
              s5checkItem: "title",
            };
            const stylePropMap: Record<string, string> = {
              itemNumber: "numberStyle",
              itemTitle: "titleStyle",
              itemDesc: "descStyle",
              itemIcon: "iconStyle",
              itemLabel: "labelStyle",
              itemText: "contentStyle",
              s5labelItem: "labelStyle",
              s5checkItem: "titleStyle",
            };
            const targetProp = targetPropMap[elementKey];
            const itemStyleKey = stylePropMap[elementKey];

            textValue = found[targetProp] || "";
            styleKey = itemStyleKey;
            styleValue = found[itemStyleKey] || {};

            onTextChange = (val) => {
              const updatedSections = bucket.list.map((s: any) => {
                if (s !== section) return s;
                const updatedItems = [...(s.items || [])];
                if (updatedItems[foundIdx]) {
                  updatedItems[foundIdx] = {
                    ...updatedItems[foundIdx],
                    [targetProp]: val,
                  };
                }
                return { ...s, items: updatedItems };
              });
              updateWidgetData(widget.id, { [bucket.key]: updatedSections });
            };
            onStyleChange = (k, v) => {
              const updatedSections = bucket.list.map((s: any) => {
                if (s !== section) return s;
                const updatedItems = [...(s.items || [])];
                if (updatedItems[foundIdx]) {
                  const targetItem = updatedItems[foundIdx];
                  updatedItems[foundIdx] = {
                    ...targetItem,
                    [itemStyleKey]: {
                      ...(targetItem[itemStyleKey] || {}),
                      [k]: v,
                    },
                  };
                }
                return { ...s, items: updatedItems };
              });
              updateWidgetData(widget.id, { [bucket.key]: updatedSections });
            };
            return;
          }
        }
      }

      if (elementKey === "image" && /^s(5|6|7|8|9|11)img_/.test(itemId)) {
        // Generic section-image editor mapping:
        // s{layout}img_{sectionId}_{imgIdx}
        const [layoutToken, sectionId, imgIdxToken] = itemId.split("_");
        const imgIdx = parseInt(imgIdxToken || "0", 10);
        const parseSectionIdxFromGeneratedKey = (value: string, type: string) => {
          const match = new RegExp(`^${type}-(\\d+)$`).exec(value || "");
          if (!match) return -1;
          const parsed = Number.parseInt(match[1], 10);
          return Number.isNaN(parsed) ? -1 : parsed;
        };
        const sectionsMap: Record<string, { key: string; list: any[] }> = {
          s5img: {
            key: "sections5",
            list: textStructureSections.sections5,
          },
          s6img: {
            key: "sections6",
            list: textStructureSections.sections6,
          },
          s7img: {
            key: "sections7",
            list: textStructureSections.sections7,
          },
          s8img: {
            key: "sections8",
            list: textStructureSections.sections8,
          },
          s9img: {
            key: "sections9",
            list: textStructureSections.sections9,
          },
          s11img: {
            key: "sections11",
            list: textStructureSections.sections11,
          },
        };

        const target = sectionsMap[layoutToken];
        if (target) {
          let section = target.list.find((s: any) => s.id === sectionId);
          let sectionIndex = target.list.findIndex((s: any) => s.id === sectionId);
          if (!section && sectionIndex < 0) {
            const generatedSectionIdx =
              sectionId && parseSectionIdxFromGeneratedKey(sectionId, "image");
            if (generatedSectionIdx >= 0) {
              const generatedSection = target.list[generatedSectionIdx];
              if (generatedSection?.type === "image") {
                section = generatedSection;
                sectionIndex = generatedSectionIdx;
              }
            }
          }
          if (!section && sectionIndex < 0) {
            sectionIndex = target.list.findIndex((s: any) => s.type === "image");
            section = sectionIndex >= 0 ? target.list[sectionIndex] : undefined;
          }
          if (section && sectionIndex >= 0) {
            const images: string[] = section.images || [];
            const fallbackUrl =
              section.imageUrl || "/images/placeholder/card-sm.jpg";
            textValue = images[imgIdx] || fallbackUrl;
            styleKey = "imageStyle";
            styleValue = section.imageStyle || {};

            onTextChange = (val) => {
              const sourceImages: string[] =
                section.images && section.images.length > 0
                  ? [...section.images]
                  : [section.imageUrl || fallbackUrl];
              while (sourceImages.length <= imgIdx) sourceImages.push("");
              sourceImages[imgIdx] = val;

              const updatedSections = target.list.map((s: any, idx: number) =>
                idx === sectionIndex ? { ...s, images: sourceImages } : s,
              );
              updateWidgetData(widget.id, { [target.key]: updatedSections });
            };

            onStyleChange = (k, v) => {
              const updatedSections = target.list.map((s: any, idx: number) =>
                idx === sectionIndex
                  ? {
                      ...s,
                      imageStyle: { ...(s.imageStyle || {}), [k]: v },
                    }
                  : s,
                  );
              updateWidgetData(widget.id, { [target.key]: updatedSections });
            };
            autoPlayValue = section.autoPlay || false;
            mutedValue = section.muted !== undefined ? section.muted : true;
            loopValue = section.loop || false;
            onAutoPlayChange = (val) => {
              const updatedSections = target.list.map((s: any, idx: number) =>
                idx === sectionIndex
                  ? { ...s, autoPlay: val, muted: val ? true : s.muted }
                  : s,
              );
              updateWidgetData(widget.id, { [target.key]: updatedSections });
            };
            onMutedChange = (val) => {
              const updatedSections = target.list.map((s: any, idx: number) =>
                idx === sectionIndex ? { ...s, muted: val } : s,
              );
              updateWidgetData(widget.id, { [target.key]: updatedSections });
            };
            onLoopChange = (val) => {
              const updatedSections = target.list.map((s: any, idx: number) =>
                idx === sectionIndex ? { ...s, loop: val } : s,
              );
              updateWidgetData(widget.id, { [target.key]: updatedSections });
            };
          }
        }
      }

      if (elementKey === "image" && /^s5labelimg_/.test(itemId)) {
        const [, sectionId] = itemId.split("_");
        const sections = textStructureSections.sections5;
        let section = sections.find((s: any) => s.id === sectionId);
        let sectionIndex = sections.findIndex((s: any) => s.id === sectionId);
        const parseSectionIdxFromGeneratedKey = (value: string, type: string) => {
          const match = new RegExp(`^${type}-(\\d+)$`).exec(value || "");
          if (!match) return -1;
          const parsed = Number.parseInt(match[1], 10);
          return Number.isNaN(parsed) ? -1 : parsed;
        };
        if (!section && sectionIndex < 0) {
          const generatedSectionIdx =
            sectionId && parseSectionIdxFromGeneratedKey(sectionId, "labelList");
          if (generatedSectionIdx >= 0) {
            const generatedSection = sections[generatedSectionIdx];
            if (generatedSection?.type === "labelList") {
              section = generatedSection;
              sectionIndex = generatedSectionIdx;
            }
          }
        }
        if (!section && sectionIndex < 0) {
          sectionIndex = sections.findIndex((s: any) => s.type === "labelList");
          section = sectionIndex >= 0 ? sections[sectionIndex] : undefined;
        }
        if (section) {
          textValue =
            section.imageUrl || "/images/placeholder/card-sm.jpg";
          styleKey = "imageStyle";
          styleValue = section.imageStyle || {};
          onTextChange = (val) => {
            const updated = sections.map((s: any, idx: number) =>
              idx === sectionIndex ? { ...s, imageUrl: val } : s,
            );
            updateWidgetData(widget.id, { sections5: updated });
          };
          onStyleChange = (k, v) => {
            const updated = sections.map((s: any, idx: number) =>
              idx === sectionIndex
                ? { ...s, imageStyle: { ...(s.imageStyle || {}), [k]: v } }
                : s,
            );
            updateWidgetData(widget.id, { sections5: updated });
          };
          autoPlayValue = section.autoPlay || false;
          mutedValue = section.muted !== undefined ? section.muted : true;
          loopValue = section.loop || false;
          onAutoPlayChange = (val) => {
            const updated = sections.map((s: any, idx: number) =>
              idx === sectionIndex
                ? { ...s, autoPlay: val, muted: val ? true : s.muted }
                : s,
            );
            updateWidgetData(widget.id, { sections5: updated });
          };
          onMutedChange = (val) => {
            const updated = sections.map((s: any, idx: number) =>
              idx === sectionIndex ? { ...s, muted: val } : s,
            );
            updateWidgetData(widget.id, { sections5: updated });
          };
          onLoopChange = (val) => {
            const updated = sections.map((s: any, idx: number) =>
              idx === sectionIndex ? { ...s, loop: val } : s,
            );
            updateWidgetData(widget.id, { sections5: updated });
          };
        }
      }

      if (elementKey === "image" && /^s(5|6|7)banner_/.test(itemId)) {
        const [layoutToken, sectionId] = itemId.split("_");
        const map: Record<string, { key: string; list: any[] }> = {
          s5banner: {
            key: "sections5",
            list: textStructureSections.sections5,
          },
          s6banner: {
            key: "sections6",
            list: textStructureSections.sections6,
          },
          s7banner: {
            key: "sections7",
            list: textStructureSections.sections7,
          },
        };
        const target = map[layoutToken];
        if (target) {
          const parseSectionIdxFromGeneratedKey = (
            value: string,
            type: string,
          ) => {
            const match = new RegExp(`^${type}-(\\d+)$`).exec(value || "");
            if (!match) return -1;
            const parsed = Number.parseInt(match[1], 10);
            return Number.isNaN(parsed) ? -1 : parsed;
          };

          let section = target.list.find((s: any) => s.id === sectionId);
          let sectionIndex = target.list.findIndex((s: any) => s.id === sectionId);

          if (!section && sectionIndex < 0) {
            const generatedSectionIdx =
              sectionId && parseSectionIdxFromGeneratedKey(sectionId, "banner");
            if (generatedSectionIdx >= 0) {
              const generatedSection = target.list[generatedSectionIdx];
              if (generatedSection?.type === "stripBanner") {
                section = generatedSection;
                sectionIndex = generatedSectionIdx;
              }
            }
          }
          if (!section && sectionIndex < 0) {
            sectionIndex = target.list.findIndex((s: any) => s.type === "stripBanner");
            section = sectionIndex >= 0 ? target.list[sectionIndex] : undefined;
          }

          if (section) {
            const bannerFallbackMap: Record<string, string> = {
              s5banner: "/images/placeholder/card-sm.jpg",
              s6banner: "/images/placeholder/card-sm.jpg",
              s7banner: "/images/placeholder/card-sm.jpg",
            };
            textValue = section.imageUrl || bannerFallbackMap[layoutToken] || "";
            styleKey = "imageStyle";
            styleValue = section.imageStyle || {};
            onTextChange = (val) => {
              const updated = target.list.map((s: any, idx: number) =>
                idx === sectionIndex ? { ...s, imageUrl: val } : s,
              );
              updateWidgetData(widget.id, { [target.key]: updated });
            };
            onStyleChange = (k, v) => {
              const updated = target.list.map((s: any, idx: number) =>
                idx === sectionIndex
                  ? { ...s, imageStyle: { ...(s.imageStyle || {}), [k]: v } }
                  : s,
              );
              updateWidgetData(widget.id, { [target.key]: updated });
            };
            return;
          }
        }
      }

      const layoutVal = data.layout || "1";
      if (layoutVal === "4") arrayName = "cases";
      else if (layoutVal === "6" || layoutVal === "layout6")
        arrayName = "sections6";
      else if (layoutVal === "7" || layoutVal === "layout7")
        arrayName = "sections7";
      else if (layoutVal === "8" || layoutVal === "layout8")
        arrayName = "sections8";
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
          const sections = textStructureSections.sections11;
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
              // No need for further item processing
              return;
            }
          } else if (elementKey === "image" && itemId?.startsWith("s11img_")) {
            // [Multi-Image Grid Support for Layout 11]
            // itemId: s11img_{sectionId}_{imgIdx}
            const [, sectionId, imgIdxStr] = itemId.split("_");
            const imgIdx = parseInt(imgIdxStr);
            const sections = textStructureSections.sections11;
            const section = sections.find((s: any) => s.id === sectionId);
            if (section) {
              const images = section.images || [
                section.imageUrl || "/images/placeholder/card-sm.jpg",
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
              return;
            }
          } else {
            // For nested items in sections
            for (const section of sections) {
              if (section.items) {
                const item = section.items.find((it: any) => it.id === itemId);
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
                        const updatedItems = s.items.map((it: any) =>
                          it.id === itemId ? { ...it, [targetProp]: val } : it,
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
                        const updatedItems = s.items.map((it: any) =>
                          it.id === itemId
                            ? {
                                ...it,
                                [styleProp]: {
                                  ...(it[styleProp] || {}),
                                  [k]: v,
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
                  return;
                }
              }
            }
          }
        }
        arrayName = "sections11";
      }
    }

    let item = findItem(data[arrayName] || [], itemId);
    if (item) {
      linkValue = item.link || "";
      onLinkChange = (val) =>
        updateWidgetData(widget.id, {
          [arrayName]: updateItemInArray(data[arrayName], itemId, "link", val),
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

      if (
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
          if (elementKey === "itemTitle" || targetProp === "title")
            return "타이틀명 입력";
          if (elementKey === "itemText" || targetProp === "text")
            return "항목 텍스트";
          return "";
        };
        textValue =
          item[targetProp] !== undefined
            ? item[targetProp]
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
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              targetProp,
              val,
            ),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(data[arrayName], itemId, styleKey, {
              ...styleValue,
              [k]: v,
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
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              badgeProp,
              val,
            ),
          });
        onStyleChange = (k, v) => {
          const currentItem = findItem(data[arrayName] || [], itemId!);
          const currentStyle = currentItem?.[styleKey] || {};
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(data[arrayName], itemId, styleKey, {
              ...currentStyle,
              [k]: v,
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
        textValue = item[targetProp] || "";
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
            [arrayName]: updateItemInArray(
              data[arrayName],
              itemId,
              targetProp,
              val,
            ),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(data[arrayName], itemId, styleKey, {
              ...styleValue,
              [k]: v,
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

        textValue =
          item[propName] || item.icon || item.image || item.iconUrl || "";
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
              data[arrayName],
              itemId,
              propName,
              val,
            ),
          });
        onStyleChange = (k, v) =>
          updateWidgetData(widget.id, {
            [arrayName]: updateItemInArray(data[arrayName], itemId, styleKey, {
              ...styleValue,
              [k]: v,
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
              ...styleValue,
              [k]: v,
            }),
          });
      }

      // Allow styleOnly updates if not caught above but styleKey is defined
      if (!onStyleChange && styleKey)
        onStyleChange = (k, v) => updateStyle(styleKey, k, v);
    }
  } else {
    const getRootDefaultText = () => {
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
    textValue =
      widget.type === "textStructure"
        ? (data[elementKey] ??
          textStructureFallbackText(elementKey))
        : data[elementKey] !== undefined
          ? data[elementKey]
          : getRootDefaultText();
    if (
      widget.type === "textStructure" &&
      elementKey === "imageUrl" &&
      !textValue
    ) {
      const layoutVal = (data.layout || "1").toString();
      if (layoutVal === "5" || layoutVal === "9") {
        textValue = "/images/placeholder/card-sm.jpg";
      }
    }
    // Convention: property 'mainTitle' -> style 'mainTitleStyle'
    styleKey =
      elementKey === "contentTitle"
        ? "contentTitleStyle"
        : elementKey === "contentDesc"
          ? "contentDescStyle"
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
    linkValue = data.link || "";
    onLinkChange = (val) => updateWidgetData(widget.id, { link: val });

    autoPlayValue = data.autoPlay || false;
    mutedValue = data.muted !== undefined ? data.muted : true;
    loopValue = data.loop || false;
    onAutoPlayChange = (val) => updateWidgetData(widget.id, { autoPlay: val });
    onMutedChange = (val) => updateWidgetData(widget.id, { muted: val });
    onLoopChange = (val) => updateWidgetData(widget.id, { loop: val });
  }

  const isMediaKey =
    elementKey.toLowerCase().includes("url") ||
    elementKey.toLowerCase().includes("image") ||
    elementKey.toLowerCase().includes("icon") ||
    elementKey.toLowerCase().includes("media") ||
    elementKey === "url" ||
    elementKey === "topImage";

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
    if (styleValue.width === undefined)
      styleValue = { ...styleValue, width: "100%" };
  }
  // Keep style inputs source-of-truth only from actual widget data.
  // Do not inject fallback font sizes/weights/colors, so cleared values stay cleared.

  const getPlaceholderText = () => {
    if (isMediaKey) {
      if (widget.type === "process" || widget.type === "processCard")
        return "/images/placeholder/step_consult.jpg";
      return "/images/placeholder/card_img_default.jpg";
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
  const resolvedStyleValue = styleValue;

  const displayValue = textValue ? textValue.replace(/<br\s*\/?>/gi, "\n") : "";
  const currentLayoutVal = (data.layout || "1").toString();
  const isLayout11FeaturePanel =
    widget.type === "textStructure" &&
    (currentLayoutVal === "11" || currentLayoutVal === "layout11") &&
    !!itemId &&
    ["itemNumber", "itemTitle", "itemDesc", "itemIcon"].includes(elementKey);
  const layout11FeatureContext = (() => {
    if (!isLayout11FeaturePanel || !itemId) return null;
    const sections = textStructureSections.sections11 || [];
    let sectionIndex = -1;
    let itemIndex = -1;
    const colonIndex = itemId.indexOf(":");
    if (colonIndex > 0) {
      const sectionId = itemId.slice(0, colonIndex);
      const parsedIdx = Number.parseInt(itemId.slice(colonIndex + 1), 10);
      const foundSectionIdx = sections.findIndex((s: any) => s.id === sectionId);
      if (
        foundSectionIdx >= 0 &&
        !Number.isNaN(parsedIdx) &&
        parsedIdx >= 0 &&
        parsedIdx < (sections[foundSectionIdx]?.items || []).length
      ) {
        sectionIndex = foundSectionIdx;
        itemIndex = parsedIdx;
      }
    }
    for (let sIdx = 0; sIdx < sections.length; sIdx += 1) {
      if (sectionIndex >= 0 && itemIndex >= 0) break;
      const items = sections[sIdx]?.items || [];
      const found = items.findIndex((it: any) => it.id === itemId);
      if (found >= 0) {
        sectionIndex = sIdx;
        itemIndex = found;
        break;
      }
    }
    if (sectionIndex < 0 || itemIndex < 0) return null;
    const section = sections[sectionIndex];
    const item = (section.items || [])[itemIndex] || {};
    return { sections, sectionIndex, itemIndex, item };
  })();
  const updateLayout11FeatureItem = (patch: Record<string, any>) => {
    if (!layout11FeatureContext) return;
    const updatedSections = layout11FeatureContext.sections.map(
      (section: any, sIdx: number) => {
        if (sIdx !== layout11FeatureContext.sectionIndex) return section;
        const updatedItems = (section.items || []).map(
          (it: any, i: number) =>
            i === layout11FeatureContext.itemIndex ? { ...it, ...patch } : it,
        );
        return { ...section, items: updatedItems };
      },
    );
    updateWidgetData(widget.id, { sections11: updatedSections });
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
          {isLayout11FeaturePanel
            ? "프로그램 특징 편집"
            : isMediaKey
            ? "이미지/영상 편집"
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
        {isLayout11FeaturePanel && layout11FeatureContext ? (
          <div className="space-y-4 p-2">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-semibold">
                아이콘 이미지 URL
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                value={
                  layout11FeatureContext.item.icon ||
                  layout11FeatureContext.item.iconUrl ||
                  ""
                }
                onChange={(e) =>
                  updateLayout11FeatureItem({
                    icon: e.target.value,
                    iconUrl: e.target.value,
                  })
                }
                placeholder="/images/placeholder/icon_program.png"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-semibold">
                숫자
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                value={layout11FeatureContext.item.number || ""}
                onChange={(e) =>
                  updateLayout11FeatureItem({ number: e.target.value })
                }
                placeholder="01."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-semibold">
                프로그램 특징명
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                value={layout11FeatureContext.item.title || ""}
                onChange={(e) =>
                  updateLayout11FeatureItem({ title: e.target.value })
                }
                placeholder="프로그램 특징"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-semibold">
                프로그램 설명
              </label>
              <textarea
                className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none min-h-[72px]"
                value={layout11FeatureContext.item.desc || ""}
                onChange={(e) =>
                  updateLayout11FeatureItem({ desc: e.target.value })
                }
                placeholder="프로그램 설명을 입력하세요."
              />
            </div>
          </div>
        ) : elementKey === "itemFeatures" && itemId ? (
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
                  const currentFeatures = targetItem.features || [
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
                    it.id === itemId ? { ...it, features: newFeatures } : it,
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
                const features = targetItem.features || [
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
                                  ? { ...it, features: newFeatures }
                                  : it,
                              );
                              updateWidgetData(widget.id, {
                                [arrayName]: newItems,
                              });
                            }}
                            className="p-1 bg-gray-50 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                            title="위로 이동"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_upward
                            </span>
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
                                  ? { ...it, features: newFeatures }
                                  : it,
                              );
                              updateWidgetData(widget.id, {
                                [arrayName]: newItems,
                              });
                            }}
                            className="p-1 bg-gray-50 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                            title="아래로 이동"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_downward
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const newFeatures = features.filter(
                              (_: any, i: number) => i !== idx,
                            );
                            const newItems = itemsList.map((it: any) =>
                              it.id === itemId
                                ? { ...it, features: newFeatures }
                                : it,
                            );
                            updateWidgetData(widget.id, {
                              [arrayName]: newItems,
                            });
                          }}
                          className="p-1 bg-gray-50 rounded text-gray-500 hover:text-red-500 hover:bg-red-50"
                          title="삭제"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            delete
                          </span>
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
                              ? { ...it, features: newFeatures }
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
                              ? { ...it, features: newFeatures }
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
                    value={styleValue.fontWeight ?? ""}
                    onChange={(e) =>
                      onStyleChange("fontWeight", e.target.value)
                    }
                  >
                    <option value="">굵기 선택</option>
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
                    value={
                      /^#([0-9a-fA-F]{6})$/.test(styleValue.color || "")
                        ? styleValue.color
                        : "#ffffff"
                    }
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
        ) : isMediaKey ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 block uppercase tracking-wide">
                콘텐츠 업로드 또는 주소
              </label>

              {/* Image Upload Popup */}
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
                          const updatedItems = currentItems.map((item: any) => {
                            if (item.id === itemId) {
                              const oldStyle = item[styleKey] || {};
                              return {
                                ...item,
                                [styleKey]: { ...oldStyle, ...updates },
                              };
                            }
                            return item;
                          });
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
                            disabled={styleValue.width === "100%"}
                            className={`w-full border border-gray-300 p-2.5 pr-8 rounded-lg text-xs font-bold focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
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
                            disabled={styleValue.width === "100%"}
                            className={`w-full border border-gray-300 p-2.5 pr-8 rounded-lg text-xs font-bold focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
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
                      {styleValue.width === "100%"
                        ? "전체 너비로 설정되었습니다. 토글을 해제하면 픽셀 단위로 조정할 수 있습니다."
                        : "이미지 영역(Container)의 크기를 픽셀 단위로 직접 변경합니다."}
                    </p>

                    {/* 설정 초기화 버튼 */}
                    <button
                      onClick={() => {
                        onStyleChange({
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        });
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
      {!isMediaKey && elementKey !== "bannerButton" && (
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
                placeholder={
                  resolvedStyleValue.fontSize
                    ? resolvedStyleValue.fontSize.toString().replace("px", "")
                    : placeholder
                }
                value={
                  resolvedStyleValue.fontSize
                    ?.toString()
                    .replace("px", "") || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") onStyleChange("fontSize", "");
                  else if (!isNaN(Number(val)) && val.trim() !== "")
                    onStyleChange("fontSize", val + "px");
                  else onStyleChange("fontSize", val);
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
                placeholder={
                  resolvedStyleValue.fontSizeMobile
                    ? resolvedStyleValue.fontSizeMobile.toString().replace("px", "")
                    : resolvedStyleValue.fontSize
                      ? resolvedStyleValue.fontSize.toString().replace("px", "")
                      : placeholderMobile || placeholder
                }
                value={
                  resolvedStyleValue.fontSizeMobile
                    ?.toString()
                    .replace("px", "") || ""
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
              value={resolvedStyleValue.fontWeight ?? ""}
              onChange={(e) => onStyleChange("fontWeight", e.target.value)}
              className="w-full bg-gray-50 border-none p-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer"
            >
              <option value="">선택 안 함</option>
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
                  value={
                    /^#([0-9a-fA-F]{6})$/.test(styleValue.color || "")
                      ? styleValue.color
                      : /^#([0-9a-fA-F]{6})$/.test(
                            resolvedStyleValue.color || "",
                          )
                        ? resolvedStyleValue.color
                      : "#ffffff"
                  }
                  onChange={(e) => onStyleChange("color", e.target.value)}
                  className="absolute inset-[0] w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                />
              </div>
              <input
                type="text"
                value={styleValue.color ?? resolvedStyleValue.color ?? ""}
                onChange={(e) => onStyleChange("color", e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none p-1 text-xs font-bold uppercase font-mono focus:ring-0 text-gray-600"
                placeholder="#RRGGBB"
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
