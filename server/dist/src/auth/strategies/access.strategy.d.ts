import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const AccessStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AccessStrategy extends AccessStrategy_base {
    constructor(config: ConfigService);
    validate(payload: any): any;
}
export {};
