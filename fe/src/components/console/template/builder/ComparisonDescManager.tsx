"use client";
import React from "react";
import { Trash2, Plus, ArrowUp, ArrowDown, ChevronLeft } from "lucide-react";

export interface DescItem {
  id: string;
  text: string;
}

interface ComparisonDescManagerProps {
  widgetId: string;
  side: "left" | "right";
  descItems: DescItem[];
  updateWidgetData: (id: string, data: any) => void;
  onBack: () => void;
}

const ComparisonDescManager: React.FC<ComparisonDescManagerProps> = ({
  widgetId,
  side,
  descItems,
  updateWidgetData,
  onBack,
}) => {
  const fieldName = side === "left" ? "leftDescItems" : "rightDescItems";
  const label = side === "left" ? "좌측" : "우측";

  const updateItems = (items: DescItem[]) => {
    updateWidgetData(widgetId, { [fieldName]: items });
  };

  const addItem = () => {
    updateItems([
      ...descItems,
      { id: `${side}-${Date.now()}`, text: "프로그램 특징 내용 입력" },
    ]);
  };

  const deleteItem = (id: string) => {
    updateItems(descItems.filter((item) => item.id !== id));
  };

  const moveItem = (idx: number, dir: "up" | "down") => {
    const newItems = [...descItems];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
    updateItems(newItems);
  };

  const updateText = (id: string, text: string) => {
    updateItems(
      descItems.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-white sticky top-0 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold"
        >
          <ChevronLeft size={14} />
          이전
        </button>
        <span className="text-xs font-bold text-gray-700 flex-1 text-center pr-6">
          {label} 항목 관리
        </span>
      </div>

      {/* 항목 목록 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {descItems.length === 0 && (
          <div className="text-center text-xs text-gray-400 py-6">
            항목이 없습니다.
            <br />
            아래 버튼으로 항목을 추가하세요.
          </div>
        )}
        {descItems.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2 bg-gray-50 rounded-xl p-2"
          >
            {/* 순서 변경 */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => moveItem(idx, "up")}
                disabled={idx === 0}
                className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ArrowUp size={12} />
              </button>
              <button
                onClick={() => moveItem(idx, "down")}
                disabled={idx === descItems.length - 1}
                className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ArrowDown size={12} />
              </button>
            </div>

            {/* 텍스트 입력 */}
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateText(item.id, e.target.value)}
              className="flex-1 text-sm bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-0"
            />

            {/* 삭제 */}
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* 추가 버튼 */}
      <div className="p-3 border-t border-gray-100 shrink-0 bg-white">
        <button
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Plus size={16} />
          항목 추가
        </button>
      </div>
    </div>
  );
};

export default ComparisonDescManager;
