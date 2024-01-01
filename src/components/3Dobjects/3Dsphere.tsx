import { DoubleSide, MaterialParameters,MeshStandardMaterial, MeshPhongMaterial, Mesh, MeshBasicMaterial, Object3D, SphereGeometry, Vector3 } from "three";
import { Base3D, Base3DProps } from "./3Dbaseclass";
import { ColorSignal, PossibleColor, SignalValue, Color, SimpleSignal } from "@motion-canvas/core";
import { initial, signal } from "@motion-canvas/2d";
import * as THREE from 'three';

export type materialTypes = 'basic' | 'standard' | 'phong'

export interface Sphere3DProps extends Base3DProps {
    fill? : SignalValue<PossibleColor>,
    position3D? : SignalValue<Vector3>,
    radius? : SignalValue<number>,
    materialParams? : MaterialParameters,
    materialType? : materialTypes,
    size? : Vector3,
    opacity3D?: SignalValue<number>,
}

export class Sphere3D extends Base3D {

    @initial(new Color("rgb(255,255,255)"))
    @signal()
    public declare readonly fill: ColorSignal< PossibleColor>

    @initial(new Vector3(0,0,0))
    @signal()
    public declare readonly position3D: SimpleSignal<Vector3>

    @initial(new Vector3(1,1,1))
    @signal()
    public declare readonly size: SimpleSignal<Vector3>

    @initial(0)
    @signal()
    public declare readonly radius: SimpleSignal<number>

    @initial(1)
    @signal()
    public declare readonly opacity3D: SimpleSignal<number>

    public mesh : Mesh;
    public geometry : SphereGeometry;
    public material : MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial;

    public constructor(props?:Sphere3DProps){
        super({...props});
        this.geometry = new SphereGeometry(1, 128, 128);
        
        
        props.materialType = props.materialType? props.materialType : 'standard';
        this.material = this.getMaterial(props.materialType, props.materialParams);
        this.mesh = new Mesh(this.geometry, this.material);

        this.update()
    }

    private getMaterial(matType:materialTypes, matProps:MaterialParameters):MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial{
        var matclass:MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial;
        var props = {
            color : this.fill().hex(),
            Side : DoubleSide, 
            ...matProps
        }
        switch(matType){
            case('basic'): {
                matclass = new MeshBasicMaterial(props); break;
            }
            case('standard'): {matclass = new MeshStandardMaterial({
                //depthTest:false,
                ...props
            }); break; }
            case('phong'): { matclass = new MeshPhongMaterial({
                //depthTest:false,
                ...props
            }); break; }
        }
        
        return matclass;
    }
    
    public update(){
        this.mesh.scale.copy( new Vector3(this.radius(),this.radius(),this.radius()).multiply(this.size()));
        this.mesh.position.copy(this.position3D());
        if(this.material){
            this.material.color = new THREE.Color( this.fill().hex() );
            if (this.opacity3D() < 1 && !this.material.transparent)
                this.material.transparent = true;
            this.material.opacity = this.opacity3D()
        }
    }

    public override includeIn(obj : Object3D){
        obj.add(this.mesh);
    }
}