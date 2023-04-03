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

var world_map = new Map();


// functions to work on volatile, non-class hex grids

// Mostly i'll be using flat top hexes in my code       __
// (unless specified otherwise)                      __/ N\__
// Directions to move                   flat top:   /NW\__/NE\
// Flat top hex: NE, SE,  S, SW, NW,  N             \__/  \__/
// Shrp top hex: NE,  E, SE, SW,  W, NW             /SW\__/SE\
//                                                  \__/ S\__/
//                                                     \__/
                                                                                                           // 
const ax_direction = [[ 1, -1]    , [ 1,  0]    , [ 0,  1]    , [-1,  1]    , [-1,  0]    , [ 0, -1]    ]; // q, r
const cb_direction = [[ 1, -1,  0], [ 1,  0, -1], [ 0,  1, -1], [-1,  1,  0], [-1,  0,  1], [ 0, -1,  1]]; // q, r, s

// adds v1 to coords of specified h1
function cube_add(h1, v1){
    return [h1[0]+v1[0], h1[1]+v1[1], h1[2]+v1[2]];
}

// scales coords of h1 by factor of sf
function cube_scale(h1, sf){
    return [h1[0]*sf, h1[1]*sf, h1[2]*sf];
}

function cube_neighbor(h1, neight){
    return cube_add(h1, cb_direction[neight]);
}

