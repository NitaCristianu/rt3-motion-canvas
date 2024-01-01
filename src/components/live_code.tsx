import { Rect, initial, signal, Circle, RectProps } from "@motion-canvas/2d";
import { Reference, SignalValue,Color, SimpleSignal, all, chain, createRef, easeInCubic, easeOutCubic, range } from "@motion-canvas/core";
import { CodeBlock} from '@motion-canvas/2d/lib/components/CodeBlock';
import { BLACK, DARKGREY, LIGHTGREY, LIGHT_BACKGROUND } from '../styles';

export interface LiveCodeProps extends RectProps {
    initial? : SignalValue<string>;
}

export class LiveCode extends Rect {

    public readonly block: Reference<CodeBlock> = createRef<CodeBlock>();

    @initial("")
    @signal()
    public declare initial: SimpleSignal<string, this>;

    public toolbar = 80;
    public windowButtonSize = 30;
    public codePadding = 25;
    public windowButtonColors = [
        new Color("rgb(255, 95, 87)"),
        new Color("rgb(254, 188, 45)"),
        new Color("rgb(42, 189, 62)")
    ]

    public constructor(props? : LiveCodeProps) {
        super({...props,});
        this.opacity(0);
        this.fill(BLACK);
        this.shadowBlur(5);
        this.shadowColor(BLACK);
        this.lineWidth(5);
        this.radius(40);
        this.clip(true);

        this.add(
            <Rect
                fill={DARKGREY}
                topLeft={this.topLeft}
                width={'100%'}
                height={this.toolbar}
                layout
                paddingLeft={this.codePadding}
                gap={20}
                shadowColor={new Color('rgb(0,0,0)')}
                shadowBlur={25}
                shadowOffsetY={20}
            >
                {range(3).map((i:number)=>(
                    <Circle
                        lineWidth={4}
                        stroke = {this.windowButtonColors[i].desaturate(2)}
                        size={this.windowButtonSize}
                        alignSelf={'center'}
                    />
                ))}

            </Rect>    
        );

        this.add(<CodeBlock
            width={()=>this.width() - this.codePadding*2}
            y={this.toolbar/2}
            fontFamily={"JetBrains Mono"}
            fontSize={40}
            fontWeight={600}
            code={this.initial}
            height = {()=>this.height() - this.toolbar - this.codePadding*2}
            language="python"
            ref = {this.block}
        />);
    }

    public *Focus(duration?:number){
        if (!duration) duration = 0.35;
        yield* all(
            this.shadowBlur(105, duration, easeOutCubic ),
            this.shadowColor(LIGHT_BACKGROUND, duration, easeOutCubic)
        );
    }

    public *DeFocus(duration?:number){
        if (!duration) duration = 0.35;
        yield* all(
            this.shadowBlur(16, duration, easeInCubic),
            this.shadowColor(BLACK, duration, easeInCubic)
        );
    }


    public *FadeIn(duration?:number){
        if (!duration) duration = 0.35

        yield* chain(all(
            this.shadowBlur(16, duration, easeOutCubic),
            this.opacity(1, duration, easeOutCubic),
        ),
        )
    }
    
    public *FadeOut(duration?:number){
        if (!duration) duration = 0.35
        yield* all(
            this.shadowBlur(0, duration, easeOutCubic),
            this.opacity(0, duration, easeInCubic),
        )
    }
}