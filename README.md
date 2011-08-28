# jQuery plug-in for XBMC

Hi folks, this is my first attempt at a jQuery plug-in, so be kind. ;)

I'm working on a new web interface for my XBMC server and needed a comprehensive jQuery object to do my communications.
This is the result and I thought I'd share.

It requires the [JSON-RPC plug-in](https://github.com/datagraph/jquery-jsonrpc) by Josh Huckabee.

## Using the Plug-in

I originally wanted the interface to reflect the namespaces available. After about three days of going back and forth between various iterations, I settled on the current interface.

Each namespace is a function within the plug-in and, when called, passes the arguments on to a centralized parameter handler/checker/sender. 
 
Every call supports a success and error callback as shown in the example below.

Basic call format is:

	yourApiObject.namespace('command',parameters,successCallback,errorCallback)

For instance:

	_xbmc.VideoPlayer('playPause');

would pause or play the currently playing video.

## Namespaces Available

The available namespaces are:

* JSONRPC
* Player
* AudioPlayer
* VideoPlayer
* PicturePlayer
* Playlist
* AudioPlaylist
* VideoPlaylist
* Files
* AudioLibrary
* VideoLibrary
* System
* XBMC
* Input

### Example Code

I will add some more examples if I get time.

	<script type="text/javascript">
	$(function(){

		var _xbmc = new $.xbmc({
			serverHostName : 'your.host.name.if.not.localhost'
		});

		_xbmc.JSONRPC( 'ping', function(response) {
			if ( 'pong' != response.result ) {
				alert('ping failed');
			} else {
				_xbmc.System( 'getInfoLabels', {labels:['Weather.Conditions','Weather.Temperature']}, function(response) {
					alert(JSON.stringify(response.result));
				});
			}
		});

	});
	</script>



## Authors, License, Development, Thanks

#### Authors
* Jerry Ablan <opensource@pogostick.com>
 
#### License
MIT & GPL

#### Development / Contributing
Fork and code.

#### Thanks
Thanks to Josh Huckabee for creating an easy-to-use JSONRPC interface.
