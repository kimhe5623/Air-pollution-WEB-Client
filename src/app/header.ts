import { NgModule } from '@angular/core';

export const MSGTYPE = {
    SGU_REQ: 101, SGU_RSP: 102,
    UVC_REQ: 103, UVC_RSP: 104,
    SGI_REQ: 105, SGI_RSP: 106,
    SGO_NOT: 107, SGO_ACK: 108,
    UPC_REQ: 109, UPC_RSP: 110,
    FPU_REQ: 111, FPU_RSP: 112,
    UDR_REQ: 113, UDR_RSP: 114,
    AUV_REQ: 115, AUV_RSP: 116,
    ASR_REQ: 117, ASR_RSP: 118,
    ASD_REQ: 119, ASD_RSP: 120,
    ASV_REQ: 121, ASV_RSP: 122,
    SRG_REQ: 123, SRG_RSP: 124,
    SAS_REQ: 125, SAS_RSP: 126,
    SDD_REQ: 127, SDD_RSP: 128,
    SLV_REQ: 129, SLV_RSP: 130,
    RAV_REQ: 131, RAV_RSP: 132,
    RHV_REQ: 133, RHV_RSP: 134,
    HAV_REQ: 135, HAV_RSP: 136,
    SHR_REQ: 137, SHR_RSP: 138,
    HHV_REQ: 139, HHV_RSP: 140,
    KAS_REQ: 141, KAS_RSP: 142,
};

export const TIMER = {
    T401: 50, T402: 50,
    T403: 50, T404: 50,
    T405: 50, T406: 50,
    T407: 50, T408: 50,
    T409: 50, T410: 50,
    T411: 50, T422: 50,
    T413: 50, T414: 50,
    T415: 50, T416: 50,
    T417: 50, T418: 50,
    T419: 50, T420: 50,
    T421: 50,

    T551: 300, T552: 30000,
    T553: 3000, T554: 3000,
}

export const RETRIVE = {
    R401: 5, R402: 5,
    R403: 5, R404: 5,
    R405: 5, R406: 5,
    R407: 5, R408: 5,
    R409: 5, R410: 5,
    R411: 5, R412: 5,
    R413: 5, R414: 5,
    R415: 5, R416: 5,
    R417: 5, R418: 5,
    R419: 5, R420: 5,
    R421: 5,
}

export const OPERATOR = {
    and:    0b00,
    or:     0b01,
    not:    0b10

}

@NgModule()

export class Header { }
