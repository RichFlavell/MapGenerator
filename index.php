<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="assets/css/reset.css"/>
		<link rel="stylesheet" type="text/css" href="assets/css/main.css"/>
		<script type="text/javascript" src="assets/js/mapEditor.js"></script>
		<title>2D Map Generator // By Rich Flavell</title>
	</head>
	<body>
		<header id="pallet">
			<ul id="pallet-list">
				<?php
					require 'scripts/checkImage.php';
					$directory = 'assets/images/tiles/';
					$imgCount = count(glob($directory . "*.png"));
					
					for ($x = 0; $x < $imgCount; $x++) {
						$src = $directory.$x.'.png';
						echo ( '<li><img id="tile-'.$x.'" src="'.$src.'" onclick="MapGenerator.updateSelectedTile(this, '.(strlen($x)).', '.CheckTransparent($src).')"/></li>' );
					}
				?>
			</ul>
			<input id="save" type="submit" value="Save" onclick="MapGenerator.Save()"/>
		</header>
		<div id="pallet-trigger" onclick="MapGenerator.triggerPallet()"></div>
		<img id="arrow" src="assets/images/style/arrow.png" onclick="MapGenerator.triggerPallet()"/>
		
		
		<canvas id="map-canvas" height="1600" width="1600"></canvas>
		
		<div id="mask">
			<div id="mask-input">
				<input type="text" id="y-coord" placeholder="Region Y Coord"/>
				<input type="text" id="x-coord" placeholder="Region X Coord"/>
				<input type="submit" value="Load Region" onclick="MapGenerator.Init()"/>
				
			</div>
		</div>
		
		<form name="phpsave" method="POST" action="scripts/saveFile.php" style="display: none">
			<input id="hidden-data" type="text" name="data"/>
			<input id="hidden-objects" type="text" name="objects"/>
			<input id="hidden-collisions" type="text" name="collisions"/>
			<input id="hidden-save-x-coord" type="text" name="save-x-coord"/>
			<input id="hidden-save-y-coord" type="text"  name="save-y-coord"/>
		</form>
		
		<form name="phpcreate" method="POST" action="scripts/createFile.php" style="display: none">
			<input id="hidden-x-coord" type="text" name="x-coord"/>
			<input id="hidden-y-coord" type="text"  name="y-coord"/>
		</form>
	</body>
</html>