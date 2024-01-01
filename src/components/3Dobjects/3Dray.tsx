import { initial, signal } from '@motion-canvas/2d';
import { ColorSignal, PossibleColor, SignalValue, SimpleSignal, Color } from '@motion-canvas/core';
import * as THREE from 'three';
import { Base3D, Base3DProps } from './3Dbaseclass';


export interface Ray3DProps extends Base3DProps {
    lineWidth?: SignalValue<number>;
    quality?: SignalValue<number>;
    stroke?: SignalValue<PossibleColor>;
    from?: SignalValue<THREE.Vector3>;
    to?: SignalValue<THREE.Vector3>;
    end? : SignalValue<number>;
};

export class Ray3D extends Base3D {

    @initial(0.02)
    @signal()
    public declare readonly lineWidth : SimpleSignal<number>; 

    @initial(1)
    @signal()
    public declare readonly end : SimpleSignal<number>; 

    @initial(32)
    @signal()
    public declare readonly quality : SimpleSignal<number>; 

    @initial(new Color("rgb(255,255,255)"))
    @signal()
    public declare readonly stroke : ColorSignal<PossibleColor>; 

    @initial(new THREE.Vector3())
    @signal()
    public declare readonly from: SimpleSignal<THREE.Vector3>

    @initial(new THREE.Vector3())
    @signal()
    public declare readonly to: SimpleSignal<THREE.Vector3>

    private material: THREE.MeshBasicMaterial;
    private box: THREE.Mesh;
    public pointer: THREE.Mesh;
    private A: THREE.Mesh;

    public lenght = 0;
    
    public constructor(props?: Ray3DProps) {
        super({...props});
        this.construct3D();
    }

    public construct3D() {
        this.material = new THREE.MeshBasicMaterial({ color: new THREE.Color( this.stroke().hex() ) });
        const box_geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0, this.quality());
        const cone_geometry = new THREE.ConeGeometry(1, 2, 32, 32);
        const sphere_geometry = new THREE.SphereGeometry(1.0, 12, 32);
        
        this.box = new THREE.Mesh(box_geometry, this.material);
        this.A = new THREE.Mesh(sphere_geometry, this.material);
        this.pointer = new THREE.Mesh(cone_geometry, this.material);;
    }

    public update() {
        this.setAB(this.from(), this.to())
        this.pointer.position.copy(this.box.localToWorld(new THREE.Vector3(0, 0, -0.5 - this.lineWidth() * 2 / this.lenght)))
        this.pointer.scale.setScalar(this.lineWidth() * 2);
        this.pointer.lookAt(this.to().clone());
        this.pointer.rotateY(Math.PI);
        this.pointer.rotateX(Math.PI/2);
        this.A.scale.setScalar(this.lineWidth() * 0.5);
        this.A.position.copy(this.from().clone());
        this.lerp();
    }
    
    public includeIn(scene: THREE.Object3D) {
        scene.add(this.A, this.pointer, this.box);
    }

    public setAB(newA: THREE.Vector3, newB: THREE.Vector3) {
        const box = this.box;
        const width = this.lineWidth();
        const distance = newA.distanceTo(newB);
        const midPoint = new THREE.Vector3().addVectors(newA, newB).divideScalar(2);

        const direction = new THREE.Vector3().subVectors(newB, newA).normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
        if (box){

            box.position.copy(midPoint);    
            box.setRotationFromQuaternion(quaternion);
            box.scale.set(width, width, distance);
        }
        this.lenght = distance;
        this.from(newA);
        this.to(newB);
    }
    
    public lerp(){
        const lerped_b = this.from().clone().lerp(this.to().clone(), this.end());
        const midpoint = new THREE.Vector3().addVectors(this.from(), lerped_b).divideScalar(2);
        const dist = this.lenght * this.end();
        this.box.position.copy(midpoint);
        this.box.scale.set(this.lineWidth(), this.lineWidth(), dist);
        this.pointer.position.copy(this.box.localToWorld(new THREE.Vector3(0, 0, -0.5 - this.lineWidth() * 2 / this.lenght)))
        this.pointer.scale.setScalar(this.lineWidth() * 2);
        this.pointer.lookAt(lerped_b);
        this.pointer.rotateY(Math.PI);
        this.pointer.rotateX(Math.PI/2);
    }
    
};