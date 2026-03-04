export type WidgetType =
  | "mainTitle"
  | "stripBanner"
  | "banner1"
  | "banner2"
  | "banner3"
  | "banner4"
  | "tabMenu"
  | "video"
  | "imageCarousel"
  | "gridCard"
  | "tabCarousel"
  | "textSplit"
  | "infoBanner"
  | "process"
  | "iconCard"
  | "table"
  | "comingSoon"
  | "imageLayout"
  | "faq"
  | "banner6"
  | "banner7"
  | "textSection"
  | "bannerSection"
  | "codeSection"
  | "cardList"
  | "imageTitle"
  | "imageTitle3"
  | "titleBanner"
  | "imageArea"
  | "titleText"
  | "tabButton"
  | "textStructure"
  | "imageCard"
  | "comparisonCard" // ADDED
  | "processCard";

export interface WidgetStyle {
  paddingTop?: number | string;
  paddingBottom?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  gap?: string; // Item spacing
  isHidden?: boolean;
}

export interface ElementStyle {
  fontSize?: string; // e.g., "24px"
  fontSizeMobile?: string; // e.g., "16px"
  fontWeight?: string; // e.g., "700"
  color?: string; // e.g., "#000000"
  link?: string;
  target?: "_blank" | "_self"; // Link target
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  textAlign?: "left" | "center" | "right";
  width?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill";
  borderRadius?: string;
  isHidden?: boolean; // For toggling text visibility
}

export interface BaseWidget {
  id: string;
  type: WidgetType;
  style?: WidgetStyle;
}

// Existing Widgets...
export interface MainTitleWidget extends BaseWidget {
  type: "mainTitle";
  data: {
    subTitle: string;
    subTitleStyle: ElementStyle;
    mainTitle: string;
    mainTitleStyle: ElementStyle;
  };
}
export interface StripBannerWidget extends BaseWidget {
  type: "stripBanner";
  data: {
    layout?: string;
    imageUrl: string;
    altText: string;
    link?: string;
    height?: string;
    objectFit?: "cover" | "contain" | "fill";
    title?: string;
    titleStyle?: ElementStyle;
    subTitle?: string;
    subTitleStyle?: ElementStyle;
    desc?: string;
    descStyle?: ElementStyle;
    buttonText?: string;
    buttonStyle?: ElementStyle;
    imageStyle?: ElementStyle;
  };
}
export interface Banner1Item {
  id: string;
  text: string;
  textStyle: ElementStyle;
  iconUrl: string;
  iconStyle?: ElementStyle;
  link?: string;
}
// 5. Banner 1 (Consolidated)
export interface Banner1Widget extends BaseWidget {
  type: "banner1";
  data: {
    variant?:
      | "text-icon"
      | "premium"
      | "image-text-icon"
      | "banner2"
      | "banner3"
      | "banner4"
      | "banner5"
      | "banner6";
    mainTitle: string;
    mainTitleStyle: ElementStyle;
    subTitle: string;
    subTitleStyle: ElementStyle;
    items: {
      id: string;
      text: string;
      textStyle?: ElementStyle;
      iconUrl: string;
      iconStyle?: ElementStyle;
      link?: string;
    }[];
    imageUrl?: string;
    image?: string; // specific for some layouts
    imageStyle?: ElementStyle;
    videoUrl?: string; // for banner3
    desc?: string;
    descStyle?: ElementStyle;
    overlayText?: string;
    link?: string;
    objectFit?: "cover" | "contain";
  };
}

// 5.5 Banner 2
export interface Banner2Widget extends BaseWidget {
  type: "banner2";
  data: {
    image: string;
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    items: {
      id: string;
      iconUrl: string;
      iconStyle?: ElementStyle;
      text: string;
      textStyle?: ElementStyle;
    }[];
    imageStyle?: ElementStyle;
    layout?: "left-image" | "right-image";
  };
}

// 6. Banner 3 (Video Left + Text/Icons Right)
export interface Banner3Widget extends BaseWidget {
  type: "banner3";
  data: {
    videoUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    items: {
      id: string;
      iconUrl: string;
      iconStyle?: ElementStyle;
      text: string;
      textStyle?: ElementStyle;
    }[];
  };
}

