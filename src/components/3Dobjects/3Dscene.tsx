import { Rect, RectProps } from "@motion-canvas/2d";
import { Three } from "../Three";
import { Scene } from "three";
import { createRef, useLogger } from "@motion-canvas/core";
import { Base3D } from './3Dbaseclass';
import { Camera3D } from "./3Dcamera";

export interface Scene3DProps extends RectProps {
    
}

export class Scene3D extends Rect {

    private readonly scene = new Scene();
    private readonly Three = createRef<Three>();
 
    private Objects: Base3D[] = [];

    public constructor(props? : Scene3DProps) {
        super({
            ...props,
        });
        const logger = useLogger();
        var camera : Camera3D;
        this.children().forEach((component)=>{
            if (component instanceof Base3D )
                this.include(component)
            if (component instanceof Camera3D)
                camera = component
        })
        if (!camera)
            logger.error("scene needs a camera added in the scene's initialization");
        this.layout(true)
        
        this.add(<Three
            ref = {this.Three}
            size = '100%'
            scene={this.scene}
            camera={camera.cam}
        />)
        
    }

    public include(object : Base3D){
        this.Objects.push(object);
        object.includeIn(this.scene);
    }
}