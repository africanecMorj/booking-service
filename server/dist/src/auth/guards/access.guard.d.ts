declare const AccessGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AccessGuard extends AccessGuard_base {
    handleRequest(err: any, user: any, info: any): any;
}
export {};