// 7. Banner 4 (Image Left with Text Overlay + Text/Icons Right)
export interface Banner4Widget extends BaseWidget {
  type: "banner4";
  data: {
    image: string;
    overlayText: string;
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    items: {
      id: string;
      iconUrl: string;
      iconStyle?: ElementStyle;
      text: string;
      textStyle?: ElementStyle;
    }[];
    imageStyle?: ElementStyle;
  };
}
// 18. Banner 6 (Video Banner)
export interface Banner6Widget extends BaseWidget {
  type: "banner6";
  data: {
    mainTitle: string;
    mainTitleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    videoUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    desc: string;
    descStyle?: ElementStyle;
    overlayText?: string;
  };
}

// 19. Banner 7 (Video + Icons Grid)
export interface Banner7Widget extends BaseWidget {
  type: "banner7";
  data: {
    videoUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    title: string;
    titleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    overlayText?: string;
    items: {
      id: string;
      iconUrl: string;
      iconStyle?: ElementStyle;
      text: string;
      textStyle?: ElementStyle;
    }[];
  };
}

export interface TabItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  style: ElementStyle;
}
export interface TabMenuWidget extends BaseWidget {
  type: "tabMenu";
  data: { items: TabItem[] };
}
export interface VideoWidget extends BaseWidget {
  type: "video";
  data: {
    variant?: "grid";
    title: string;
    titleStyle: ElementStyle;
    subTitle: string;
    subTitleStyle: ElementStyle;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    layout?: "horizontal" | "vertical";
    itemsPerRow?: 1 | 2;
    items: {
      id: string;
      type: "video" | "image";
      url: string;
      imageStyle?: ElementStyle;
      title: string;
      itemTitleStyle?: ElementStyle;
      desc: string;
      itemDescStyle?: ElementStyle;
      autoPlay?: boolean;
      muted?: boolean;
      loop?: boolean;
    }[];
    itemTitleStyle?: ElementStyle;
    itemDescStyle?: ElementStyle;
  };
}
export interface ImageCarouselWidget extends BaseWidget {
  type: "imageCarousel";
  data: {
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    items: {
      id: string;
      image: string;
      imageStyle?: ElementStyle;
      title: string;
      desc: string;
      link?: string;
    }[];
  };
}
export interface GridCardWidget extends BaseWidget {
  type: "gridCard";
  data: {
    variant: "keyword" | "banner" | "button" | "box" | "large";
    layout?: "left-title" | "top-title";
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    mediaUrl?: string;
    mediaStyle?: ElementStyle;
    mediaType?: "image" | "video";
    items: {
      id: string;
      image?: string;
      imageStyle?: ElementStyle;
      title: string;
      titleStyle?: ElementStyle;
      desc: string;
      descStyle?: ElementStyle;
      tagStyle?: ElementStyle;
      label?: string;
      labelStyle?: ElementStyle;
      tags?: string[];
      buttonText?: string;
      bottomText?: string;
      link?: string;
    }[];
  };
}
export interface TabCarouselWidget extends BaseWidget {
  type: "tabCarousel";
  data: {
    title: string;
    subTitle: string;
    tabs: {
      id: string;
      label: string;
      items: {
        id: string;
        image: string;
        imageStyle?: ElementStyle;
        title: string;
        desc: string;
        link?: string;
      }[];
    }[];
    activeTabId: string;
  };
}
// 11. Text Split
export interface TextSplitWidget extends BaseWidget {
  type: "textSplit";
  data: {
    variant: "media-left" | "overlay" | "image-left-list";
    title?: string;
    titleStyle?: ElementStyle;
    subTitle?: string;
    subTitleStyle?: ElementStyle;
    mediaUrl: string;
    imageStyle?: ElementStyle;
    mediaType: "image" | "video";
    autoPlay?: boolean;
    muted?: boolean;
    textContent: string;
    textContentStyle?: ElementStyle;
    listItems?: {
      id: string;
      icon: string;
      iconStyle?: ElementStyle;
      text: string;
      textStyle?: ElementStyle;
      link?: string;
    }[];
    link?: string;
  };
}
export interface InfoBannerWidget extends BaseWidget {
  type: "infoBanner";
  data: {
    variant: "grid" | "simple" | "overlap" | "split";
    title: string;
    titleStyle?: ElementStyle;
    content: string;
    contentStyle?: ElementStyle;
    buttonText?: string;
    buttonStyle?: ElementStyle;
    backgroundImage?: string;
    imageStyle?: ElementStyle;
    gridImages?: string[];
  };
}
export interface ProcessWidget extends BaseWidget {
  type: "process";
  data: {
    variant: "horizontal" | "vertical" | "number" | "layout1";
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc?: string;
    descStyle?: ElementStyle;
    showImage?: boolean;
    steps: {
      id: string;
      number: string;
      numberStyle?: ElementStyle;
      title: string;
      titleStyle?: ElementStyle;
      desc: string;
      descStyle?: ElementStyle;
      icon?: string;
      iconStyle?: ElementStyle;
      label?: string;
      labelStyle?: ElementStyle;
    }[];
    layout?: "horizontal" | "vertical" | "1";
    itemsPerRow?: number;
  };
}

