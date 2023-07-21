const apiBaseUrl = "https://api.themoviedb.org/3/";
const apiKey = "e7f5c912d9c2b7a8d9256f8de81e1573";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

// function to fetch data

function fetchData(endpoint) {
  return $.ajax({
    url: apiBaseUrl + endpoint,
    data: {
      api_key: apiKey
    }
  });
}


// start of search bar

$(document).ready(function() {
  // Attach event handler to search button click

  $(".search-button").on("click", function(event) {
    event.preventDefault(); 
    searchMovies();
  });

  // Attach event handler to Enter key press

  $(".input").on("keypress", function(event) {
    if (event.which === 13) {
      event.preventDefault(); 
      searchMovies();
    }
  });

  // Attach event handler to input change

  $(".input").on("input", function() {
    if ($(".input").val() === "") {
      showMovieContent();
      hideMovieList();
    }
  });

  // Attach event handler to cross sign click

  $(".cross-sign").on("click", function() {
    clearSearch();
  });

  // Function to handle movie search

  function searchMovies() {
    var query = $(".input").val(); 
    if (query !== "") {
      hideMovieContent();
      
      $.ajax({
        url: `${apiBaseUrl}/search/movie`,
        data: {
          api_key: apiKey,
          query: query
        },
        success: function(response) {
          const movies = response.results;
          displayMovies(movies); 
        },
        error: function(error) {
          console.error("Error:", error);
        }
      });
    } 
    else {
      clearSearch();
    }
  }

  // function to display the search movies

  function displayMovies(movies) {
    hideMovieContent();
    showMovieList();
  
    $("#movie-list").empty();
  
    movies.forEach(function (movie) {
      var movieContainer = $("<div>").addClass("movie-container");
      var movieInfo = $("<div>").addClass("movie-info container");
  
      var poster = $("<img>").attr("src", imageBaseUrl + movie.poster_path).attr("alt", movie.title).addClass("movie-poster");
      movieContainer.append(poster);
  
      var title = $("<div>").text(movie.title).addClass("movie-title");
      movieInfo.append(title);
  
      var rating = $("<div>").html(' <i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-rating");
      movieInfo.append(rating);
  
      var overview = $("<div>").text(movie.overview).addClass("movie-overview");
      movieInfo.append(overview);
  
      movieContainer.append(movieInfo);
  
      $("#movie-list").append(movieContainer);
  
      // Add click event handler to movie container
      movieContainer.on("click", function () {
        openMovieBox(movie);
      });

    });
  }
  

  //function to display the search movies in details

  function openMovieBox(movie) {
    var movieBox = $("<div>").addClass("movie-box").appendTo("body");

    var closeButton = $("<div>").html(' <i class="fa-solid fa-xmark"></i>').addClass("close-button");
    movieBox.append(closeButton);
    
    closeButton.on("click", function () {
      movieBox.remove();
    });
    
    var movieBoxContent = $("<div>").addClass("movie-box-content");
    movieBox.append(movieBoxContent);

    var movieBoxPoster = $("<img>").attr("src", imageBaseUrl + movie.poster_path).attr("alt", movie.title).addClass("movie-box-poster");
    movieBoxContent.append(movieBoxPoster);

    var movieBoxInfo = $("<div>").addClass("movie-box-info container");
    movieBoxContent.append(movieBoxInfo);

    var title = $("<div>").text(movie.title).addClass("movie-box-title");
    movieBoxInfo.append(title);

    // Create a flex container for release date and rating
    var infoContainer = $("<div>").addClass("info-container");
    movieBoxInfo.append(infoContainer);

    var rating = $("<div>").html(' <i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(movie.overview).addClass("movie-box-overview");
    movieBoxInfo.append(overview);

    //function to fetch the release date of movies

    fetchData(`movie/${movie.id}`)
    .done(function (movieDetails) {
      var releaseDate = movieDetails.release_date;
      var releaseDateText = $("<div>").html(' | '  + releaseDate).addClass("movie-release-date");
    infoContainer.append(releaseDateText);
    })

    .fail(function (error) {
      console.error("Error fetching movie details:", error);
    });
  
    //function to fetch the posters of the movie
   
    fetchData(`movie/${movie.id}/images`).done(function (imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        movieBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function (backdrop) {
          var imagePath = imageBaseUrl + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("movie-image");
          imageContainer.append(image);
        });
        movieBoxInfo.append(imageContainer);
      }
    })
    .fail(function (error) {
      console.error("Error fetching movie images:", error);
    });  

  }
  // Call the displayMovies function to populate movie containers

  displayMovies(movies);
  
  // Function to hide the movie info box 

  function hideMovieInfoBox() {
    $(".movie-info-box").remove();
    
  }
  
  // Function to show content

  function showMovieContent() {
    $(".movie-content").show();
  }

  // Function to hide content

  function hideMovieContent() {
    $(".movie-content").hide();
  }

  // Function to show movie-list

  function showMovieList() {
    $("#movie-list").show();
  }

  // Function to hide movie-list
  function hideMovieList() {
    $("#movie-list").hide();
  }

});

