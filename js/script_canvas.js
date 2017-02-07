/**
 * Created by Eduard Kolenov on 25.01.2017.
 */


var canvasPlayGround = (function (window, document, undefined) {

    var canvasField = {
        canvas: null,
        context: null,
        canvasBound: null,
        pointerX: null,
        pointerY: null
    };

    function init(id) {
        canvasField.canvas = document.getElementById(id);
        canvasField.canvas.addEventListener("click", getPointerPosition, false);
        canvasField.context = canvasField.canvas.getContext("2d");

        canvasField.canvas.width = window.innerWidth;
        canvasField.canvas.height = window.innerHeight;

        canvasField.canvasBound = canvasField.canvas.getBoundingClientRect();
        return canvasField;
    }

    function getPointerPosition(event) {
        canvasField.pointerX = event.pageX - canvasField.canvasBound.left;
        canvasField.pointerY = event.pageY - canvasField.canvasBound.top;
    }

    return {
        init: init
    };

})(window, document);


function Ball(canvasField) {
    this.x = canvasField.pointerX || 0;
    this.y = canvasField.pointerY || 0;
    this.radius = getRandomNumber(20, 50);
    this.fillStyle = "red";
    this.stepX = getRandomNumber(-5, 5);
    this.stepY = getRandomNumber(-5, 5);

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

var stage = (function (window, document, undefined) {

    var balls = [];
    var context = null;
    var canvasBounds = null;
    var canvasWidth = null;
    var canvasHeight = null;

    function init(canvasField) {
        context = canvasField.context;
        canvasBounds = canvasField.canvasBound;
        canvasWidth = canvasBounds.width;
        canvasHeight = canvasBounds.height;
    }

    function play() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        window.requestAnimationFrame(play);

        for (var i = 0; i < balls.length; ++i) {

            var circle = new Path2D();
            circle.arc(balls[i].x, balls[i].y, balls[i].radius, 0, 2 * Math.PI);
            context.fillStyle = balls[i].fillStyle;
            context.fill(circle);
            context.shadowColor = "rgba(0,0,0,0.5)";
            context.shadowBlur = 15;
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;

            if ((balls[i].x + balls[i].radius > canvasWidth) || (balls[i].x - balls[i].radius < 0)) {
                balls[i].stepX = -balls[i].stepX;
            }

            if ((balls[i].y + balls[i].radius > canvasHeight) || (balls[i].y - balls[i].radius < 0)) {
                balls[i].stepY = -balls[i].stepY;
            }

            balls[i].x += balls[i].stepX;
            balls[i].y += balls[i].stepY;
        }
    }

    function addBall(ball) {
        if (balls.length < 10) {
            balls.push(ball);
            console.log(balls);
        }
    }

    return {
        init: init,
        addBall: addBall,
        play: play
    };

}(window, document));


window.onload = function () {

    var canvasField = canvasPlayGround.init("play-ground");

    canvasField.canvas.addEventListener("click", function () {
        stage.addBall(new Ball(canvasField));
    }, false);

    stage.init(canvasField);
    stage.play();

};