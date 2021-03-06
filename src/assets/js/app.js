(function ($, root, undefined) {
	
	$(function () {
		
		'use strict';
		
		function app() {

			// -------------------------- App Vars --------------------------

			// Requires
			var SceneLoader = require('./app/loaders/SceneLoader.js');
			var PointerLockControls = require('./app/controllers/PointerLockControls.js');
			var CharacterController = require('./app/controllers/CharacterController.js')

			// Selectors
			var container = $('.app');
			var containerWidth = window.innerWidth;
			var containerHeight =  window.innerHeight;

			// Base
			var camera, scene, renderer;
			var light;

			// Shapes
			var geomtry, material, cube;

			// Colliders
			var colliders = [];

			// Loaders
			var sceneLoader;

			// -------------------------- Init ThreeJS --------------------------
			init();
			animate();

			function init() {

				// Scene
				scene = new THREE.Scene();

				// Camera
				camera = new THREE.PerspectiveCamera( 2, containerWidth / containerHeight, 1, 15000 );
				camera.position.set( 0, 0, -20 );

				// Light
				light = new THREE.AmbientLight( 0x404040 );
				scene.add( light );

				// Renderer
				renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
				renderer.setClearColor( 0xffffff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( containerWidth, containerHeight );
				renderer.autoClear = false;
				renderer.shadowMapEnabled = true;
				renderer.shadowMapType = THREE.PCFSoftShadowMap;

				container.append( renderer.domElement ); 

				// Listeners 
				window.addEventListener( 'resize', onWindowResize, false );

				// Build Scene
				buildScene();

			}

			function buildScene() {

				var sceneLoader = new THREE.SceneLoader();
				sceneLoader.load('assets/scenes/test/scene.json', function (obj) {
					scene.add(obj);
				});

			}

			// -- Rerender on Resize --
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function animate() {
				requestAnimationFrame( animate );
				render();
			}

			function render() {
				renderer.render( scene, camera );
			}

		}

		// -- Start App! --
		app();

	});
	
})(jQuery, this);
