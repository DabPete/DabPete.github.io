let maptester = new Map();

let keychaintest = [];
let keychainvec = [];
let keychain = [];
let mapsize = [];
let forEachvalues = [];
let itervalues = [];

/*maptester.__proto__.transKey = function(key){
    return [key[0]-this.trans[0], key[1]-this.trans[1], key[2]-this.trans[2]];
}*/

/*maptester.__proto__.transKey = function(key){
    return [key[0]-trans[0], key[1]-trans[1], key[2]-trans[2]];
} // SLOOOOW AS FUCK*/

base_i = -16000;
base_j = -16000;
base_y = -25000;
for(i=base_i; i<250+base_i;i++){
    for(j=base_j; j<25+base_j;j++){
        for(y=base_y; y<16+base_y;y++){
            keychain.push([i,y,j]);
        }
    }
}

var tests = 100;
var totaltime = 0;
var startTime = 0;
var endTime = 0;

function testloadfun(a){
    return [a[0]+1, a[1]+2, a[2]+3];
}

readTime = 0;
clearTime = 0;
writeTime = 0;
iteraTime = 0;

for(ii = 0;ii<tests; ii++){

    startTime = performance.now();
    maptester.clear();
    endTime = performance.now();

    clearTime += (endTime-startTime);

    startTime = performance.now();
    keychain.forEach(function(val){maptester.set(val.toString(), [val, Math.ceil(Math.random()*65535), Math.ceil(Math.random()*65535)].flat());})
    endTime = performance.now();

    
    writeTime += (endTime-startTime);
    mapfogtester = new Map(maptester);
    mapsize.push(mapfogtester.size);

    keychaintest = [];
    keychainvec = [];
    startTime = performance.now();
    maptester.forEach(function(value, key) {
        mapfogtester.delete(key);
        keychainvec.push(testloadfun(value[0]));
        keychainvec.push(keychainvec.pop());
        keychaintest.push(key);
    });
    
    endTime = performance.now();

    mapsize.push(mapfogtester.size);
    readTime += (endTime-startTime);

    itervalues = [];
    startTime = performance.now()
    itervalues = [...maptester.values()].flat();
    
    endTime = performance.now()

    iteraTime +=(endTime-startTime);
    
}

console.log("clear time: " +(clearTime/(tests-1)) + "ms");
console.log("write time: " + (writeTime/tests) + "ms");
console.log("read time: " + (readTime/tests) + "ms");
console.log("Iterating [...]: "+(iteraTime/tests) + "ms");

// yet additional code

let a = new Int32Array(100000), A = [], B = [], C = [];
bitShiftTime=0;
divisionTime=0;
multiplyTime=0;
for(i=100000; i--;){a[i] = 0x10;}

iterations = 1000;
for(i=iterations;i--;){
startTime = performance.now();
a.forEach((x)=>{A.push(x>>4)});
endTime = performance.now();
bitShiftTime += (endTime - startTime)

startTime = performance.now();
a.forEach((x)=>{B.push(x/16)});
endTime = performance.now();
divisionTime += (endTime - startTime);

startTime = performance.now();
a.forEach((x)=>{C.push(x*0.0625)});
endTime = performance.now();
multiplyTime += (endTime - startTime)
}

console.log("Bitshift eval. time" + bitShiftTime/iterations +"ms");
console.log("Division eval. time" + divisionTime/iterations +"ms");
console.log("Multiply eval. time" + multiplyTime/iterations +"ms");