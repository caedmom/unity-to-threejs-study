(function ($, root, undefined) {
	
	$(function () {
		
		'use strict';
		
		function app() {

			// -------------------------- App Vars --------------------------

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

			// -------------------------- Init ThreeJS --------------------------

			init();
			animate();

			function init() {

				// Scene
				scene = new THREE.Scene();

				// Camera
				camera = new THREE.PerspectiveCamera( 30, containerWidth / containerHeight, 1, 5000 );
				camera.position.set( 0, 0, 250 );

				// Light
				light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.color.setHSL( 0.1, 1, 0.95 );
				light.position.set( -1, 1.75, 1 );
				light.position.multiplyScalar( 50 );
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
				
				createBox();

			}

			function createBox() {

				var box, boxGeo, boxMat;

				boxGeo = new THREE.SphereGeometry( 5, 32, 32 );
				boxMat = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
				box = new THREE.Mesh( boxGeo, boxMat );

				scene.add( box );

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
