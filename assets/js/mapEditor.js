/*
 *  Created By: Rich Flavell - 2013
 *  Email: me@richflavell.com
*/

var MapGenerator = {

	updatedTileData : new Array(101),
	updatedObjectData : new Array(101),
	updatedCollisionData : new Array(101),
	selectedTileNum : new Array(3),
	tmpxpos : 0,
	tmpypos : 0,
	xpos : 0,
	ypos : 0,

	Init: function()
	{
		var trigger = document.getElementById( 'pallet-trigger' );
		trigger.style.display = 'inline';
		var mask = document.getElementById( 'mask' );
		mask.style.display = 'none';
		
		var canvas = document.getElementById( 'map-canvas' );
		var context = canvas.getContext( '2d' );
		
		var xCoord = document.getElementById( 'x-coord' ).value;
		var yCoord = document.getElementById( 'y-coord' ).value;
		
		var selectedTileNum = 1;
		
		// Create arrays to store any alterations later on
		for (i = 0; i < MapGenerator.updatedTileData.length; i++) {
			MapGenerator.updatedTileData[i] = new Array(100);
		}
		
		for (i = 0; i < MapGenerator.updatedObjectData.length; i++) {
			MapGenerator.updatedObjectData[i] = new Array(100);
		}
		
		for (i = 0; i < MapGenerator.updatedCollisionData.length; i++) {
			MapGenerator.updatedCollisionData[i] = new Array(100);
		}
		
		// Grab data from file and write to canvas
		MapGenerator.HandleFile(yCoord, xCoord, canvas, context);
		
		canvas.addEventListener('mouseup', function(event) {
			clearInterval(drawLoop);
		});
		
		canvas.onmousemove = function(event) {
			var offsetLeft = canvas.offsetLeft;
			var offsetTop = canvas.offsetTop;
		
			var mousexpos = event.pageX - offsetLeft;
			var mouseypos = event.pageY - offsetTop;
			
			var tilex = Math.ceil(mousexpos / 16) - 1;
			var tiley = Math.ceil(mouseypos / 16) - 1;
			
			MapGenerator.xpos = tilex;
			MapGenerator.ypos = tiley;
		}
		
		canvas.addEventListener('mousedown', function(event) {
			drawLoop = setInterval(function() {
				if (MapGenerator.tmpxpos != MapGenerator.xpos || MapGenerator.tmpypos != MapGenerator.ypos) {
				
					MapGenerator.tmpxpos = MapGenerator.xpos;
					MapGenerator.tmpypos = MapGenerator.ypos;
					
					if (MapGenerator.selectedTileNum[1] != 0) {
						MapGenerator.updatedTileData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = MapGenerator.updatedTileData[MapGenerator.tmpypos][MapGenerator.tmpxpos];
						MapGenerator.updatedObjectData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = MapGenerator.selectedTileNum[1];
						MapGenerator.updatedCollisionData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = 1;
					} else {
						MapGenerator.updatedTileData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = MapGenerator.selectedTileNum[0];
						MapGenerator.updatedObjectData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = 0;
						MapGenerator.updatedCollisionData[MapGenerator.tmpypos][MapGenerator.tmpxpos] = 0;
					}
					
					var tmpImage = new Image();
					tmpImage.src = 'assets/images/tiles/' + MapGenerator.selectedTileNum[0] + '.png';
					tmpImage.onload = function() {
						context.drawImage(tmpImage, MapGenerator.tmpxpos * 16, MapGenerator.tmpypos * 16, 16, 16);
					}
				}
			}, 1);
		});
	},

	updateSelectedTile: function(img, i, object)
	{
		var clickedImageId = img.id.substr(img.id.length - i);
		MapGenerator.selectedTileNum[0] = clickedImageId;
		
		if (object != false) {
			MapGenerator.selectedTileNum[1] = clickedImageId;
			MapGenerator.selectedTileNum[2] = 1;
		} else {
			MapGenerator.selectedTileNum[1] = 0;
			MapGenerator.selectedTileNum[2] = 0;
		}
	},

	Save: function()
	{
		var form = document.forms['phpsave'];
		
		var data = document.getElementById( 'hidden-data' );
		var objects = document.getElementById( 'hidden-objects' );
		var collisions = document.getElementById( 'hidden-collisions' );
		var xCoord = document.getElementById( 'x-coord' ).value;
		var yCoord = document.getElementById( 'y-coord' ).value;
		
		var hiddenXCoord = document.getElementById( 'hidden-save-x-coord' );
		var hiddenYCoord = document.getElementById( 'hidden-save-y-coord' );
		
		hiddenXCoord.value = xCoord;
		hiddenYCoord.value = yCoord;
		for (i = 0; i < 100; i++) {
			MapGenerator.updatedTileData[i][100] = '*';
			MapGenerator.updatedObjectData[i][100] = '*';
			MapGenerator.updatedCollisionData[i][100] = '*';
		}
		
		data.value = MapGenerator.updatedTileData;
		objects.value = MapGenerator.updatedObjectData;
		collisions.value = MapGenerator.updatedCollisionData;
		
		form.submit();		
	},

	HandleFile: function(y, x, canvas, context)
	{
		var request = new XMLHttpRequest();
		request.open('GET', 'data/' + y + '-' + x +'.REGION?no-cache=' + new Date().getTime());
		request.onreadystatechange = function() {
			if (request.status != 404) {
				var tileSrc = new Array(100);
				for (i = 0; i < tileSrc.length; i++) {
					tileSrc[i] = new Array(100);
					for (o = 0; o < tileSrc[i].length; o++) {
						tileSrc[i][o] = new Array(3);
					}
				}
				
				var data = request.responseText;
				var lines = new Array(100);
				lines = data.split('\n');

				for (i = 0; i < lines.length; i++) {
					tileSrc[i] = lines[i].split(',');
					for (o = 0; o < tileSrc[i].length; o++) {
						tileSrc[i][o] = tileSrc[i][o].split(':');
					}
				}
				
				var listCount = document.getElementById( 'pallet-list' ).children.length;
				var tiles = new Array(listCount);
				for (i = 0; i < tiles.length; i++) {
					tiles[i] = document.getElementById( 'tile-'+ i );
				}
				
				// Add image to canvas from src and load data into the stores
				for (y = 0; y < 100; y++) {
					for (x = 0; x < 100; x++) {
						for(z = 0; z < 3; z++) {
							if (typeof tiles[tileSrc[y][x][z]] !== undefined && tiles[tileSrc[y][x][z]] !== null) {
								if (z < 2) {
									MapGenerator.Draw(y, x, tiles[tileSrc[y][x][z]], canvas, context);
								}

								MapGenerator.updatedTileData[y][x] = tileSrc[y][x][0];
								MapGenerator.updatedObjectData[y][x] = tileSrc[y][x][1];
								MapGenerator.updatedCollisionData[y][x] = tileSrc[y][x][2];
							}
						}
					}
				}
			} else {
				var form = document.forms['phpcreate'];
				var xCoord = document.getElementById( 'x-coord' ).value;
				var yCoord = document.getElementById( 'y-coord' ).value;
				
				var hiddenXCoord = document.getElementById( 'hidden-x-coord' );
				var hiddenYCoord = document.getElementById( 'hidden-y-coord' );
				
				hiddenXCoord.value = xCoord;
				hiddenYCoord.value = yCoord;
				
				form.submit();
			}
		}
		request.send();
	},

	triggerPallet: function()
	{
		var palletTrigger = document.getElementById( 'pallet-trigger' );
		var arrow = document.getElementById( 'arrow' );

		if (palletTrigger.style.top == '') {
			var pallet = document.getElementById( 'pallet' );
			pallet.style.display = 'inline';
			
			var palletList = document.getElementById( 'pallet' );
			var params = palletList.getBoundingClientRect();
			
			
			palletTrigger.style.top = params.bottom + 'px';
			arrow.style.top = params.bottom + 'px';
			arrow.style.transform = 'rotate(180deg)';
		} else {
			var pallet = document.getElementById( 'pallet' );
			pallet.style.display = 'none';
			
			palletTrigger.style.top = '';
			arrow.style.top = '';
			arrow.style.transform = '';
		}
	},

	Draw: function(y, x, tile, canvas, context)
	{
	    context.drawImage(tile, x * 16, y * 16, 16, 16);
	}

};