function cube_ring_vect(center /*Cube_hex around which ring has to be centered*/, radius/*radius of measured ring*/){
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

function cube_ring_arr(center /*Cube_hex around which ring has to be centered*/, radius/*radius of measured ring*/){
    let results = [];
    let cube = cube_add(center, cube_scale(cb_direction[4], radius));
    for(let i=0; i < 6; i++){
        for(let j=0; j < radius; j++){
            results.push(cube);
            cube = cube_neighbor(cube, i);
        }
    }
    return results;
}

function cube_spiral_vect(center, radius){
    var results = [];
    Array.prototype.push.apply(results, center);

    for(let k=1;k<=radius; k++){
        Array.prototype.push.apply(results, cube_ring_vect(center, k));
    }
    return results;
}

function xyz_spiral_vect(cb_center, radius){
    var results = [];
    Array.prototype.push.apply(results, cube_to_xyz(cb_center));

    for(let k=1;k<=radius; k++){
        Array.prototype.push.apply(results, xyz_ring_vect(cb_center, k));
    }
    return results;
}

function xyz_ring_vect(center /*Cube_hex around which ring has to be centered*/, radius/*radius of measured ring*/){
    let results = [];
    let cube = cube_add(center, cube_scale(cb_direction[4], radius));
    for(let i=0; i < 6; i++){
        for(let j=0; j < radius; j++){
            Array.prototype.push.apply(results, cube_to_xyz(cube))
            cube = cube_neighbor(cube, i)
        }
    }
    return results;
}

function cube_spiral_arr(center, radius){
    var results = [];
    results.push(center);

    for(let k=1;k<=radius; k++){
        Array.prototype.push.apply(results, cube_ring_arr(center, k));
    }
    return results;
}

// transform cubic coordinates to xyz coordinates
function cube_to_xyz(cb_crd, sz=1.0){
    return [1.5*sz*cb_crd[0], cb_crd[0]+cb_crd[1]+cb_crd[2], 1.732*sz*(cb_crd[1] + 0.5*cb_crd[0])];
}

// transform cubic coordinates to xyzw coordinates (rendering usage)
function cube_to_xyzw(cb_crd, sz=1.0){
    return [1.5*sz*cb_crd[0], cb_crd[0]+cb_crd[1]+cb_crd[2], 1.732*sz*(cb_crd[1] + 0.5*cb_crd[0]), 1.0];
}

function cube_to_xyztriangles(cb_coords, sz=1.0){
    let xyz = cube_to_xyz(cb_coords, sz);/*
    return [xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 0   flat top   0---1 Deprecated due to improper culling
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
            ];*/

    return [xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 0   flat top   0---1
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4             /     \
            xyz[0] - sz    , xyz[1], xyz[2]           , // 5            5   c   2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1             \     /
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4              4---3
            xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 0    function is used to calculate
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1    xyz coordinates of anti-clockwise
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 3    triangles for rendering of hexagons
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, // 4
            xyz[0] + sz    , xyz[1], xyz[2]           , // 2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, // 1
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz  // 3
            ];
}

function cube_to_xyzwtriangles(cb_coords, sz=1.0){
    let xyz = cube_to_xyzw(cb_coords, sz);/*
    return [xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 1.0,// 0   flat top   0---1 Deprecated due to improper culling
            xyz[0] - sz    , xyz[1], xyz[2]           , 1.0,// 5             /     \
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 1.0,// 4            5   c   2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 1.0,// 1             \     /
            xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 1.0,// 0              4---3
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 1.0,// 4    function is used to calculate
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 1.0,// 1    xyz coordinates of anti-clockwise
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 1.0,// 4    triangles for rendering of hexagons
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 1.0,// 3
            xyz[0] + sz    , xyz[1], xyz[2]           , 1.0,// 2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 1.0,// 1
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 1.0 // 3 
            ];*/

    return [xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 0.0,// 0   flat top   4---3
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 0.0,// 4             /     \
            xyz[0] - sz    , xyz[1], xyz[2]           , 0.0,// 5            5   c   2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 0.0,// 1             \     /
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 0.0,// 4              0---1
            xyz[0] - 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 0.0,// 0    function is used to calculate
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 0.0,// 1    xyz coordinates of anti-clockwise
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 0.0,// 3    triangles for rendering of hexagons
            xyz[0] - 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 0.0,// 4
            xyz[0] + sz    , xyz[1], xyz[2]           , 0.0,// 2
            xyz[0] + 0.5*sz, xyz[1], xyz[2] - 0.866*sz, 0.0,// 3
            xyz[0] + 0.5*sz, xyz[1], xyz[2] + 0.866*sz, 0.0 // 1
            ];
}

// because of instanced drawing w coordinate = 0.0; it is due to addition of xyz coordinates, in specified vertexAttribPointer of
// transformation of given prims geometry we take only 3 out of 4 coordinates, if vertex attrib pointer takes xyz coords only then w=1.0
// thus w coord in transformation vector defaults to 1.0 and it's addition is performed to yeild proper end result.
function cube_to_xyzwprism(cb_coords, sz=1.0, h=1.0){
    let xyz = cube_to_xyzw(cb_coords, sz);

    return [xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 0  top geometry (12 verticies 4 triangles)
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 4        4--------3
            xyz[0] - sz    , xyz[1]    , xyz[2]           , 0.0,// 5+      /:        :\
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1      5 :        : 2
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 4      |\E. .  . .D/|
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 0+     |.0--------1.|
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1      F |        | C
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 3       \|        |/
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 4+       A--------B
            xyz[0] + sz    , xyz[1]    , xyz[2]           , 0.0,// 2
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 3
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1+

            xyz[0] - sz    , xyz[1]    , xyz[2]           , 0.0,// 5
            xyz[0] - sz    , xyz[1] - h, xyz[2]           , 0.0,// F
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// A+
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// A
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 0
            xyz[0] - sz    , xyz[1]    , xyz[2]           , 0.0,// 5+
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 0
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// A
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 0+
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B
            xyz[0] + sz    , xyz[1] - h, xyz[2]           , 0.0,// C+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           , 0.0,// C
            xyz[0] + sz    , xyz[1]    , xyz[2]           , 0.0,// 2
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz, 0.0,// 1+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           , 0.0,// C
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// D
            xyz[0] + sz    , xyz[1]    , xyz[2]           , 0.0,// 2+
            xyz[0] + sz    , xyz[1]    , xyz[2]           , 0.0,// 2
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// D
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 3+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// D
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 3+
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 3
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 4+
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E
            xyz[0] - sz    , xyz[1] - h, xyz[2]           , 0.0,// F
            xyz[0] - sz    , xyz[1]    , xyz[2]           , 0.0,// 5+
            xyz[0] - sz    , xyz[1]    , xyz[2]           , 0.0,// 5
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz, 0.0,// 4
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E

            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// A  bottom geometry (12 verticies 4 triangles) 
            xyz[0] - sz    , xyz[1] - h, xyz[2]           , 0.0,// F
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// A
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// E
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0,// D+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           , 0.0,// C
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz, 0.0,// B
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz, 0.0 // D+
            ];
}

function cube_to_xyzprism(cb_coords, sz=1.0, h=1.0){
    let xyz = cube_to_xyz(cb_coords, sz);

    return [xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 0  top geometry (12 verticies 4 triangles)
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 4        4--------3
            xyz[0] - sz    , xyz[1]    , xyz[2]           ,// 5+      /:        :\
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1      5 :        : 2
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 4      |\E. .  . .D/|
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 0+     |.0--------1.|
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1      F |        | C
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 3       \|        |/
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 4+       A--------B
            xyz[0] + sz    , xyz[1]    , xyz[2]           ,// 2
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 3
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1+

            xyz[0] - sz    , xyz[1]    , xyz[2]           ,// 5
            xyz[0] - sz    , xyz[1] - h, xyz[2]           ,// F
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// A+
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// A
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 0
            xyz[0] - sz    , xyz[1]    , xyz[2]           ,// 5+
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 0
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// A
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 0+
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B
            xyz[0] + sz    , xyz[1] - h, xyz[2]           ,// C+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           ,// C
            xyz[0] + sz    , xyz[1]    , xyz[2]           ,// 2
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] + 0.866*sz,// 1+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           ,// C
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// D
            xyz[0] + sz    , xyz[1]    , xyz[2]           ,// 2+
            xyz[0] + sz    , xyz[1]    , xyz[2]           ,// 2
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// D
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 3+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// D
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 3+
            xyz[0] + 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 3
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 4+
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E
            xyz[0] - sz    , xyz[1] - h, xyz[2]           ,// F
            xyz[0] - sz    , xyz[1]    , xyz[2]           ,// 5+
            xyz[0] - sz    , xyz[1]    , xyz[2]           ,// 5
            xyz[0] - 0.5*sz, xyz[1]    , xyz[2] - 0.866*sz,// 4
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E

            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// A  bottom geometry (12 verticies 4 triangles) 
            xyz[0] - sz    , xyz[1] - h, xyz[2]           ,// F
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// A
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E+
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B
            xyz[0] - 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// E
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz,// D+
            xyz[0] + sz    , xyz[1] - h, xyz[2]           ,// C
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] + 0.866*sz,// B
            xyz[0] + 0.5*sz, xyz[1] - h, xyz[2] - 0.866*sz // D+
            ];
}

function cube_xyz_mesh(cube_vec, size=1.0){
    let k = cube_vec.length/3;
    let results = [];
    for(let i=0;i<k; i++){
        Array.prototype.push.apply(results, cube_to_xyztriangles([cube_vec[i*3+0], cube_vec[i*3+1], cube_vec[i*3+2]]), size);
    }
    return results;
}

function cube_xyzw_mesh(cube_vec, size=1.0){
    let k = cube_vec.length/3;
    let results = [];
    for(let i=0;i<k; i++){
        Array.prototype.push.apply(results, cube_to_xyzwtriangles([cube_vec[i*3+0], cube_vec[i*3+1], cube_vec[i*3+2]]), size);
    }
    return results;
}