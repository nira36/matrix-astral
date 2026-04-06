// Minimal type declarations for lunar-javascript (untyped JS library).
// Only the methods we actually use.

declare module 'lunar-javascript' {
  export interface JieQi {
    getName(): string
  }

  export interface DaYun {
    getStartYear(): number
    getEndYear(): number
    getStartAge(): number
    getGanZhi(): string
  }

  export interface Yun {
    getDaYun(): DaYun[]
  }

  export interface EightChar {
    getYear(): string
    getMonth(): string
    getDay(): string
    getTime(): string
    getYearGan(): string
    getYearZhi(): string
    getMonthGan(): string
    getMonthZhi(): string
    getDayGan(): string
    getDayZhi(): string
    getTimeGan(): string
    getTimeZhi(): string
    getYearWuXing(): string
    getMonthWuXing(): string
    getDayWuXing(): string
    getTimeWuXing(): string
    getYearShiShenGan(): string
    getMonthShiShenGan(): string
    getDayShiShenGan(): string
    getTimeShiShenGan(): string
    getYearHideGan(): string[]
    getMonthHideGan(): string[]
    getDayHideGan(): string[]
    getTimeHideGan(): string[]
    getYearNaYin(): string
    getMonthNaYin(): string
    getDayNaYin(): string
    getTimeNaYin(): string
    getYun(gender: number): Yun
  }

  export interface Lunar {
    getEightChar(): EightChar
    getJieQi(): string
    getPrevJieQi(): JieQi
    getCurrentJieQi(): JieQi | null
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
  }

  export interface SolarStatic {
    fromYmd(year: number, month: number, day: number): Solar
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar
  }

  export interface Solar {
    getLunar(): Lunar
  }

  export const Solar: SolarStatic
  export const Lunar: { fromYmd(year: number, month: number, day: number): Lunar }
}
