class ViewModel

  constructor: ->
    @applicationTitle = ko.observable 'CoffeeScript Video Player'
    @videos = ko.observableArray [
      { name: 'Incredibles', src: 'movies/Incredibles (2004).mp4' }
      { name: 'Ratatouille', src: 'movies/Ratatouille (2007).mp4' }
      { name: 'Toy Story', src: 'movies/Toy Story (1995).mp4' }
    ]
    @selectedVideo = ko.observable @videos()[0]

  isSelected: (video) -> video is @selectedVideo()

  select: (video) -> @selectedVideo video

$ ->
  vm = new ViewModel
  ko.applyBindings vm
