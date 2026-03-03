import { useSiteStore } from "@/store/common/useSiteStore";

const DEFAULT_LANG = "ko";

export const useLangTypes = () => {
    const { siteLanguages } = useSiteStore();

    // siteLanguages가 undefined이거나 배열이 아닌 경우 방어
    const safeLanguages = Array.isArray(siteLanguages) ? siteLanguages : [];

    const langTypes = safeLanguages.length > 0
        ? safeLanguages.map(lang => lang?.site_lang ?? DEFAULT_LANG)
        : [DEFAULT_LANG];
    const initialLang = langTypes[0] || DEFAULT_LANG;

    return { langTypes, initialLang };
};