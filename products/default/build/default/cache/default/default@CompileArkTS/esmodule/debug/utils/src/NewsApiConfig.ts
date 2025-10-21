export interface ExtraParamPair {
    key: string;
    value: string | number;
}
export interface NewsApiRequestParams {
    type?: string; // e.g. 'guonei' | 'guoji'
    is_filter?: number | string; // API may require number/string
    is_filer?: number | string; // some docs typo; keep for compatibility
    page?: number;
    size?: number;
    // extra query pairs if needed
    extra?: ExtraParamPair[];
}
export interface NewsApiConfigShape {
    endpoint: string; // Base endpoint, e.g. https://example.com/news
    apiKey: string; // Fill by user
    apiKeyParam: string; // e.g. 'apikey' or 'key'
    typeParam: string; // e.g. 'type'
    pageParam: string; // e.g. 'page'
    sizeParam: string; // e.g. 'page_size' | 'num'
    isFilterParam?: string; // default 'is_filter'
    isFilerParam?: string; // typo compatibility
    defaultSize: number; // default page size
}
export function maskApiKey(url: string): string {
    try {
        return url.replace(/(key=)([^&]*)/i, (m: string, p1: string, p2: string): string => {
            if (!p2) {
                return m;
            }
            const keepStart: number = Math.min(3, p2.length);
            const keepEnd: number = Math.min(2, p2.length - keepStart);
            let maskedMid: string = '';
            for (let i = 0; i < Math.max(0, p2.length - keepStart - keepEnd); i++) {
                maskedMid += '*';
            }
            return p1 + p2.substring(0, keepStart) + maskedMid + p2.substring(p2.length - keepEnd);
        });
    }
    catch (_) {
        return url;
    }
}
// Placeholder config. Please fill endpoint and apiKey according to PDF.
export const NewsApiConfig: NewsApiConfigShape = {
    endpoint: 'https://v.juhe.cn/toutiao/index',
    apiKey: '71833a97a51ccfad8563af5ecae4839b',
    apiKeyParam: 'key',
    typeParam: 'type',
    pageParam: 'page',
    sizeParam: 'page_size',
    isFilterParam: 'is_filter',
    isFilerParam: 'is_filer',
    defaultSize: 30
};
export function buildNewsApiUrl(params: NewsApiRequestParams = {}): string {
    const cfg = NewsApiConfig;
    const kv: string[] = [];
    // api key
    kv.push(`${encodeURIComponent(cfg.apiKeyParam)}=${encodeURIComponent(cfg.apiKey)}`);
    // type
    if (params.type !== undefined) {
        kv.push(`${encodeURIComponent(cfg.typeParam)}=${encodeURIComponent(String(params.type))}`);
    }
    // is_filter/is_filer (default 1 if neither provided)
    const isFilterKey: string = cfg.isFilterParam ? cfg.isFilterParam : 'is_filter';
    const isFilerKey: string = cfg.isFilerParam ? cfg.isFilerParam : 'is_filer';
    const hasFilter: boolean = (params.is_filter !== undefined) || (params.is_filer !== undefined);
    if (hasFilter) {
        if (params.is_filter !== undefined) {
            kv.push(`${encodeURIComponent(isFilterKey)}=${encodeURIComponent(String(params.is_filter))}`);
        }
        if (params.is_filer !== undefined) {
            kv.push(`${encodeURIComponent(isFilerKey)}=${encodeURIComponent(String(params.is_filer))}`);
        }
    }
    else {
        // default per request: is_filter=0
        kv.push(`${encodeURIComponent(isFilterKey)}=0`);
    }
    // pagination
    const page: number = (params.page !== undefined) ? params.page as number : 1;
    const size: number = (params.size !== undefined) ? params.size as number : cfg.defaultSize;
    kv.push(`${encodeURIComponent(cfg.pageParam)}=${encodeURIComponent(String(page))}`);
    kv.push(`${encodeURIComponent(cfg.sizeParam)}=${encodeURIComponent(String(size))}`);
    // extra pairs
    if (params.extra && params.extra.length > 0) {
        for (let i = 0; i < params.extra.length; i++) {
            const pair = params.extra[i];
            if (!pair || !pair.key)
                continue;
            kv.push(`${encodeURIComponent(pair.key)}=${encodeURIComponent(String(pair.value))}`);
        }
    }
    const qs: string = kv.length > 0 ? `?${kv.join('&')}` : '';
    const full: string = `${cfg.endpoint}${qs}`;
    const masked: string = maskApiKey(full);
    console.info('buildNewsApiUrl ->', masked);
    return full;
}
