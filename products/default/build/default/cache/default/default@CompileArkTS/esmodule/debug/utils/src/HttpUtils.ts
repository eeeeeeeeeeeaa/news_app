import http from "@ohos:net.http";
import type { BusinessError as BusinessError } from "@ohos:base";
export class HttpUtils {
    private static toText(result: string | Uint8Array | undefined | null): string {
        if (typeof result === 'string') {
            return result;
        }
        // 添加二进制数据处理逻辑（来自第二个代码）
        if (result instanceof Uint8Array) {
            let out = '';
            const len = result.length;
            for (let i = 0; i < len; i++) {
                out += String.fromCharCode(result[i]);
            }
            try {
                return decodeURIComponent(escape(out));
            }
            catch (_) {
                return out;
            }
        }
        return '';
    }
    // 以下保持第一个代码的所有结构和功能不变
    private static getDefaultHeaders(): Record<string, string> {
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'Accept': 'application/json,text/plain,*/*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        };
    }
    private static getDefaultPostHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
        };
    }
    private static getDefaultFormHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
        };
    }
    private static mergeHeaders(defaultHeaders: Record<string, string>, customHeaders?: Record<string, string>): Record<string, string> {
        if (!customHeaders) {
            return defaultHeaders;
        }
        const merged: Record<string, string> = {};
        const defaultKeys: string[] = Object.keys(defaultHeaders);
        for (let i: number = 0; i < defaultKeys.length; i++) {
            const key: string = defaultKeys[i];
            merged[key] = defaultHeaders[key];
        }
        const customKeys: string[] = Object.keys(customHeaders);
        for (let i: number = 0; i < customKeys.length; i++) {
            const key: string = customKeys[i];
            merged[key] = customHeaders[key];
        }
        return merged;
    }
    private static encodeFormData(formData: object): string {
        const keys: string[] = Object.keys(formData as Record<string, string | undefined>);
        const pairs: string[] = [];
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i];
            const value: string = (formData as Record<string, string | undefined>)[key] ?? '';
            pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
        return pairs.join('&');
    }
    static async get(url: string, headers?: Record<string, string>): Promise<string> {
        return new Promise((resolve, reject) => {
            const httpRequest: http.HttpRequest = http.createHttp();
            const mergedHeaders: Record<string, string> = HttpUtils.mergeHeaders(HttpUtils.getDefaultHeaders(), headers);
            const options: http.HttpRequestOptions = {
                method: http.RequestMethod.GET,
                header: mergedHeaders,
                connectTimeout: 15000,
                readTimeout: 15000
            };
            httpRequest.request(url, options).then((response: http.HttpResponse) => {
                if (response.responseCode === 200) {
                    resolve(HttpUtils.toText(response.result as string));
                }
                else {
                    reject(new Error('HTTP request failed: ' + response.responseCode));
                }
            }).catch((error: BusinessError) => {
                reject(new Error('HTTP exception: ' + error.message));
            }).finally(() => {
                httpRequest.destroy();
            });
        });
    }
    static async post(url: string, data: string, headers?: Record<string, string>): Promise<string> {
        return new Promise((resolve, reject) => {
            const httpRequest: http.HttpRequest = http.createHttp();
            const mergedHeaders: Record<string, string> = HttpUtils.mergeHeaders(HttpUtils.getDefaultPostHeaders(), headers);
            const options: http.HttpRequestOptions = {
                method: http.RequestMethod.POST,
                header: mergedHeaders,
                extraData: data,
                connectTimeout: 15000,
                readTimeout: 15000
            };
            httpRequest.request(url, options).then((response: http.HttpResponse) => {
                if (response.responseCode === 200) {
                    resolve(HttpUtils.toText(response.result as string));
                }
                else {
                    reject(new Error('HTTP request failed: ' + response.responseCode));
                }
            }).catch((error: BusinessError) => {
                reject(new Error('HTTP exception: ' + error.message));
            }).finally(() => {
                httpRequest.destroy();
            });
        });
    }
    static async postForm(url: string, formData: object, headers?: Record<string, string>): Promise<string> {
        const encoded: string = HttpUtils.encodeFormData(formData);
        console.log('🔍 [HttpUtils.postForm] URL:', url);
        console.log('🔍 [HttpUtils.postForm] 原始formData:', JSON.stringify(formData));
        console.log('🔍 [HttpUtils.postForm] 编码后的数据:', encoded);
        return new Promise((resolve, reject) => {
            const httpRequest: http.HttpRequest = http.createHttp();
            const mergedHeaders: Record<string, string> = HttpUtils.mergeHeaders(HttpUtils.getDefaultFormHeaders(), headers);
            const options: http.HttpRequestOptions = {
                method: http.RequestMethod.POST,
                header: mergedHeaders,
                extraData: encoded,
                connectTimeout: 15000,
                readTimeout: 15000
            };
            httpRequest.request(url, options).then((response: http.HttpResponse) => {
                if (response.responseCode === 200) {
                    resolve(HttpUtils.toText(response.result as string));
                }
                else {
                    reject(new Error('HTTP request failed: ' + response.responseCode));
                }
            }).catch((error: BusinessError) => {
                reject(new Error('HTTP exception: ' + error.message));
            }).finally(() => {
                httpRequest.destroy();
            });
        });
    }
}
