import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefresh } from "../types/auth.types";
import { Request } from 'express';
declare const RefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    constructor(config: ConfigService);
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefresh;
}
export {};