// button click on notification and message icon

$(".dropdown-center").on("click", function() {
  var $notificationIcon = $(this).find(".notification-icon");
  var $otherNotificationIcons = $(".notification-icon").not($notificationIcon);
  
  if ($notificationIcon.hasClass("active")) {
    $notificationIcon.removeClass("active");
    $notificationIcon.css("color", ""); 
  } 
  else{
    $notificationIcon.addClass("active");
    $notificationIcon.css("color", "hsl(356, 100%, 35%)");
    $otherNotificationIcons.removeClass("active");
    $otherNotificationIcons.css("color", ""); 
  }
});
  
$(document).on("click", function(event) {
  var $target = $(event.target);
  var $notificationIcons = $(".notification-icon");
  
  if (!$target.closest(".notification-icon").length) {
    $notificationIcons.removeClass("active");
    $notificationIcons.css("color", ""); 
  }
});
  
function showMovieDetailsBox() {
  $("#movie-details-box").removeClass("hidden");
}

function hideMovieDetailsBox() {
  $("#movie-details-box").addClass("hidden");
}


//function to display now playing

function displayNowPlaying() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".now-playing-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numMovies = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var movies;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showMovie(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var movieIndex = (currentIndex + i) % numMovies;
      var movie = movies[movieIndex];

      var movieContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(movie.title);
      var rating = $("<p>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + movie.vote_average);

      cardBody.append(rating, title);
      movieContainer.append(img, cardBody);
      posterFlex.empty().append(movieContainer);

      // Click event on movie poster
      posterFlex.on("click", function() {
        openMovieBox(movie);
      });
    });
  }

  //function to display open movie box in details

  function openMovieBox(movie) {
    var movieBox = $("<div>").addClass("movie-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    movieBox.append(closeButton);

    closeButton.on("click", function() {
      movieBox.remove();
    });

    var movieBoxContent = $("<div>").addClass("movie-box-content");
    movieBox.append(movieBoxContent);

    var movieBoxPoster = $("<img>")
    .attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path).attr("alt", movie.title).addClass("movie-box-poster");
    movieBoxContent.append(movieBoxPoster);

    var movieBoxInfo = $("<div>").addClass("movie-box-info container");
    movieBoxContent.append(movieBoxInfo);

    var title = $("<div>").text(movie.title).addClass("movie-box-title");
    movieBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    movieBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(movie.overview).addClass("movie-box-overview");
    movieBoxInfo.append(overview);

    // Fetch release date of movie
    var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
    $.ajax({
      url: movieDetailsUrl,
      method: "GET"
    })
      
    .done(function(movieDetails) {
      var releaseDate = movieDetails.release_date;
      var releaseDateText = $("<div>").html(" | " + releaseDate).addClass("movie-release-date");
      infoContainer.append(releaseDateText);
    })

    .fail(function(error) {
      console.error("Error fetching movie details:", error);
    });

    // Fetch movie posters
    var movieImagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: movieImagesUrl,
      method: "GET"
    })

    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        movieBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("movie-image");
          imageContainer.append(image);
        });
        movieBoxInfo.append(imageContainer);
      }
    })

    .fail(function(error) {
      console.error("Error fetching movie images:", error);
    });

  }

  $("#prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numMovies) % numMovies;
    showMovie(currentIndex);
  });

  $("#next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numMovies;
    showMovie(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    movies = response.results;
    numMovies = movies.length;
    showMovie(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching now playing movies:", error);
  });
}

