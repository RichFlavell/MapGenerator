<?php

	/*
	 *  Created By: Rich Flavell - 2013
	 *  Email: me@richflavell.com
	*/

	$xCoord = $_POST['x-coord'];
	$yCoord = $_POST['y-coord'];
	
	$fh = fopen('../data/'.$yCoord.'-'.$xCoord.'.REGION', 'w');
	
	for ($y = 0; $y < 100; $y++) {
		for ($x = 0; $x < 100; $x++) {
			if ($x == 99) {
				fwrite($fh, '1:0:0');
			}
			else {
				fwrite($fh, '1:0:0,');
			}
		}
		if ($y == 99) {
			;
		} else {
			fwrite($fh, "\n");
		}
	}
	
	fclose($fh);
	
	header('location: ../');