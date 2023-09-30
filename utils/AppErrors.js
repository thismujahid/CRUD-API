import { getHTTPStatusFrom } from "./helpers.js";

export default class AppErrors extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
        this.statusText = getHTTPStatusFrom(code);
        return this;
    }
}