displayNowPlaying();


//function to display upcoming movies

function displayUpcoming() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".upcoming-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numMovies = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var movies;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showMovie(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var movieIndex = (currentIndex + i) % numMovies;
      var movie = movies[movieIndex];

      var movieContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(movie.title);
      var rating = $("<p>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + movie.vote_average);

      cardBody.append(rating, title);
      movieContainer.append(img, cardBody);
      posterFlex.empty().append(movieContainer);

      // Click event on movie poster
      posterFlex.on("click", function() {
        openMovieBox(movie);
      });
    });
  }

  //function to display open movie box in details

  function openMovieBox(movie) {
    var movieBox = $("<div>").addClass("movie-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    movieBox.append(closeButton);

    closeButton.on("click", function() {
      movieBox.remove();
    });

    var movieBoxContent = $("<div>").addClass("movie-box-content");
    movieBox.append(movieBoxContent);

    var movieBoxPoster = $("<img>")
    .attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path).attr("alt", movie.title).addClass("movie-box-poster");
    movieBoxContent.append(movieBoxPoster);

    var movieBoxInfo = $("<div>").addClass("movie-box-info container");
    movieBoxContent.append(movieBoxInfo);

    var title = $("<div>").text(movie.title).addClass("movie-box-title");
    movieBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    movieBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(movie.overview).addClass("movie-box-overview");
    movieBoxInfo.append(overview);

    // Fetch release date of movie
    var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
    $.ajax({
      url: movieDetailsUrl,
      method: "GET"
    })
      
    .done(function(movieDetails) {
      var releaseDate = movieDetails.release_date;
      var releaseDateText = $("<div>").html(" | " + releaseDate).addClass("movie-release-date");
      infoContainer.append(releaseDateText);
    })

    .fail(function(error) {
      console.error("Error fetching movie details:", error);
    });

    // Fetch movie posters
    var movieImagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: movieImagesUrl,
      method: "GET"
    })

    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        movieBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("movie-image");
          imageContainer.append(image);
        });
        movieBoxInfo.append(imageContainer);
      }
    })

    .fail(function(error) {
      console.error("Error fetching movie images:", error);
    });

  }

  $("#upcoming-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numMovies) % numMovies;
    showMovie(currentIndex);
  });

  $("#upcoming-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numMovies;
    showMovie(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    movies = response.results;
    numMovies = movies.length;
    showMovie(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching now playing movies:", error);
  });
}

displayUpcoming();


//function to display top rated

function displayTopRated() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".top-rated-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numMovies = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var movies;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showMovie(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var movieIndex = (currentIndex + i) % numMovies;
      var movie = movies[movieIndex];

      var movieContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(movie.title);
      var rating = $("<p>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + movie.vote_average);

      cardBody.append(rating, title);
      movieContainer.append(img, cardBody);
      posterFlex.empty().append(movieContainer);

      // Click event on movie poster
      posterFlex.on("click", function() {
        openMovieBox(movie);
      });
    });
  }

  //function to display open movie box in details

  function openMovieBox(movie) {
    var movieBox = $("<div>").addClass("movie-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    movieBox.append(closeButton);

    closeButton.on("click", function() {
      movieBox.remove();
    });

    var movieBoxContent = $("<div>").addClass("movie-box-content");
    movieBox.append(movieBoxContent);

    var movieBoxPoster = $("<img>")
    .attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path).attr("alt", movie.title).addClass("movie-box-poster");
    movieBoxContent.append(movieBoxPoster);

    var movieBoxInfo = $("<div>").addClass("movie-box-info container");
    movieBoxContent.append(movieBoxInfo);

    var title = $("<div>").text(movie.title).addClass("movie-box-title");
    movieBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    movieBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(movie.overview).addClass("movie-box-overview");
    movieBoxInfo.append(overview);

    // Fetch release date of movie
    var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
    $.ajax({
      url: movieDetailsUrl,
      method: "GET"
    })
      
    .done(function(movieDetails) {
      var releaseDate = movieDetails.release_date;
      var releaseDateText = $("<div>").html(" | " + releaseDate).addClass("movie-release-date");
      infoContainer.append(releaseDateText);
    })

    .fail(function(error) {
      console.error("Error fetching movie details:", error);
    });

    // Fetch movie posters
    var movieImagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: movieImagesUrl,
      method: "GET"
    })

    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        movieBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("movie-image");
          imageContainer.append(image);
        });
        movieBoxInfo.append(imageContainer);
      }
    })

    .fail(function(error) {
      console.error("Error fetching movie images:", error);
    });

  }

  $("#rated-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numMovies) % numMovies;
    showMovie(currentIndex);
  });

  $("#rated-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numMovies;
    showMovie(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    movies = response.results;
    numMovies = movies.length;
    showMovie(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching now playing movies:", error);
  });
}

