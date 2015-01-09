var ViewModel = (function () {
    "use strict";

    function ViewModel (){
        this.applicationTitle = ko.observable('Video Player');
        this.videos = ko.observableArray([
            { name: 'Big Buck Bunny', src: 'movies/big_buck_bunny.mp4' },
            { name: 'Lions', src: 'movies/Die leeutemmer.mp4' },
            { name: 'Incredible Mara Leopard Attack', src: 'movies/Incredible Mara Leopard Attack21.mp4' }
        ]);
        this.selectedVideo = ko.observable(this.videos()[0]);
    }

    ViewModel.prototype.isSelected = function isSelected(video) {
       return video === this.selectedVideo();
    };

    ViewModel.prototype.select = function select(video) {
        this.selectedVideo(video);
    };

    return ViewModel;
}());

$(function () {
    var vm = new ViewModel();
    ko.applyBindings(vm);
});