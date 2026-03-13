import React from "react";
import { getElementStyle, SafeHtml } from "./WidgetUtils";

interface WidgetHeaderProps {
  title?: string;
  subTitle?: string;
  titleStyle?: any;
  subTitleStyle?: any;
  viewport: "mobile" | "tablet" | "desktop";
  onElementSelect?: (key: string) => void;
  className?: string;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  subTitle,
  titleStyle,
  subTitleStyle,
  viewport,
  onElementSelect,
  className = "",
}) => {
  const getHeaderTextStyle = (style: any) => getElementStyle(style, viewport);

  return (
    <div className={className}>
      <SafeHtml
        html={title || "타이틀 입력"}
        className="text-시안-mode-gray95 text-xl xl:text-4xl font-bold leading-tight xl:leading-[60px] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
        style={getHeaderTextStyle(titleStyle)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("title");
        }}
      />
      <br />
      <SafeHtml
        html={subTitle}
        placeholder="서브타이틀을 입력하세요"
        className="pt-[4px] text-[#666666] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
        style={getHeaderTextStyle(subTitleStyle)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("subTitle");
        }}
      />
    </div>
  );
};
