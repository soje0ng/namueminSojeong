import { Widget } from "@/types/console/template";
import { PROCESS_STEP_DEFAULT } from "@/components/console/template/widgets/ProcessRenderer";
import { ICON_CARD_ITEM_DEFAULT } from "@/components/console/template/widgets/IconCardRenderer";

/**
 * 배열에서 아이템을 찾습니다.
 */
export const findItem = (arr: any[], id: string) =>
    id?.startsWith("__idx_")
        ? arr[parseInt(id.replace("__idx_", ""), 10)]
        : arr.find((i: any) => i.id === id);

/**
 * 배열에서 아이템을 업데이트합니다.
 */
export const updateItemInArray = (arr: any[], id: string, key: string, val: any) =>
    arr.map((i: any, idx: number) => {
        if (id?.startsWith("__idx_")) {
            const targetIdx = parseInt(id.replace("__idx_", ""), 10);
            return idx === targetIdx ? { ...i, [key]: val } : i;
        }
        return i.id === id ? { ...i, [key]: val } : i;
    });

/**
 * 위젯 타입에 따른 배열 이름을 반환합니다.
 */
export const getArrayNameForWidget = (widget: Widget): string => {
    const data = widget.data as any;

    if (widget.type === "process") return "steps";
    if (widget.type === "tabCarousel") return "tabs";
    if (widget.type === "textSplit" && data.variant === "image-left-list") return "listItems";
    return "items";
};

/**
 * 새 아이템을 생성합니다.
 */
export function createNewItem(widget: Widget): any {
    const id = `item-${Date.now()}`;
    const data = widget.data as any;
    const arrayName = getArrayNameForWidget(widget);

    // CLONING STRATEGY: Use the first item as a template to preserve styles
    const targetList = data[arrayName];
    if (targetList && Array.isArray(targetList) && targetList.length > 0) {
        const newItem = JSON.parse(JSON.stringify(targetList[0]));
        newItem.id = id;

        // Re-label text but keep styles/structure
        if (newItem.text !== undefined) newItem.text = "새 항목";
        if (newItem.label !== undefined && widget.type !== "process")
            newItem.label = "새 항목";
        if (newItem.question !== undefined) newItem.question = "새로운 질문?";
        if (newItem.answer !== undefined) newItem.answer = "답변 내용입니다.";
        if (newItem.title !== undefined) newItem.title = "새 제목";
        if (newItem.desc !== undefined) newItem.desc = "설명을 입력하세요.";

        // Special handling for process step numbering
        if (widget.type === "process") {
            const count = (data.steps?.length || 0) + 1;
            newItem.number = count < 10 ? `0${count}` : `${count}`;
        }

        return { item: newItem, arrayName };
    }

    // Fallback: 위젯의 데이터가 하나도 없을 때
    let newItem: any = null;

    if (widget.type === "process") {
        newItem = { id, ...PROCESS_STEP_DEFAULT, number: "01" };
    } else if (widget.type === "tabMenu") {
        newItem = {
            id,
            label: "새 메뉴",
            url: "#",
            isActive: false,
            style: { fontSize: "16px", fontWeight: "400" },
        };
    } else if (
        widget.type === "banner1" ||
        widget.type === "banner2" ||
        widget.type === "banner3" ||
        widget.type === "banner4" ||
        widget.type === "banner7"
    ) {
        newItem = {
            id,
            text: "새 항목",
            textStyle: { fontSize: "18px" },
            iconUrl: "/images/template/icon.png",
        };
    } else if (widget.type === "faq") {
        newItem = {
            id,
            question: "새로운 질문?",
            questionStyle: { fontSize: "20px" },
            answer: "답변 내용입니다.",
            answerStyle: { fontSize: "18px" },
        };
    } else if (widget.type === "tabCarousel") {
        newItem = { id, label: "새 탭", items: [] };
    } else if (widget.type === "iconCard") {
        newItem = { id, ...ICON_CARD_ITEM_DEFAULT };
    } else if (widget.type === "imageLayout") {
        newItem = { id, text: "새 리스트 항목", icon: "/images/template/icon.png" };
    } else if (widget.type === "textSplit" && data.variant === "image-left-list") {
        newItem = { id, icon: "/images/template/icon.png", text: "새 항목" };
    } else if (widget.type === "comingSoon") {
        newItem = { id, text: "새로운 Coming Soon 항목" };
    }

    return { item: newItem, arrayName };
}

/**
 * 테이블에 새 행을 추가합니다.
 */
export function createTableRow(widget: Widget): string[] {
    const data = (widget as any).data;
    const colCount = data.headers.length;
    return Array(colCount).fill("새 내용");
}

/**
 * 테이블에 새 열을 추가합니다.
 */
export function addTableColumn(data: any): { headers: string[]; rows: string[][] } {
    const newHeaders = [...data.headers, "새 열"];
    const newRows = data.rows.map((row: string[]) => [...row, "내용"]);
    return { headers: newHeaders, rows: newRows };
}

/**
 * 테이블에서 마지막 행을 제거합니다.
 */
export function removeTableLastRow(data: any): string[][] | null {
    if (data.rows.length <= 1) return null;
    const newRows = [...data.rows];
    newRows.pop();
    return newRows;
}

/**
 * 테이블에서 마지막 열을 제거합니다.
 */
export function removeTableLastColumn(data: any): { headers: string[]; rows: string[][] } | null {
    if (data.headers.length <= 1) return null;
    const newHeaders = [...data.headers];
    newHeaders.pop();
    const newRows = data.rows.map((row: string[]) => {
        const r = [...row];
        r.pop();
        return r;
    });
    return { headers: newHeaders, rows: newRows };
}

/**
 * 배열 아이템을 이동합니다.
 */
export function moveItemInArray(items: any[], itemId: string, direction: "up" | "down"): any[] | null {
    const newItems = [...items];
    const idx = newItems.findIndex((i: any) => i.id === itemId);
    if (idx === -1) return null;

    if (direction === "up" && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
        return newItems;
    } else if (direction === "down" && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
        return newItems;
    }
    return null;
}

/**
 * 아이템 순서를 재정렬합니다.
 */
export function reorderItems(items: any[], draggedId: string, targetId: string): any[] | null {
    const fromIndex = items.findIndex((it: any) => it.id === draggedId);
    const toIndex = items.findIndex((it: any) => it.id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return null;

    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    return newItems;
}
