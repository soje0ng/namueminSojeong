import React from "react";

import { BannerSectionRenderer } from "./widgets/BannerSectionRenderer";
import { CardRenderer } from "./widgets/CardRenderer";
import { ComparisonCardRenderer } from "./widgets/ComparisonCardRenderer";
import { CultureLetterRenderer } from "./widgets/CultureLetterRenderer";
import { FaqRenderer } from "./widgets/FaqRenderer";
import { GridCardRenderer } from "./widgets/GridCardRenderer";
import { IconCardRenderer } from "./widgets/IconCardRenderer";
import { ImageAreaRenderer } from "./widgets/ImageAreaRenderer";
import { ImageCardRenderer } from "./widgets/ImageCardRenderer";
import { InfoBannerRenderer } from "./widgets/InfoBannerRenderer";
import { MainTitleRenderer } from "./widgets/MainTitleRenderer";
import { ProcessRenderer } from "./widgets/ProcessRenderer";
import { StripBannerRenderer } from "./widgets/StripBannerRenderer";
import { TableRenderer } from "./widgets/TableRenderer";
import { TabButtonRenderer } from "./widgets/TabButtonRenderer";
import { TextSectionRenderer } from "./widgets/TextSectionRenderer";
import { TextStructureRenderer } from "./widgets/TextStructureRenderer";
import { TitleBannerRenderer } from "./widgets/TitleBannerRenderer";
import { TitleTextRenderer } from "./widgets/TitleTextRenderer";
import { VideoRenderer } from "./widgets/VideoRenderer";

export const TEMPLATE_WIDGET_RENDERER_MAP: Record<
  string,
  React.ComponentType<any>
> = {
  mainTitle: MainTitleRenderer,
  textSection: TextSectionRenderer,
  video: VideoRenderer,
  gridCard: GridCardRenderer,
  infoBanner: InfoBannerRenderer,
  process: ProcessRenderer,
  processCard: ProcessRenderer,
  iconCard: IconCardRenderer,
  table: TableRenderer,
  faq: FaqRenderer,
  bannerSection: BannerSectionRenderer,
  cardList: CardRenderer,
  titleBanner: TitleBannerRenderer,
  imageArea: ImageAreaRenderer,
  titleText: TitleTextRenderer,
  tabButton: TabButtonRenderer,
  textStructure: TextStructureRenderer,
  imageCard: ImageCardRenderer,
  comparisonCard: ComparisonCardRenderer,
  stripBanner: StripBannerRenderer,
  cultureLetter: CultureLetterRenderer,
};

export const getTemplateWidgetRenderer = (type: string) =>
  TEMPLATE_WIDGET_RENDERER_MAP[type] || null;

export const supportsTemplateWidgetHtmlConversion = (type: string) =>
  Boolean(getTemplateWidgetRenderer(type));
