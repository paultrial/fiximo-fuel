import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  constructor() { }

  async recognizePumpData(imageSource: string): Promise<{ liters: number }> {
    const worker = await createWorker('eng');

    // We can use a narrow whitelist for fuel pumps (numbers and dots)
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789.',
    });

    const { data: { text } } = await worker.recognize(imageSource);
    await worker.terminate();

    // Basic parsing logic: find the first number that looks like liters
    const matches = text.match(/\d+(\.\d+)?/g);
    const results = (matches || []).map(m => parseFloat(m));

    return {
      liters: results[0] || 0
    };
  }
}
