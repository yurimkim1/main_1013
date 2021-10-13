class Player {
	constructor(game, options) {//로컬 플레이어라면 단순히 게임에서 패스(매개변수는 정의되지 않는다)
		this.local = true;
		let model, colour;

		const colours = ['Black', 'Brown', 'White'];
		colour = colours[Math.floor(Math.random() * colours.length)];//선택해야할 색상은 무작위로 선택

		if (options === undefined) {
			const people = ['BeachBabe', 'BusinessMan', 'Doctor', 'FireFighter', 'Housewife', 'Policeman', 'Prostitute', 'Punk', 'RiotCop', 'Roadworker', 'Robber', 'Sheriff', 'Streetman', 'Waitress'];
			model = people[Math.floor(Math.random() * people.length)];//선택해야할 모델을 무작위로 선택
		} else if (typeof options == 'object') {
			this.local = false;
			this.options = options;
			this.id = options.id;
			model = options.model;
			colour = options.colour;
		} else {
			model = options;
		}
		this.model = model;
		this.colour = colour;
		this.game = game;
		this.animations = game.animations;//애니메이션을 나타내는 모든 fbx파일이 로드

		const loader = new THREE.FBXLoader();
		const player = this;

		loader.load(`${game.assetsPath}fbx/people/${model}.fbx`, function (object) {

			object.mixer = new THREE.AnimationMixer(object);
			player.root = object;
			player.mixer = object.mixer;

			object.name = "Person";

			object.traverse(function (child) {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});


			const textureLoader = new THREE.TextureLoader();

			textureLoader.load(`${game.assetsPath}images/SimplePeople_${model}_${colour}.png`, function (texture) {
				object.traverse(function (child) {
					if (child.isMesh) {
						child.material.map = texture;
					}
				});
			});

			player.object = new THREE.Object3D();
			// player.object.position.set(-500,150,-1400);  // 캐릭터 생성위치(200, 0, 900) 계단앞
			// player.object.rotation.set(0, 3, 0);
			player.object.position.set(200, 0, 900);  // 캐릭터 생성위치(200, 0, 900) 계단앞
			player.object.rotation.set(0, 0, 0);

			player.object.add(object);
			if (player.deleted === undefined) game.scene.add(player.object);

			if (player.local) {
				game.createCameras();
				game.sun.target = game.player.object;
				game.animations.Idle = object.animations[0];
				if (player.initSocket !== undefined) player.initSocket();
			} else {//로컬플레이어가 아니라면
				const geometry = new THREE.BoxGeometry(100, 300, 100);
				const material = new THREE.MeshBasicMaterial({ visible: false });
				const box = new THREE.Mesh(geometry, material);
				box.name = "Collider";
				box.position.set(0, 150, 0);
				player.object.add(box);
				player.collider = box;
				player.object.userData.id = player.id;
				player.object.userData.remotePlayer = true;//멀티플레이어의 사용자 데이터를 true
				const players = game.initialisingPlayers.splice(game.initialisingPlayers.indexOf(this), 1);//플레이어찾아서
				game.remotePlayers.push(players[0]);//원격플레이어배열에 푸쉬

				////////////////////////////////////////////
				// nickname용 객체 생성 시작           
				const fontLoader = new THREE.FontLoader();
				fontLoader.load("/libs/three.js-master/examples/fonts/helvetiker_regular.typeface.json", function (font) {
				/////////////////////////// 생성자로 넘겨받은 game에서 userNick를 get 함.
					const fgeometry = new THREE.TextGeometry( game.userNick, {
						font: font,
						size: 50, // 텍스트 크기
						height: 20, // 돌출 두께
						curveSegments: 12, // 곡선의 점 : 기본값 12
						bevelEnabled: false, // 윤곽선 on
						bevelThickness: 0, // 윤곽선 두께? : 기본값 10
						bevelSize: 0, //텍스트 윤곽선 : 기본값 8
						bevelOffset: 0, // 텍스트 윤곽선이 시작 되는 거리 : 기본값 0
						bevelSegments: 5
					});
					fgeometry.center(); // 폰트 중심점 설정하기
					player.nickname = new THREE.Mesh(fgeometry, [
						new THREE.MeshPhongMaterial({ color: 0xad4000 }), // front
						new THREE.MeshPhongMaterial({ color: 0x5c2301 })     // side
					])
					player.nickname.castShadow = true
					player.nickname.position.set(player.object.position.x, player.object.position.y+200, player.object.position.z) // 텍스트 위치
					game.scene.add(player.nickname);
				});
				// nickname용 객체 생성 끝
			}

			if (game.animations.Idle !== undefined) player.action = "Idle";

		});





		// geme.scene.add(this.nickname);

		




		/*

		const self = this;
		const loader = new THREE.TextureLoader();

		loader.load(
			// resource URL
			`${game.assetsPath}images/speech.png`,

			// onLoad callback
			function (texture) {
				// in this example we create the material when the texture is loaded
				self.img = texture.image;
				self.mesh.material.map = texture;
				self.mesh.material.transparent = true;
				self.mesh.material.needsUpdate = true;
				if (msg !== undefined) self.update(msg);
				if (this.mesh === undefined) return;

				let context = this.context;

				if (this.mesh.userData.context === undefined) {
					const canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
					this.context = canvas.getContext('2d');
					context = this.context;
					context.font = `${this.config.size}pt ${this.config.font}`;
					context.fillStyle = this.config.colour;
					context.textAlign = 'center';
					this.mesh.material.map = new THREE.CanvasTexture(canvas);
				}

				const bg = this.img;
				context.clearRect(0, 0, this.config.width, this.config.height);
				context.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.config.width, this.config.height);
				this.wrapText(msg, context);

				this.mesh.material.map.needsUpdate = true;
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function (err) {
				console.error('An error happened.');
			}
		);
		*/

	}

	set action(name) {
		//Make a copy of the clip if this is a remote player
		if (this.actionName == name) return;
		const clip = (this.local) ? this.animations[name] : THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(this.animations[name]));
		const action = this.mixer.clipAction(clip);
		action.time = 0;
		this.mixer.stopAllAction();
		this.actionName = name;
		this.actionTime = Date.now();

		action.fadeIn(0.5);
		action.play();
	}

	get action() {
		return this.actionName;
	}

	update(dt) {
		this.mixer.update(dt);

		if (this.game.remoteData.length > 0) {
			let found = false;
			for (let data of this.game.remoteData) {
				if (data.id != this.id) continue;
				//Found the player
				this.object.position.set(data.x, data.y, data.z);//플레이어가 일치하면 위치 설정
				const euler = new THREE.Euler(data.pb, data.heading, data.pb);//지정된 축으로 회전
				this.object.quaternion.setFromEuler(euler);//방향업데이트
				this.action = data.action;
				found = true;

// nickname 용 update 시작
				this.nickname.position.set(data.x, data.y+500, data.z);
// nickname 용 update 끝

			}
			if (!found) this.game.removePlayer(this);//특정항목 못찾을시 false로 설정된 플레이어 제거
		}
	}
}