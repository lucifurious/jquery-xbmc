/**
 * jquery.xbmc.js
 * Copyright 2011, Pogostick, LLC. (http://www.pogostick.com/)
 *
 * Dual licensed under the MIT License and the GNU General Public License (GPL) Version 2.
 * See {@link http://www.pogostick.com/licensing/} for complete information.
 *
 * @copyright	Copyright 2011, Pogostick, LLC. (http://www.pogostick.com/)
 * @link		http://github.com/lucifurious/jquery-xbmc/ XBMC Plug-In for jQuery
 * @license		http://www.pogostick.com/licensing/
 * @author		Jerry Ablan <opensource@pogostick.com>
 * @package		jquery-xbmc
 * @version		1.0
 * @filesource
 */
(function($) {

	   	//********************************************************************************
		//* XBMC Client Plug-in
		//********************************************************************************

		/**
		 * Create our plug-in 
		 * @param options
		 */
		$.xbmc = function(options) {

			//*************************************************************************
			//* Properties
			//*************************************************************************

			/**
			 * @const object Our defaults
			 */
			var defaults = {
				/**
				 * @var string The XBMC server
				 */
				serverHostName : 'localhost',
				/**
				 * @var int The server's port
				 */
				serverPort : 8080,
				/**
				 * @var string Server access user
				 */
				serverUserName : 'xbmc',
				/**
				 * @var string Server access password
				 */
				serverPassword : null,
				/**
				 * @var boolean Server available flag
				 */
				serverAvailable : false,
				/**
				 * @var object An overridable mapping of available namespaces and methods
				 */
				namespaceMap : {
					JSONRPC : [
						'getNotificationFlags',
						'introspect',
						'notifyAll',
						'permission',
						'ping',
						'setNotificationFlags',
						'version'
					],

					Player : [
						'getActivePlayers'
					],

					AudioPlayer : [
						'bigSkipBackward',
						"bigSkipForward",
						'forward',
						'getPercentage',
						'getTime',
						'playPause',
						'rewind',
						'seekPercentage',
						'seekTime',
						'skipNext',
						'skipPrevious',
						'smallSkipBackward',
						'smallSkipForward',
						'state',
						'stop'
					],

					VideoPlayer : [
						'bigSkipBackward' ,
						"bigSkipForward",
						'forward',
						'getPercentage',
						'getTime',
						'playPause',
						'rewind',
						'seekPercentage',
						'seekTime',
						'skipNext',
						'skipPrevious',
						'smallSkipBackward',
						'smallSkipForward',
						'state',
						'stop'
					],

					PicturePlayer : [
						'moveDown' ,
						'moveLeft' ,
						'moveRight' ,
						'moveUp' ,
						'playPause' ,
						'rotate' ,
						'skipNext' ,
						'skipPrevious' ,
						'stop' ,
						'zoom' ,
						'zoomIn' ,
						'zoomOut'
					],

					Playlist : [
						'add',
						'clear',
						'getItems',
						'insert',
						'play',
						'remove',
						'shuffle',
						'skipNext',
						'skipPrevious',
						'unShuffle'
					],

					AudioPlaylist : [
						'add',
						'clear',
						'getItems',
						'insert',
						'play',
						'remove',
						'shuffle',
						'skipNext',
						'skipPrevious',
						'unShuffle'
					],

					VideoPlaylist : [
						'add',
						'clear',
						'getItems',
						'insert',
						'play',
						'remove',
						'shuffle',
						'skipNext',
						'skipPrevious',
						'unShuffle'
					],

					Files : [
						'download',
						'getDirectory',
						'getSources'
					],

					AudioLibrary : [
						'getAlbumDetails',
						'getAlbums',
						'getArtists',
						'getGenres',
						'getSongDetails',
						'getSongs',
						'scanForContent'
					],

					VideoLibrary : [
						'getEpisodeDetails',
						'getEpisodes',
						'getMovieDetails',
						'getMovies',
						'getMusicVideoDetails',
						'getMusicVideos',
						'getRecentlyAddedEpisodes',
						'getRecentlyAddedMovies',
						'getRecentlyAddedMusicVideos',
						'getSeasons',
						'getTVShowDetails',
						'getTVShows',
						'scanForContent'
					],

					System : [
						'getInfoBooleans',
						'getInfoLabels',
						'hibernate',
						'reboot',
						'shutdown',
						'suspend'
					],

					XBMC : [
						'getVolume',
						'log',
						'play',
						'quit',
						'setVolume',
						'startSlideshow',
						'toggleMute'
					],

					Input : [
						'back',
						'down',
						'home',
						'left',
						'right',
						'select',
						'up'
					]
				}
			};

			/**
			 * @const jQuery Our evil twin
			 */
			var _this = this;

			/**
			 * @var object Our settings
			 */
			_this.settings = {};
			
			//*************************************************************************
			//* Private Plug-in Methods
			//*************************************************************************

			/**
			* Constructor
			*/
			var _init = function() {
				_this.settings = $.extend({}, defaults, options);

				//	Initialize jsonRPC plug-in
				$.jsonRPC.setup({
					endPoint: '/jsonrpc'
				});
			};

			/**
			 * Makes an arbitrary XBMC JSONRPC request
			 * @param namespace
			 * @param validCommands
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			var _xbmcCommand = function(namespace,validCommands,cmd,params,success,error) {
				//	Allow for no params being passed
				if ( params && typeof(params) === 'function' ) {
					error = success;
					success = params;
					params = {};
				}

				if (-1 == $.inArray(cmd,validCommands)) {
					throw "The command \""+cmd+"\" is not valid.";
				} else {
					return _send( namespace + '.' + cmd, params, success, error );
				}
			};

			/**
			 * Sends a command to the server
			 * @param command
			 * @param commandParams
			 * @param success
			 * @param error
			 */
			var _send = function(command, commandParams, success, error) {
				return $.jsonRPC.request(command, {

					params : commandParams,

					success : function(result,rawResult,textStatus,xhrObject) {
						if ( success && typeof success === 'function') {
							success.call(_this, result, textStatus,xhrObject);
						}
					},

					error : function(result, xhrObject, textStatus, errorThrown) {
						if ( error && typeof error === 'function') {
							error.call(
								_this,
								{"error" : { "ajaxFailed" : true, "xhr" : xhrObject, "status" : textStatus, "errorThrown" : errorThrown }},
								result,
								xhrObject,
								textStatus,
								errorThrown
							);
						}
					}
				});
			};

			//*************************************************************************
			//* Public XBMC Namespace Methods
			//*************************************************************************

			/**
			 * The JSONRPC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.JSONRPC = function(cmd,params,success,error) {
				return _xbmcCommand('JSONRPC',_this.settings.namespaceMap.JSONRPC,cmd,params,success,error);
			};

			/**
			 * The Player namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Player)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.Player = function(cmd,params,success,error) {
				return _xbmcCommand('Player',_this.settings.namespaceMap.Player,cmd,params,success,error);
			};

			/**
			 * The AudioPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlayer)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.AudioPlayer = function(cmd,params,success,error) {
				return _xbmcCommand('AudioPlayer',_this.settings.namespaceMap.AudioPlayer,cmd,params,success,error);
			};

			/**
			 * The VideoPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlayer)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.VideoPlayer = function(cmd,params,success,error) {
				return _xbmcCommand('VideoPlayer',_this.settings.namespaceMap.VideoPlayer,cmd,params,success,error);
			};

			/**
			 * The PicturePlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#PicturePlayer)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.PicturePlayer = function(cmd,params,success,error) {
				return _xbmcCommand('PicturePlayer',_this.settings.namespaceMap.PicturePlayer,cmd,params,success,error);
			};

			/**
			 * The Playlist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Playlist)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.Playlist = function(cmd,params,success,error) {
				return _xbmcCommand('Playlist',_this.settings.namespaceMap.Playlist,cmd,params,success,error);
			};

			/**
			 * The AudioPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlaylist)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.AudioPlaylist = function(cmd,params,success,error) {
				return _xbmcCommand('AudioPlaylist',_this.settings.namespaceMap.AudioPlaylist,cmd,params,success,error);
			};

			/**
			 * The VideoPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlaylist)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.VideoPlaylist = function(cmd,params,success,error) {
				return _xbmcCommand('VideoPlaylist',_this.settings.namespaceMap.VideoPlaylist,cmd,params,success,error);
			};

			/**
			 * The Files namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Files)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.Files = function(cmd,params,success,error) {
				return _xbmcCommand('Files',_this.settings.namespaceMap.Files,cmd,params,success,error);
			};

			/**
			 * The AudioLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioLibrary)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.AudioLibrary = function(cmd,params,success,error) {
				return _xbmcCommand('AudioLibrary',_this.settings.namespaceMap.AudioLibrary,cmd,params,success,error);
			};

			/**
			 * The VideoLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoLibrary)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.VideoLibrary = function(cmd,params,success,error) {
				return _xbmcCommand('VideoLibrary',_this.settings.namespaceMap.VideoLibrary,cmd,params,success,error);
			};

			/**
			 * The System namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#System)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.System = function(cmd,params,success,error) {
				return _xbmcCommand('System',_this.settings.namespaceMap.System,cmd,params,success,error);
			};

			/**
			 * The XBMC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.XBMC = function(cmd,params,success,error) {
				return _xbmcCommand('XBMC',_this.settings.namespaceMap.XBMC,cmd,params,success,error);
			};

			/**
			 * The Input namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Input)
			 * @param cmd
			 * @param params
			 * @param success
			 * @param error
			 */
			_this.Input = function(cmd,params,success,error) {
				return _xbmcCommand('Input',_this.settings.namespaceMap.Input,cmd,params,success,error);
			};

			//*************************************************************************
			//* And kick it all off by calling init()
			//*************************************************************************

			//	Construct!
			_init();
		};

})(jQuery);