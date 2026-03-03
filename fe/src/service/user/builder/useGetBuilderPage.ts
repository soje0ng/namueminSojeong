import { useQuery } from "@tanstack/react-query";

import { USER_API_ROUTES } from "@/config/apiConfig";
import userAxios from "@/service/axios/userAxios";

// 사용자용 빌더 페이지 조회 (Public)
export const useGetBuilderPage = (slug: string, lang: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["publicBuilderPage", slug, lang],
        queryFn: async () => {
            const url = USER_API_ROUTES.BUILDER_PAGE.GET.replace(":slug", slug).replace(
                ":lang",
                lang,
            );
            const res = await userAxios.get(url);
            return res.data;
        },
        enabled: options?.enabled ?? true,
    });
};
