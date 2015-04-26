var apiUrl = '../api/videos';

var Video = (function () {
   function Video(id, name, src) {
       this.id = id;
       this.name = name;
       this.src = src;
   }

   return Video;
} ());

var VideoService = (function () {
    'use strict';

    function VideoService () {
        this.url = apiUrl;
    }

    VideoService.prototype.getAll = function() {
        var dfd = $.Deferred();

        $.get(this.url)
            .done(getAll_done.bind(null, this, dfd))
            .fail(dfd.reject);

        return dfd.promise();
    };

    VideoService.prototype.get = function(videoId) {
        var dfd = $.Deferred();

        $.get(this.url + '/' + videoId)
            .done(get_done.bind(null, this, dfd))
            .fail(dfd.reject);

        return dfd.promise();
    };

    function getAll_done(self, dfd, results) {
        var videos = results.map(function (video) {
            return new Video(video.id, video.name);
        });

        dfd.resolve(videos);
    }

    function get_done(self, dfd, result) {
        dfd.resolve(new Video(result.id, result.name, result.src));
    }

    return VideoService;
} ());

var ViewModel = (function () {
    'use strict';

    function ViewModel () {
        this.service = new VideoService();
        this.socket = io();

        this.playPauseText = ko.observable('>');
        this.applicationTitle = ko.observable('Video Player Remote');
        this.videos = ko.observableArray();
        this.selectedVideo = ko.observable();
    }

    ViewModel.prototype.initialize = function initialize() {
        loadVideos(this);

        this.socket.on('video playing', setPauseIcon.bind(null, this));
        this.socket.on('video paused', setPlayIcon.bind(null, this));
        this.socket.on('video stopped', function() { console.log('stopped'); });
        this.socket.on('video seeked', function() { console.log('seeked'); });
        this.socket.on('video jumped', function() { console.log('jumped'); });
    };

    ViewModel.prototype.isSelected = function isSelected(video) {
        if(!this.selectedVideo()) {
            return false;
        }
        return video.id === this.selectedVideo().id;
    };

    ViewModel.prototype.select = function select(video) {
        this.socket.emit('select video', { videoId: video.id });
        loadVideoDetails(this, video.id);
    };

    ViewModel.prototype.playPause = function playPause() {
        if(this.playPauseText() === '>') {
            this.play();
        } else {
            this.pause();
        }
    };

    ViewModel.prototype.play = function play() {
        this.socket.emit('play video');
    };

    ViewModel.prototype.pause = function pause() {
        this.socket.emit('pause video');
    };

    ViewModel.prototype.stop = function stop() {
        this.socket.emit('stop video');
    };

    ViewModel.prototype.seek = function seek(delta) {
        this.socket.emit('seek video', { delta: delta });
    };

    ViewModel.prototype.jump = function jump(time) {
        this.socket.emit('jump video', { time: time });
    };

    function loadVideos(self) {
        self.service.getAll()
            .done(getAll_done.bind(null, self))
            .fail(handleAjaxError);
    }

    function getAll_done(self, videos) {
        self.videos(videos);
        self.select(self.videos()[0]);
    }

    function loadVideoDetails(self, videoId) {
        self.service.get(videoId)
            .done(get_done.bind(null, self))
            .fail(handleAjaxError);
    }

    function get_done(self, video) {
        self.selectedVideo(video);
    }

    function setPauseIcon(self) {
        self.playPauseText('||');
    }

    function setPlayIcon(self) {
        self.playPauseText('>');
    }

    function handleAjaxError(response) {
        toastr.error(response.responseText);
    }

    return ViewModel;
} ());

$(function () {
    var vm = new ViewModel();
    vm.initialize();
    ko.applyBindings(vm);
});