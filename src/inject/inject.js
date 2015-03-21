var $document, canvas, context;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// init canvas
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		$document = $(document);
		canvas.id = 'webotate';
		canvas.height = $document.height();
		canvas.width = $document.width();
		canvas.style.backgroundColor = 'transparent';
		canvas.style.position = 'absolute';
		canvas.style.zIndex = 9001;
		// initially canvas is display: none
		canvas.style.display = 'none';
		$('body').prepend(canvas);

		// init canvas events
		initCanvasEvents();

	}
	}, 10);
});

// toggle visibility of canvas on page action press
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.data === 'DisplayBlock') {
		canvas.style.display = 'block';
		sendResponse();
	} else if(request.data === 'DisplayNone') {
		canvas.style.display = 'none';
		sendResponse();
	}
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function redraw(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = 5;
			
	for(var i=0; i < clickX.length; i++) {		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}
}

function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function initCanvasEvents() {
	var $canvas = $(canvas);

	$canvas.mousedown(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	$canvas.mousemove(function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$canvas.mouseup(function(e){
		paint = false;
	});
	
	$canvas.mouseleave(function(e){
		paint = false;
	});
}