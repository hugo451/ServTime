import { Log } from '../log';
import { LogService } from '../log.service';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export class PdfLogService extends LogService {
    public static _instance: PdfLogService;

    private constructor() {
        super();
    }

    public static get instance(): PdfLogService {
        if (!PdfLogService._instance) {
            PdfLogService._instance = new PdfLogService();
        }
        return PdfLogService._instance;
    }

    protected async handleGenerateRelatory(logs: Log[]): Promise<Buffer> {
        const doc = new PDFDocument();
        let buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        doc.fontSize(16).text('Log Relatory', { align: 'center' });
        doc.moveDown();

        logs.forEach((log) => {
            doc.fontSize(12);
            doc.text(`Log ${log.id}`);
            doc.text(`Event: ${log.event}`);
            doc.text(`Old Value: ${log.oldValue}`);
            doc.text(`New Value: ${log.newValue}`);
            doc.text(`Timestamp: ${log.timestamp.toISOString()}`);
            doc.moveDown();
        });

        doc.end();

        // Return a Promise with the generated PDF in a Buffer
        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });
    }
}
