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
;
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
				'JSONRPC.Introspect' : {}
			},
			/**
			 * @var object An lookup cache of called methods
			 */
			_namespaceCache : {}
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
		 * Finds the method name in a namespace, returns false if not found
		 * @param namespace
		 * @param cmd
		 */
		var _hasCommand = function(namespace,cmd) {
			var _command = namespace + '.' + cmd;

			//	Cached?
			if (_this.settings._namespaceCache[_command]) {
				return _this.settings._namespaceCache[_command];
			}

			//	Look it up
			for ( var _methodName in _this.settings.namespaceMap )
			{
				if (_command.toLowerCase().trim() == _methodName.toLowerCase().trim()) {
					_this.settings._namespaceCache[_command] = _methodName;
					return _methodName;
				}
			}

			return false;
		};

		/**
		 * Makes an arbitrary XBMC JSONRPC request
		 * @param namespace
		 * @param cmd
		 * @param options
		 */
		var _xbmcCommand = function(namespace, cmd, options) {
			var _command = _hasCommand(namespace,cmd);

			if (!_command) {
				throw "The command \"" + cmd + "\" is not valid.";
			} else {
				//	Allow options to be the success and error method
				if ($.isFunction(options)) {
					var _callback = options;

					options = {
						success: _callback,
						error: _callback
					};
				}

				var _options = $.extend({}, options);

				if (!_options.params) {
					_options.params = {};
				}

				//	Otherwise send on to server...
				return $.jsonRPC.request(_command, _options);
			}
		};

		/**
		 * Constructor
		 */
		var _init = function() {
			_this.settings = $.extend({}, defaults, options);

			//	Initialize jsonRPC plug-in
			$.jsonRPC.setup({
				endPoint: '/jsonrpc'
			});

			/**
			 * @var object Introspective method list
			 */
			var _xbmcMethods = null;

			//	Call introspect and populate the namespace map...
			_xbmcCommand(
				'JSONRPC',
				'introspect',
				{
					success : function(response) {
						if (!response.result) {
							alert('Cannot retrieve introspect from server. Cannot continue.');
							throw 'Cannot retrieve introspect from server. Cannot continue.';
						} else {
							if (response.result.methods) {
								_xbmcMethods = response.result.methods;
							}
						}
					},

					async : false
				}
			);

			if (!_xbmcMethods) {
				alert('Cannot/did not retrieve introspect from server. Cannot continue.');
				throw 'Cannot/did not retrieve introspect from server. Cannot continue.';
			} else {
				for ( var _methodName in _xbmcMethods ) {
					if (_methodName) {
						var _parts = _methodName.split('.');

						if (2 == _parts.length) {
							if (!_this.settings.namespaceMap[_methodName]) {
								_this.settings.namespaceMap[_methodName] = _xbmcMethods[_methodName];
//								console.log('Added command: ' + _methodName);
							}

							//	If there is no namespace helper function, define it
							if (!$.isFunction(_this[_parts[0]])) {
								var _function = "_this['" + _parts[0] + "'] = function(cmd,options) { return _xbmcCommand('" + _parts[0] + "',cmd,options); }";
								eval(_function);
//								console.log('Added method: _this.' + _parts[0]);
							}
						}
					}
				}
			}
		};

		//*************************************************************************
		//* Public XBMC Helper Methods
		//*************************************************************************

		/**
		 * Given one or more info labels, retrieve and return them
		 * @param label One or more labels. Accepts string or array
		 */
		_this.getInfoLabels = function(label, async) {
			var _labels = label;
			var _singleLabel = false;
			var _result =
				[
				];

			if (!$.isArray(_labels)) {
				_labels = new Array(_labels);
				_singleLabel = true;
			}

			//	Make the call...
			_this.System('getInfoLabels', {
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
		//* Public XBMC Namespace Methods
		//*************************************************************************

//		/**
//		 * The JSONRPC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
//		 * @param cmd
//		 * @param params
//		 */
//		_this.JSONRPC = function(cmd, params) {
//			return _xbmcCommand('JSONRPC', cmd, params);
//		};
//
//		/**
//		 * The Player namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Player)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.Player = function(cmd, options) {
//			return _xbmcCommand('Player', cmd, options);
//		};
//
//		/**
//		 * The AudioPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlayer)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.AudioPlayer = function(cmd, options) {
//			return _xbmcCommand('AudioPlayer', cmd, options);
//		};
//
//		/**
//		 * The VideoPlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlayer)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.VideoPlayer = function(cmd, options) {
//			return _xbmcCommand('VideoPlayer', cmd, options);
//		};
//
//		/**
//		 * The PicturePlayer namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#PicturePlayer)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.PicturePlayer = function(cmd, options) {
//			return _xbmcCommand('PicturePlayer', cmd, options);
//		};
//
//		/**
//		 * The Playlist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Playlist)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.Playlist = function(cmd, options) {
//			return _xbmcCommand('Playlist', cmd, options);
//		};
//
//		/**
//		 * The AudioPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioPlaylist)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.AudioPlaylist = function(cmd, options) {
//			return _xbmcCommand('AudioPlaylist', cmd, options);
//		};
//
//		/**
//		 * The VideoPlaylist namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoPlaylist)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.VideoPlaylist = function(cmd, options) {
//			return _xbmcCommand('VideoPlaylist', cmd, options);
//		};
//
//		/**
//		 * The Files namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Files)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.Files = function(cmd, options) {
//			return _xbmcCommand('Files', cmd, options);
//		};
//
//		/**
//		 * The AudioLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#AudioLibrary)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.AudioLibrary = function(cmd, options) {
//			return _xbmcCommand('AudioLibrary', cmd, options);
//		};
//
//		/**
//		 * The VideoLibrary namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#VideoLibrary)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.VideoLibrary = function(cmd, options) {
//			return _xbmcCommand('VideoLibrary', cmd, options);
//		};
//
//		/**
//		 * The System namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#System)
//		 * See also (@link http://wiki.xbmc.org/index.php?title=InfoLabels) for all the various InfoLabels
//		 * @param cmd
//		 * @param options
//		 */
//		_this.System = function(cmd, options) {
//			return _xbmcCommand('System', cmd, options);
//		};
//
//		/**
//		 * The XBMC namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#XBMC)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.XBMC = function(cmd, options) {
//			return _xbmcCommand('XBMC', cmd, options);
//		};
//
//		/**
//		 * The Input namespace (@link http://wiki.xbmc.org/index.php?title=JSON_RPC#Input)
//		 * @param cmd
//		 * @param options
//		 */
//		_this.Input = function(cmd, options) {
//			return _xbmcCommand('Input', cmd, options);
//		};

		//*************************************************************************
		//* And kick it all off by calling init()
		//*************************************************************************

		//	Construct!
		_init();
	};

})(jQuery);