// 13. Icon Card
export interface IconCardWidget extends BaseWidget {
  type: "iconCard";
  data: {
    variant: "box" | "vertical" | "button" | "or" | "horizontal" | "layout1";
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    items: {
      id: string;
      icon: string;
      iconStyle?: ElementStyle;
      title: string;
      desc: string;
      titleStyle?: ElementStyle;
      descStyle?: ElementStyle;
      label?: string;
      link?: string;
    }[];
    layout?: "horizontal" | "vertical";
    itemsPerRow?: number;
    rowGap?: number;
  };
}

// 14. Table
export interface TableWidget extends BaseWidget {
  type: "table";
  data: {
    variant:
      | "standard"
      | "cost"
      | "color"
      | "comparison"
      | "responsive"
      | "table02"
      | "table03"
      | "table04";
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc?: string;
    descStyle?: ElementStyle;
    image?: string;
    imageStyle?: ElementStyle;
    bottomText?: string;
    bottomTextStyle?: ElementStyle;
    // Simplified generic data structure for tables
    headers: string[];
    headerStyle?: ElementStyle;
    rows: string[][];
    bodyStyle?: ElementStyle;
    comparisonHeaders?: string[];
    comparisonRows?: string[][];
    comparisonGubun?: string;
    layout?: "horizontal" | "vertical";
  };
}

// 15. Coming Soon (준비중)
export interface ComingSoonWidget extends BaseWidget {
  type: "comingSoon";
  data: {
    variant: "content" | "page";
    title: string;
    titleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    iconUrl?: string;
    contentTitle?: string;
    contentTitleStyle?: ElementStyle;
    contentDesc?: string;
    contentDescStyle?: ElementStyle;
    layout?: "horizontal" | "vertical";
  };
}

// 16. Image Layouts
export interface ImageLayoutWidget extends BaseWidget {
  type: "imageLayout";
  data: {
    variant:
      | "horizontal"
      | "horizontal-video"
      | "vertical"
      | "vertical-video"
      | "list"
      | "check"
      | "icon";
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    media1Url: string;
    imageStyle?: ElementStyle;
    media2Url?: string; // Optional second media
    image2Style?: ElementStyle;
    textContent: string;
    autoPlay?: boolean;
    muted?: boolean;
    items?: {
      id: string;
      text: string;
      textStyle?: ElementStyle;
      icon?: string;
      iconStyle?: ElementStyle;
      link?: string;
    }[];
    link?: string;
    layout?: "horizontal" | "vertical";
  };
}

// 17. FAQ
export interface FaqWidget extends BaseWidget {
  type: "faq";
  data: {
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    items: {
      id: string;
      question: string;
      questionStyle?: ElementStyle;
      answer: string;
      answerStyle?: ElementStyle;
    }[];
  };
}

// 19. Text Section (Flexible Content Blocks)
export interface TextSectionWidget extends BaseWidget {
  type: "textSection";
  data: {
    variant: "sticky-left" | "standard" | "text2" | "text3";
    title?: string;
    titleStyle?: ElementStyle;
    subTitle?: string;
    subTitleStyle?: ElementStyle;
    // For sticky/standard
    blocks?: {
      id: string;
      type: "heading" | "text" | "image" | "video";
      text?: string;
      url?: string;
      iconType?: "check" | "circle" | "square" | "none";
      style?: ElementStyle;
      autoPlay?: boolean;
      muted?: boolean;
    }[];
    // For text2 / text3
    topImage?: string;
    items?: {
      id: string;
      number: string;
      numberStyle?: ElementStyle;
      title: string;
      titleStyle?: ElementStyle;
      subTitle?: string;
      subTitleStyle?: ElementStyle;
      desc: string;
      descStyle?: ElementStyle;
      textStyle?: ElementStyle; // Added for general text blocks if needed
      icon?: string; // For text3
      iconStyle?: ElementStyle;
    }[];
  };
}

