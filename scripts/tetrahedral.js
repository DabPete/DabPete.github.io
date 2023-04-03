// xyz_c = xyz_center of tetrahedron

const sqrt3_precise = 0.57735026919;

function xyz_tetrahedron(xyz_c = [0.0, 0.0, 0.0], size=1.0){
    return [xyz_c[0] + sqrt3_precise*size, xyz_c[1] + sqrt3_precise*size, xyz_c[2] - sqrt3_precise*size, 1.0,
            xyz_c[0] - sqrt3_precise*size, xyz_c[1] + sqrt3_precise*size, xyz_c[2] + sqrt3_precise*size, 1.0,
            xyz_c[0] + sqrt3_precise*size, xyz_c[1] - sqrt3_precise*size, xyz_c[2] + sqrt3_precise*size, 1.0,
            xyz_c[0] - sqrt3_precise*size, xyz_c[1] - sqrt3_precise*size, xyz_c[2] - sqrt3_precise*size, 1.0,
            xyz_c[0] + sqrt3_precise*size, xyz_c[1] + sqrt3_precise*size, xyz_c[2] - sqrt3_precise*size, 1.0,
            xyz_c[0] - sqrt3_precise*size, xyz_c[1] + sqrt3_precise*size, xyz_c[2] + sqrt3_precise*size, 1.0,
            xyz_c[0] - sqrt3_precise*size, xyz_c[1] - sqrt3_precise*size, xyz_c[2] - sqrt3_precise*size, 1.0,
            xyz_c[0] + sqrt3_precise*size, xyz_c[1] - sqrt3_precise*size, xyz_c[2] + sqrt3_precise*size, 1.0,
            xyz_c[0] + sqrt3_precise*size, xyz_c[1] + sqrt3_precise*size, xyz_c[2] - sqrt3_precise*size, 1.0]
}