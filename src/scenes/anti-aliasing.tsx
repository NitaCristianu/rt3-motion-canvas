import { Circle, Gradient, GradientProps, Node, Rect, makeScene2D, Line } from '@motion-canvas/2d';
import { createRef, createSignal, linear, waitFor, waitUntil, Color, easeInCubic, all, range } from '@motion-canvas/core';
import { Shader } from '../components/Shader';
import previousVideoShader from '../components/shaders/previous-video-shader';
import previousVideoShaderTransition from '../components/shaders/previous-video-shader-transition';
import { BLACK, WHITE } from '../styles';

export default makeScene2D(function* (view) {

  const shader = createRef<Shader>();
  const circle_zoom = createRef<Circle>();
  const time = createSignal<number>(0);
  const blackFrame = createRef<Rect>();

  const STOP_AT = 8.35;
  const CHANGE_AT = 3.62
  yield time(STOP_AT, STOP_AT)

  view.add(<Rect
    ref={blackFrame}
    opacity={0}
    fill={BLACK}
    size='100%'
  />)
  view.add(<Shader
    ref={shader}
    size='100%'
    shader_code={previousVideoShader}
    time={time}
  />)
  yield* waitFor(CHANGE_AT);
  shader().remove();
  view.add(<Shader
    ref={shader}
    size='100%'
    zIndex={-1}
    shader_code={previousVideoShaderTransition}
    time={time}
    cache
  />)
  yield* waitFor(STOP_AT - CHANGE_AT - 2.0);
  yield* shader().scale(7, 1.5);

  const settings: GradientProps = {
    stops: [
      { offset: 0.0, color: '#fff0' },
      { offset: .2, color: '#fff' },
      { offset: .8, color: '#fff' },
      { offset: 1.0, color: '#fff0' },
    ],
    type: 'linear'
  }
  const GRADIENTS = [
    new Gradient({
      from: [-300, 0],
      to: [300, 0],
      ...settings
    }),
    new Gradient({
      from: [0, -300],
      to: [0, 300],
      ...settings
    }),
    new Gradient({
      from: [300, -300],
      to: [-300, 300],
      ...settings
    }),
    new Gradient({
      from: [-300, 300],
      to: [300, -300],
      ...settings
    })
  ]

  yield view.add(
    <Node cache>


      <Rect
        size={1600}
        fill={GRADIENTS[1]}
        position={[310, -10]}
      />
      <Rect
        size={1600}
        fill={GRADIENTS[0]}
        compositeOperation={'source-in'}
        position={[310, -10]}
      />
      <Rect
        size={1600}
        fill={GRADIENTS[2]}
        position={[310, -10]}
        compositeOperation={'source-in'}
      />
      <Rect
        size={1600}
        fill={GRADIENTS[3]}
        position={[310, -10]}
        compositeOperation={'source-in'}
      />


      <Circle
        ref={circle_zoom}
        zIndex={6}
        position={[310, -10]}
        scale={10}
        clip
        shadowBlur={40}
        shadowColor={WHITE}
        compositeOperation={'source-in'}
      >{shader().reactiveClone({
        position: [-310, 10],
        scale: 7,
      })}
      </Circle>

    </Node>)


  yield* waitUntil('zoom in');
  yield* all(
    circle_zoom().size(60, 1),
    blackFrame().opacity(0.83, 1),
  );
  yield* waitUntil('zoom out');
  yield* all(
    circle_zoom().size(0, 1),
    blackFrame().opacity(0, 1),
  );

  view.add(<Line

    

  />)


  yield* waitUntil('end');
});