// 20. Banner Section (New)
export interface BannerSectionWidget extends BaseWidget {
  type: "bannerSection";
  data: {
    variant: "banner1" | "banner2" | "banner3";
    title: string;
    titleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    buttonText?: string; // For banner2
    image?: string; // For banner3 illustration
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    items: {
      id: string;
      image?: string; // Used for icon in buttons or images in grid
      imageStyle?: ElementStyle;
      link?: string; // Button link
      text?: string; // Button label (newly proposed for consistency)
      textStyle?: ElementStyle; // Button label style
      icon?: string; // Material Symbol Icon Name
      autoPlay?: boolean;
      muted?: boolean;
      loop?: boolean;
    }[];
  };
}

// 21. Card List (New)
export interface CardListWidget extends BaseWidget {
  type: "cardList";
  data: {
    variant: "image-card" | "bg-image" | "text-card";
    layout?: "horizontal" | "vertical"; // Relationship between Title and List
    title: string;
    titleStyle?: ElementStyle;
    subTitle: string;
    subTitleStyle?: ElementStyle;
    itemsPerRow?: number;
    items: {
      id: string;
      image?: string;
      imageStyle?: ElementStyle;
      title: string;
      titleStyle?: ElementStyle;
      desc: string;
      descStyle?: ElementStyle;
      tag?: string; // Small badge like '커리어 · 트렌드'
      tagStyle?: ElementStyle;
      label?: string; // Small badge like 'NEW' or '상품안내'
      labelStyle?: ElementStyle;
      link?: string;
      author?: string; // For image-card variant
      authorStyle?: ElementStyle;
      icon?: string; // Material symbol icon name for text-card
      iconStyle?: ElementStyle;
    }[];
  };
}

export type Widget =
  | MainTitleWidget
  | StripBannerWidget
  | Banner1Widget
  | Banner2Widget
  | Banner3Widget
  | Banner4Widget
  | TabMenuWidget
  | VideoWidget
  | ImageCarouselWidget
  | GridCardWidget
  | TabCarouselWidget
  | TextSplitWidget
  | InfoBannerWidget
  | ProcessWidget
  | IconCardWidget
  | TableWidget
  | ComingSoonWidget
  | ImageLayoutWidget
  | FaqWidget
  | Banner6Widget
  | Banner7Widget
  | TextSectionWidget
  | BannerSectionWidget
  | CodeSectionWidget
  | CardListWidget
  | ImageTitleWidget
  | ImageTitle3Widget
  | GenericNewWidget;

export interface GenericNewWidget extends BaseWidget {
  type:
    | "titleBanner"
    | "imageArea"
    | "titleText"
    | "tabButton"
    | "textStructure"
    | "imageCard"
    | "comparisonCard" // ADDED
    | "processCard";
  data: {
    layout?: string;
    [key: string]: any;
  };
}

// 22. Image Title
export interface ImageTitleWidget extends BaseWidget {
  type: "imageTitle";
  data: {
    subTitle: string;
    subTitleStyle?: ElementStyle;
    mainTitle: string;
    mainTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    textContent: string;
    textContentStyle?: ElementStyle;
    image: string;
    imageStyle?: ElementStyle;
    items: {
      id: string;
      iconUrl: string;
      iconStyle?: ElementStyle;
      title: string;
      titleStyle?: ElementStyle;
      desc: string;
      descStyle?: ElementStyle;
    }[];
  };
}

// 23. Image Title 3 (따옴표타이틀)
export interface ImageTitle3Widget extends BaseWidget {
  type: "imageTitle3";
  data: {
    subTitle: string;
    subTitleStyle?: ElementStyle;
    mainTitle: string;
    mainTitleStyle?: ElementStyle;
    desc: string;
    descStyle?: ElementStyle;
    image: string;
    imageStyle?: ElementStyle;
    imageMobile?: string;
    overlayTitle: string;
    overlayTitleStyle?: ElementStyle;
    overlaySubTitle: string;
    overlaySubTitleStyle?: ElementStyle;
    quoteLeftUrl: string;
    quoteRightUrl: string;
  };
}

export interface CodeSectionWidget extends BaseWidget {
  type: "codeSection";
  data: {
    code: string;
  };
}

export interface Section {
  id: string;
  layout: "full" | "padded";
  backgroundColor: string;
  widgets: Widget[];
}

export interface FooterData {
  companyName: string;
  copyrightYear: string;
  links: { label: string; url: string }[];
  backgroundColor: string;
  textColor: string;
}

export interface PageData {
  title: string;
  sections: Section[];
}
