import { Rect, RectProps, initial, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import * as THREE from 'three';
import { Three } from "./Three";

export interface Shader_Props extends RectProps {
    shader_code? : SignalValue<string>;
    time? : SignalValue<number>;
}

export class Shader extends Rect {
    
    private scene = new THREE.Scene();
    private camera = new THREE.Camera();
    private geometry = new THREE.PlaneGeometry(2, 2);
    private quad: THREE.Mesh;
    private material = new THREE.ShaderMaterial({
        uniforms: {
            iResolution : {value : new THREE.Vector2(0,0)},
            iTime : {value : 0}
        },
    });

    @initial(0)
    @signal()
    public declare time : SimpleSignal<number, this>;

    @initial(`
    void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        gl_FragColor = vec4(uv.x * ((sin(iTime)+1.)/2.), uv.y * ((sin(iTime)+1.)/2.), 0.0, 1.0);
    }`)
    @signal()
    public declare shader_code : SimpleSignal<string, this>;

    public constructor(props? : Shader_Props){
        super({...props,});
        this.material.fragmentShader = `
        uniform vec2 iResolution;
        uniform float iTime;
        ` + this.shader_code();

        this.material.uniforms.iResolution = new THREE.Uniform(new THREE.Vector2(this.width(), this.height()))
        this.material.uniforms.iTime = new THREE.Uniform(this.time());
        this.quad = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.quad);

        this.add(<Three
            size = {this.size}
            scene={this.scene}
            camera={this.camera}
        />)

    
    }

    protected override draw(context : CanvasRenderingContext2D){
        
        this.material.uniforms.iResolution = new THREE.Uniform(new THREE.Vector2(this.width(), this.height()));
        this.material.uniforms.iTime = new THREE.Uniform(this.time());

        super.draw(context);
    }
}