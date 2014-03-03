var clipper = require('clipper');


console.log(clipper.union([
	0, 0,
	10, 0,
	10, 10,
	0, 10
], [
	5, 5,
	15, 5,
	15, 15,
	5, 15
]));

console.log(clipper.union([
	0, 0,
	10, 0,
	10, 10,
	0, 10
], [
	15, 15,
	25, 15,
	25, 25,
	15, 25
]));

console.log(clipper.union([
	0, 0,
	10, 0,
	10, 10,
	0, 10
], [
	0, 0,
	10, 0,
	10, 10,
	0, 10
], [
	15, 15,
	25, 15,
	25, 25,
	15, 25
]));