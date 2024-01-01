import { Node, NodeProps } from "@motion-canvas/2d";
import { Object3D, Scene } from "three";

export interface Base3DProps extends NodeProps {}

export class Base3D extends Node {
    public readonly is3D = true;

    public update(){}
    protected override draw(context : CanvasRenderingContext2D){
        this.update()
        super.draw(context);
    }
    public includeIn(obj : Object3D) {}
}