import {KarmiaConverterJSONRPC} from "karmia-converter-jsonrpc";

declare module KarmiaLambda {
    class KarmiaLambdaJSONRPCMethod {
        converter: KarmiaConverterJSONRPC;
        methods: Object;

        constructor(options: Object|null);
        set(key: object|string, value: Function|null|undefined): KarmiaLambdaJSONRPCMethod;
        clear(): KarmiaLambdaJSONRPCMethod;
        get(path: null|string|undefined): Function|Object|undefined;
        list(): Object;
        call(event: Object, context: Object, body: Array<Object>|Object, parameters: Object): Promise;
    }

    export class KarmiaLambdaJSONRPC {
        methods: KarmiaLambdaJSONRPCMethod;
        converter: KarmiaConverterJSONRPC;
        parameters: Object;

        constructor(methods: Object|null|undefined);
        set(key: Object|string, value:any): KarmiaLambdaJSONRPC;
        clear(): KarmiaLambdaJSONRPC;
        get(path: null|string|undefined): any;
        list(): Object;
        call(event: Object, context: Object, body: Array<Object>|Object): Promise;
    }
}
