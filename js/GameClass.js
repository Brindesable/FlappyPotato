var Game = function(canvasWidth, canvasHeight, context, canvas)
{
	//context carac
	var _canvasWidth = canvasWidth;
	var _canvasHeight = canvasHeight;
	var _context = context;
	var _canvas = canvas;

	var _potato = new Potato(canvasWidth, canvasHeight);
	window.setInterval(_potato.nextSprite, 50);
	var _score = 0;

	var _obstacles = new Array();
	var _speedX = 4;
	var _holeLength = 190;

	//instance of this to enable the callback function (it stinks)
	var _self = this;

	//-Main Loop
	this.gameLoop = function()
	{
		//context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		//weird function to clear context ; previous not working 
		_canvas.width = _canvas.width;

		//reposition of the potato & drawing
		_potato.reevaluatePosition();
		_potato.draw(_context);

		//score display
		context.font = "bold 32pt Calibri,Geneva,Arial";
		context.fillStyle = "#000";
		context.fillText(_score / 2, _canvasWidth * 0.9, _canvasHeight * 0.1);

		//for each obstacle
		for(var i = 0; i < _obstacles.length; i++)
		{
			_obstacles[i].moveForward(_speedX);
			_obstacles[i].draw(_context);
			
			if(_obstacles[i].lookIfPassed(_potato.getHitbox()) && !_obstacles[i].isPassed())
			{
				_score++;
				_obstacles[i].pass();
			}

			//intersections (game over)
			if(_potato.intersect(_obstacles[i]) || _potato.getHitbox().y + _potato.getHitbox().height >= canvasHeight)
				_self.reloadGame();
		}
		
		if(_obstacles.length > 0)
		{
			//obstacles out from layer ?
			if(_obstacles[0].outFromLayer())
			{
				//remove top & bot obstacles
				_obstacles.shift();
			}
		}
		window.requestAnimFrame(_self.gameLoop);
	}
	
	//restart game
	this.reloadGame = function()
	{
		_potato.reload();
		_obstacles = new Array();
		_score = 0;
	}

	//create obstacles every x seconds
	this.createObstacle = function()
	{
		heightObstacle = Math.floor(Math.random()*(_canvasHeight - _holeLength))
		//top obstacle
		newObstacle = new Obstacle(0, heightObstacle, _canvasWidth, _canvasHeight);
		_obstacles.push(newObstacle);
		//bot obstacle
		newObstacle2 = new Obstacle(heightObstacle + _holeLength, _canvasHeight - (heightObstacle + _holeLength), _canvasWidth, _canvasHeight);
		_obstacles.push(newObstacle2);
	}

	//user action
	this.arrowUp = function()
	{
		_potato.addAcceleration(-10);
		_potato.changeCurrentSprite(0);
	}

	this.everythingLoaded = function()
	{
		return _potato.imgLoaded(); 
	}
}