displayTopRated();


//function to display trending now

function displayTrendingNow() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".trending-now-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numMovies = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var movies;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showMovie(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var movieIndex = (currentIndex + i) % numMovies;
      var movie = movies[movieIndex];

      var movieContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(movie.title);
      var rating = $("<p>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + movie.vote_average);

      cardBody.append(rating, title);
      movieContainer.append(img, cardBody);
      posterFlex.empty().append(movieContainer);

      // Click event on movie poster
      posterFlex.on("click", function() {
        openMovieBox(movie);
      });
    });
  }

  //function to display open movie box in details

  function openMovieBox(movie) {
    var movieBox = $("<div>").addClass("movie-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    movieBox.append(closeButton);

    closeButton.on("click", function() {
      movieBox.remove();
    });

    var movieBoxContent = $("<div>").addClass("movie-box-content");
    movieBox.append(movieBoxContent);

    var movieBoxPoster = $("<img>")
    .attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path).attr("alt", movie.title).addClass("movie-box-poster");
    movieBoxContent.append(movieBoxPoster);

    var movieBoxInfo = $("<div>").addClass("movie-box-info container");
    movieBoxContent.append(movieBoxInfo);

    var title = $("<div>").text(movie.title).addClass("movie-box-title");
    movieBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    movieBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + movie.vote_average).addClass("movie-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(movie.overview).addClass("movie-box-overview");
    movieBoxInfo.append(overview);

    // Fetch release date of movie
    var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
    $.ajax({
      url: movieDetailsUrl,
      method: "GET"
    })
      
    .done(function(movieDetails) {
      var releaseDate = movieDetails.release_date;
      var releaseDateText = $("<div>").html(" | " + releaseDate).addClass("movie-release-date");
      infoContainer.append(releaseDateText);
    })

    .fail(function(error) {
      console.error("Error fetching movie details:", error);
    });

    // Fetch movie posters
    var movieImagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: movieImagesUrl,
      method: "GET"
    })

    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        movieBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("movie-image");
          imageContainer.append(image);
        });
        movieBoxInfo.append(imageContainer);
      }
    })

    .fail(function(error) {
      console.error("Error fetching movie images:", error);
    });

  }

  $("#trending-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numMovies) % numMovies;
    showMovie(currentIndex);
  });

  $("#trending-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numMovies;
    showMovie(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    movies = response.results;
    numMovies = movies.length;
    showMovie(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching now playing movies:", error);
  });
}

displayTrendingNow();


// function to display popular tv serials

