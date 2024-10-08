import { Log } from '../log';
import { LogService } from '../log.service';

export class HtmlLogService extends LogService {
  public static _instance: HtmlLogService;

  private constructor() {
    super();
  }

  public static get instance(): HtmlLogService {
    if (!HtmlLogService._instance) {
        HtmlLogService._instance = new HtmlLogService();
    }
    return HtmlLogService._instance;
}

  protected async handleGenerateRelatory(logs: Log[]): Promise<string> {
    return logs.map(log => {
      return `
        <div>
          <h2>Log ${log.id}</h2>
          <p>Event: ${log.event}</p>
          <p>Old Value: ${log.oldValue}</p>
          <p>New Value: ${log.newValue}</p>
          <p>Timestamp: ${log.timestamp.toString()}</p>
        </div>
      `;
    }).reduce((html, current) => {
      return html + current;
    }, '<html><body>')
    + '</body></html>';
  }
}