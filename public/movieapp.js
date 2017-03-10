var app = angular.module('movieApp', ['ui.router']);
var input = '';

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: 'search',
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'searchController'
  })
  .state({
    name: 'searchResults',
    url: '/{searchInput}',
    templateUrl: 'templates/searchResults.html',
    controller: 'searchResultsController'
  })
  .state({
    name: 'movieDetails',
    url: '/movie/{movieID}',
    templateUrl: 'templates/movieDetails.html',
    controller: 'movieDetailsController'
  });

  $urlRouterProvider.otherwise('/search');
});



app.factory('MovieService', function($http) {
  var service = {};
  var API_KEY = "d872204c805d9eae8fed0d0c3c302807";
  service.nowPlaying = function() {
    var url = "http://api.themoviedb.org/3/movie/now_playing";
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };
  service.getMovies = function(movieTitle) {
    var url = "http://api.themoviedb.org/3/search/movie";
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY, query: movieTitle }
  });
};
  service.details = function(movieID) {
    var url = "http://api.themoviedb.org/3/movie/" + movieID;
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };
  return service;
});




app.controller('searchController', function($scope, $stateParams, $state) {
  $scope.enterSearch = function(searchInput) {
    console.log($scope.searchInput);
    $state.go('searchResults', { searchInput: $scope.searchInput});
  };
});

app.controller('searchResultsController', function($scope, $stateParams, $state, MovieService) {
  $scope.input = $stateParams.searchInput;
  MovieService.getMovies($scope.input).then(function(data) {
    $scope.movies = data.data.results;
  }, function(data) {
    console.log("error on getMovies");
  });
  $scope.getMovieID = function(movie) {
    $scope.thisID = movie.id;
    $state.go('movieDetails', { movieID: $scope.thisID});
    console.log("going to movieDetails with id: ", movie.id);
  };
});

app.controller('movieDetailsController', function($scope, $state, $stateParams, MovieService) {
  MovieService.details($stateParams.movieID).then(function(data) {
    console.log(data);
    $scope.thisTitle = data.data.title;
    $scope.thisOverview = data.data.overview;
    $scope.thisGenres = data.data.genres;
    $scope.thisRelease = data.data.release_date;
    $scope.thisPoster = data.data.poster_path;
    $scope.thisRuntime = data.data.runtime;
    $scope.thisTagline = data.data.tagline || "(No Tagline Available)";
  }, function(data) {
    console.log("error on details");
  });
});
