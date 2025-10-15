import { HttpUtils } from './HttpUtils';

export interface BaiduHotSearchItem {
  card_title: string;
  linkurl: string;
  heat_score: string;
  hotTags: string;
  index: string;
  imageUrl?: string;
  rawUrl?: string;
}

export class BaiduHotSearchItemModel implements BaiduHotSearchItem {
  card_title: string;
  linkurl: string;
  heat_score: string;
  hotTags: string;
  index: string;
  imageUrl?: string;
  rawUrl?: string;
  constructor(card_title: string, linkurl: string, heat_score: string, hotTags: string, index: string, imageUrl?: string, rawUrl?: string) {
    this.card_title = card_title;
    this.linkurl = linkurl;
    this.heat_score = heat_score;
    this.hotTags = hotTags;
    this.index = index;
    this.imageUrl = imageUrl;
    this.rawUrl = rawUrl;
  }
}

interface RealtimeItem {
  card_title?: string;
  linkurl?: string;
  heat_score?: string | number;
  hotTags?: string | number;
  index?: string | number;
  title?: string;
  word?: string;
  query?: string;
  url?: string;
  rawUrl?: string;
  hotScore?: string | number;
  hotTag?: string | number;
  img?: string;
}

class RealtimeCard { content?: RealtimeItem[] }
class RealtimeRoot { cards?: RealtimeCard[] }
class RealtimeData { data?: RealtimeRoot; content?: RealtimeItem[] }

export class BaiduHotSearchParser {
  private static readonly API_URL = 'https://top.baidu.com/api/board?platform=pc&tab=realtime';

  static async getHotSearchData(): Promise<BaiduHotSearchItem[]> {
    try {
      const json = await HttpUtils.get(BaiduHotSearchParser.API_URL);
      const list = BaiduHotSearchParser.parseRealtimeJson(json);
      if (list.length > 0) {
        return list;
      }
      return BaiduHotSearchParser.getMockHotSearchData();
    } catch (_) {
      return BaiduHotSearchParser.getMockHotSearchData();
    }
  }

  private static parseRealtimeJson(jsonStr: string): BaiduHotSearchItem[] {
    if (!jsonStr) return [];
    try {
      const parsed: Object = JSON.parse(jsonStr);
      const data: RealtimeData = parsed as RealtimeData;
      let items: RealtimeItem[] = [];

      const root: RealtimeRoot | undefined = data ? data.data : undefined;
      if (root && root.cards && root.cards.length > 0) {
        const cards: RealtimeCard[] = root.cards;
        for (let i = 0; i < cards.length; i++) {
          const card: RealtimeCard | undefined = cards[i];
          if (card && card.content && card.content.length > 0) {
            items = card.content;
            break;
          }
        }
      }
      const fallbackContent: RealtimeItem[] | undefined = data ? data.content : undefined;
      if (items.length === 0 && fallbackContent && fallbackContent.length > 0) {
        items = fallbackContent;
      }

      const result: BaiduHotSearchItem[] = [];
      for (let i = 0; i < items.length; i++) {
        const current: RealtimeItem | undefined = items[i];
        if (!current) {
          continue;
        }
        const titleCandidate: string | undefined = current.card_title || current.title || current.word || current.query;
        const title: string = titleCandidate ? titleCandidate : '';
        const defaultUrl: string = title.length > 0 ? `https://www.baidu.com/s?wd=${encodeURIComponent(title)}` : '';
        const url: string = current.linkurl || current.url || current.rawUrl || defaultUrl;
        const heatSource: string | number | undefined = current.heat_score || current.hotScore;
        const heat: string = heatSource !== undefined ? String(heatSource) : '';
        const tagSource: string | number | undefined = current.hotTags || current.hotTag;
        const tag: string = tagSource !== undefined ? String(tagSource) : '0';
        const indexSource: string | number | undefined = current.index;
        const idx: string = indexSource !== undefined ? String(indexSource) : String(i);
        const image: string = current.img ? String(current.img) : '';
        const raw: string = current.rawUrl ? String(current.rawUrl) : url;
        if (title.length > 0) {
          result.push(new BaiduHotSearchItemModel(title, url, heat, tag, idx, image, raw));
        }
      }
      return result;
    } catch (e) {
      return [];
    }
  }

  static formatHeatScore(heat: string): string {
    const n = parseInt(heat);
    if (isNaN(n)) { return '0'; }
    if (n >= 10000) { return Math.floor(n / 10000) + '万'; }
    if (n >= 1000) { return Math.floor(n / 1000) + 'k'; }
    return String(n);
  }

  private static getMockHotSearchData(): BaiduHotSearchItem[] {
    return [
      {
        card_title: '哈尔滨下雪了',
        linkurl: 'https://www.baidu.com/s?wd=%E5%93%88%E5%B0%94%E6%BB%A8%E4%B8%8B%E9%9B%AA%E4%BA%86',
        heat_score: '7714268',
        hotTags: '1',
        index: '0',
        imageUrl: '',
        rawUrl: 'https://www.baidu.com/s?wd=%E5%93%88%E5%B0%94%E6%BB%A8%E4%B8%8B%E9%9B%AA%E4%BA%86'
      },
      {
        card_title: '新一股较强冷空气来袭',
        linkurl: 'https://www.baidu.com/s?wd=%E6%96%B0%E4%B8%80%E8%82%A1%E8%BE%83%E5%BC%BA%E5%86%B7%E7%A9%BA%E6%B0%94%E6%9D%A5%E8%A2%AD',
        heat_score: '7618036',
        hotTags: '0',
        index: '1',
        imageUrl: '',
        rawUrl: 'https://www.baidu.com/s?wd=%E6%96%B0%E4%B8%80%E8%82%A1%E8%BE%83%E5%BC%BA%E5%86%B7%E7%A9%BA%E6%B0%94%E6%9D%A5%E8%A2%AD'
      }
    ];
  }
}
