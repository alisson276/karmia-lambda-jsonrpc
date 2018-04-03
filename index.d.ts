import KarmiaConverterJSONRPC = require('karmia-converter-jsonrpc');

declare class KarmiaLambdaJSONRPCMethod {
    converter: KarmiaConverterJSONRPC;
    methods: object;

    constructor(options?: object);
    set(key: object|string, value?: Function): KarmiaLambdaJSONRPCMethod;
    clear(): KarmiaLambdaJSONRPCMethod;
    get(path?: string): Function|object|undefined;
    list(): object;
    call(event: object, context: object, body: Array<object>|object, parameters?: object): Promise<any>;
}

declare class KarmiaLambdaJSONRPC {
    methods: KarmiaLambdaJSONRPCMethod;
    converter: KarmiaConverterJSONRPC;
    parameters: object;

    constructor(methods?: object);
    set(key: object|string, value?: any): KarmiaLambdaJSONRPC;
    clear(): KarmiaLambdaJSONRPC;
    get(path?: string): any;
    list(): object;
    call(event: object, context: object, body: Array<object>|object): Promise<any>;
}

export = KarmiaLambdaJSONRPC;
