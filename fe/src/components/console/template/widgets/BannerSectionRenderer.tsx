import React from "react";
import { Download } from "lucide-react";
import { BannerSectionWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 배너 섹션이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "28px" (데스크탑 크기)
// - 모바일 버전: fontSizeMobile: "24px" (모바일 크기)
export const BANNER_SECTION_DEFAULTS = {
  variant: "banner1",
  title: "배너 타이틀",
  titleStyle: {
    fontSize: "32px",
    fontSizeMobile: "24px",
    fontWeight: "600",
    color: "#ffffff",
  },
  desc: "보다 정확한 자격 판정을 위해 양식을 다운받아 작성하여, 이메일(likweb@likeweb.com)로 보내 주시면\n24시간 이내 연락을 드리겠습니다.\n고객님의 소중한 정보는 안전하게 보장되오니, 정확한 판정을 위해 상세하기 기재 바랍니다.",
  descStyle: { fontSize: "18px", color: "#ffffff" }, // 설명 기본 크기
  buttonText: "무료 자격판정 양식 받기",
  items: [
    {
      id: "1",
      image: "/images/template/img1.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "2",
      image: "/images/template/img2.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "3",
      image: "/images/template/img3.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "4",
      image: "/images/template/img4.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "5",
      image: "/images/template/img5.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "6",
      image: "/images/template/img6.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "7",
      image: "/images/template/img7.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
    {
      id: "8",
      image: "/images/template/img8.png",
      imageStyle: { borderRadius: "0px" },
      link: "#",
    },
  ],
};

export const BannerButton: React.FC<{
  item: any;
  textOverride?: string;
  onElementSelect?: any;
  viewport: string;
}> = ({ item, textOverride, onElementSelect, viewport }) => {
  // Merge default styles with item's textStyle
  const style = React.useMemo(() => {
    const s = getElementStyle(item.textStyle, viewport as any);
    return {
      ...s,
      // Ensure defaults if not set in textStyle
      fontSize: s.fontSize || (viewport === "mobile" ? "14px" : "18px"),
      fontWeight: s.fontWeight || "500",
      color: s.color || "#060606",
    };
  }, [item.textStyle, viewport]);

  return (
    <a
      href={item.link || "#"}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-[12px_16px] md:p-[16px_24px] hover:shadow-lg transition-all cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${viewport === "mobile" ? "w-full" : "flex-1"}${viewport === "desktop" ? " xl:max-w-[280px]" : ""}${!item.textStyle?.backgroundColor ? " bg-white" : ""}`}
      style={style}
      onClick={(e) => {
        if (onElementSelect) {
          e.preventDefault();
          e.stopPropagation();
          onElementSelect("bannerButton", item.id);
        }
      }}
    >
      <SafeHtml
        html={textOverride ?? item.text}
        placeholder="버튼 텍스트를 입력하세요"
        className="rounded"
        style={style}
      />
      <span className="material-symbols-outlined ml-2 text-[20px] md:text-[24px]">
        {item.icon || "download"}
      </span>
    </a>
  );
};

export const BannerSectionRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as BannerSectionWidget;
  const _style = useWidgetStyle(w.style);
  // Prevent background styles on the wrapper section, as we apply them to inner containers for Banners
  const {
    backgroundColor,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    ...style
  } = _style;

  // 💡 [배너 섹션 공통 폰트 설정]
  // 모든 안내배너 타입(1, 2, 3)에서 공통으로 처리하기 위해 스타일을 미리 계산합니다.
  const titleStyle = getElementStyle(
    {
      fontSize: "32px",
      fontSizeMobile: "24px",
      fontWeight: "600",
      color: "#ffffff",
      ...w.data.titleStyle,
    },
    viewport as any,
  );

  const descStyle = getElementStyle(
    {
      fontSize: "18px",
      fontSizeMobile: "14px",
      color: "#ffffff",
      ...w.data.descStyle,
    },
    viewport as any,
  );

  // Default to 'banner1' rendering
  if (w.data.variant === "banner1") {
    return (
      <section style={style} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            className="p-[24px_20px] text-center md:p-[40px_24px]"
            style={{
              ...(w.style?.backgroundImage
                ? {
                    backgroundImage: `url(${w.style.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    backgroundColor: w.style?.backgroundColor || "#012E58",
                  }),
            }}
          >
            <SafeHtml
              html={w.data.title}
              placeholder="배너 타이틀을 입력하세요"
              className="font-[600] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
              style={titleStyle}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onElementSelect?.("title");
              }}
            />
            <div className="mt-[8px]">
              <SafeHtml
                html={w.data.desc}
                placeholder="설명을 입력하세요"
                className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                style={descStyle}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            </div>
            <div
              className={`m-[24px_auto_0] grid md:mt-[40px] ${viewport === "mobile" ? "grid-cols-2 gap-4 place-items-center" : viewport === "tablet" ? "grid-cols-4 gap-2" : "xl:flex xl:flex-wrap xl:justify-center xl:gap-[14px]"}`}
              style={{
                gap: w.style?.gap ? formatUnit(w.style.gap) : undefined,
              }}
            >
              {(w.data.items || []).map((item) => (
                <div
                  key={item.id}
                  className={`group relative block w-full md:w-auto cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-blue-400`}
                >
                  <UniversalMedia
                    url={item.image || "/images/template/img1.png"}
                    alt="배너 이미지"
                    className="transition-transform duration-300"
                    style={{
                      width: "160px", // Default fallback width
                      ...getElementStyle(item.imageStyle, viewport as any),
                    }}
                    autoPlay={item.autoPlay ?? w.data.autoPlay}
                    muted={item.muted ?? w.data.muted}
                    loop={item.loop ?? w.data.loop}
                    onDoubleClick={
                      onElementSelect
                        ? (e) => {
                            e.stopPropagation();
                            onElementSelect("itemImage", item.id);
                          }
                        : undefined
                    }
                  />
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-[5]"
                      onClick={(e) => {
                        if (onElementSelect) {
                          e.preventDefault();
                          e.stopPropagation();
                          onElementSelect("itemImage", item.id);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  } else if (w.data.variant === "banner2") {
    const b2TitleStyle = { ...titleStyle };
    const b2DescStyle = { ...descStyle };
    // Banner 2 defaults to dark text if background is light/default
    if (
      (b2TitleStyle.color === "#ffffff" ||
        b2TitleStyle.color === "#fff" ||
        !b2TitleStyle.color) &&
      !w.style?.backgroundImage &&
      (!w.style?.backgroundColor || w.style.backgroundColor === "#F8F6F2")
    ) {
      b2TitleStyle.color = "#000000";
      b2DescStyle.color = "#000000";
    }

    return (
      <section style={style} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            className={`flex flex-col gap-[24px] p-[24px_20px] md:p-[40px_24px] ${viewport === "desktop" ? "xl:flex-row xl:items-center xl:justify-between xl:p-[40px_60px]" : ""}`}
            style={{
              ...(w.style?.backgroundImage
                ? {
                    backgroundImage: `url(${w.style.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    backgroundColor: w.style?.backgroundColor || "#F8F6F2",
                  }),
            }}
          >
            <div className={`${viewport === "desktop" ? "xl:flex-1" : ""}`}>
              <SafeHtml
                html={w.data.title}
                placeholder="배너 타이틀을 입력하세요"
                className="font-[600] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                style={b2TitleStyle}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
              <div className="pt-[8px] xl:pt-[40px]">
                <SafeHtml
                  html={w.data.desc}
                  placeholder="설명을 입력하세요"
                  className="hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                  style={b2DescStyle}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              </div>
            </div>
            <div className="md:min-w-[280px]">
              <BannerButton
                item={
                  w.data.items?.[0] || {
                    id: "temp",
                    link: "#",
                    icon: "download",
                  }
                }
                textOverride={w.data.buttonText}
                onElementSelect={onElementSelect}
                viewport={viewport || "desktop"}
              />
            </div>
          </div>
        </div>
      </section>
    );
  } else if (w.data.variant === "banner3") {
    return (
      <section style={style} className="w-full h-auto">
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            className={`relative flex flex-col gap-[24px] p-[24px_20px] md:p-[40px_24px] ${viewport === "desktop" ? "xl:p-[40px_60px_40px_500px]" : ""} ${!w.style?.backgroundImage && !w.style?.backgroundColor ? "bg-gradient-to-r from-[#21568E] to-[#093666]" : ""}`}
            style={{
              ...(w.style?.backgroundImage
                ? {
                    backgroundImage: `url(${w.style.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : w.style?.backgroundColor
                  ? {
                      backgroundColor: w.style.backgroundColor,
                    }
                  : {}),
            }}
          >
            <div
              className={`absolute bottom-0 right-0 hidden aspect-[6/7] max-w-[240px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 flex justify-center items-center overflow-hidden${viewport !== "mobile" ? " md:block" : ""}${viewport === "desktop" ? " xl:left-[240px] xl:right-auto" : ""}`}
            >
              <UniversalMedia
                url={w.data.image || "/images/template/banner_img5.png"}
                alt="banner"
                className="w-full h-auto object-contain"
                autoPlay={w.data.autoPlay ?? false}
                muted={w.data.muted ?? true}
                loop={w.data.loop ?? false}
                onDoubleClick={
                  onElementSelect
                    ? (e) => {
                        e.stopPropagation();
                        onElementSelect("image");
                      }
                    : undefined
                }
              />
            </div>

            {/* Content */}
            <div className="z-[1] xl:flex-1 text-center xl:text-left">
              <SafeHtml
                html={w.data.title}
                placeholder="배너 타이틀을 입력하세요"
                className="font-[600] text-white hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                style={titleStyle}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
              <div className="pt-[8px]">
                <SafeHtml
                  html={w.data.desc}
                  placeholder="설명을 입력하세요"
                  className="text-white hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                  style={descStyle}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementSelect?.("desc");
                  }}
                />
              </div>
            </div>

            {/* Buttons inside Items */}
            <div
              className={`z-[1] flex gap-[8px] flex-wrap justify-center xl:justify-start ${viewport === "mobile" ? "flex-col" : "flex-row"}`}
              style={{
                gap: w.style?.gap ? formatUnit(w.style.gap) : undefined,
              }}
            >
              {(w.data.items || []).map((item) => (
                <BannerButton
                  key={item.id}
                  item={item}
                  onElementSelect={onElementSelect}
                  viewport={viewport || "desktop"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
