$(document).ready(function () {
    // Genius API variables
    var currentArtist;
    var currentSong;
    var lyrics;

    // function to get lyrics based on artist and song names
    function getLyrics(artist, song) {
        var queryURL = "https://api.lyrics.ovh/v1/" + artist + "/" + song;

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // After data comes back from the request
            .then(function (response) {
                // console.log(queryURL);
                // console.log(response.lyrics);

                // parse lyrics correctly
                lyrics = response.lyrics.replace(/\n/g, "<br>");

                // adding lyrics to the lyrics div
                $("#lyrics").empty();
                $("#lyrics").append("<h1 id='lyrics-header'>Lyrics</h1>");
                $("#lyrics").append("<h3>Artist: " + currentArtist + " | Song: " + currentSong + "</h3>");
                $("#lyrics").append(lyrics);

                // if no lyrics are available for selected song
                // if (lyrics == "") {
                //     lyrics = "Sorry, lyrics not available at this time";
                // }
            });
    }

    // on click, show lyrics of selected song
    $(document).on("click", ".show-lyrics", function () {
        currentArtist = $(this).attr("data-artist");
        // console.log("currentArtist: " + currentArtist);
        currentSong = $(this).attr("data-song");
        // console.log("currentSong: " + currentSong);
        getLyrics(currentArtist, currentSong);
    });

    // on click, get top track data from last-fm API
    $("#playlist-button").on("click", function (event) {
        event.preventDefault();
        var apiKeyLastFM = "8e58ab9ad2424bc14ac0944a801793cd";

        var countryID = $("#country").val();
        var country = $("#country option:selected").text();

        var limit = $("#numresults").val().trim();
        var queryURL = "https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&api_key=" + apiKeyLastFM + "&country=" + country + "&limit=" + limit + "&format=json";

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (tracks) {
            // console.log(queryURL);
            // empty old song & lyric list
            $("#list").empty();
            $("#lyrics").empty();
            $("#empty-error").empty();
            // displays country flag of option selected
            $("#country-flag").append("<img src=" + "https://www.countryflags.io/" + countryID + "/shiny/64.png>");


            // only show results if user enters a limit from 1 to 50
            if (limit > 0 && limit < 51) {

                // show song-list div
                $("#song-list").show();

                const tracksResult = tracks.tracks;

                // initial array to hold tracks
                const trackArray = [];

                // create a for loop to iterate through tracksResult.track[i]
                for (let i = 0; i < tracksResult.track.length; i++) {
                    // log expected values
                    console.log("last-fm artist: " + tracksResult.track[i].artist.name);
                    console.log("last-fm song: " + tracksResult.track[i].name);
                    console.log("last-fm url: " + tracksResult.track[i].url);
                    console.log('--------------------------------');

                    // dynamically create key value pairs using square bracket notation and the index 
                    let newObject = {
                        artist: tracksResult.track[i].artist.name,
                        song: tracksResult.track[i].name,
                        url: tracksResult.track[i].url,

                        // function to pair song and artist name
                        topTrack: function () {
                            var topTitle = this.song + " by " + this.artist;
                            return topTitle;
                        }
                    };

                    // push newObject to trackArray & get topTrack
                    trackArray.push(newObject);
                    newObject.topTrack();

                    // create songListDiv to show artist, song & url
                    var songListDiv = $("<div>");
                    songListDiv.addClass("songListDiv");

                    // show song list only there are results
                    // if (trackArray.length > 0) {
                        songListDiv.append(newObject.topTrack() + " | <a href=" + newObject.url + " target='_blank'>Listen</a> | ");

                        // create link to show lyrics
                        var lyricsLink = $("<a>");
                        lyricsLink.addClass("show-lyrics");
                        lyricsLink.attr("href", "#lyrics");
                        lyricsLink.text("Show Lyrics");

                        // set artist and song data for lyric functionality
                        lyricsLink.attr("data-artist", newObject.artist);
                        lyricsLink.attr("data-song", newObject.song);

                        // append lyricsLink to songListDiv
                        songListDiv.append(lyricsLink);
                    // }

                    // append songListDiv to the song-link div
                    $("#list").append(songListDiv);
                }
            }
            // show error message if they do not enter a valid number
            else {
                // hide song-list div
                $("#song-list").hide();
                // error message
                $("#empty-error").text("Please enter a number from 1 to 50.");
            }

            // test to console each object in trackArray
            // for (let i = 0; i < trackArray.length; i++) {
            //     console.log("track " + i + ": " + trackArray[i].artist + " - " + trackArray[i].song + " (" + trackArray[i].url + ")");
            // }

        })
    });

    // initially hide the song list div
    $("#song-list").hide();
});