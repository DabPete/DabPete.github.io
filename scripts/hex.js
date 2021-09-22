// Constructor of Cube_hex class
function  Cube_hex(_q, _r){
    let _s = -_q -_r;
    this.s = _s;
    this.q = _q;
    this.r = _r;
}

Cube_hex.prototype.add = function(_q, _r){
    this.s -=(_q+_r);
    this.q +=_r;
    this.r +=_q;
} 

Cube_hex.prototype.ring = function(radius){
    let results = [];
}

Cube_hex.prototype.spiral = function(radius){

}


// functions to work on volatile, non-class hex grids

// Mostly i'll be using flat top hexes in my code       __
// (unless specified otherwise)                      __/ N\__
// Directions to move                   flat top:   /NW\__/NE\
// Flat top hex: NE, SE,  S, SW, NW,  N             \__/  \__/
// Shrp top hex: NE,  E, SE, SW,  W, NW             /SW\__/SE\
//                                                  \__/ S\__/
//                                                     \__/

const ax_direction = [[ 1, -1]    , [ 1,  0]    , [ 0,  1]    , [-1,  1]    , [-1,  0]    , [ 0, -1]    ]; // q, r
const cb_direction = [[ 1, -1,  0], [ 1,  0, -1], [ 0,  1, -1], [-1,  1,  0], [-1,  0,  1], [ 0, -1,  1]]; // q, r, s

// adds v1 to coords of specified h1
function cube_add(h1, v1){
    h1[0]+=v1[0];
    h1[1]+=v1[1];
    h1[2]+=v1[2];
    return h1;
}

// scales coords of h1 by factor of sf
function cube_scale(h1, sf){
    h1[0]*=sf;
    h1[1]*=sf;
    h1[2]*=sf;
    return h1;
}

function cube_neighbor(h1, neight){
    return cube_add(h1, cb_direction[neight]);
}

function cube_ring(center /*Cube_hex around which ring has to be centered*/, radius/*radius of measured ring*/){
    let results = [];
    let cube = cube_add(center, cube_scale(cb_direction[4], radius));
    for(let i=0; i < 6; i++){
        for(let j=0; j < radius; j++){
            Array.prototype.push.apply(results, cube)
            cube = cube_neighbor(cube, i)
        }
    }
    return results;
}

function cube_spiral(center, radius){
    var results = [];
    Array.prototype.push.apply(results, center);

    for(let k=1;k<=radius; k++){
        Array.prototype.push.apply(results, cube_ring(center, k))
    }
    return results
}

function cube_to_xyz(cb_crd, sz=1.0){
    return [1.5*sz*cb_crd[0], cb_crd[0]+cb_crd[1]+cb_crd[2], 1.732*sz*(cb_crd[2] + 0.5*cb_crd[0])];
}

function cube_hextriangles(cb_coords, sz=1.0){
    let xyz = cube_to_xyz(cb_coords, sz);
    return [xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 0   flat top   0---1
            xyz[0] - sz    , xyz[1], xyz[2]           , // 5             /     \
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4            5   c   2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1             \     /
            xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 0              4---3
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4    function is used to calculate
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1    xyz coordinates of anti-clockwise
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4    triangles for rendering of hexagons
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 3
            xyz[0] + sz    , xyz[1], xyz[2]           , // 2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz  // 3
        ];
}

function cube_mesh(cube_vec, size=1.0){
    let k = cube_vec.length/3;
    let results = [];
    for(let i=0;i<k; i++){
        Array.prototype.push.apply(results, cube_hextriangles([cube_vec[i*3+0], cube_vec[i*3+1], cube_vec[i*3+2]]), size);
    }
    return results;
}