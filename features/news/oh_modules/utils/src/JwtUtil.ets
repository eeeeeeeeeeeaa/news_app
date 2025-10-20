/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * JWT载荷接口
 */
interface JwtPayload {
  sub?: string;  // 用户ID
  iat?: number;  // 签发时间
  exp?: number;  // 过期时间
}

/**
 * JWT工具类 - 用于解析和验证JWT令牌
 */
export class JwtUtil {
  /**
   * Base64解码函数
   * @param str Base64编码的字符串
   * @returns 解码后的字符串
   */
  private static base64UrlToBase64(input: string): string {
    // 将 Base64Url 转换为标准 Base64，并补齐 '='
    const replaced: string = input.replace(/-/g, '+').replace(/_/g, '/');
    const paddingNeeded: number = (4 - (replaced.length % 4)) % 4;
    return replaced + '='.repeat(paddingNeeded);
  }

  private static base64Decode(base64: string): number[] {
    // 纯 ArkTS Base64 解码实现，避免依赖 atob
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const output: number[] = [];
    let i: number = 0;
    while (i < base64.length) {
      const enc1: number = chars.indexOf(base64.charAt(i++));
      const enc2: number = chars.indexOf(base64.charAt(i++));
      const enc3: number = chars.indexOf(base64.charAt(i++));
      const enc4: number = chars.indexOf(base64.charAt(i++));

      if (enc1 < 0 || enc2 < 0 || enc3 < 0 || enc4 < 0) {
        break;
      }

      const chr1: number = (enc1 << 2) | (enc2 >> 4);
      const chr2: number = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3: number = ((enc3 & 3) << 6) | enc4;

      output.push(chr1);
      if (enc3 !== 64) {
        output.push(chr2);
      }
      if (enc4 !== 64) {
        output.push(chr3);
      }
    }
    return output;
  }

  private static utf8Decode(bytes: number[]): string {
    // 简单 UTF-8 解码器，满足解析 JWT JSON 的需要
    let result: string = '';
    for (let i: number = 0; i < bytes.length;) {
      const b0: number = bytes[i++];
      if ((b0 & 0x80) === 0) {
        result += String.fromCharCode(b0);
        continue;
      }
      if ((b0 & 0xe0) === 0xc0) {
        const b1: number = bytes[i++];
        const code: number = ((b0 & 0x1f) << 6) | (b1 & 0x3f);
        result += String.fromCharCode(code);
        continue;
      }
      if ((b0 & 0xf0) === 0xe0) {
        const b1: number = bytes[i++];
        const b2: number = bytes[i++];
        const code: number = ((b0 & 0x0f) << 12) | ((b1 & 0x3f) << 6) | (b2 & 0x3f);
        result += String.fromCharCode(code);
        continue;
      }
      // 处理四字节字符
      const b1: number = bytes[i++];
      const b2: number = bytes[i++];
      const b3: number = bytes[i++];
      const codePoint: number = ((b0 & 0x07) << 18) | ((b1 & 0x3f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
      const offset: number = codePoint - 0x10000;
      const lead: number = 0xd800 + ((offset >> 10) & 0x3ff);
      const trail: number = 0xdc00 + (offset & 0x3ff);
      result += String.fromCharCode(lead, trail);
    }
    return result;
  }

  /**
   * 解析JWT令牌
   * @param token JWT令牌
   * @returns 解析后的载荷信息
   */
  public static parseJwt(token: string): JwtPayload | null {
    try {
      // JWT格式：header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // 解码payload部分
      const payload: string = parts[1];
      const base64: string = JwtUtil.base64UrlToBase64(payload);

      // Base64解码 + UTF-8 解码
      const bytes: number[] = JwtUtil.base64Decode(base64);
      const jsonPayload: string = JwtUtil.utf8Decode(bytes);
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error('JWT解析失败:', error);
      return null;
    }
  }

  /**
   * 检查JWT是否过期
   * @param token JWT令牌
   * @returns 是否过期
   */
  public static isTokenExpired(token: string): boolean {
    try {
      const payload = JwtUtil.parseJwt(token);
      if (!payload || !payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('JWT过期检查失败:', error);
      return true;
    }
  }

  /**
   * 从JWT中获取用户ID
   * @param token JWT令牌
   * @returns 用户ID
   */
  public static getUserIdFromToken(token: string): number | null {
    try {
      const payload = JwtUtil.parseJwt(token);
      return payload && payload.sub ? parseInt(payload.sub) : null;
    } catch (error) {
      console.error('获取用户ID失败:', error);
      return null;
    }
  }

  /**
   * 获取JWT签发时间
   * @param token JWT令牌
   * @returns 签发时间（时间戳）
   */
  public static getIssuedAt(token: string): number | null {
    try {
      const payload = JwtUtil.parseJwt(token);
      return payload ? payload.iat || null : null;
    } catch (error) {
      console.error('获取签发时间失败:', error);
      return null;
    }
  }

  /**
   * 获取JWT过期时间
   * @param token JWT令牌
   * @returns 过期时间（时间戳）
   */
  public static getExpirationTime(token: string): number | null {
    try {
      const payload = JwtUtil.parseJwt(token);
      return payload ? payload.exp || null : null;
    } catch (error) {
      console.error('获取过期时间失败:', error);
      return null;
    }
  }

  /**
   * 验证JWT格式是否正确
   * @param token JWT令牌
   * @returns 格式是否正确
   */
  public static isValidFormat(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取JWT剩余有效时间（秒）
   * @param token JWT令牌
   * @returns 剩余有效时间，-1表示已过期或无效
   */
  public static getRemainingTime(token: string): number {
    try {
      const exp = JwtUtil.getExpirationTime(token);
      if (!exp) {
        return -1;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const remaining = exp - currentTime;
      return remaining > 0 ? remaining : -1;
    } catch (error) {
      console.error('获取剩余时间失败:', error);
      return -1;
    }
  }
}