function displayPopularTvShow() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".popular-tv-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numShows = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var shows;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showShow(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var showIndex = (currentIndex + i) % numShows;
      var show = shows[showIndex];

      var showContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(show.name);
      var rating = $("<div>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + show.vote_average);

      cardBody.append(rating, title);
      showContainer.append(img, cardBody);
      posterFlex.empty().append(showContainer);

      // Click event on show poster
      posterFlex.on("click", function() {
        openShowBox(show);
      });
    });
  }

  // Function to display open show box in details
  function openShowBox(show) {
    var showBox = $("<div>").addClass("show-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    showBox.append(closeButton);

    closeButton.on("click", function() {
      showBox.remove();
    });

    var showBoxContent = $("<div>").addClass("show-box-content");
    showBox.append(showBoxContent);

    var showBoxPoster = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path).attr("alt", show.name).addClass("show-box-poster");
    showBoxContent.append(showBoxPoster);

    var showBoxInfo = $("<div>").addClass("show-box-info container");
    showBoxContent.append(showBoxInfo);

    var title = $("<div>").text(show.name).addClass("show-box-title");
    showBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    showBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + show.vote_average).addClass("show-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(show.overview).addClass("show-box-overview");
    showBoxInfo.append(overview);

    // Fetch show details
    var showDetailsUrl = `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}`;
    $.ajax({
      url: showDetailsUrl,
      method: "GET"
    })
    .done(function(showDetails) {
      var firstAirDate = showDetails.first_air_date;
      var firstAirDateText = $("<div>").html(" | " + firstAirDate).addClass("show-first-air-date");
      infoContainer.append(firstAirDateText);
    })
    .fail(function(error) {
      console.error("Error fetching show details:", error);
    });

    // Fetch show posters
    var showImagesUrl = `https://api.themoviedb.org/3/tv/${show.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: showImagesUrl,
      method: "GET"
    })
    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        showBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("show-image");
          imageContainer.append(image);
        });
        showBoxInfo.append(imageContainer);
      }
    })
    .fail(function(error) {
      console.error("Error fetching show images:", error);
    });
  }

  $("#popular-tv-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numShows) % numShows;
    showShow(currentIndex);
  });

  $("#popular-tv-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numShows;
    showShow(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    shows = response.results;
    numShows = shows.length;
    showShow(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching popular TV shows:", error);
  });
}

displayPopularTvShow();


//function to display Top Rated tv show

function displayTopRatedShow() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".top-rated-show-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numShows = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var shows;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showShow(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var showIndex = (currentIndex + i) % numShows;
      var show = shows[showIndex];

      var showContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(show.name);
      var rating = $("<div>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + show.vote_average);

      cardBody.append(rating, title);
      showContainer.append(img, cardBody);
      posterFlex.empty().append(showContainer);

      // Click event on show poster
      posterFlex.on("click", function() {
        openShowBox(show);
      });
    });
  }

  // Function to display open show box in details
  function openShowBox(show) {
    var showBox = $("<div>").addClass("show-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    showBox.append(closeButton);

    closeButton.on("click", function() {
      showBox.remove();
    });

    var showBoxContent = $("<div>").addClass("show-box-content");
    showBox.append(showBoxContent);

    var showBoxPoster = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path).attr("alt", show.name).addClass("show-box-poster");
    showBoxContent.append(showBoxPoster);

    var showBoxInfo = $("<div>").addClass("show-box-info container");
    showBoxContent.append(showBoxInfo);

    var title = $("<div>").text(show.name).addClass("show-box-title");
    showBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    showBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + show.vote_average).addClass("show-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(show.overview).addClass("show-box-overview");
    showBoxInfo.append(overview);

    // Fetch show details
    var showDetailsUrl = `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}`;
    $.ajax({
      url: showDetailsUrl,
      method: "GET"
    })
    .done(function(showDetails) {
      var firstAirDate = showDetails.first_air_date;
      var firstAirDateText = $("<div>").html(" | " + firstAirDate).addClass("show-first-air-date");
      infoContainer.append(firstAirDateText);
    })
    .fail(function(error) {
      console.error("Error fetching show details:", error);
    });

    // Fetch show posters
    var showImagesUrl = `https://api.themoviedb.org/3/tv/${show.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: showImagesUrl,
      method: "GET"
    })
    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        showBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("show-image");
          imageContainer.append(image);
        });
        showBoxInfo.append(imageContainer);
      }
    })
    .fail(function(error) {
      console.error("Error fetching show images:", error);
    });
  }

  $("#top-rated-show-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numShows) % numShows;
    showShow(currentIndex);
  });

  $("#top-rated-show-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numShows;
    showShow(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    shows = response.results;
    numShows = shows.length;
    showShow(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching popular TV shows:", error);
  });
}

