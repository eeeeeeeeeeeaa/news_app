export interface BackendConfigShape {
    baseUrl: string; // e.g. http://localhost:8080
}
// 可在打包前或运行时轻松修改此处 baseUrl
export const BackendConfig: BackendConfigShape = {
    baseUrl: 'http://hmos.w1.luyouxia.net'
};
export function withBase(path: string): string {
    const trimmed = path.startsWith('/') ? path : `/${path}`;
    let base = BackendConfig.baseUrl;
    if (base.endsWith('/')) {
        base = base.substring(0, base.length - 1);
    }
    return `${base}${trimmed}`;
}
export interface ResultShape<T> {
    code: number;
    message: string;
    data: T | null;
}
export interface LoginParams {
    userPhone: string;
    userPassword: string;
}
export interface RegisterParams extends LoginParams {
    userName?: string;
}
