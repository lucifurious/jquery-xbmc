# jQuery plug-in for XBMC

Hi folks, this is my first attempt at a jQuery plug-in, so be kind. ;)

I'm working on a new web interface for my XBMC server and needed a comprehensive jQuery object to do my communications.
This is the result and I thought I'd share.

It requires the [JSON-RPC plug-in](https://github.com/datagraph/jquery-jsonrpc) by Josh Huckabee.

## Example of Usage

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
Thanks to Josh Huckabee for creating and easy-to-use JSONRPC interface.
