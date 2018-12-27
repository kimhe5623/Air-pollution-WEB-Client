import { Injectable } from '@angular/core';
import { HEADER } from 'src/app/header';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor() { }

  /** MsgPacking (if EP is tci, EP == null) */
  fnPackingMsg(payload: any, msgType: number, EP: number): any {

    if (EP == null) {
      EP = Number(Math.random().toString(36).replace(/[^0-9]+/g, '').substr(0, 3));
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
  fnVerifyMsgHeader(rspMsg: any, msgType: number, EP: string): boolean {
    if (rspMsg.header.endpointId != EP) {
      console.log("Invalid endpointId");
      return HEADER.RES_FAILD;
    }
    else if (rspMsg.header.msgType != msgType) {
      console.log("Invalid msgType");
      return HEADER.RES_FAILD;
    }
    /*else if (rspMsg.header.msgLen != ~-encodeURI(JSON.stringify(rspMsg.payload)).split(/%..|./).length) {
      console.log("Damaged message");
      return HEADER.RES_FAILD;
    }*/
    else return HEADER.RES_SUCCESS;
  }
}
