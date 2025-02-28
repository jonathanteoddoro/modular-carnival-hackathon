class DynamicResponse extends Response {
    constructor(body: object | string, init: ResponseInit) {
        if (typeof body === 'object') {
            body = JSON.stringify(body)
            if (!init.headers) init.headers = {}
            init.headers = {
                'Content-Type': 'application/json',
                ...init.headers
            }
        }
        super(body, init)
    }
}

export { DynamicResponse }