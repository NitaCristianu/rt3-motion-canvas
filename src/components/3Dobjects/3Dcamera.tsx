import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { Base3D, Base3DProps } from "./3Dbaseclass";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { initial, signal } from "@motion-canvas/2d";

export interface Camera3DProps extends Base3DProps {
    position3D? : SignalValue<Vector3>,
    lookTo? : SignalValue<Vector3>
}

export class Camera3D extends Base3D {

    public cam = new PerspectiveCamera(40, 1, 0.01, 2000);

    @initial(new Vector3(0,0,0))
    @signal()
    public declare readonly position3D: SimpleSignal<Vector3>

    @initial(new Vector3(0,0,-1))
    @signal()
    public declare readonly lookTo: SimpleSignal<Vector3>

    public constructor(props?:Camera3DProps){
        super({...props});
    }

    public override update(){
        this.cam.position.copy(this.position3D());
        this.cam.lookAt(this.lookTo()); 
    }

    public override includeIn(obj : Object3D){
        obj.add(this.cam);
    }
}