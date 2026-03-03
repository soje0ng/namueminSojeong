import React from 'react';
import { getElementStyle, SafeHtml } from './WidgetUtils';

interface WidgetHeaderProps {
    title?: string;
    subTitle?: string;
    titleStyle?: any;
    subTitleStyle?: any;
    viewport: 'mobile' | 'tablet' | 'desktop';
    onElementSelect?: (key: string) => void;
    className?: string;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
    title, subTitle, titleStyle, subTitleStyle, viewport, onElementSelect, className = ''
}) => {
    // Fallback font sizes if not provided in data
    const titleStyleWithDefaults = {
        fontSize: titleStyle?.fontSize || (viewport === 'mobile' ? '28px' : '36px'),
        ...titleStyle
    };

    const subTitleStyleWithDefaults = {
        fontSize: subTitleStyle?.fontSize || '18px',
        ...subTitleStyle
    };

    return (
        <div className={className}>
            <SafeHtml
                html={title}
                placeholder="타이틀을 입력하세요"
                className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                style={getElementStyle(titleStyleWithDefaults, viewport)}
                onDoubleClick={(e) => { e.stopPropagation(); onElementSelect?.('title'); }}
            />
            <br />
            <SafeHtml
                html={subTitle}
                placeholder="서브타이틀을 입력하세요"
                className="pt-[4px] text-[#666666] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                style={getElementStyle(subTitleStyleWithDefaults, viewport)}
                onDoubleClick={(e) => { e.stopPropagation(); onElementSelect?.('subTitle'); }}
            />
        </div>
    );
};
