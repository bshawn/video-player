function VideoLoadError(message) {
    this.number = 500;
    this.name = 'VideoLoadError';
    this.message = message || 'Unable to load video';
}
VideoLoadError.prototype = Object.create(Error.prototype);
VideoLoadError.prototype.constructor = VideoLoadError;

module.exports = VideoLoadError;