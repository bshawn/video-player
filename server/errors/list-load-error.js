function ListLoadError(message) {
    this.number = 500;
    this.name = 'ListLoadError';
    this.message = message || 'Unable to load video list';
}
ListLoadError.prototype = Object.create(Error.prototype);
ListLoadError.prototype.constructor = ListLoadError;

module.exports = ListLoadError;