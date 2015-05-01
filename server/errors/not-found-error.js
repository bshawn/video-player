function NotFoundError(message) {
    this.number = 404;
    this.name = 'NotFoundError';
    this.message = message || 'The requested resource was not found';
}
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

NotFoundError.prototype = new Error();

module.exports = NotFoundError;