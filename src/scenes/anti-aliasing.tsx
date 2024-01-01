import {makeScene2D} from '@motion-canvas/2d';
import {Vector2, createRef, createSignal, delay, linear, useScene, waitFor, waitUntil} from '@motion-canvas/core';
import { Shader } from '../components/Shader';
import previousVideoShader from '../components/shaders/previous-video-shader';
import previousVideoShaderTransition from '../components/shaders/previous-video-shader-transition';

export default makeScene2D(function* (view) {

    const shader = createRef<Shader>();
    const time = createSignal<number>(0);
   
    yield time(8.1, 8.1, linear)
    view.add(<Shader
      ref = {shader}
      size = '100%'
      shader_code={previousVideoShader}
      time = {time}
    />)
    yield* waitFor(3);
    shader().remove(); 
    view.add(<Shader
    
      size = '100%'
      shader_code={previousVideoShaderTransition}
      time = {time}
    />)
    
  yield* waitUntil('end');
});
 