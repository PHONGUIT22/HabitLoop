declare module "luxon" {
  export interface DateTimeOptions {
    zone?: string | { name: string };
    locale?: string;
    numberingSystem?: string;
    outputCalendar?: string;
  }

  export interface DateTime {
    // Properties
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    readonly weekday: number; // 1-7 (Mon-Sun)
    readonly weekNumber: number;
    readonly weekYear: number;
    readonly ordinal: number;
    readonly zoneName: string;
    readonly offset: number;
    readonly offsetNameShort: string;
    readonly offsetNameLong: string;
    readonly isValid: boolean;
    readonly invalidReason?: string;
    readonly invalidExplanation?: string;

    // Instance methods
    toFormat(format: string): string;
    toISO(options?: {
      includeOffset?: boolean;
      suppressMilliseconds?: boolean;
      suppressSeconds?: boolean;
    }): string | null;
    toJSDate(): Date;
    toMillis(): number;
    toSeconds(): number;
    toUnixInteger(): number;
    startOf(
      unit: "year" | "month" | "day" | "hour" | "minute" | "second" | "week"
    ): DateTime;
    endOf(
      unit: "year" | "month" | "day" | "hour" | "minute" | "second" | "week"
    ): DateTime;
    plus(duration: any): DateTime;
    minus(duration: any): DateTime;
    setZone(zone: string | { name: string }): DateTime;
    setLocale(locale: string): DateTime;
    toUTC(): DateTime;
    toLocal(): DateTime;
    diff(other: DateTime, unit?: string | string[]): any;
    equals(other: DateTime): boolean;
    hasSame(other: DateTime, unit: string): boolean;
    isBefore(other: DateTime): boolean;
    isAfter(other: DateTime): boolean;
    isBetween(start: DateTime, end: DateTime): boolean;
  }

  export class DateTime {
    constructor(options?: DateTimeOptions);

    // Static methods
    static local(options?: DateTimeOptions): DateTime;
    static utc(options?: DateTimeOptions): DateTime;
    static now(options?: DateTimeOptions): DateTime;
    static fromISO(iso: string, options?: DateTimeOptions): DateTime;
    static fromJSDate(date: Date, options?: DateTimeOptions): DateTime;
    static fromMillis(ms: number, options?: DateTimeOptions): DateTime;
    static fromSeconds(seconds: number, options?: DateTimeOptions): DateTime;
    static fromObject(obj: any, options?: DateTimeOptions): DateTime;
  }
}
