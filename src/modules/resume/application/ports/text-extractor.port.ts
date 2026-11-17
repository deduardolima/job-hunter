export const TEXT_EXTRACTOR = Symbol('TEXT_EXTRACTOR');
export interface TextExtractorPort {
  extract(buffer: Buffer, mimetype: string, filename: string): Promise<string>;
}
