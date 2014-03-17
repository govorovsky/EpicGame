define([
    'classy',
], function(
    Class
){

	var SpaceShip = Class.$extend({
		__init__ : function(x,y,src,cnvs) {
			var ship = this;
			var game = game;
			this.direction = '';
			this.cnvs = cnvs;
			this.x = x;
			this.y = y;
			this.dy = 2; 
			this.dx = 2;
			this.gravity = 0.01;
			this.vy = 0; // vertical speed
			this.vx = 0; // horizontal speed
			this.imgLoaded = false;
			this.image = new Image();
			this.image.src = src;
			this.bullets = []; // TODO ship can shoot bullets
			this.image.onload = function () { 
            	ship.imgLoaded = true;
        	}
		},

		update : function(game) {

			if(game.keys[38]) { // up
				this.vy = -this.dy; this.direction = ''; 
			}
			if(game.keys[40]) { //down
				this.vy = this.dy; this.direction = '';  

			}
			if(game.keys[37]) { // back
				this.vx = -this.dx; this.direction = ''; 

			}
			if(game.keys[39]) { // forward
				this.vx = this.dx; this.direction = ''; 
			}

			this.vy += this.gravity;
			this.y += this.vy;
			this.x += this.vx;
			this.vy *= 0.98; // friction 
			this.vx *= 0.98;
			if(this.y > this.cnvs.width-178-22) {
			 game.trigger("SpaceShipCrash");
			} 
		},

		draw : function(ctx) {
			if(this.imgLoaded == true) ctx.drawImage(this.image, this.x, this.y, 125, 53);
		}
	})


	return SpaceShip;
});