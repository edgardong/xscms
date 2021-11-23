declare interface Ret {
	end(): void;
	write(): void;
	statusCode : number;
	writeHead(statusCode : any): void;
}
type Ret = ((ctx : any, next : any) => any);

declare function makeInjectedResponse(koaCtx : any, whenEnded : any): Ret;
declare function handler(ctx : any, connectMiddleware : any): Promise;
declare function koa2Connect(connectMiddleware : any): Ret;

declare module "koa2-connect" {}
declare namespace koa2Connect {}
export = koa2Connect;