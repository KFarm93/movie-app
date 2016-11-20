var app = angular.module('movieApp', ['ui.router']);
var input = '';

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: 'search',
    url: '/search',
    templateUrl: 'search.html',
    controller: 'searchController'
  })
  .state({
    name: 'searchResults',
    url: '/{searchInput}',
    templateUrl: 'searchResults.html',
    controller: 'searchResultsController'
  })
  .state({
    name: 'movieDetails',
    url: '/movie/{movieID}',
    templateUrl: 'movieDetails.html',
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
  MovieService.getMovies($scope.input).success(function(data) {
      // got movies
    // console.log(data.results);
    $scope.movies = data.results;
  });
  $scope.getMovieID = function(movie) {
    $scope.thisID = movie.id;
    $state.go('movieDetails', { movieID: $scope.thisID});
  };
});

app.controller('movieDetailsController', function($scope, $state, $stateParams, MovieService) {
  MovieService.details($stateParams.movieID).success(function(data) {
    $scope.thisTitle = data.title;
    $scope.thisOverview = data.overview;
    $scope.thisGenres = data.genres;
    $scope.thisRelease = data.release_date;
    $scope.thisPoster = data.poster_path;
  });
});
