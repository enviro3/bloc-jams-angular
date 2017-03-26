(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function playSong
        * @desc plays current song
        */
        var playSong = function(song){
            currentBuzzObject.play();
            song.playing = true;
        }
        
        var stopSong = function(song){
            currentBuzzObject.stop(song);
            song.playing = null;
        }
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(futureSong){
            if (currentBuzzObject){
                stopSong(SongPlayer.currentSong);
            }
            
            currentBuzzObject = new buzz.sound(futureSong.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            currentBuzzObject.setVolume(SongPlayer.volume);
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
            });
        });
            
            SongPlayer.currentSong = futureSong;
        };
        
         /**
        * @function getSongIndex
        * @desc gets index of currently playing song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */ 
        SongPlayer.currentSong = null;
        
        /**
        * @desc volume control
        * @type {Number}
        */ 
        SongPlayer.volume = 80;
        
        /**
        *@desc Current playback time (in seconds) of currently playing song
        *@type {Number}
        */
        SongPlayer.currentTime = null;
        
        
        /**
        * @function SongPlayer.play
        * @desc creates a public method to play the song 
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if(SongPlayer.currentSong !== song){
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
        /**
        * @function SongPlayer.pause
        * @desc creates a public method to pause the song 
        * @param {Object} song
        */
        SongPlayer.pause = function(song){
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
         /**
        * @function SongPlayer.previous
        * @desc allows player bar to go to previous index and therefore song 
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        SongPlayer.next = function(){
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            if(currentSongIndex >= currentAlbum.songs.length){
                stopSong(SongPlayer.currentSong);
            }else{
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time){
            if (currentBuzzObject !== null) {
                currentBuzzObject.setTime(time);
            }
        };
        
        SongPlayer.setVolume = function(currentVolume){
            if (currentBuzzObject !== null){
                currentBuzzObject.setVolume(currentVolume); 
            }   
        }
        return SongPlayer;
    };
     angular
         .module('blocJams')
         .factory('SongPlayer',['$rootScope','Fixtures', SongPlayer]);
 })();