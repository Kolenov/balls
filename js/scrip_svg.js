/**
 * Created by Eduard Kolenov on 29.01.2017.
 */

function Ball(pointer) {
    this.x = pointer.x || 0;
    this.y = pointer.y || 0;
    this.radius = getRandomNumber(20, 50);
    this.fillStyle = "red";
    this.strokeStyle = "black";
    this.strokeWidth = 3;
    this.stepX = getRandomNumber(-5, 5);
    this.stepY = getRandomNumber(-5, 5);
    this.ref = null;

    function getRandomNumber(min, max) {
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        if (number === 0) {
            getRandomNumber(min, max);
        }
        return number;
    }
}

var svgPlayGround = (function (window, document) {

    var svgField = {
        svg: null,
        width: null,
        height: null,
        pointer: {
            x: null,
            y: null
        }
    };

    function init(id) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var svg = document.getElementById(id);

        svgField.svg = svg;
        svgField.width = width;
        svgField.height = height;
        svgField.svg.addEventListener("click", getPointerPosition, false);
        return svgField;
    }

    function getPointerPosition(event) {
        svgField.pointer.x = event.pageX;
        svgField.pointer.y = event.pageY;
        console.log(svgField.pointer);
    }

    return {
        init: init,
    };

}(window, document));


var stageSVG = (function (window, document) {
    var balls = [];
    var svgWidth = null;
    var svgHeight = null;
    var svg = null;

    function init(svgField) {
        svg = svgField.svg;
        svgWidth = svgField.width;
        svgHeight = svgField.height;
        return this;
    }

    function addBall(ball) {
        var svgNS = "http://www.w3.org/2000/svg";
        var newBall = document.createElementNS(svgNS, "circle");
        newBall.setAttributeNS(null, "cx", ball.x);
        newBall.setAttributeNS(null, "cy", ball.y);
        newBall.setAttributeNS(null, "r", ball.radius);
        newBall.setAttributeNS(null, "fill", ball.fillStyle);
        newBall.setAttributeNS(null, "stroke", ball.strokeStyle);
        newBall.setAttributeNS(null, "stroke-width", ball.strokeWidth);
        ball.ref = newBall;
        if (balls.length < 10) {
            balls.push(ball);
            svg.appendChild(newBall);
        }
    }

    function play() {
        window.requestAnimationFrame(play);

        for (var i = 0; i < balls.length; ++i) {

            var curX = balls[i].x;
            var curY = balls[i].y;
            var radius = balls[i].radius;

            if ((curX + radius > svgWidth) || (curX - radius < 0)) {
                balls[i].stepX = -balls[i].stepX;
            }
            if ((curY + radius > svgHeight) || (curY - radius < 0)) {
                balls[i].stepY = -balls[i].stepY;
            }

            balls[i].x += balls[i].stepX;
            balls[i].y += balls[i].stepY;

            balls[i].ref.setAttribute("cx", balls[i].x);
            balls[i].ref.setAttribute("cy", balls[i].y);
        }
    }

    return {
        init: init,
        addBall: addBall,
        play: play
    };

}(window, document));


window.onload = function () {

    var svgField = svgPlayGround.init("play-ground");
    var stage = stageSVG.init(svgField);

    svgField.svg.addEventListener("click", function () {
        stage.addBall(new Ball(svgField.pointer));
    }, false);

    stage.play();
};