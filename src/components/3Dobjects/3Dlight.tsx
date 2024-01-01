import { Object3D, PerspectiveCamera, PointLight, Scene, Vector3 } from "three";
import { Base3D, Base3DProps } from "./3Dbaseclass";
import { Color, ColorSignal, PossibleColor, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { initial, signal } from "@motion-canvas/2d";
import * as THREE from 'three';

export interface PointLight3DProps extends Base3DProps {
    fill? : SignalValue<PossibleColor>,
    position3D? : SignalValue<Vector3>,
    distance? : SignalValue<number>,
    intensity?: SignalValue<number>,
    decay? : number
}

export class PointLight3D extends Base3D {

    @initial(new Color("rgb(255,255,255)"))
    @signal()
    public declare readonly fill: ColorSignal<PossibleColor>

    @initial(new Vector3(0,0,0))
    @signal()
    public declare readonly position3D: SimpleSignal<Vector3>

    @initial(0)
    @signal()
    public declare readonly distance: SimpleSignal<number>

    @initial(1)
    @signal()
    public declare readonly intensity: SimpleSignal<number>

    @initial(2)
    @signal()
    public declare readonly decay: SimpleSignal<number>

    public pointlight:PointLight;

    public constructor(props?:PointLight3DProps){
        super({...props});
        this.pointlight = new PointLight()
        this.update();
    }

    public update(){
        this.pointlight.color = new THREE.Color( this.fill().hex() );
        this.pointlight.position.copy( this.position3D() );
        this.pointlight.intensity = this.intensity();
        this.pointlight.distance = this.distance();
        this.pointlight.decay = this.decay();
    }

    public override includeIn(obj : Object3D){
        obj.add(this.pointlight);
    }
}