<?php

	/*
	 *  Created By: Rich Flavell - 2013
	 *  Email: me@richflavell.com
	*/

	function CheckTransparent($img) {
		if(isTransparent($img) ) {
			return 'true';
		} else {
			return 'false';
		}
	}
	
    function isTransparent($img){
        return (ord(file_get_contents($img, false, NULL, 25, 1)) & 4);
    }
