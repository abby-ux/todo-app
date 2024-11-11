const PI = Math.PI;

/**
 * use module.exports.function to export a function
 * use require() to import functions
 */

// first way to export modules:
module.exports.squareArea = function(sideLen) {
    return sideLen * sideLen;
}
// second way to export modules:
function circleArea(r) {
    return PI * r * r;
}
module.exports.circleArea = circleArea;

// if we wanted then require this in another file:
const radius = 3;
const sideLength = 7;
// way 1:
const areaFunctions = require('area-functions.js');
// way 2:
const {circleArea, squareArea} = require('area-functions.js');
// way 1:
const areaOfCircle = areaFunctions.circleArea(radius);
const areaOfSquare = areaFunctions.squareArea(sideLength);
// way 2:
const areaCircle = circleArea(radius);
const squareArea = squareArea(sideLength);