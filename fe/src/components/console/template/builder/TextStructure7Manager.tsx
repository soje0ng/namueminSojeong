"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from "lucide-react";
import ImgUploadPop from "@/components/console/popup/ImgUploadPop";

export type Section7Type = "image" | "text" | "newsletter" | "stripBanner";

export interface Section7Item {
  id: string;
  type: Section7Type;
  // image
  columns?: number;
  images?: string[];
  imageHeight?: string;
  // text
  subTitle?: string;
  content?: string;
  // newsletter
  newsletterSubTitle?: string;
  leftContent?: string;
  rightContent?: string;
  // stripBanner
  imageUrl?: string;
  bannerSubTitle?: string;
  bannerDesc?: string;
}

const SECTION_LABELS: Record<Section7Type, string> = {
  image: "이미지 영역",
  text: "기본 텍스트",
  newsletter: "뉴스레터 텍스트",
  stripBanner: "띠배너",
};

const SECTION_COLORS: Record<Section7Type, string> = {
  image: "bg-blue-100 text-blue-700",
  text: "bg-gray-100 text-gray-700",
  newsletter: "bg-green-100 text-green-700",
  stripBanner: "bg-purple-100 text-purple-700",
};

function createDefaultSection(type: Section7Type): Section7Item {
  const id = `s7-${type}-${Date.now()}`;
  if (type === "image") {
    return {
      id,
      type: "image",
      columns: 2,
      images: [
        "/images/placeholder/section-image.jpg",
        "/images/placeholder/section-image.jpg",
      ],
      imageHeight: "380",
    };
  }
  if (type === "text") {
    return {
      id,
      type: "text",
      subTitle: "서브 타이틀 입력",
      content: "내용을 입력하세요.",
    };
  }
  if (type === "newsletter") {
    return {
      id,
      type: "newsletter",
      newsletterSubTitle: "서브 타이틀 입력",
      leftContent: "왼쪽 내용을 입력하세요.",
      rightContent: "오른쪽 내용을 입력하세요.",
    };
  }
  // stripBanner
  return {
    id,
    type: "stripBanner",
    imageUrl: "/images/placeholder/strip-banner.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc: "내용을 입력하세요.",
  };
}

interface Props {
  widgetId: string;
  sections: Section7Item[];
  updateWidgetData: (id: string, data: any) => void;
}

const TextStructure7Manager: React.FC<Props> = ({
  widgetId,
  sections,
  updateWidgetData,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  const update = (newSections: Section7Item[]) => {
    updateWidgetData(widgetId, { sections7: newSections });
  };

  const updateSection = (id: string, patch: Partial<Section7Item>) => {
    update(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const moveSection = (idx: number, dir: "up" | "down") => {
    const arr = [...sections];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    update(arr);
  };

  const deleteSection = (id: string) => {
    update(sections.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addSection = (type: Section7Type) => {
    update([...sections, createDefaultSection(type)]);
    setShowAddPicker(false);
  };

  const updateImageCount = (section: Section7Item, cols: number) => {
    const current = section.images || [];
    const placeholder = "/images/placeholder/section-image.jpg";
    let images: string[];
    if (cols > current.length) {
      images = [...current, ...Array(cols - current.length).fill(placeholder)];
    } else {
      images = current.slice(0, cols);
    }
    const heightMap: Record<number, string> = { 1: "480", 2: "384", 3: "280", 4: "240" };
    updateSection(section.id, { columns: cols, images, imageHeight: heightMap[cols] || "280" });
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
        구조 관리
      </label>

      {/* Section list */}
      <div className="space-y-1.5">
        {sections.map((section, idx) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Header row */}
              <div className="flex items-center gap-1 p-2 bg-gray-50/80">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${SECTION_COLORS[section.type]}`}
                >
                  {SECTION_LABELS[section.type]}
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-white"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : section.id)
                  }
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white"
                >
                  {isExpanded ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
              </div>

              {/* 이미지 섹션 열 수 선택 */}
              {section.type === "image" && (
                <div className="flex items-center gap-2 px-2 pb-2 bg-gray-50/80">
                  <span className="text-[10px] text-gray-400 shrink-0">열 수</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        className={`w-7 h-5 text-[10px] font-bold rounded transition-all ${
                          (section.columns || 2) === col
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => updateImageCount(section, col)}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-3 space-y-3 border-t border-gray-100 bg-white">
                  {/* IMAGE */}
                  {section.type === "image" && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 w-16 shrink-0">
                          이미지 높이
                        </label>
                        <input
                          type="number"
                          min={80}
                          max={800}
                          className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                          value={parseInt(section.imageHeight || "380") || 380}
                          onChange={(e) =>
                            updateSection(section.id, {
                              imageHeight: e.target.value,
                            })
                          }
                        />
                        <span className="text-[10px] text-gray-400">px</span>
                      </div>
                      {(section.images || []).map((img, imgIdx) => (
                        <div key={imgIdx} className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-semibold">
                            이미지 {imgIdx + 1}
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="이미지 URL"
                              value={img}
                              onChange={(e) => {
                                const imgs = [...(section.images || [])];
                                imgs[imgIdx] = e.target.value;
                                updateSection(section.id, { images: imgs });
                              }}
                            />
                            <ImgUploadPop
                              button={
                                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                  <ImageIcon size={12} />
                                </button>
                              }
                              onSelect={(url) => {
                                const imgs = [...(section.images || [])];
                                imgs[imgIdx] = url;
                                updateSection(section.id, { images: imgs });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* BASIC TEXT */}
                  {section.type === "text" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          서브타이틀
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.subTitle || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              subTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          본문 내용
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={4}
                          value={section.content || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* NEWSLETTER TEXT */}
                  {section.type === "newsletter" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          서브타이틀
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.newsletterSubTitle || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              newsletterSubTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          왼쪽 내용
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={3}
                          value={section.leftContent || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              leftContent: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          오른쪽 내용
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={3}
                          value={section.rightContent || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              rightContent: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* STRIP BANNER */}
                  {section.type === "stripBanner" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          배너 이미지
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="이미지 URL"
                            value={section.imageUrl || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                imageUrl: e.target.value,
                              })
                            }
                          />
                          <ImgUploadPop
                            button={
                              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                <ImageIcon size={12} />
                              </button>
                            }
                            onSelect={(url) =>
                              updateSection(section.id, { imageUrl: url })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          제목
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.bannerSubTitle || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              bannerSubTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          설명
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={3}
                          value={section.bannerDesc || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              bannerDesc: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add section */}
      <div className="relative">
        <button
          onClick={() => setShowAddPicker(!showAddPicker)}
          className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Plus size={13} />
          영역 추가
        </button>
        {showAddPicker && (
          <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10 grid grid-cols-2 gap-1.5">
            {(
              [
                "image",
                "text",
                "newsletter",
                "stripBanner",
              ] as Section7Type[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className={`text-xs font-semibold p-2 rounded-lg text-left transition-all hover:opacity-80 ${SECTION_COLORS[type]}`}
              >
                {SECTION_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextStructure7Manager;
