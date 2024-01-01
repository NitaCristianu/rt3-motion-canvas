export default `#define PI 3.1415926535
#define NUM_OF_SPHERES 6

struct Ray {
    vec3 o;
    vec3 d;
};

struct Material {
    vec3 albedo;
    float persistence;
    bool diffuse;
};

struct Sphere {
    vec3 c;
    float r;
    Material mat;
};

struct Record { 
    vec3 p;
    float t;
    vec3 n;
    Material mat;
    bool didHit;
};

vec2 randState;

float hash( const float n ) 
{
     return fract(sin(n)*43758.54554213);
}


float rand2D()
{
    randState.x = fract(sin(dot(randState.xy, vec2(12.9898, 78.233))) * 43758.5453);
    randState.y = fract(sin(dot(randState.xy, vec2(12.9898, 78.233))) * 43758.5453);;
    
    return randState.x;
}


vec3 random_in_unit_sphere()
{
    float phi = 2.0 * PI * rand2D();
    float cosTheta = 2.0 * rand2D() - 1.0;
    float u = rand2D();

    float theta = acos(cosTheta);
    float r = pow(u, 1.0 / 3.0);

    float x = r * sin(theta) * cos(phi);
    float y = r * sin(theta) * sin(phi);
    float z = r * cos(theta);

    return vec3(x, y, z);
}

vec3 random_in_hemisphere(vec3 normal)
{
    vec3 rand = random_in_unit_sphere();
    if (dot(normal, rand) < 0.0)
        return -rand;
    return rand;
}


Sphere SPHERES[] = Sphere[NUM_OF_SPHERES](
    Sphere(
        vec3(.05,0,-.3)*5.0,
        .7,
        Material(vec3(.9,.2,.2), 0.9, false)  
    ),
    Sphere(
        vec3(.0,.0,.1)*5.0,
        0.4,
        Material(vec3(.2,.2,.9), 0.9, false)  
    ),
    Sphere(
        vec3(.1,.0,.0)*5.0,
        0.4,
        Material(vec3(.2,.9,.2), 0.9, false)  
    ),
    Sphere(
        vec3(-.1,.0,.0)*5.0,
        0.3,
        Material(vec3(.9,.2,.9), 0.9, false)  
    ),
    Sphere(
        vec3(0,0,-.3),
        0.5,
        Material(vec3(0.2,0.2,.9)*5.0, 0.8, true)  
    ),
    Sphere(
        vec3(0,-1.0,-.3),
        0.2,
        Material(vec3(0.2,0.8,.9)*5.0, 0.8, true)  
    )
);

Record hit(Ray r, Sphere s){
    Record info;
    vec3 oc = r.o - s.c;
    float a = dot(r.d, r.d);
    float b = dot(oc, r.d);
    float c = dot(oc, oc) - s.r * s.r;

    float disc = b*b - a * c;

    if (disc > 0.0){
        float t = (-b - sqrt(disc)) / a;
        vec3 p = r.o + r.d * t;
        info.didHit = true;
        info.t = t;
        info.n = (p - s.c) / s.r;
        info.p = p;
        info.mat = s.mat;
        return info;
    }

    info.didHit = false;
    return info;
}

Record hit_world(Ray r){
    Record info;
    info.t = 99999999.0;

    for (int i = 0; i < NUM_OF_SPHERES; i++){
        Sphere s = SPHERES[i];
        Record tempinfo = hit(r, s);
        if (tempinfo.didHit && tempinfo.t < info.t && tempinfo.t > 0.0){
            info = tempinfo;
        }
    }

    return info;
}

Ray calculateRay(vec3 lookTo, vec3 CameraOrigin, vec2 ScaledDown){
    vec3 forwad = normalize(lookTo - CameraOrigin);
    vec3 right = normalize(cross(forwad, vec3(0, 1,0)));
    vec3 up = normalize(cross(forwad, right));
    vec3 direction = forwad + right * ScaledDown.x + up * ScaledDown.y;
    return Ray(CameraOrigin, direction); 
}

vec3 background(Ray r){
    return vec3(0);
}

vec3 rayColor(Ray r){
    vec3 col = vec3(1);
    for (int i = 0; i <= 20; i++){
        Record info = hit_world(r);
        if (info.didHit){
            r.o = info.p;
            r.d = random_in_hemisphere(info.n);
            if (info.mat.diffuse){
                col *= info.mat.persistence;
            }
            else{
                col *= info.mat.albedo;
                break;
                }
        }else{
            col *= background(r);
            break;
        }
    }
    return col;
}

void main () {
    randState = gl_FragCoord.xy / iResolution.xy;
    vec2 uv = gl_FragCoord.xy / iResolution.xy - 0.5;
    vec2 ScaledDown = iResolution.xy / 400.0 * uv;

    Ray r = calculateRay(
        vec3(0,0,0),
        vec3(sin(iTime), 0, cos(iTime)*1.2) * 1.9,
        ScaledDown
    );

    vec3 color = rayColor(r);
   
   gl_FragColor = vec4(color, 1);
}`