displayTopRatedShow();


//function to display popular person

function displayPopularPerson() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".popular-person-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numPersons = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var persons;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showPerson(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var personIndex = (currentIndex + i) % numPersons;
      var person = persons[personIndex];

      var personContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + person.profile_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("person-card-title").text(person.name);
      var rating = $("<div>").addClass("person-card-rating").html('Popularity : ' + person.popularity);

      cardBody.append(title, rating);
      personContainer.append(img, cardBody);
      posterFlex.empty().append(personContainer);

      // Click event on person poster
      posterFlex.on("click", function() {
        openPersonBox(person);
      });
    });
  }

  // Function to display open person box in details

  function openPersonBox(person) {
    var personBox = $("<div>").addClass("person-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    personBox.append(closeButton);

    closeButton.on("click", function() {
      personBox.remove();
    });

    var personBoxContent = $("<div>").addClass("person-box-content");
    personBox.append(personBoxContent);

    var personBoxPoster = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + person.profile_path).attr("alt", person.name).addClass("person-box-poster");
    personBoxContent.append(personBoxPoster);

    var personBoxInfo = $("<div>").addClass("person-box-info container");
    personBoxContent.append(personBoxInfo);

    var title = $("<div>").text(person.name).addClass("person-box-title");
    personBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    personBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + person.popularity).addClass("person-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(person.biography).addClass("person-box-biography");
    personBoxInfo.append(overview);

    // Fetch person details
    var personDetailsUrl = `https://api.themoviedb.org/3/person/${person.id}?api_key=${apiKey}`;
    $.ajax({
      url: personDetailsUrl,
      method: "GET"
    })
    .done(function(personDetails) {
      var birthday = personDetails.birthday;
      var birthdayText = $("<div>").html(" | " + birthday).addClass("person-birthday");
      infoContainer.append(birthdayText);
    })
    .fail(function(error) {
      console.error("Error fetching person details:", error);
    });

    // Fetch person images
    var personImagesUrl = `https://api.themoviedb.org/3/person/${person.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: personImagesUrl,
      method: "GET"
    })
    .done(function(imagesData) {
      var profiles = imagesData.profiles;
      if (profiles && profiles.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var profileTitle = $("<div>").text("Profiles").addClass("profile-title");
        personBoxInfo.append(profileTitle);
        profiles.slice(0, 4).forEach(function(profile) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + profile.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("person-image");
          imageContainer.append(image);
        });
        personBoxInfo.append(imageContainer);
      }
    })
    .fail(function(error) {
      console.error("Error fetching person images:", error);
    });
  }

  $("#person-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numPersons) % numPersons;
    showPerson(currentIndex);
  });

  $("#person-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numPersons;
    showPerson(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    persons = response.results;
    numPersons = persons.length;
    showPerson(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching popular persons:", error);
  });
}

displayPopularPerson();



// function to display popular tv serials

function displayAiringToday() {
  var apiKey = 'e7f5c912d9c2b7a8d9256f8de81e1573';
  var posterContainer = $(".airing-today-list");
  posterContainer.empty();

  var flexContainer = $('<div>').addClass('poster-flex-container');
  var currentIndex = 0;
  var numShows = 0;
  var posterFlexList = [];

  var columnCount = 4;
  var shows;

  for (var i = 0; i < columnCount; i++) {
    var posterFlex = $('<div>').addClass('poster-flex');
    flexContainer.append(posterFlex);
    posterFlexList.push(posterFlex);
  }

  posterContainer.append(flexContainer);

  function showShow(index) {
    currentIndex = index;

    $.each(posterFlexList, function(i, posterFlex) {
      var showIndex = (currentIndex + i) % numShows;
      var show = shows[showIndex];

      var showContainer = $("<div>").addClass("card");

      var img = $("<img>").addClass("card-img-top").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path);
      var cardBody = $("<div>").addClass("card-body");
      var title = $("<div>").addClass("card-title").text(show.name);
      var rating = $("<div>").addClass("card-rating").html('<i class="fa-solid fa-star"></i>' + show.vote_average);

      cardBody.append(rating, title);
      showContainer.append(img, cardBody);
      posterFlex.empty().append(showContainer);

      // Click event on show poster
      posterFlex.on("click", function() {
        openShowBox(show);
      });
    });
  }

  // Function to display open show box in details
  function openShowBox(show) {
    var showBox = $("<div>").addClass("show-box").appendTo("body");

    var closeButton = $("<div>").html('<i class="fa-solid fa-xmark"></i>').addClass("close-button");
    showBox.append(closeButton);

    closeButton.on("click", function() {
      showBox.remove();
    });

    var showBoxContent = $("<div>").addClass("show-box-content");
    showBox.append(showBoxContent);

    var showBoxPoster = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + show.poster_path).attr("alt", show.name).addClass("show-box-poster");
    showBoxContent.append(showBoxPoster);

    var showBoxInfo = $("<div>").addClass("show-box-info container");
    showBoxContent.append(showBoxInfo);

    var title = $("<div>").text(show.name).addClass("show-box-title");
    showBoxInfo.append(title);

    var infoContainer = $("<div>").addClass("info-container");
    showBoxInfo.append(infoContainer);

    var rating = $("<div>").html('<i class="fa-solid fa-star"></i>' + show.vote_average).addClass("show-box-rating");
    infoContainer.append(rating);

    var overview = $("<div>").text(show.overview).addClass("show-box-overview");
    showBoxInfo.append(overview);

    // Fetch show details
    var showDetailsUrl = `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}`;
    $.ajax({
      url: showDetailsUrl,
      method: "GET"
    })
    .done(function(showDetails) {
      var firstAirDate = showDetails.first_air_date;
      var firstAirDateText = $("<div>").html(" | " + firstAirDate).addClass("show-first-air-date");
      infoContainer.append(firstAirDateText);
    })
    .fail(function(error) {
      console.error("Error fetching show details:", error);
    });

    // Fetch show posters
    var showImagesUrl = `https://api.themoviedb.org/3/tv/${show.id}/images?api_key=${apiKey}`;
    $.ajax({
      url: showImagesUrl,
      method: "GET"
    })
    .done(function(imagesData) {
      var backdrops = imagesData.backdrops;
      if (backdrops && backdrops.length > 0) {
        var imageContainer = $("<div>").addClass("image-container");
        var posterTitle = $("<div>").text("Posters").addClass("poster-title");
        showBoxInfo.append(posterTitle);
        backdrops.slice(0, 4).forEach(function(backdrop) {
          var imagePath = "https://image.tmdb.org/t/p/w500" + backdrop.file_path;
          var image = $("<img>").attr("src", imagePath).addClass("show-image");
          imageContainer.append(image);
        });
        showBoxInfo.append(imageContainer);
      }
    })
    .fail(function(error) {
      console.error("Error fetching show images:", error);
    });
  }

  $("#airing-prev").on("click", function() {
    currentIndex = (currentIndex - columnCount + numShows) % numShows;
    showShow(currentIndex);
  });

  $("#airing-next").on("click", function() {
    currentIndex = (currentIndex + columnCount) % numShows;
    showShow(currentIndex);
  });

  var apiUrl = `https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}`;
  $.ajax({
    url: apiUrl,
    method: "GET"
  })
  .done(function(response) {
    shows = response.results;
    numShows = shows.length;
    showShow(currentIndex);
  })
  .fail(function(error) {
    console.error("Error fetching popular TV shows:", error);
  });
}

displayAiringToday();

//function to add onclcik event to add shadow  on  price plans 

$(document).ready(function() {
  
  $('.change-plans').first().addClass('shadow');

  function removeShadow() {
    $('.change-plans').not(this).removeClass('shadow');
  }
  
  $('.change-plans').on('click', function() {
    addShadow($(this));
    removeShadow.call(this);
    addShadowButton.call(this);
  });

  function removeShadow() {
    $('.change-plans').not(this).removeClass('shadow');
  }

  function addShadow(elem) {
    elem.addClass('shadow');
  }
  
});

