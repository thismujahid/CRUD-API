export default class AppErrors extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
        this.statusText = this.getErrorTextFromHTTPStatusCode(code);
        return this;
    }
    getErrorTextFromHTTPStatusCode(code) {
        if (code < 300) {
            return "success";
        } else if (code < 400) {

            return "failure";
        } else if (code < 500) {
            return "error";
        } else {
            return "Internal Error";
        }
    }
}