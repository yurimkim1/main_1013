
class Game  {
	
	constructor(nick) {
		if (!Detector.webgl) Detector.addGetWebGLMessage();
		//////////////////////////////////////////////	
		// Game 클래스 객체화 할 때 nick을 넘겨 받아서 userNick 속성에 저장함
		this.userNick = nick;
		//////////////////////////////////////////////	
		
		

		this.modes = Object.freeze({
			NONE: Symbol("none"),
			PRELOAD: Symbol("preload"),
			INITIALISING: Symbol("initialising"),
			CREATING_LEVEL: Symbol("creating_level"),
			ACTIVE: Symbol("active"),
			GAMEOVER: Symbol("gameover")
		});
		this.mode = this.modes.NONE;

	

		this.container;
		this.player;
		this.cameras;
		this.camera;
		this.scene;
		this.textMesh1;
		this.textMesh2;
		this.textMesh3;
		this.textMesh4;
		this.textMesh5;
		this.textMesh6;
		this.textMesh7;
		this.renderer;
		this.ytRenderer;
		this.animations = {};
		this.assetsPath = 'assets/';

		this.colliders = [];
		this.remotePlayers = [];
		this.remoteColliders = [];
		this.initialisingPlayers = [];
		this.remoteData = [];

		this.messages = {
			text: [
				"Welcome to Blockland",
				"GOOD LUCK!"
			],
			index: 0
		}

		this.container = document.createElement('div');
		this.container.style.height = '100%';
		document.body.appendChild(this.container);

		const sfxExt = SFX.supportsAudioType('mp3') ? 'mp3' : 'ogg';

		const game = this;

		this.anims = ['Walking', 'Walking Backwards', 'Turn', 'Running', 'Pointing', 'Talking', 'Pointing Gesture'];

		const options = {
			assets: [
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`,
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`,
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`,
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`,
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`,
				`${this.assetsPath}images/KakaoTalk_20210916_195442737.png`
			],
			oncomplete: function () {
				game.init();
			}
		}

		

		this.anims.forEach(function (anim) { options.assets.push(`${game.assetsPath}fbx/anims/${anim}.fbx`) });

		this.mode = this.modes.PRELOAD;

		this.clock = new THREE.Clock();

		const preloader = new Preloader(options);

		window.onError = function (error) {
			console.error(JSON.stringify(error));
		}
	}

	initSfx() {
		this.sfx = {};
		this.sfx.context = new (window.AudioContext || window.webkitAudioContext)();
		this.sfx.gliss = new SFX({
			context: this.sfx.context,
			src: { mp3: `${this.assetsPath}sfx/gliss.mp3`, ogg: `${this.assetsPath}sfx/gliss.ogg` },
			loop: false,
			volume: 0.3
		});
	}

	set activeCamera(object) {
		this.cameras.active = object;
	}


	init() {
		this.mode = this.modes.INITIALISING;

		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x00a0f0);

		const ambient = new THREE.AmbientLight(0xaaaaaa);
		this.scene.add(ambient);


		const light = new THREE.DirectionalLight(0xaaaaaa);
		light.position.set(30, 100, 40);
		light.target.position.set(0, 0, 0);

		light.castShadow = true;

		const lightSize = 500;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 500;
		light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
		light.shadow.camera.right = light.shadow.camera.top = lightSize;

		light.shadow.bias = 0.0039;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;




		this.sun = light;
		this.scene.add(light);
		// --------------------------------------------------------------------------------------------------------------------
		// -----------------------------------------------------텍 스 트-------------------------------------------------------
		// --------------------------------------------------------------------------------------------------------------------
		// 텍스트1 : Stage(기타)
		const fontLoader = new THREE.FontLoader();
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('Stage', {
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center(); // 폰트 중심점 설정하기
			game.textMesh1 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh1.castShadow = true
			game.textMesh1.position.set(-1000, 900, -1500) // 텍스트 위치
			game.scene.add(game.textMesh1)
		});

		
		
		// 텍스트1 팀명 : BIT 
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('BIT', {
				
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh2 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh2.castShadow = true
			game.textMesh2.position.set(-1300, 900, -6000) // 텍스트 위치
			game.scene.add(game.textMesh2)
		});
		// 텍스트2 팀명 : MetaUS
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('MetaUS ', {

				
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh3 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh3.castShadow = true
			game.textMesh3.position.set(4000, 900, -7000) // 텍스트 위치
			game.textMesh3.rotation.y += 200
			game.scene.add(game.textMesh3)
		});
		// 텍스트3 팀명 : 4Runner
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('4Runner ', {
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh4 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh4.castShadow = true
			game.textMesh4.position.set(7000, 900, -2500) // 텍스트 위치
			game.textMesh4.rotation.y = 30
			game.scene.add(game.textMesh4)
		});
		// 텍스트4 팀명 : 힐링캠프
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('Healing Camp ', {
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh5 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh5.castShadow = true
			game.textMesh5.position.set(-7500, 900, 0) // 텍스트 위치
			game.textMesh5.rotation.y = 20
			game.scene.add(game.textMesh5)
		});
		// 텍스트5 팀명 : Creeps
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('Creeps', {
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh6 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			
			game.textMesh6.castShadow = true
			game.textMesh6.position.set(-6000, 800, -5000) // 텍스트 위치
			game.textMesh6.rotation.y = 19
			game.scene.add(game.textMesh6)
		});
		// 텍스트6 팀명 : KMH
		fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
			const fgeometry = new THREE.TextGeometry('KMH', {
				font: font,
				size: 500, // 텍스트 크기
				height: 20, // 돌출 두께
				curveSegments: 12, // 곡선의 점 : 기본값 12
				bevelEnabled: true, // 윤곽선 on
				bevelThickness: 10, // 윤곽선 두께? : 기본값 10
				bevelSize: 8, //텍스트 윤곽선 : 기본값 8
				bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
				bevelSegments: 5
			});
			fgeometry.center();
			game.textMesh7 = new THREE.Mesh(fgeometry, [
				new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
				new THREE.MeshPhongMaterial({ color: 0x5c2301 })	 // side
			])
			game.textMesh7.castShadow = true
			game.textMesh7.position.set(7500, 800, 1000) // 텍스트 위치
			game.textMesh7.rotation.y = 17
			game.scene.add(game.textMesh7)
		});
		// // 동영상 화면 텍스쳐
		const video = document.getElementById('localVideo');
		//video.play(); // 필수 자동재생
		const videoTexture = new THREE.VideoTexture(video);
		const videoMaterial = new THREE.MeshBasicMaterial({
			map: videoTexture,
			side: THREE.DoubleSide, // DoubleSide 양쪽 면이 다 보이게
			overdraw: true
		});
		videoTexture.minFilter = THREE.LinearFilter; // 원래는 1920x960 이런식으로 영상의 사이즈에 맞게 설정해야하는데 
		videoTexture.magFilter = THREE.LinearFilter; // 이 두개를 쓰면 그런 경고 사라짐

		const videoGeometry = new THREE.PlaneGeometry(10500, 4700, 2000);  // 동영상 재생 화면 생성 및 크기조정
		const videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);  // 동영상 화면 및 videoMaterial
		videoScreen.position.set(0, 2000, 3920); //이게 맞는 위치
		videoScreen.rotation.y = Math.PI
		this.scene.add(videoScreen);

		
		const video1 = document.getElementById('video1');
		video1.play(); // 필수 자동재생
		const videoTexture1 = new THREE.VideoTexture(video1);
		const videoMaterial1 = new THREE.MeshBasicMaterial({
		   map: videoTexture1,
		   side: THREE.FrontSide, // DoubleSide 양쪽 면이 다 보이게
		   overdraw: true
		});
		videoTexture1.minFilter = THREE.LinearFilter; // 원래는 1920x960 이런식으로 영상의 사이즈에 맞게 설정해야하는데 
		videoTexture1.magFilter = THREE.LinearFilter; // 이 두개를 쓰면 그런 경고 사라짐
  
		const videoGeometry1 = new THREE.PlaneGeometry(500, 500, 2000);  // 동영상 재생 화면 생성 및 크기조정
		const videoScreen1 = new THREE.Mesh(videoGeometry1, videoMaterial1);  // 동영상 화면 및 videoMaterial
		videoScreen1.position.set(-700, 300, -6190); //이게 맞는 위치
		this.scene.add(videoScreen1);

		// 유튜브 영상 렌더
		// const bufferCubegeometry = new THREE.BoxBufferGeometry(500, 500, 500);
		// const cubeMaterial = new THREE.MeshBasicMaterial({
		// 	color: 0xffff00,
		// 	wireframe: false // 뼈대 보기
		// });
		// this.cubeBufferMesh = new THREE.Mesh(bufferCubegeometry, cubeMaterial);
		// this.cubeBufferMesh.position.set(0, 500, 0)

		// this.scene.add(this.cubeBufferMesh);
		
		// const youtubeGeometry = new THREE.PlaneBufferGeometry(15000, 10000, 1000);
		// const youtbeuMaterial = new THREE.MeshBasicMaterial({
		// 	side: THREE.DoubleSide
		// })

		// const youtubeScreen = new THREE.Mesh(youtubeGeometry, group.material);
		// const youtubeScreen = new THREE.Mesh(youtubeGeometry, youtuMaterial);
		// youtubeScreen.position.set(0, 2000, 3920); //위치
		// youtubeScreen.position.set(0, 2000, 0);

		
		// youtubeScreen
		// this.scene.add(youtubeScreen);
		// this.scene.add( group );
		// this.scene.add(elem);
		// const startButton = document.getElementById('startButton'); //id값아 startButton 일 때
		// startButton.addEventListener('click', this.init); //버튼을 클릭하면 음악재생

		// const overlay = document.getElementById( 'overlay' );
		// overlay.remove();

		// 사운드
		// const listener = new THREE.AudioListener();
		// this.camera.add(listener);

		// // create a global audio source
		// const sound = new THREE.Audio(listener);

		// // load a sound and set it as the Audio object's buffer
		// const audioLoader = new THREE.AudioLoader();
		// audioLoader.load('assets/sound/bensound-ukulele.mp3', function (buffer) {
		// 	sound.setBuffer(buffer);
		// 	sound.setLoop(true);
		// 	sound.setVolume(0.5);
		// 	sound.play();
		// });

		// ground
		const tLoader = new THREE.TextureLoader();
		const groundTexture = tLoader.load(`${this.assetsPath}images/KakaoTalk_20210916_161725622.jpg`);
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set(8, 8);
		groundTexture.encoding = THREE.sRGBEncoding;

		const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
		mesh.rotation.x = - Math.PI / 2;
		mesh.receiveShadow = true;
		this.scene.add(mesh);

		// 그리드
		// const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
		// mesh.rotation.x = - Math.PI / 2;
		// //mesh.position.y = -100;
		// mesh.receiveShadow = true;
		// this.scene.add( mesh );

		const grid = new THREE.GridHelper(5000, 40, 0x000000, 0x000000);
		//grid.position.y = -100;
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		this.scene.add(grid);

		const loader = new THREE.FBXLoader();
		const MLoader = new THREE.MaterialLoader();

		//stage "#CCEEFF" 하늘색
		const geometry = new THREE.BoxGeometry(11000, 100, 3000); // 5000,x,x
		const material = new THREE.MeshBasicMaterial({ color: "black", wireframe: false });
		const stage = new THREE.Mesh(geometry, material); 												//시작할때 서있는 스테이지박스
		stage.position.set(0, 100, 2950);
		this.colliders.push(stage);
		this.scene.add(stage);

		// //스크린 바깥
		// const geomscreenout = new THREE.BoxGeometry(11000, 4400, 80); // 5000,3000,80
		// const materscreenout = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
		// const screenout = new THREE.Mesh(geomscreenout, materscreenout);
		// screenout.position.set(0, 2300, 4000);
		// this.colliders.push(screenout);
		// this.scene.add(screenout);

		// //스크린 안
		// const geomscreenin = new THREE.BoxGeometry(10500, 3800, 100);  // 2500
		// const materscreenin = new THREE.MeshBasicMaterial({ color: 'white', wireframe: false });
		// const screenin = new THREE.Mesh(geomscreenin, materscreenin);
		// screenin.position.set(0, 2150, 4000);
		// this.colliders.push(screenin);
		// this.scene.add(screenin);

		// 계단
		loader.load(`${this.assetsPath}fbx/SM_Buildings_Stairs_1x2_01P.fbx`, function (Stair) {
			Stair.position.set(-300, 0, 1500);
			Stair.scale.set(5, 3, 3);
			Stair.rotation.y = Math.PI / 1;

			tLoader.load(`${game.assetsPath}images/PolygonPrototype_Texture_04.png`, function (Stairtext) {
				Stair.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = Stairtext;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(Stair);
		});
		//차
		loader.load(`${this.assetsPath}fbx/SM_Veh_Car_Sports_01.fbx`, function (Car) {
			Car.position.set(-3900, 150, 3000);
			Car.scale.set(3, 3, 3);
			Car.rotation.y = Math.PI / 1.4;

			tLoader.load(`${game.assetsPath}images/PolygonPrototype_Texture_04.png`, function (Cartext) {
				Car.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = Cartext;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(Car);
		});
		//남자매니저
		loader.load(`${this.assetsPath}fbx/lpMale_casual_K.FBX`, function (lpMale_casual_K) {
			lpMale_casual_K.position.set(1400, 50, -3000);
			lpMale_casual_K.scale.set(5, 3, 5);
			//lpMale_casual_K.rotation.y = Math.PI ;

			tLoader.load(`${game.assetsPath}images/world_people_colors.png`, function (lpMale_casual_K_tx) {
				lpMale_casual_K.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = lpMale_casual_K_tx;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(lpMale_casual_K);

		});
		//여자매니저(toongirl)
		loader.load(`${this.assetsPath}fbx/toongirl.FBX`, function (toongirl) {
			toongirl.position.set(-3000, 0, -3000);
			toongirl.scale.set(6, 2, 6);
			toongirl.rotation.y = Math.PI / 4;
			game.scene.add(toongirl);
		});
		// //boy
		// loader.load(`${this.assetsPath}fbx/boy.fbx`, function (boy) {
		// 	boy.position.set(-500, 500, -3000);
		// 	boy.scale.set(10, 10, 10);
		// 	boy.rotation.y = Math.PI / 1.4;

		// 	tLoader.load(`${game.assetsPath}images/boy.png`, function (boy_tx) {
		// 		boy.traverse(function (child) {
		// 			if (child.isMesh) {
		// 				child.material.map = boy_tx;
		// 				game.colliders.push(child);
		// 			}
		// 		});
		// 	});
		// 	game.scene.add(boy);
		// });		
		// //man_cartoon====== ==================================================================================
		// loader.load(`${this.assetsPath}fbx/man_cartoon.fbx`, function (man_cartoon) {
		// 	man_cartoon.position.set(-500, 500, -3000);  
		// 	man_cartoon.scale.set(10, 10, 10);
		// 	//man_cartoon.rotation.y = Math.PI  ;

		// 	tLoader.load(`${game.assetsPath}images/man_cartoon.jpg`, function (man_cartoon_tx) {
		// 		man_cartoon.traverse(function (child) {
		// 			if (child.isMesh) {
		// 				child.material.map = man_cartoon_tx;
		// 				game.colliders.push(child);
		// 			}
		// 		});							
		// 	game.scene.add(man_cartoon);		
		// 	});
		// });
		//농구동상
		// loader.load(`${this.assetsPath}fbx/CB_Discobolus_LOD0.fbx`, function (balloons) {
		// 	balloons.position.set(6000, 0, 3300);
		// 	balloons.scale.set(6, 6, 6);
		// 	balloons.rotation.y = Math.PI / 1.5;

		// 	tLoader.load(`${game.assetsPath}images/Road_divider.png`, function (balloonstext) {
		// 		balloons.traverse(function (child) {
		// 			if (child.isMesh) {
		// 				child.material.map = balloonstext;
		// 				game.colliders.push(child);
		// 			}
		// 		});
		// 	});
		// 	game.scene.add(balloons);
		// });
		//트로피1 금
		loader.load(`${this.assetsPath}fbx/SM_Icon_Cup_01.fbx`, function (Cup1) {
			Cup1.position.set(-3600, 150, 2100);
			Cup1.scale.set(3, 3, 3);
			Cup1.rotation.y = Math.PI / 1.4;

			tLoader.load(`${game.assetsPath}images/PolygonPrototype_Texture_01.png`, function (Cup1text) {
				Cup1.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = Cup1text;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(Cup1);
		});
		//트로피2 은
		loader.load(`${this.assetsPath}fbx/SM_Icon_Cup_02.fbx`, function (Cup2) {
			Cup2.position.set(-3500, 150, 2100);
			Cup2.scale.set(1.7, 1.7, 1.7);
			Cup2.rotation.y = Math.PI / 1.4;

			tLoader.load(`${game.assetsPath}images/PolygonPrototype_Texture_01.png`, function (Cup2text) {
				Cup2.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = Cup2text;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(Cup2);

		});
		//트로피3 동
		loader.load(`${this.assetsPath}fbx/SM_Icon_Cup_03.fbx`, function (Cup3) {
			Cup3.position.set(-3700, 150, 2100);
			Cup3.scale.set(1.7, 1.7, 1.7);
			Cup3.rotation.y = Math.PI / 1.4;

			tLoader.load(`${game.assetsPath}images/PolygonPrototype_Texture_01.png`, function (Cup3text) {
				Cup3.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = Cup3text;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(Cup3);

		});
		//garden1====== ==================================================================================
		loader.load(`${this.assetsPath}fbx/garden1.fbx`, function (garden1) {
			garden1.position.set(-500, 500, -3000);
			garden1.scale.set(3, 3, 3);
			garden1.rotation.y = Math.PI;

			tLoader.load(`${game.assetsPath}images/MainOffice_tx/PolygonOffice_Texture_01_A.png`, function (garden1_tx) {
				garden1.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = garden1_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(garden1);
			});
		});
		//polygonoffice3====== ==================================================================================
		//오피스1(작은집)
		loader.load(`${this.assetsPath}fbx/polygonoffice3.fbx`, function (polygonoffice3) {
			polygonoffice3.position.set(-1000, 300, -7500);
			polygonoffice3.scale.set(2, 2, 2);
			//polygonoffice3.rotation.y = Math.PI  ;

			tLoader.load(`${game.assetsPath}images/PolygonOffice_Texture_01_A.png`, function (polygonoffice3_tx) {
				polygonoffice3.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = polygonoffice3_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(polygonoffice3);
			});

		});
		//오피스2(키친)
		loader.load(`${this.assetsPath}fbx/polygonkitchen7.fbx`, function (polygonkitchen) {
			polygonkitchen.position.set(-5000, -80, -5500);
			polygonkitchen.scale.set(2, 2, 2);
			polygonkitchen.rotation.y = Math.PI / 6;

			tLoader.load(`${game.assetsPath}images/PolygonOffice_Texture_01_A.png`, function (polygonkitchen_tx) {
				polygonkitchen.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = polygonkitchen_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(polygonkitchen);
			});
		});
		//오피스3(휴게실)
		loader.load(`${this.assetsPath}fbx/lounge4.fbx`, function (lounge4) {
			lounge4.position.set(-8000, -160, -1100);
			lounge4.scale.set(2, 2, 2);
			lounge4.rotation.y = Math.PI;
			tLoader.load(`${game.assetsPath}images/PolygonOffice_Texture_01_A.png`, function (lounge_tx) {
				lounge4.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = lounge_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(lounge4);
			});
		});
		//smalloffice1(작은집) ==================================================================================
		loader.load(`${this.assetsPath}fbx/smalloffice1.fbx`, function (smalloffice1) {
			smalloffice1.position.set(7500, 380, 2000);  //(4800, 480, -9000)
			smalloffice1.scale.set(1.5, 1.5, 1.5);
			smalloffice1.rotation.y = Math.PI;

			tLoader.load(`${game.assetsPath}images/SimpleOffice_Texture.png`, function (smalloffice1_tx) {
				smalloffice1.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = smalloffice1_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(smalloffice1);
			});
		});
		//simpleoffice2(큰채)
		loader.load(`${this.assetsPath}fbx/simpleoffice2.fbx`, function (simpleoffice2) {
			simpleoffice2.position.set(5500, 900, -7000);
			simpleoffice2.scale.set(1.3, 1.3, 1.3);
			simpleoffice2.rotation.y = Math.PI;

			tLoader.load(`${game.assetsPath}images/SimpleOffice_Texture.png`, function (simpleoffice2_tx) {
				simpleoffice2.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = simpleoffice2_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(simpleoffice2);
			});
		});
		//LPMoffice ========================================================================================
		//walls_doors3 팀명 : 4Runner
		loader.load(`${this.assetsPath}fbx/walls_doors3.fbx`, function (walls_doors3) {
			walls_doors3.position.set(7000, 400, -2500);
			walls_doors3.scale.set(2, 2, 2);
			walls_doors3.rotation.y = Math.PI;
			tLoader.load(`${game.assetsPath}images/colorpalette.png`, function (walls_doors3_tx) {
				walls_doors3.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = walls_doors3_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(walls_doors3);
				// MLoader.load('material/glass.mat',function(material){
				// 	game.scene.add(material.scene)
				// });	
			});
		});
		//Floor 팀명 : 4Runner
		loader.load(`${this.assetsPath}fbx/floor.fbx`, function (floor) {
			floor.position.set(6500, 1000, -1000);
			floor.scale.set(2, 2, 2);
			floor.rotation.y = Math.PI;
			tLoader.load(`${game.assetsPath}images/colorpalette.png`, function (floor_tx) {
				floor.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = floor_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(floor);
			});
		});
		//enterance1
		loader.load(`${this.assetsPath}fbx/enterance1.fbx`, function (enterance1) {
			enterance1.position.set(4900, 450, -100);//2600, 1000, -3100)
			enterance1.scale.set(2, 2, 2);
			enterance1.rotation.y = Math.PI;

			tLoader.load(`${game.assetsPath}images/colorpalette.png`, function (enterance1_tx) {
				enterance1.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = enterance1_tx;
						game.colliders.push(child);
					}
				});
				game.scene.add(enterance1);
			});
		});
		//structure(객석)====================================================================================
		loader.load(`${this.assetsPath}fbx/Structure.fbx`, function (structure) {
			structure.position.set(-400, 0, -400);
			structure.scale.set(1.5, 1.5, 1.5);  // 원래 스케일2였음
			structure.rotation.y = Math.PI / 12;  // 무대기준으로 structure가 정방향이 됨

			tLoader.load(`${game.assetsPath}images/KakaoTalk_20210916_161329272.jpg`, function (structure_tx) {
				structure.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = structure_tx;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(structure);
		});
		// stairs
		loader.load(`${this.assetsPath}fbx/Stairs.fbx`, function (stairs) {
			stairs.position.set(-500, 250, -420);
			stairs.scale.set(1.5, 1.5, 1.5);
			stairs.rotation.y = Math.PI / 12;  // 분모가 커지면 y축 기준 시계방향으로 회전한다

			tLoader.load(`${game.assetsPath}images/KakaoTalk_20210916_161329272.jpg`, function (stairs_tx) {
				stairs.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = stairs_tx;
						game.colliders.push(child);
					}
				});
			});
			game.scene.add(stairs);
		});
		// model
		const game = this;

		this.player = new PlayerLocal(this);//플레이어는 플레이어로컬클래스가 단순히 매개변수로 게임을 전달

		this.loadEnvironment(loader);

		this.speechBubble = new SpeechBubble(this, "", 150);
		this.speechBubble.mesh.position.set(0, 350, 0);

		this.joystick = new JoyStick({
			onMove: this.playerControl,
			game: this
		});

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.container.appendChild(this.renderer.domElement);

		if ('ontouchstart' in window) {
			window.addEventListener('touchdown', (event) => game.onMouseDown(event), false);
		} else {
			window.addEventListener('mousedown', (event) => game.onMouseDown(event), false);
		}
		window.addEventListener('resize', () => game.onWindowResize(), false);
	}

	// mouseControls(){
	// 	const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
	// 	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	// 	controls.dampingFactor = 0.05;

	// 	controls.screenSpacePanning = false;

	// 	controls.minDistance = 100;
	// 	controls.maxDistance = 500;

	// 	controls.maxPolarAngle = Math.PI / 2;
	// }

	loadEnvironment(loader) {
		const game = this;
		// loader.load(`${this.assetsPath}fbx/town.fbx`, function(object){
		// 	game.environment = object;
		// 	game.colliders = [];
		// 	game.scene.add(object);
		// 	object.traverse( function ( child ) {
		// 		if ( child.isMesh ) {
		// 			if (child.name.startsWith("proxy")){
		// 				game.colliders.push(child);
		// 				child.material.visible = false;
		// 			}else{
		// 				child.castShadow = true;
		// 				child.receiveShadow = true;
		// 			}
		// 		}
		// 	} );

		// const tLoader = new THREE.TextureLoader();
		// const backgroundtexture =tLoader.load( `${game.assetsPath}/images/pngegg.png` );
		// backgroundtexture.repeat.set(35,35);
		// game.scene.background = backgroundtexture;

		// game.loadNextAnim(loader);

		const tloader = new THREE.CubeTextureLoader();
		tloader.setPath(`${game.assetsPath}/images/`);

		var textureCube = tloader.load([
			'KakaoTalk_20210916_195442737.png', 'KakaoTalk_20210916_195442737.png',
			'KakaoTalk_20210916_195442737.png', 'KakaoTalk_20210916_195442737.png',
			'KakaoTalk_20210916_195442737.png', 'KakaoTalk_20210916_195442737.png'
		]);

		game.scene.background = textureCube;

		game.loadNextAnim(loader);
	}

	loadNextAnim(loader) {
		let anim = this.anims.pop();
		const game = this;
		loader.load(`${this.assetsPath}fbx/anims/${anim}.fbx`, function (object) {
			game.player.animations[anim] = object.animations[0];
			if (game.anims.length > 0) {
				game.loadNextAnim(loader);
			} else {
				delete game.anims;
				game.action = "Idle";
				game.mode = game.modes.ACTIVE;
				game.animate();
			}
		});
	}
	playerControl(forward, turn) {
		turn = -turn;

		if (forward > 0.3) {
			if (this.player.action != 'Walking' && this.player.action != 'Running') this.player.action = 'Walking';
		} else if (forward < -0.3) {
			if (this.player.action != 'Walking Backwards') this.player.action = 'Walking Backwards';
		} else {
			forward = 0;
			if (Math.abs(turn) > 0.1) {
				if (this.player.action != 'Turn') this.player.action = 'Turn';
			} else if (this.player.action != "Idle") {
				this.player.action = 'Idle';
			}
		}
		if (forward == 0 && turn == 0) {
			delete this.player.motion;
		} else {
			this.player.motion = { forward, turn };
		}
		this.player.updateSocket();
	}

	createCameras() {
		const offset = new THREE.Vector3(0, 80, 0);
		const front = new THREE.Object3D();
		front.position.set(112, 100, 600);
		front.parent = this.player.object;
		const back = new THREE.Object3D();
		back.position.set(0, 350, -200);  // 기본값 0, 300, -1050
		back.parent = this.player.object;
		const chat = new THREE.Object3D();
		chat.position.set(0, 200, -450);
		chat.parent = this.player.object;
		const wide = new THREE.Object3D();
		wide.position.set(0, 400, -1500);
		wide.parent = this.player.object;
		const overhead = new THREE.Object3D();
		overhead.position.set(0, 400, 0);
		overhead.parent = this.player.object;
		const collect = new THREE.Object3D();
		collect.position.set(0, 600, -4000);
		collect.parent = this.player.object;
		const bird = new THREE.Object3D();
		bird.position.set(0, 2000, -8000);
		bird.parent = this.player.object;
		this.cameras = { front, back, wide, overhead, collect, chat, bird };
		this.activeCamera = this.cameras.wide; // 캐릭터 카메라위치설정정

		(function () {
			document.addEventListener('keydown', function (e) {
				const keyCode = e.keyCode;
				console.log('pushed key ' + e.key);

				if (keyCode == 49) { // 1번 누를 때
					game.activeCamera = game.cameras.back;
					document.dispatchEvent(new KeyboardEvent('keydown', { key22: '1' }));

				} else if (keyCode == 50) { // 2번
					game.activeCamera = game.cameras.wide;
					document.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
				}
				else if (keyCode == 51) { // 3번
					game.activeCamera = game.cameras.collect;
					document.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
				} else if (keyCode == 52) { // 4번
					game.activeCamera = game.cameras.bird;
					document.dispatchEvent(new KeyboardEvent('keydown', { key: '4' }));
				}
			})
		})();
	}
	showMessage(msg, fontSize = 20, onOK = null) {
		const txt = document.getElementById('message_text');
		txt.innerHTML = msg;
		txt.style.fontSize = fontSize + 'px';
		const btn = document.getElementById('message_ok');
		const panel = document.getElementById('message');
		const game = this;
		if (onOK != null) {
			btn.onclick = function () {
				panel.style.display = 'none';
				onOK.call(game);
			}
		} else {
			btn.onclick = function () {
				panel.style.display = 'none';
			}
		}
		panel.style.display = 'flex';
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	updateRemotePlayers(dt) {
		if (this.remoteData === undefined || this.remoteData.length == 0 || this.player === undefined || this.player.id === undefined) return;

		const newPlayers = [];
		const game = this;
		//Get all remotePlayers from remoteData array
		const remotePlayers = [];
		const remoteColliders = [];

		this.remoteData.forEach(function (data) {//원격데이터배열 foreach문 돌린다 // 배열의 각요소는 function(data) <- data가 된다
			if (game.player.id != data.id) {
				//Is this player being initialised?
				let iplayer;
				game.initialisingPlayers.forEach(function (player) {
					if (player.id == data.id) iplayer = player;
				});
				//If not being initialised check the remotePlayers array
				if (iplayer === undefined) {
					let rplayer;
					game.remotePlayers.forEach(function (player) {
						if (player.id == data.id) rplayer = player;
					});
					if (rplayer === undefined) {
						//Initialise player
						game.initialisingPlayers.push(new Player(game, data));//새로운 초기화가 필요하지 않음 그래서 데이터 패킷에 플레이어패턴의 새로운 인스턴스 생성
					} else {
						//Player exists
						remotePlayers.push(rplayer);//새원격플레이어배열에 푸시
						remoteColliders.push(rplayer.collider);
					}
				}
			}
		});
		this.scene.children.forEach(function (object) {
			if (object.userData.remotePlayer && game.getRemotePlayerById(object.userData.id) == undefined) {//원격플레이어가 존재하지 않을경우
				game.scene.remove(object);//장면에서 제거
			}
		});

		this.remotePlayers = remotePlayers;//원격플레이어 속성을 새로 할당
		this.remoteColliders = remoteColliders;
		this.remotePlayers.forEach(function (player) { player.update(dt); });
	}

	onMouseDown(event) {
		if (this.remoteColliders === undefined || this.remoteColliders.length == 0 || this.speechBubble === undefined || this.speechBubble.mesh === undefined) return;

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		const mouse = new THREE.Vector2();
		mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, this.camera);//방금 계산한 마우스갖ㅅ을 카메라에 전달

		const intersects = raycaster.intersectObjects(this.remoteColliders);
		const chat = document.getElementById('chat');

		if (intersects.length > 0) {
			const object = intersects[0].object;
			const players = this.remotePlayers.filter(function (player) {//filter사용하여 방금 교차한 객체의 위치를 찾는다
				if (player.collider !== undefined && player.collider == object) {
					return true;
				}
			});
			if (players.length > 0) {//플레이어 선택시 나타나는 효과 코드
				const player = players[0];//실제 플레이어가 배열의 첫번째요소
				console.log(`onMouseDown: player ${player.id}`);
				this.speechBubble.player = player;
				this.speechBubble.update('');
				this.scene.add(this.speechBubble.mesh);//말풍성메쉬 추가
				this.chatSocketId = player.id;
				chat.style.bottom = '0px';
				this.activeCamera = this.cameras.chat;
			}
		} else {
			//Is the chat panel visible?
			if (chat.style.bottom == '0px' && (window.innerHeight - event.clientY) > 40) {
				console.log("onMouseDown: No player found");
				if (this.speechBubble.mesh.parent !== null) this.speechBubble.mesh.parent.remove(this.speechBubble.mesh);
				delete this.speechBubble.player;
				delete this.chatSocketId;
				chat.style.bottom = '-50px';//화면의 아래쪽으로 보냄
				this.activeCamera = this.cameras.back;//활성카메라를 기본값으로 돌림
			} else {
				console.log("onMouseDown: typing");
			}
		}
	}

	getRemotePlayerById(id) {
		if (this.remotePlayers === undefined || this.remotePlayers.length == 0) return;

		const players = this.remotePlayers.filter(function (player) {
			if (player.id == id) return true;
		});

		if (players.length == 0) return;

		return players[0];
	}

	animate() {
		const game = this;
		const dt = this.clock.getDelta();
		requestAnimationFrame(function () { game.animate(); });

		this.updateRemotePlayers(dt);//화면 새로 고침에서 길을 잃은 후 경과된 델타 시간 내에 플레이어 초기화와 플레이어 이동을 처리해야 합니다.

		if (this.player.mixer != undefined && this.mode == this.modes.ACTIVE) this.player.mixer.update(dt);

		if (this.player.action == 'Walking') {
			const elapsedTime = Date.now() - this.player.actionTime;
			if (elapsedTime > 1000 && this.player.motion.forward > 0) {
				this.player.action = 'Running';
			}
		}

		if (this.player.motion !== undefined) this.player.move(dt);

		if (this.cameras != undefined && this.cameras.active != undefined && this.player !== undefined && this.player.object !== undefined) {
			this.camera.position.lerp(this.cameras.active.getWorldPosition(new THREE.Vector3()), 0.15);
			const pos = this.player.object.position.clone();
			if (this.cameras.active == this.cameras.chat) {
				pos.y += 200;
			} else {
				pos.y += 300;
			}
			this.camera.lookAt(pos);
		}

		if (this.sun !== undefined) {
			this.sun.position.copy(this.camera.position);
			this.sun.position.y += 10;
		}
		if (this.speechBubble !== undefined) this.speechBubble.show(this.camera.position);

		this.renderer.render(this.scene, this.camera);
		// this.cubeBufferMesh.rotation.y += 0.01;
		game.textMesh1.rotation.y += 0.012;
		game.textMesh2.rotation.y += 0.01;
		game.textMesh3.rotation.y += 0.011;
		game.textMesh4.rotation.y += 0.01;
		game.textMesh5.rotation.y += 0.011;
		game.textMesh6.rotation.y += 0.012;
		game.textMesh7.rotation.y += 0.011;
	}
}
