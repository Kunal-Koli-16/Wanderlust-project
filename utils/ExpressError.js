class ExpressError extends Error{
    constructor(StatusCode , Message){
        super();
        this.statusCode = statusCode;
        this.message = message;

    }
};


module.exports=ExpressError;