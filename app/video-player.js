var ViewModel = (function () {
    "use strict";

    function ViewModel (){
        this.applicationTitle = ko.observable('Video Player');
        this.videos = ko.observableArray([
            { name: 'Incredibles', src: 'movies/Incredibles (2004).mp4' },
            { name: 'Ratatouille', src: 'movies/Ratatouille (2007).mp4' },
            { name: 'Toy Story', src: 'movies/Toy Story (1995).mp4' }
        ]);
        this.selectedVideo = ko.observable(this.videos()[0]);
    }

    ViewModel.prototype.isSelected = function isSelected(video) {
       return video === this.selectedVideo();
    };

    ViewModel.prototype.select = function select(video) {
        this.selectedVideo(video);
    }

    return ViewModel;
}());

$(function () {
    var vm = new ViewModel();
    ko.applyBindings(vm);
});