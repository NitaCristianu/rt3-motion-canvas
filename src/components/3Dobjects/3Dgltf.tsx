import { MeshStandardMaterial, MeshPhongMaterial, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { Base3D, Base3DProps } from "./3Dbaseclass";
import { SignalValue, SimpleSignal, useLogger } from "@motion-canvas/core";
import { initial, signal } from "@motion-canvas/2d";
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export type materialTypes = 'basic' | 'standard' | 'phong'

export interface GLTF3DProps extends Base3DProps {
    position3D? : SignalValue<Vector3>,
    size? : Vector3,
    src? : string,
}

export class GLTF3D extends Base3D {

    @initial(new Vector3(0,0,0))
    @signal()
    public declare readonly position3D: SimpleSignal<Vector3>

    @initial(new Vector3(1,1,1))
    @signal()
    public declare readonly size: SimpleSignal<Vector3>

    public mesh : Object3D;
    public material : MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial;
    private props : GLTF3DProps;

    public constructor(props?:GLTF3DProps){
        super({...props});
        this.props = props;

        this.update()
    }
    
    public update(){
        if (this.mesh){
            this.mesh.scale.copy( this.size());
            this.mesh.position.copy(this.position3D());
        }
    }

    public override includeIn(scene : Object3D){
        const logger = useLogger();
        const gltfLoader = new GLTFLoader();
        var obj:Object3D;
        gltfLoader.load(this.props.src, (gltfScene: GLTF)=>{
            this.mesh = gltfScene.scene;
            
            scene.add(this.mesh);
            
        }, function(xhr){
            logger.info((xhr.loaded / xhr.total * 100) + '% loaded')
        }, function(error){
            logger.error(error);
        })
        
    }
}