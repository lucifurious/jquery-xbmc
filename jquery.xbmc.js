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
			 */
			var _xbmcCommand = function(namespace,validCommands,cmd,options) {
				if (-1 == $.inArray(cmd,validCommands)) {
					throw "The command \""+cmd+"\" is not valid.";
				} else {
					var _options = $.extend({},options);

					if (!_options.params) {
						_options.params = {};
					}
					
					return $.jsonRPC.request(namespace + '.' + cmd, _options);
				}
			};

			//*************************************************************************
			//* Public XBMC Namespace Methods
			//*************************************************************************

			/**
			 * The JSONRPC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
			 * @param cmd
			 * @param params
			 */
			_this.JSONRPC = function(cmd,params) {
				return _xbmcCommand('JSONRPC',_this.settings.namespaceMap.JSONRPC,cmd,params);
			};

			/**
			 * The Player namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Player)
			 * @param cmd
			 * @param params
			 */
			_this.Player = function(cmd,params) {
				return _xbmcCommand('Player',_this.settings.namespaceMap.Player,cmd,params);
			};

			/**
			 * The AudioPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlayer)
			 * @param cmd
			 * @param params
			 */
			_this.AudioPlayer = function(cmd,params) {
				return _xbmcCommand('AudioPlayer',_this.settings.namespaceMap.AudioPlayer,cmd,params);
			};

			/**
			 * The VideoPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlayer)
			 * @param cmd
			 * @param params
			 */
			_this.VideoPlayer = function(cmd,params) {
				return _xbmcCommand('VideoPlayer',_this.settings.namespaceMap.VideoPlayer,cmd,params);
			};

			/**
			 * The PicturePlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#PicturePlayer)
			 * @param cmd
			 * @param params
			 */
			_this.PicturePlayer = function(cmd,params) {
				return _xbmcCommand('PicturePlayer',_this.settings.namespaceMap.PicturePlayer,cmd,params);
			};

			/**
			 * The Playlist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Playlist)
			 * @param cmd
			 * @param params
			 */
			_this.Playlist = function(cmd,params) {
				return _xbmcCommand('Playlist',_this.settings.namespaceMap.Playlist,cmd,params);
			};

			/**
			 * The AudioPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlaylist)
			 * @param cmd
			 * @param params
			 */
			_this.AudioPlaylist = function(cmd,params) {
				return _xbmcCommand('AudioPlaylist',_this.settings.namespaceMap.AudioPlaylist,cmd,params);
			};

			/**
			 * The VideoPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlaylist)
			 * @param cmd
			 * @param params
			 */
			_this.VideoPlaylist = function(cmd,params) {
				return _xbmcCommand('VideoPlaylist',_this.settings.namespaceMap.VideoPlaylist,cmd,params);
			};

			/**
			 * The Files namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Files)
			 * @param cmd
			 * @param params
			 */
			_this.Files = function(cmd,params) {
				return _xbmcCommand('Files',_this.settings.namespaceMap.Files,cmd,params);
			};

			/**
			 * The AudioLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioLibrary)
			 * @param cmd
			 * @param params
			 */
			_this.AudioLibrary = function(cmd,params) {
				return _xbmcCommand('AudioLibrary',_this.settings.namespaceMap.AudioLibrary,cmd,params);
			};

			/**
			 * The VideoLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoLibrary)
			 * @param cmd
			 * @param params
			 */
			_this.VideoLibrary = function(cmd,params) {
				return _xbmcCommand('VideoLibrary',_this.settings.namespaceMap.VideoLibrary,cmd,params);
			};

			/**
			 * The System namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#System)
			 * See also (@link http://wiki.xbmc.org/index.php?title=InfoLabels) for all the various InfoLabels
			 * @param cmd
			 * @param params
			 */
			_this.System = function(cmd,params) {
				return _xbmcCommand('System',_this.settings.namespaceMap.System,cmd,params);
			};

			/**
			 * The XBMC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
			 * @param cmd
			 * @param params
			 */
			_this.XBMC = function(cmd,params) {
				return _xbmcCommand('XBMC',_this.settings.namespaceMap.XBMC,cmd,params);
			};

			/**
			 * The Input namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Input)
			 * @param cmd
			 * @param params
			 */
			_this.Input = function(cmd,params) {
				return _xbmcCommand('Input',_this.settings.namespaceMap.Input,cmd,params);
			};

			//*************************************************************************
			//* Public XBMC Helper Methods
			//*************************************************************************

			/**
			 * Given one or more info labels, retrieve and return them
			 * @param label One or more labels. Accepts string or array
			 */
			_this.getInfoLabels = function(label,async) {
				var _labels = label;
				var _singleLabel = false;
				var _result = [];

				if (!$.isArray(_labels)){
					_labels = new Array(_labels);
					_singleLabel = true;
				}

				//	Make the call...
				_this.System( 'getInfoLabels', {
					params : {
						labels : _labels
					},

					success : function(response) {
						if (response.result) {
							_result = ( _singleLabel ? response.result[label] : response.result );
						}
					},

					//	Synchronous unless otherwise specified
					async : true === async
				});

				return _result;
			};

			//*************************************************************************
			//* And kick it all off by calling init()
			//*************************************************************************

			//	Construct!
			_init();
		};

})(jQuery);