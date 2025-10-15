import http from "@ohos:net.http";
import type { BusinessError as BusinessError } from "@ohos:base";
export class HttpUtils {
    private static toText(result: string | Uint8Array | undefined | null): string {
        if (typeof result === 'string') {
            return result;
        }
        // ArkTS http 在文本场景通常返回 string，这里保守返回空字符串
        return '';
    }
    static async get(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const httpRequest: http.HttpRequest = http.createHttp();
            const options: http.HttpRequestOptions = {
                method: http.RequestMethod.GET,
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
                    'Accept': 'application/json,text/plain,*/*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                },
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
    static async post(url: string, data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const httpRequest: http.HttpRequest = http.createHttp();
            const options: http.HttpRequestOptions = {
                method: http.RequestMethod.POST,
                header: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
                },
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
}
