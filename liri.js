'use strict';
const keys = require('./keys.js');

const Spotify = require('node-spotify-api');
// Initialize the spotify client
const spotify = new Spotify(keys.spotify);

const Twitter = require('twitter');
//must use "client name"
const client = new Twitter(keys.twitter);

const request = require('request');

const fs = require('fs');

// Read in the command line arguments
var cmdArgs = process.argv;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The LIRI command will always be the second command line argument
var liriCommand = cmdArgs[2];

// The parameter to the LIRI command may contain spaces
var liriArg = cmdArgs[3];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// kunleTweets will retrieve my last 20 tweets and display them together with the date
const kunleTweets = () => {
	// Append the command to the log file
	fs.appendFile('./log.txt', '\nbash-3.2$ >> node liri.js my-tweets\n', err => {
		if (err) throw err;
	});

	// Set the 'screen_name' to my Twitter handle
	var params = { screen_name: '@kunlebabatunde5', count: 20 };

	// Retrieve the last 5 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			// Append the error string to the log file
			fs.appendFile('./log.txt', 'ERROR: Retrieving user tweets -- ' + error, err => {
				if (err) throw err;
				console.log('ERROR: Retrieving user tweets -- ' + error);
			});
			return;
		} else {
			var tweetOutputs = '------------------------\n' + 'User Tweets:\n' + '------------------------\n\n';
			for (var i = 0; i < tweets.length; i++) {
				tweetOutputs +=
					'Created on: ' +
					tweets[i].created_at +
					'\n' +
					'Tweet content: ' +
					tweets[i].text +
					'\n' +
					'------------------------\n';
			}
			// Append the output to the log file
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + tweetOutputs + '\n', err => {
				if (err) throw err;
				console.log(tweetOutputs);
			});
		}
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// spotifySong will retrieve information on a song from Spotify
const spotifySong = song => {
	// Append the command to the log file
	fs.appendFile('./log.txt', '\nbash-3.1$ node liri.js spotify-this-song ' + song + '\n\n', err => {
		if (err) throw err;
	});

	// If no song is provided, LIRI defaults to 'The Sign' by Ace Of Base
	var search;
	song === '' ? (search = 'The Sign') : (search = song);

	spotify
		.search({
			type: 'track',
			query: search,
		})
		.then(response => {
			const outputStr =
				'Artist(s) -->' +
				response.tracks.items[0].artists[0].name +
				'\nSong Name -->' +
				response.tracks.items[0].name +
				'\nPreview Link -->' +
				response.tracks.items[0].preview_url +
				'\nAlbum Name -->' +
				response.tracks.items[0].album.name;
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', err => {
				if (err) throw err;
				console.log(outputStr);
			});
		});
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Movie function, uses the Request module to call the OMDB api
function retrieveOBDBInfo(movie) {
	if (!movie) {
		movie = 'mr nobody';
	}
	request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json&tomatoes=true&apikey=trilogy', (error, response, body) => {
		console.log('\nbody title=',JSON.parse(body).Title);
		if (!error) 
		{
			const movieResults = "\nTitle: "+JSON.parse(body).Title+
													"\nYear: "+JSON.parse(body).Year+
													"\nRating(IMD): "+JSON.parse(body).Ratings[0].Value+
													"\nRotten Tomatoes Rating of the movie: "+JSON.parse(body).Ratings[1].Value+
													"\nCountry where the movie was produced "+JSON.parse(body).Country+
													"\nLanguage of the movie: "+JSON.parse(body).Language+
													"\nPlot: "+JSON.parse(body).Plot+
													"\nActors in the movie: "+JSON.parse(body).Actors;
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + movieResults + '\n', err => {
				if (err) throw err;
				console.log(movieResults);
			});
		} else {
			console.log('Error :' + error);
			return;
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// doAsYerTold will read in a file to determine the desired command and then execute
const doAsYerTold = ()=>
{
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	})
	// Read in the file containing the command

	fs.readFile('./random.txt', 'utf8', (error, data)=> 
	{
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else 
		{
			// Split out the command name and the parameter name
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					kunleTweets()
					break;

				case 'spotify-this-song':
					spotifySong(param)
					break;

				case 'movie-this':
					retrieveOBDBInfo(param)
					break;
			}
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
switch (liriCommand) {
	case 'my-tweets':
		kunleTweets();
		break;
	case 'spotify-this-song':
		spotifySong(liriArg);
		break;
	case 'movie-this':
		retrieveOBDBInfo(liriArg);
		break;
	case 'do-what-it-says':
		doAsYerTold();
		break;
}
