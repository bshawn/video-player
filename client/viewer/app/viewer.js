/*jshint*/
/*global ko*/
/*global $*/
/*global console*/
/*global toastr*/

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

        this.applicationTitle = ko.observable('Video Player');
        this.videos = ko.observableArray();
        this.selectedVideo = ko.observable();
    }

    ViewModel.prototype.initialize = function initialize() {
        this.socket.on('video selected', displayVideo.bind(null, this));
        this.socket.on('play video', playVideo);
        this.socket.on('pause video', pauseVideo);
        this.socket.on('seek video', seekVideo);
    };

    function displayVideo(self, video) {
        self.selectedVideo(video);
    }

    function playVideo() {
        console.log('play video');
        getVideoTag().play();
    }

    function pauseVideo() {
        console.log('pause video');
        getVideoTag().pause();
    }

    function seekVideo(args) {
        console.log('seek video');
        console.log(args);
        getVideoTag().currentTime += args.delta;
    }

    function getVideoTag() {
        return $('video')[0];
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