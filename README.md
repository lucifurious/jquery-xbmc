# jQuery plug-in for XBMC

Hi folks, this is my first "released" jQuery plug-in, so be kind. ;)

I've written a few, but this one is not proprietary.

## Backstory

I've been working on a new web interface for my XBMC server and needed a comprehensive jQuery object to do my communications.

I found a few. Some in PHP, some in Javascript. Even one in Ruby (shudder!). But none of them were elegant. This plug-in is my attempt at something elegant and I thought I'd share.

## Requirements

It requires the [JSON-RPC plug-in](https://github.com/datagraph/jquery-jsonrpc) by Josh Huckabee.

## Interface Design Notes

I originally wanted the interface to reflect the namespaces available. After about three days of going back and forth between various iterations, I finally settled on an interface.

Each namespace was a function within the plug-in and, when called, passes the arguments on to a centralized parameter handler/checker/sender.

However, I found it clunky and would require maintenance as the API evolved/changed. So I scrapped the entire thing and started over. This time building a dynamic plug-in that uses XBMC's Introspect API call to "discover" what functions are available. It is with this data that the plug-in is able to learn which calls are available.

# Using the Plug-in

The plug-in, is just like almost every other jQuery plug-in. You include the code and off you go.

## Including the plug-in

The plug-in is contained within a single file. You can download it here or clone the repo. Your call.

Download (if you haven't already) the JSON-RPC plug-in from [here](https://github.com/datagraph/jquery-jsonrpc/).

Add a script tag for each plug-in to your page before the &gt;/BODY&lt; tag or in your &gt;HEAD&lt;. It'd probably be best if you included jquery-jsonrpc <em>before</em> this plug-in.

## Making Calls

The plug-in, once instantiated, provides virtual access to each XBMC namespace. See the list of available namespaces below.

Each call accepts two arguments. The first is the name of the namespace method to call. The second is an optional object containing one or more of the following options:

1. <em>params</em>            This is the parameter array that is passed, verbatim, to XBMC.
2. <em>success</em>           An optional callback called when the XBMC call has completed successfully.
3. <em>error</em>             An optional callback called when the XBMC call has completed unsuccessfully.
4. <em>async</em>             An optional boolean allowing you to change the synchronicity of the specific call.

### Call Format

The basic call format is then:

<code>
	yourApiObject.namespace('command',parameters)
</code>

### Example

<code>
	_xbmc.VideoPlayer('playPause');
</code>

This call would pause or play the currently playing video.

# Namespaces Reference

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

I will add some more examples when I get time.

	<script type="text/javascript">
	$(function(){

		var _xbmc = new $.xbmc({
			serverHostName : 'your.host.name.if.not.localhost'
		});

		//	Call the JSONRPC namespace's "ping" command
		_xbmc.JSONRPC( 'ping', {

			success : function(response) {
				if ( 'pong' != response.result ) {
					alert('ping failed');
				} else {

					//	Grab some weather...
					_xbmc.System('getInfoLabels', {
						params : {
							labels : [
								'Weather.Conditions',
								'Weather.Temperature'
							]
						},

						success : function(response) {
							alert(JSON.stringify(response.result));
						}
					});

				}
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
