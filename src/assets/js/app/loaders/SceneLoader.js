THREE.SceneLoader = function () {
	

	// ---------------------------------------------------------------------------
	this.load = function (url, onLoad) {

		var loader = new THREE.ObjectLoader();
		loader.load(url, function (obj) {

			if ( onLoad !== undefined ) onLoad();

		});

	};

	// ---------------------------------------------------------------------------

};