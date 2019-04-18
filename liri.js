require("dotenv").config();
var keys = require("./keys.js");

var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

var action = process.argv[2];
var input = process.argv.slice(3).join(' ');

//console.log("KEYS", keys.spotify);
console.log(action);
console.log(input);


function userRequest(action, input) {

    switch (action) {
        case 'concert-this':
        concertThis(input);
            console.log("You want a concert for", input);
            break;
        case 'spotify-this-song':
        spotifyThis(input);
            console.log("You want a song for", input);
            break;
        case 'movie-this':
        movieThis(input);
            console.log("You want movie info on", input);
            break;
        case 'do-what-it-says':
        getRandom();
            console.log("Do what it says!");
            break;
        default:
            console.log("NO idea what you are asking for....");
    }
}


// Spotify Start
function spotifyThis(song) {
    if (!song) {
        song = 'The Sign by Ace of Base';
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occured: ' + err);

        }
        else {
            var tracks = data.tracks.items;
            for (var i = 0; i < tracks.length; i++) {
                console.log("------------------------------");
                var artistArr = tracks[i].artists;
                var artists = [];
                for (var j = 0; j < artistArr.length; j++) {
                    artists.push(artistArr[j].name);

                }
                console.log('Artist: ' + artists.join(", "));
                console.log('Song: ' + tracks[i].name);
                console.log('Album: ' + tracks[i].album.name);

                if (tracks[i].preview_url == null) {
                    console.log('Preview unavailable');
                }
                else {
                    console.log('Preview: ' + tracks[i].preview_url);
                }
                console.log("------------------------------")
            }

        }
    });
}
// Spotify End




// Bands in Town Start
function concertThis(artist) {
    var artistQ = artist.split(' ').join('+');

    var queryURL = "https://rest.bandsintown.com/artists/" + artistQ + "/events?app_id=" + keys.bandsintown;
    request(queryURL, function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            var result = JSON.parse(body);
            // console.log(result);
            for (var i = 0; i < result.length; i++) {
                console.log("------------------------------")
                console.log("Venue: " + result[i].venue.name);
                console.log("Location: " + result[i].venue.city + ", " + (result[i].venue.region || result[i].venue.country));
                console.log("Date: " + moment(result[i].datetime).format("MM/DD/YYYY"));
                console.log("------------------------------")
            }
        }
    });
}
// Bands In Town End



// OMDb start
function movieThis(movie) {
    if (!movie) {
        movie = "Mr. Nobody";
    }

    let queryURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=long&tomatoes=true&r=json&apikey=58b72bb4'

    let movieQ = movie.split(' ').join('+');

    request(queryURL, function (error, response, body) {

        if (error) {
            console.log(error);
        } else {
            let result = JSON.parse(body);
            console.log("------------------------------")
            console.log("Title: " + result["Title"]);
            console.log("Year: " + result["Year"]);
            console.log("IMDB Rating: " + result["imdbRating"]);
            if (result.Ratings[1]) {
                console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
            }

            console.log("Country: " + result["Country"]);
            console.log("Language: " + result["Language"]);
            console.log("Plot: " + result["Plot"]);
            console.log("Actors: " + result["Actors"]);
            console.log("Rotten Tomatoes URL: " + result["tomatoURL"])
            console.log("------------------------------")
        }
    });
}
// OMDb end



function getRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error){
            console.log(error);
        }else {
            var dataSplit = data.split(',');
            var readCommand = dataSplit[0];
            var readParam = dataSplit[1];
            
        

            userRequest(readCommand, readParam);
        }
    })
}


 userRequest(action, input);