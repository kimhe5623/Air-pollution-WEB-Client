import { Injectable } from '@angular/core';
import { HEADER } from 'src/app/header';
import { StateMachineManagementService } from './state-machine-management.service';
import { DisplayMessageService } from './display-message.service';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor(
    private stateService: StateMachineManagementService,
    private dispMsgService: DisplayMessageService
  ) { }

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

    this.dispMsgService.printLog(['PACK', 'MSG', 'MsgType: '+msgType.toString()]);
    return packedMsg;
  }

  /** Header check */
  fnVerifyMsgHeader(rspMsg: any, msgType: number, EP: string): boolean {
    var isCorrect: boolean;
    var msg: string;

    if (rspMsg.header.endpointId != EP) {
      msg = "Invalid endpointId";
      isCorrect = HEADER.RES_FAILD;
    }
    else if(!this.stateService.fnStateOfUsnCheck(msgType)) {
      msg = "Invalid currentState";
      isCorrect = HEADER.RES_FAILD;
    }
    else if (rspMsg.header.msgType != msgType) {
      msg = "Invalid msgType";
      isCorrect = HEADER.RES_FAILD;
    }
    // else if (rspMsg.header.msgLen != ~-encodeURI(JSON.stringify(rspMsg.payload)).split(/%..|./).length) {
    //   msg = "Invalid msgLen";
    //   isCorrect = HEADER.RES_FAILD;
    // }
    else {
      msg = "OK"
      isCorrect = HEADER.RES_SUCCESS;
    }

    this.dispMsgService.printLog(['VRFY', 'HDR', msg]);

    return isCorrect;
  }
}
