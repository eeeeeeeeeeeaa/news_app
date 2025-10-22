import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';

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
      } catch (_) {
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

      console.log('🔍 [HttpUtils.get] URL:', url);
      console.log('🔍 [HttpUtils.get] 请求头:', JSON.stringify(mergedHeaders));

      const options: http.HttpRequestOptions = {
        method: http.RequestMethod.GET,
        header: mergedHeaders,
        connectTimeout: 15000,
        readTimeout: 15000
      };

      httpRequest.request(url, options).then((response: http.HttpResponse) => {
        console.log('🔍 [HttpUtils.get] 响应状态码:', response.responseCode);
        console.log('🔍 [HttpUtils.get] 响应数据:', HttpUtils.toText(response.result as string));
        
        if (response.responseCode === 200) {
          resolve(HttpUtils.toText(response.result as string));
        } else {
          // 读取响应体以获取详细错误信息
          const responseBody = HttpUtils.toText(response.result as string);
          reject(new Error(`HTTP ${response.responseCode}: ${responseBody}`));
        }
      }).catch((error: BusinessError) => {
        console.error('🔍 [HttpUtils.get] 请求异常:', error.message);
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
        console.log('🔍 [HttpUtils.post] 响应状态码:', response.responseCode);
        console.log('🔍 [HttpUtils.post] 响应数据:', HttpUtils.toText(response.result as string));
        
        if (response.responseCode === 200) {
          resolve(HttpUtils.toText(response.result as string));
        } else {
          // 读取响应体以获取详细错误信息
          const responseBody = HttpUtils.toText(response.result as string);
          reject(new Error(`HTTP ${response.responseCode}: ${responseBody}`));
        }
      }).catch((error: BusinessError) => {
        console.error('🔍 [HttpUtils.post] 请求异常:', error.message);
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
        console.log('🔍 [HttpUtils.postForm] ========== 响应详情 ==========');
        console.log('🔍 [HttpUtils.postForm] 响应状态码:', response.responseCode);
        console.log('🔍 [HttpUtils.postForm] 响应头数量:', Object.keys(response.header).length);
        console.log('🔍 [HttpUtils.postForm] 响应头详情:', JSON.stringify(response.header, null, 2));
        
        const responseBody = HttpUtils.toText(response.result as string);
        console.log('🔍 [HttpUtils.postForm] 响应数据类型:', typeof response.result);
        console.log('🔍 [HttpUtils.postForm] 响应原始数据:', response.result);
        console.log('🔍 [HttpUtils.postForm] 响应数据长度:', responseBody.length);
        console.log('🔍 [HttpUtils.postForm] 响应数据内容:', responseBody);
        console.log('🔍 [HttpUtils.postForm] 响应数据是否为空:', responseBody === '');
        console.log('🔍 [HttpUtils.postForm] 响应数据是否只包含空白字符:', responseBody.trim() === '');
        console.log('🔍 [HttpUtils.postForm] ================================');
        
        if (response.responseCode === 200) {
          resolve(responseBody);
        } else {
          // 读取响应体以获取详细错误信息
          const errorMsg = responseBody ? `HTTP ${response.responseCode}: ${responseBody}` : `HTTP ${response.responseCode}: (空响应体)`;
          console.error('❌ [HttpUtils.postForm] 请求失败:', errorMsg);
          reject(new Error(errorMsg));
        }
      }).catch((error: BusinessError) => {
        console.error('❌ [HttpUtils.postForm] ========== 请求异常 ==========');
        console.error('❌ [HttpUtils.postForm] 异常类型:', typeof error);
        console.error('❌ [HttpUtils.postForm] 异常消息:', error.message);
        console.error('❌ [HttpUtils.postForm] 异常代码:', error.code);
        console.error('❌ [HttpUtils.postForm] 异常堆栈:', error.stack);
        console.error('❌ [HttpUtils.postForm] 完整异常对象:', JSON.stringify(error, null, 2));
        console.error('❌ [HttpUtils.postForm] ================================');
        reject(new Error('HTTP exception: ' + error.message));
      }).finally(() => {
        console.log('🔍 [HttpUtils.postForm] 请求完成，销毁连接');
        httpRequest.destroy();
      });
    });
  }

  static async delete(url: string, headers?: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
      const httpRequest: http.HttpRequest = http.createHttp();
      const mergedHeaders: Record<string, string> = HttpUtils.mergeHeaders(HttpUtils.getDefaultHeaders(), headers);

      const options: http.HttpRequestOptions = {
        method: http.RequestMethod.DELETE,
        header: mergedHeaders,
        connectTimeout: 15000,
        readTimeout: 15000
      };

      httpRequest.request(url, options).then((response: http.HttpResponse) => {
        console.log('🔍 [HttpUtils.delete] 响应状态码:', response.responseCode);
        console.log('🔍 [HttpUtils.delete] 响应数据:', HttpUtils.toText(response.result as string));
        
        if (response.responseCode === 200) {
          resolve(HttpUtils.toText(response.result as string));
        } else {
          // 读取响应体以获取详细错误信息
          const responseBody = HttpUtils.toText(response.result as string);
          reject(new Error(`HTTP ${response.responseCode}: ${responseBody}`));
        }
      }).catch((error: BusinessError) => {
        console.error('🔍 [HttpUtils.delete] 请求异常:', error.message);
        reject(new Error('HTTP exception: ' + error.message));
      }).finally(() => {
        httpRequest.destroy();
      });
    });
  }
}

