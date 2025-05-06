class Errors extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }

    static badRequest(message) {
        return new Errors(message, 400);
    }

    static internal(message) {
        return new Errors(message, 500);
    }

    static forbidden(message) {
        return new Errors(message, 403);
    }

    static unauthorized(message) {
        return new Errors(message, 401);
    }

    static notFound(message) {
        return new Errors(message, 404);
    }
}

module.exports = Errors