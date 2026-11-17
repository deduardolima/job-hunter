import { BadRequestException, Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { TextExtractorPort } from '../../application/ports/text-extractor.port';

@Injectable()
export class TextExtractorAdapter implements TextExtractorPort {
  async extract(buffer: Buffer, mimetype: string, filename: string) {
    const name = filename.toLowerCase();
    if (mimetype === 'application/pdf' || name.endsWith('.pdf'))
      return (await pdfParse(buffer)).text;
    if (name.endsWith('.docx'))
      return (await mammoth.extractRawText({ buffer })).value;
    if (name.endsWith('.md') || name.endsWith('.txt')) return buffer.toString('utf8');
    throw new BadRequestException(`Formato não suportado: ${filename}`);
  }
}
