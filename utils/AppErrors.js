export default class AppErrors extends Error{
    constructor(){
        super();
    }
    create(message,code,statusCode){
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
        return this;
    }
}