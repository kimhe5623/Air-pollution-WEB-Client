import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor() { }

  /** MsgPacking (if EP is tci, EP == null) */
  packingMsg(payload: any, msgType: number, EP: string): any {

    if (EP == null) {
      EP = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 3);
    }

    var packedMsg: any = {
      "header": {
        "msgType": msgType,
        "msgLen": ~-encodeURI(JSON.stringify(payload)).split(/%..|./).length,
        "endpointId": EP
      },
      "payload": payload
    }
    return packedMsg;
  }

  /** Header check */
  isValidHeader(header: any, msgType: number, EP: string): boolean {
    if (header.endpointId != EP) {
      console.log("Invalid endpointId");
      return false;
    }
    else if (header.msgType != msgType) {
      console.log("Invalid msgType");
      return false;
    }
    else return true;
  }
}
