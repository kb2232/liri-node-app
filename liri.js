var Twitter = require('twitter');
// var spotify = require('spotify');
// var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');

// Read in the command line arguments
var cmdArgs = process.argv;

// The LIRI command will always be the second command line argument
var liriCommand = cmdArgs[2];

// The parameter to the LIRI command may contain spaces
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// kunleTweets will retrieve my last 20 tweets and display them together with the date
const kunleTweets = () => 
{
	// Append the command to the log file
	fs.appendFile('./log.txt', '\nbash-3.2$ >> node liri.js my-tweets\n', (err) => {
		if (err) throw err;
	});

  // Initialize the Twitter client
  //must use "client name"
	var client = new Twitter(keys.twitter);

	// Set the 'screen_name' to my Twitter handle
	var params = {screen_name: '@kunlebabatunde5', count: 20};

	// Retrieve the last 5 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			// Append the error string to the log file
			fs.appendFile('./log.txt', "ERROR: Retrieving user tweets -- " + error, (err) => {
				if (err) throw err;
				console.log("ERROR: Retrieving user tweets -- " + error);
			});
			return;
    } else 
    {
			var tweetOutputs = '------------------------\n'+'User Tweets:\n' +'------------------------\n\n';
			for (var i = 0; i < tweets.length; i++) {
				tweetOutputs += 'Created on: ' + tweets[i].created_at + '\n' +'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}
			// Append the output to the log file
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + tweetOutputs + '\n', (err) => {
				if (err) throw err;
				console.log(tweetOutputs);
			});
		}
	});
}

switch(liriCommand)
{
  case 'my-tweets':
    kunleTweets()
    break;
  case 'spotify-this-song':
    spotifySong(liriArg)
    break;
  case 'movie-this':
    retrieveOBDBInfo(liriArg)
    break;
  case 'do-what-it-says':
    doAsYerTold()
    break;

  default:
    // Append the command to the log file
  fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n\n', (err) => 
  {
		if (err) throw err;
		tweetOutputs = 'Usage:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';
		// Append the output to the log file
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + tweetOutputs + '\n', (err) => {
			if (err) throw err;
			console.log(tweetOutputs);
		});
  })
  break;
}

