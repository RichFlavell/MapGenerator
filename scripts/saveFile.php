<?php

	/*
	 *  Created By: Rich Flavell - 2013
	 *  Email: me@richflavell.com
	*/

	$data = $_POST['data'];
	$objects = $_POST['objects'];
	$collisions = $_POST['collisions'];
	
	$xCoord = $_POST['save-x-coord'];
	$yCoord = $_POST['save-y-coord'];
	
	$fh = fopen('../data/'.$yCoord.'-'.$xCoord.'.REGION', 'w');
	
	$tileLines = explode(',*', $data);
	
	$tileData = array();
	for ( $i = 0; $i < count($tileLines); $i++ ) {
		$tileData[$i] = array();
	}
	for( $i = 0; $i < count($tileLines); $i++ ) {
		$tileData[$i] = explode(',', $tileLines[$i]);
	}
	
	$objectLines = explode(',*', $objects);
	
	$objectData = array();
	for ( $i = 0; $i < count($objectLines); $i++ ) {
		$objectData[$i] = array();
	}
	for( $i = 0; $i < count($objectLines); $i++ ) {
		$objectData[$i] = explode(',', $objectLines[$i]);
	}
	
	$collisionLines = explode(',*', $collisions);
	
	$collisionData = array();
	for ( $i = 0; $i < count($collisionLines); $i++ ) {
		$collisionData[$i] = array();
	}
	for( $i = 0; $i < count($collisionLines); $i++ ) {
		$collisionData[$i] = explode(',', $collisionLines[$i]);
	}
	
	
	for ($y = 0; $y < 100; $y++) {
		for ($x = 0; $x < 101; $x++) {
			if ($y == 0) {
				if ($x == 99) {
					fwrite($fh, $tileData[$y][$x].':'.$objectData[$y][$x].':'.$collisionData[$y][$x]);
					fwrite($fh, "\n");
					$x = 101;
				} else {
					fwrite($fh, $tileData[$y][$x].':'.$objectData[$y][$x].':'.$collisionData[$y][$x].',');
				}
			} else {
				if ($x == 0) {
					;
				} else if ($x == 100) {
					fwrite($fh, $tileData[$y][$x].':'.$objectData[$y][$x].':'.$collisionData[$y][$x]);
					if ($y != 99) {
						fwrite($fh, "\n");
					}
				} else {
					fwrite($fh, $tileData[$y][$x].':'.$objectData[$y][$x].':'.$collisionData[$y][$x].',');
				}
			}
		}
	}
	
	fclose($fh);
	
	header('location: ../');