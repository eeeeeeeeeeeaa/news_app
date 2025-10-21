import { HttpUtils } from "@bundle:com.huawei.quickstart/default@utils/src/HttpUtils";
import { buildNewsApiUrl } from "@bundle:com.huawei.quickstart/default@utils/src/NewsApiConfig";
import type { NewsApiRequestParams } from "@bundle:com.huawei.quickstart/default@utils/src/NewsApiConfig";
export interface NewsHeadlineItem {
    title: string;
    url: string;
    source?: string;
    time?: string;
}
// Juhe API typed structures
interface JuheNewsItem {
    uniquekey?: string;
    title?: string;
    date?: string;
    category?: string;
    author_name?: string;
    url?: string;
}
interface JuheResult {
    stat?: string;
    data?: JuheNewsItem[];
    page?: string;
    pageSize?: string;
}
interface JuheResponse {
    reason?: string;
    result?: JuheResult;
    error_code?: number;
}
// Trim and normalize whitespace, including various unicode spaces
function sanitizeText(value: string): string {
    const WS = /[\s\u00A0\u3000\u2000-\u200A\u202F\u205F\u200B\uFEFF]/g;
    const WS_LEAD = /^[\s\u00A0\u3000\u2000-\u200A\u202F\u205F\u200B\uFEFF]+/;
    const WS_TAIL = /[\s\u00A0\u3000\u2000-\u200A\u202F\u205F\u200B\uFEFF]+$/;
    let s: string = value;
    s = s.replace(WS_LEAD, '');
    s = s.replace(WS_TAIL, '');
    s = s.replace(WS, ' ');
    s = s.replace(/ {2,}/g, ' ');
    return s;
}
export class NewsHeadlineService {
    static async fetch(params: NewsApiRequestParams): Promise<NewsHeadlineItem[]> {
        const requestUrl: string = buildNewsApiUrl(params);
        try {
            const masked = requestUrl.replace(/(key=)([^&]*)/i, (m: string, p1: string, p2: string) => {
                if (!p2)
                    return m;
                const keepStart = Math.min(3, p2.length);
                const keepEnd = Math.min(2, p2.length - keepStart);
                const maskedMid = '*'.repeat(Math.max(0, p2.length - keepStart - keepEnd));
                return p1 + p2.substring(0, keepStart) + maskedMid + p2.substring(p2.length - keepEnd);
            });
            console.info('News request URL:', masked);
        }
        catch (_) { }
        const text: string = await HttpUtils.get(requestUrl);
        let parsed: JuheResponse;
        try {
            parsed = JSON.parse(text) as JuheResponse;
        }
        catch (_) {
            return [];
        }
        if (!parsed || !parsed.result || !parsed.result.data) {
            return [];
        }
        const data: JuheNewsItem[] = parsed.result.data as JuheNewsItem[];
        const result: NewsHeadlineItem[] = [];
        for (let i = 0; i < data.length; i++) {
            const it: JuheNewsItem = data[i] as JuheNewsItem;
            const titleRaw: string = it.title ? String(it.title) : '';
            const title: string = sanitizeText(titleRaw);
            const url: string = it.url ? String(it.url) : '';
            if (!title || !url) {
                continue;
            }
            const sourceRaw: string | undefined = it.author_name ? String(it.author_name) : undefined;
            const source: string | undefined = sourceRaw ? sanitizeText(sourceRaw) : undefined;
            const timeRaw: string | undefined = it.date ? String(it.date) : undefined;
            const time: string | undefined = timeRaw ? sanitizeText(timeRaw) : undefined;
            result.push({ title, url, source, time });
        }
        return result;
    }
}
