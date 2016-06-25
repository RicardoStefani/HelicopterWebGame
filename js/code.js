function start() {
	$("#start").hide();
	$("#baseGame").append("<div id='player' class='anima1'></div>");
	$("#baseGame").append("<div id='enemy1' class='anima2'></div>");
	$("#baseGame").append("<div id='enemy2'></div>");
	$("#baseGame").append("<div id='friend' class='anima3'></div>");
	$("#baseGame").append("<div id='scoreBoard'></div>");
	$("#baseGame").append("<div id='energy'></div>");

	var game = {}
	var velocity = 5;
	var posicaoY = parseInt(Math.random() * 334);
	var canFire = true;
	var endGame = false;
	var score = 0;
	var friendSave = 0;
	var friendLost = 0;
	var currentLife = 3;

	var fireSound = document.getElementById("fireSound");
	var explosionSound = document.getElementById("explosionSound");
	var music = document.getElementById("music");
	var gameoverSound = document.getElementById("gameoverSound");
	var lostFriendSound = document.getElementById("lostFriendSound");
	var saveFriendSound = document.getElementById("saveFriendSound");

	var KeyBoards = {
		W: 87,
		S: 83,
		D: 68
	}

	game.press = [];

	$(document).keydown(function (e) {
		game.press[e.which] = true;
	});

	$(document).keyup(function (e) {
		game.press[e.which] = false;
	});

	game.timer = setInterval(loop, 30);

	music.addEventListener("ended", function(){
		currentTime = 0; music.play();
	}, false);

	music.play();

	function loop() {
		moveBackground();
		movePlayer();
		moveEnemy1();
		moveEnemy2();
		moveFriend();
		collision();
		scoreBoard();
		energy();
	}

	function moveBackground() {
		var backgroundPosition = parseInt($("#baseGame").css("background-position"));
		$("#baseGame").css("background-position", backgroundPosition-1);
	}

	function movePlayer() {
		if(game.press[KeyBoards.W]){
			var top = parseInt($("#player").css("top"));
			if(top >= 0)
			{
				$("#player").css("top", top-10);
			}
		}
		
		if(game.press[KeyBoards.S]){
			var top = parseInt($("#player").css("top"));
			if(top <= 434)
			{
				$("#player").css("top", top+10);
			}
		}

		if(game.press[KeyBoards.D]){
			fire();
		}
	}

	function moveEnemy1() {
		var positionX = parseInt($("#enemy1").css("left"));
		$("#enemy1").css("left", positionX - velocity);
		$("#enemy1").css("top", posicaoY);
		if (positionX <= 0) {
			posicaoY = parseInt(Math.random() * 334);
			$("#enemy1").css("left", 694);
			$("#enemy1").css("top", posicaoY);
		}
	}

	function moveEnemy2() {
		var positionX = parseInt($("#enemy2").css("left"));
		$("#enemy2").css("left", positionX - 3);
		if (positionX <= 0) {
			$("#enemy2").css("left", 775);
		}
	}

	function moveFriend() {
		var positionX = parseInt($("#friend").css("left"));
		$("#friend").css("left", positionX + 1);
		if (positionX > 906) {
			$("#friend").css("left", 0);
		}
	}

	function fire() {
		if (canFire) {
			fireSound.play();
			canFire = false;
			var top = parseInt($("#player").css("top"));
			var positionX = parseInt($("#player").css("left"));
			var tiroX = positionX + 190;
			var topFire = top + 37;
			$("#baseGame").append("<div id='fire'></div>");
			$("#fire").css("top", topFire);
			$("#fire").css("left", tiroX);

			var fireTime = window.setInterval(execFire, 30);
		}
	
		function execFire() {
			var positionX = parseInt($("#fire").css("left"));
			$("#fire").css("left", positionX + 15);
			if (positionX > 900) {
				window.clearInterval(fireTime);
				fireTime = null;
				$("#fire").remove();
				canFire = true;
			}

		}
	}

	function collision() {
		var collision1 = ($("#player").collision("#enemy1"));
		var collision2 = ($("#player").collision("#enemy2"));
		var collision3 = ($("#fire").collision("#enemy1"));
		var collision4 = ($("#fire").collision("#enemy2"));
		var collision5 = ($("#player").collision("#friend"));
		var collision6 = ($("#enemy2").collision("#friend"));

		if (collision1.length > 0) {
			currentLife--;
			enemy1X = parseInt($("#enemy1").css("left"));
			enemy1Y = parseInt($("#enemy1").css("top"));
			explosion1(enemy1X, enemy1Y);
			posicaoY = parseInt(Math.random() * 334);
			$("#enemy1").css("left", 694);
			$("#enemy1").css("top", posicaoY);
		}

		if (collision2.length > 0) {
			currentLife--;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			explosion2(enemy2X, enemy2Y);
			$("#enemy2").remove();
			replaceEnemy2();
		}

		if (collision3.length > 0) {
			velocity += 0.3;
			score += 100;
			enemt1X = parseInt($("#enemy1").css("left"));
			enemt1Y = parseInt($("#enemy1").css("top"));
			explosion1(enemt1X, enemt1Y);
			$("#fire").css("left", 950);
			posicaoY = parseInt(Math.random() * 334);
			$("#enemy1").css("left", 694);
			$("#enemy1").css("top", posicaoY);
		}

		if (collision4.length > 0) {
			score += 50;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			$("#enemy2").remove();
			explosion2(enemy2X, enemy2Y);
			$("#fire").css("left", 950);
			replaceEnemy2();
		}

		if (collision5.length > 0) {
			saveFriendSound.play();
			friendSave++;
			replaceFriend();
			$("#friend").remove();
		}

		if (collision6.length > 0) {
			friendLost++;
			friendX = parseInt($("#friend").css("left"));
			friendY = parseInt($("#friend").css("top"));
			explosion3(friendX, friendY);
			$("#friend").remove();
			replaceFriend();
		}
	}

	function explosion1(enemy1X, enemy1Y) {
		explosionSound.play();
		$("#baseGame").append("<div id='explosion1'></div>");
		$("#explosion1").css("background-image", "url(imgs/explosao.png)");
		var div = $("#explosion1");
		div.css("top", enemy1Y);
		div.css("left", enemy1X);
		div.animate({width: 200, opacity: 0}, "slow");

		var explosionTime = window.setInterval(removeExplosion, 1000);

		function removeExplosion() {
			div.remove();
			window.clearInterval(explosionTime);
			explosionTime = null;
		}
	}

	function explosion2(enemy2X, enemy2Y) {
		explosionSound.play();
		$("#baseGame").append("<div id='explosion2'></div>");
		$("#explosion2").css("background-image", "url(imgs/explosao.png)");
		var div2 = $("#explosion2");
		div2.css("top", enemy2Y);
		div2.css("left", enemy2X);
		div2.animate({width: 200, opacity: 0}, "slow");

		var explosionTime = window.setInterval(removeExplosion, 1000);

		function removeExplosion() {
			div2.remove();
			window.clearInterval(explosionTime);
			explosionTime = null;
		}
	}

	function explosion3(friendX, friendY) {
		explosionSound.play();
		$("#baseGame").append("<div id='explosion3' class='anima4'></div>");
		$("#explosion3").css("top", friendY);
		$("#explosion3").css("left", friendX);

		var explosionTime = window.setInterval(removeExplosion, 1000);

		function removeExplosion() {
			$("#explosion3").remove();
			window.clearInterval(explosionTime);
			explosionTime = null;
		}
	}

	function replaceEnemy2() {
		var colisionTime = window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(colisionTime);
			colisionTime = null;
			if (endGame == false) {
				$("#baseGame").append("<div id='enemy2'></div>");
			}
		}
	}

	function replaceFriend() {
		var friendTime = window.setInterval(replace, 5000);

		function replace() {
			window.clearInterval(friendTime);
			friendTime = null;
			if (endGame == false) {
				$("#baseGame").append("<div id='friend' class='anima3'></div>");
			}
		}
	}

	function scoreBoard() {
		$("#scoreBoard").html("<h2>pontos:" + score + " Salvos: " + friendSave + " Perdidos: " + friendLost + "</h2>")
	}

	function energy() {
		if (currentLife == 3) {
			$("#energy").css("background-image", "url(imgs/energia3.png)");
		}

		if (currentLife == 2) {
			$("#energy").css("background-image", "url(imgs/energia2.png)");
		}
		
		if (currentLife == 1) {
			$("#energy").css("background-image", "url(imgs/energia1.png)");
		}
		
		if (currentLife == 0) {
			$("#energy").css("background-image", "url(imgs/energia0.png)");
			gameOver();
		}
	}

	function gameOver() {
		endGame = true;
		music.pause();
		gameoverSound.play();
		window.clearInterval(game.timer);
		game.timer = null;
		$("#player").remove();
		$("#enemy1").remove();
		$("#enemy2").remove();
		$("#friend").remove();

		$("#baseGame").append("<div id='end'></div>");
		$("#end").html("<h1>Game Over</h1><p>Sua pontuação foi: " + score + "</p><div id='reinicia' onclick='restartGame()'><h3>Jogar Novamente</h3></div>");
	}
}

function restartGame() {
	gameoverSound.pause();
	$("#end").remove();
	start();
}