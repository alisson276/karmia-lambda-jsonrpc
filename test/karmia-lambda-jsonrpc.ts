/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
import KarmiaLambdaJSONRPC = require("../");
const expect = require("expect.js");

// Variables
const jsonrpc = new KarmiaLambdaJSONRPC();
const event = {event: 'event'};
const context = {context: 'context'};

// Classes
class JSONRPCError extends Error {
    code?: number;
    data?: any
}

// RPC
jsonrpc.methods.set('success', function () {
    return Promise.resolve({success: true});
});
jsonrpc.methods.set('error', function () {
    const error = new JSONRPCError('TEST_EXCEPTION');
    error.code = 500;

    return Promise.reject(error);
});
jsonrpc.methods.set('badRequest', function () {
    return Promise.reject(new Error('Bad Request'));
});
jsonrpc.methods.set('internalServerError', function () {
    return Promise.reject(new Error('Internal Server Error'));
});
jsonrpc.methods.set('400', function () {
    const error = new JSONRPCError();
    error.code = 400;

    return Promise.reject(error);
});
jsonrpc.methods.set('500', function () {
    const error = new JSONRPCError();
    error.code = 500;

    return Promise.reject(error);
});


describe('karmia-jsonrpc', function () {
    describe('Parameters', function () {
        it('Should set parameter', function () {
            const rpc = new KarmiaLambdaJSONRPC(),
                key = 'key',
                value = 'value';
            expect(rpc.parameters).to.eql({});
            rpc.set(key, value);
            expect(rpc.parameters[key]).to.be(value);
        });

        it('Should clear parameters', function () {
            const rpc = new KarmiaLambdaJSONRPC(),
                key = 'key',
                value = 'value';
            rpc.set(key, value);
            expect(rpc.parameters[key]).to.be('value');
            rpc.clear();
            expect(rpc.parameters).to.eql({});
        });

        it('Should list parameters', function () {
            const rpc = new KarmiaLambdaJSONRPC(),
                parameters = {
                    value1: 'value1',
                    level2: {
                        value2: 'value2',
                        level3: {
                            value3: 'value3'
                        }
                    }
                };
            rpc.set(parameters);

            expect(rpc.list()).to.eql(parameters);
            expect(rpc.get()).to.eql(parameters);
        });

        describe('Should get parameter', function () {
            it('All parameters', function () {
                const rpc = new KarmiaLambdaJSONRPC(),
                    parameters = {
                        value1: 'value1',
                        level2: {
                            value2: 'value2',
                            level3: {
                                value3: 'value3'
                            }
                        }
                    };
                rpc.set(parameters);

                expect(rpc.get()).to.eql(parameters);
            });

            it('Level 1', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: 'level1'
                } as {[index: string]: any});
                expect(rpc.methods.get('level1')).to.be('level1');
            });

            it('Level 2', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: {
                        level2: 'level2'
                    }
                });
                expect(rpc.methods.get('level1')).to.be.an('object');
                expect(rpc.methods.get('level1.level2')).to.be('level2');
            });

            it('Level 3', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: {
                        level2: {
                            level3: 'level3'
                        }
                    }
                });
                expect(rpc.methods.get('level1')).to.be.an('object');
                expect(rpc.methods.get('level1.level2')).to.be.an('object');
                expect(rpc.methods.get('level1.level2.level3')).to.be('level3');
            });
        });
    });

    describe('Methods', function () {
        it('Should set method', function () {
            const rpc = new KarmiaLambdaJSONRPC();
            expect(rpc.methods.constructor.name).to.be('KarmiaLambdaJSONRPCMethod');
            expect(rpc.methods.methods).to.eql({});
            rpc.methods.set('test', function () {
                return Promise.resolve({success: true});
            });
            expect(rpc.methods.methods.test).to.be.a('function');
        });

        it('Should clear method', function () {
            const rpc = new KarmiaLambdaJSONRPC();
            rpc.methods.set('test', function () {
                return Promise.resolve({success: true});
            });
            expect(rpc.methods.methods.test).to.be.a('function');
            rpc.methods.clear();
            expect(rpc.methods.methods).to.eql({});
        });

        it('Should list methods', function () {
            const rpc = new KarmiaLambdaJSONRPC(),
                functions = {
                    function1: function () {
                        return Promise.resolve({success: true});
                    },
                    level2: {
                        function2: function () {
                            return Promise.resolve({success: true});
                        },
                        level3: {
                            function3: function () {
                                return Promise.resolve({success: true});
                            }
                        }
                    }
                };
            rpc.methods.set(functions);

            expect(rpc.methods.list()).to.eql(functions);
        });

        describe('Should get method', function () {
            it('Level 1', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: function () {
                        return Promise.resolve({success: true});
                    }
                });
                expect(rpc.methods.get('level1')).to.be.a('function');
            });

            it('Level 2', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: {
                        level2: function () {
                            return Promise.resolve({success: true});
                        }
                    }
                });
                expect(rpc.methods.get('level1')).to.be.an('object');
                expect(rpc.methods.get('level1.level2')).to.be.a('function');
            });

            it('Level 3', function () {
                const rpc = new KarmiaLambdaJSONRPC();
                rpc.methods.set({
                    level1: {
                        level2: {
                            level3: function () {
                                return Promise.resolve({success: true});
                            }
                        }
                    }
                });
                expect(rpc.methods.get('level1')).to.be.an('object');
                expect(rpc.methods.get('level1.level2')).to.be.an('object');
                expect(rpc.methods.get('level1.level2.level3')).to.be.a('function');
            });
        });
    });

    describe('RPC', function () {
        describe('RPC request', function () {
            it('success', function (done) {
                const data = {jsonrpc: '2.0', method: 'success', id: 'success'};
                jsonrpc.call(event, context, data).then((result: {[index: string]: any}) => {
                    expect(result.status).to.be(200);
                    expect(result.body.jsonrpc).to.be('2.0');
                    expect(result.body.result).to.eql({success: true});
                    expect(result.body.id).to.be(data.id);

                    done();
                });
            });

            it('fail', function (done) {
                const data = {jsonrpc: '2.0', method: 'error', id: 'error'};
                jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                    expect(result.status).to.be(200);
                    expect(result.body.jsonrpc).to.be('2.0');
                    expect(result.body.error.code).to.eql(500);
                    expect(result.body.error.message).to.eql('TEST_EXCEPTION');
                    expect(result.body.id).to.be(data.id);

                    done();
                });
            });

            it('ID is empty', function (done) {
                const data = {jsonrpc: '2.0', method: 'success', id: ''};
                jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                    expect(result.status).to.be(200);
                    expect(result.body.jsonrpc).to.be('2.0');
                    expect(result.body.result).to.eql({success: true});
                    expect(result.body.id).to.be(data.id);

                    done();
                });
            });
        });

        describe('Notification request', function () {
            it('success', function (done) {
                const data = {jsonrpc: '2.0', method: 'success'};
                jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                    expect(result.status).to.be(204);
                    expect(result.body).to.be(null);

                    done();
                });
            });

            it('fail', function (done) {
                const data = {jsonrpc: '2.0', method: 'error'};
                jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                    expect(result.status).to.be(204);
                    expect(result.body).to.be(null);

                    done();
                });
            });
        });

        it('Batch request', function (done) {
            const data = [
                {jsonrpc: '2.0', method: 'success', id: 'success'},
                {jsonrpc: '2.0', method: 'error', id: 'error'}
            ];
            jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}): void {
                expect(result.status).to.be(200);
                result.body.forEach(function (value: any, index: number) {
                    expect(result.body[index].jsonrpc).to.be('2.0');
                    expect(result.body[index].id).to.be(data[index].id);
                });

                expect(result.body[0].result).to.eql({success: true});
                expect(result.body[1].error.code).to.be(500);
                expect(result.body[1].error.message).to.be('TEST_EXCEPTION');

                done();
            });
        });

        describe('Error converter', function () {
            describe('Should convert error', function () {
                it('Version not specified', function (done) {
                    const data = {method: 'error', id: 'error'};
                    jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                        expect(result.status).to.be(200);
                        expect(result.body.error.code).to.be(-32600);
                        expect(result.body.error.message).to.be('Invalid request');
                        expect(result.body.id).to.be(data.id);

                        done();
                    });
                });

                it('Method not specified', function (done) {
                    const data = {jsonrpc: '2.0', id: 'error'};
                    jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                        expect(result.status).to.be(200);
                        expect(result.body.error.code).to.be(-32600);
                        expect(result.body.error.message).to.be('Invalid request');
                        expect(result.body.id).to.be(data.id);

                        done();
                    });
                });

                it('Method not found', function (done) {
                    const data = {jsonrpc: '2.0', method: 'not_found', id: 'error'};
                    jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                        expect(result.status).to.be(200);
                        expect(result.body.error.code).to.be(-32601);
                        expect(result.body.error.message).to.be('Method not found');
                        expect(result.body.id).to.be(data.id);

                        done();
                    });
                });

                it('Invalid params', function (done) {
                    const data = {jsonrpc: '2.0', method: 'badRequest', id: 'error'};
                    jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                        expect(result.status).to.be(200);
                        expect(result.body.error.code).to.be(-32602);
                        expect(result.body.error.message).to.be('Invalid params');
                        expect(result.body.id).to.be(data.id);

                        done();
                    });
                });

                it('Internal error', function (done) {
                    const data = {jsonrpc: '2.0', method: 'internalServerError', id: 'error'};
                    jsonrpc.call(event, context, data).then(function (result: {[index: string]: any}) {
                        expect(result.status).to.be(200);
                        expect(result.body.error.code).to.be(-32603);
                        expect(result.body.error.message).to.be('Internal error');
                        expect(result.body.id).to.be(data.id);

                        done();
                    });
                });
            });
        });
    });
});


/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */