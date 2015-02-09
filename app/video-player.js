/*jshint*/
/*global ko*/

var apiUrl = 'api/videos'

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
            .done(getAll_done.bind(this, dfd))
            .fail(console.log);
        
        return dfd.promise();
    };
    
    VideoService.prototype.get = function(videoId) {
        var dfd = $.Deferred();
        
        $.get(this.url + '/' + videoId)
            .done(get_done.bind(this, dfd))
            .fail(console.log);
        
        return dfd.promise();
    };
    
    function getAll_done(dfd, results) {
        var videos = results.map(function (video) {
            return new Video(video.id, video.name);
        });
        
        dfd.resolve(videos);
    }
    
    function get_done(dfd, result) {
        dfd.resolve(new Video(result.id, result.name, result.src));
    }
    
    return VideoService;
} ());


var ViewModel = (function () {
    'use strict';

    function ViewModel () {
        this.service = new VideoService();
        
        this.applicationTitle = ko.observable('Video Player');
        this.videos = ko.observableArray();
        this.selectedVideo = ko.observable();
    }
    
    ViewModel.prototype.initialize = function initialize() {
        loadVideos.call(this);
    };

    ViewModel.prototype.isSelected = function isSelected(video) {
        if(!this.selectedVideo()) {
            return false;
        }
        return video.id === this.selectedVideo().id;
    };

    ViewModel.prototype.select = function select(video) {
        loadVideoDetails.call(this, video.id);
    };
    
    function loadVideos() {
        this.service.getAll()
            .done(getAll_done.bind(this))
            .fail(console.log);
    }
    
    function getAll_done(videos) {
        this.videos(videos);
        this.select(this.videos()[0]);
    }
    
    function loadVideoDetails(videoId) {
        this.service.get(videoId)
            .done(get_done.bind(this))
            .fail(console.log);
    }
    
    function get_done(video) {
        this.selectedVideo(video);
    }

    return ViewModel;
} ());

$(function () {
    var vm = new ViewModel();
    vm.initialize();
    ko.applyBindings(vm);
});