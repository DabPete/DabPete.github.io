var m4 = {
    identity: function(){
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1];
    },

    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
   
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
   
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
   
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
   
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
   
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
   
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
   
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },

    multiply: function(a, b) {
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
     
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
      },

      normalize: function(v) {
        var lng = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (lng) {return [v[0] / lng, v[1] / lng, v[2] / lng];}
          return [0, 0, 0];
      },

      cross: function(a, b) {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
      },

      subtractVectors: function(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      },

      translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
      },
     
      xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
      },
     
      yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
      },
     
      zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
      },
     
      scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
      },
      // ortographic projection of space
      projection: function(w, h, d) {
        return [
           2/w, 0  , 0  , 0,
           0  , 2/h, 0  , 0,
           0  , 0  , 2/d, 1,
           0  , 0  , 0  , 1,
        ];
      },
      // perspective projection
      perspective: function(fov, ar, fr, nr) {
        var f = Math.tan(Math.PI*0.5 - 0.5*fov);
        var lng = -1.0/(fr-nr);
        return [
          f/ar, 0, 0,  0,
          0   , f, 0,  0,
          0   , 0, (fr+nr)*lng, -1,
          0   , 0, 2.0*nr*fr*lng, 0
        ];
      },

      setCam: function(camPos, focPos){
        var Z = m4.normalize(m4.subtractVectors(camPos, focPos));
        console.log("Z vector: ")
        console.log(Z);
        var X = m4.normalize([-Z[2], 0,  Z[0]]);
        console.log("X vector: ");
        console.log(X);
        var Y = m4.cross(Z, X);
        console.log("Y vector: ");
        console.log(Y);

        var ZX = m4.normalize([Z[0], 0   , Z[2]]);
        var ZY = m4.normalize([0   , Z[1], Z[2]]);
        var XY = m4.normalize([Z[0], Z[1], 0   ]);
        var A = ZY[2]*ZX[0];
        var B = ZY[2]*ZX[2];

        return [ -X[0],-X[2]*Z[1], Z[0], 0,
                  0   ,-Y[1]     , Z[1], 0,
                 -X[2], X[0]*Z[1], Z[2], 0,
               camPos[0]*X[0] + camPos[2]*X[2],
               camPos[1]*Y[1] + Z[1]*(camPos[0]*X[2] - camPos[2]*X[0]),
              -camPos[1]*Z[1] + Y[1]*(camPos[0]*X[2] - camPos[2]*X[0]),
              1];
              //fallback in case of future errors
        /*return [ ZX[2], -ZY[1]*ZX[0], ZY[2]*ZX[0], 0,
                 0    ,  ZY[2]      , ZY[1]      , 0,
                -ZX[0], -ZY[1]*ZX[2], ZY[2]*ZX[2], 0,
              -camPos[0]*ZX[2] + camPos[2]*ZX[0],
              -camPos[1]*ZY[2] + ZY[1]*(camPos[2]*ZX[2] + camPos[0]*ZX[0]),
              -(camPos[1]*ZY[1]+ZY[2]*(camPos[2]*ZX[2] + camPos[0]*ZX[0])),
              1];*/
              return [-XY[0]*ZX[2] - A*XY[1], -ZY[1]*ZX[0],  XY[1]*ZX[0] - A*XY[0], 0,
              -XY[1]*ZY[1]          ,  ZY[2]      , -ZY[1]*ZX[1]          , 0,
               ZX[0]*XY[0] - B*XY[1], -ZY[1]*ZX[2], -ZX[0]*XY[1] - B*XY[0], 0,
            XY[0]*(camPos[0]*ZX[2] + camPos[2]*ZX[0]) + XY[1]*(camPos[1]*ZY[1]+ZY[2]*(camPos[2]*ZX[2] + camPos[0]*ZX[0])),
            -camPos[1]*ZY[2] + ZY[1]*(camPos[2]*ZX[2] + camPos[0]*ZX[0]),
            XY[0]*(camPos[1]*ZY[1]+ZY[2]*(camPos[2]*ZX[2] + camPos[0]*ZX[0])) - XY[1]*(camPos[0]*ZX[2] + camPos[2]*ZX[0]),
            1];
      }
}