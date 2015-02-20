/*jshint*/
/*global ko*/
/*global $*/
/*global console*/
/*global toastr*/

var apiUrl = 'api/videos';

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
        
        this.applicationTitle = ko.observable('Video Player');
        this.videos = ko.observableArray();
        this.selectedVideo = ko.observable();
    }
    
    ViewModel.prototype.initialize = function initialize() {
        loadVideos.call(null, this);
    };

    ViewModel.prototype.isSelected = function isSelected(video) {
        if(!this.selectedVideo()) {
            return false;
        }
        return video.id === this.selectedVideo().id;
    };

    ViewModel.prototype.select = function select(video) {
        loadVideoDetails.call(null, this, video.id);
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