# karmia-jsonrpc

Karmia JSON-RPC 2.0 module for AWS Lambda.

## Installation

```Shell
npm install karmia-lambda-jsonrpc
```

## Example
### API Gateway / Lambda
#### Request mapping template
```
#set($parameters = $input.params())
{
    "stage": "$context.stage",
    "user_id": "$context.identity.cognitoIentityId",
    "headers": {
        #foreach($name in $parameters.heaer)
            "$name": "$util.escapeJavaScript($parameters.header.get($name))"
            #if($foreach.hasNext),#end
        #end
    },
    "body": {
        "jsonrpc": "2.0",
        "method": $input.json('$.method'),
        "params": $input.json('$.params'),
        "id": "$context.requestId"
    }
}
```

#### Response mapping template
```
$input.json('$.body');
```

#### Example lambda function
```javascript
// Import modules
const karmia_jsonrpc = require('karmia-lambda-jsonrpc'),
    jsonrpc = new karmia_jsonrpc();

// Add methods
jsonrpc.methods.set('method', (event, context, params) => {
    return Promise.resolve({success: true});
});

/*
// Add multiple method
jsonrpc.methods.set({
    method1: (event, context, parameters) => {},
    method2: (event, context, parameters) => {}
});
*/

// Export handler
exports.handler = async (event, context) => {
    try {
        return jsonrpc.call(event, context, event.body);
    } catch (error) {
        return Promise.reject({
            jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: "Internal error",
                    data: error
                },
                id: event.body.id
        });
    }
};
```
