class Errors extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }

    static badRequest(message) {
        return new Errors(message, 404);
    }

    static internal(message) {
        return new Errors(message, 500);
    }

    static forbidden(message) {
        return new Errors(message, 403);
    }
}

module.exports = Errors