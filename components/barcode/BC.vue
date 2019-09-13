<template>
  <div>
    <div id="bord" style="position: fixed; top: 0; left: 0; width: 100%; background-color: yellow; z-index: 99999;">
      event: {{ uiPointer }}-{{ show }} <br />
      {{ pivot }} <br /> {{ resizeHandle }} <br /> {{ rotationHandle }} <br /> {{ uiVector }} <br /> {{ deg }} - {{ rad }}
    </div>
    <svg
      id="svgHelper"
      ref="svgHelper"
      :class="{'no-touch': action}"
      style="position: absolute"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="500"
      height="500"
    >
      <defs>
        <!--
          DEFINIZIONE DELL'INTERFACCIA PER LA LOCALIZZAZIONE DEL BARCODE
          TUTTO IL SISTEMA VIENE DEFINITO IN SCALA 1 CON
          RIFERIMENTO LA LINEA ROSSA DOVE VERRA' ESTRATTO LA STRISCIA DA DECODIFICARE
          IL PUNTO MEDIO DELLA LINEA ROSSA SARA' L'ORIGINE DI TUTTO IL SISTEMA
          E ANCHE IL PUNTO PER SPOSTARE IL LOCALIZZATORE
          L'ESTREMO SINISTRO VERRA' USATO PER IL RIDIMENSIONAMENTO
          L'ESTREMO DESTRO VERRA' USATO PER LA ROTAZIONE
          TUTTI E TRE I PUNTI AVRANNO UN'APPOSITA ICONA PER INDICARE IL LORO SCOPO.
          PER RIDIMENSIONARE E RUOTARE IL LOCALIZZATORE VERRA' UTILIZZATO ROTAZIONE
          E RIDIMENSIONAMENTO DELL'ELEMENTO USE. MENTRE LO SPOSTAMENTO VERRA' FATTO
          POSIZIONANDO CORRETTAMENTE L'ELEMENTO CON X, Y
          Per la parte di interazione, sara' il JS che determinera' se il punto di interazione
          si trova sopra a uno dei 3 punti di gestione.
        -->
        <rect
          id="codeBoundary"
          x="-0.5"
          :y="-height / 2"
          width="1"
          :height="height"
        />
        <circle
          id="baseCircle"
          cx="0"
          cy="0"
          r="1"
          opacity="0.4"
        />
        <polygon
          id="bigTriangle"
          points="
            1,0
            0.25,-0.75
            0.25,0.75
            1,0
          "
        />
        <polygon
          id="arrowRight"
          points="
            0.6,0
            0.6,0.3
            0.9,0
            0.6,-0.3
            0.6,0
            0,0
          "
          stroke-width="0.1"
          stroke="black"
          stroke-linejoin="arcs"
          stroke-linecap="round"
        />
        <polygon
          id="smallTriangle"
          points="
            1,0
            0.4,0
            0.7,-0.3
          "
          strike-width="0.1"
        />
        <g
          id="resizeIcon"
          :transform="`scale(${handleRadius})`"
        >
          <use xlink:href="#baseCircle" fill="blue" />
          <use xlink:href="#bigTriangle" />
          <use xlink:href="#bigTriangle" transform="rotate(180)" />
        </g>
        <g
          id="moveIcon"
          :transform="`scale(${handleRadius})`"
        >
          <use xlink:href="#baseCircle" fill="blue" />
          <use xlink:href="#arrowRight" />
          <use xlink:href="#arrowRight" transform="rotate(90)" />
          <use xlink:href="#arrowRight" transform="rotate(180)" />
          <use xlink:href="#arrowRight" transform="rotate(270)" />
        </g>

        <g
          id="rotateIcon"
          :transform="`scale(${handleRadius})`"
        >
          <use xlink:href="#baseCircle" fill="blue" />
          <use xlink:href="#smallTriangle" transform="rotate(-60)" />
          <use xlink:href="#smallTriangle" transform="scale(1,-1) rotate(-60)" />
          <path
            d="
              M 0.7,0
              A 0.7 0.7 90 0 0 -0.35,-0.606
            "
            fill="none"
            stroke-width="0.1"
            stroke="black"
            transform="rotate(60)"
          />
        </g>
        <g id="scanHelperDef">
          <use
            ref="codeBoundary"
            xlink:href="#codeBoundary"
            :transform="`scale(${rect.width})`"
          />
          <line
            id="scanLine"
            refs="scanLine"
            :x1="-rect.width / 2"
            y1="0"
            :x2="rect.width / 2"
            y2="0"
          />
          <use
            id="rotationHandle"
            xlink:href="#rotateIcon"
            :x="rect.width / 2"
          />
          <use
            id="resizeHandle"
            xlink:href="#resizeIcon"
            :x="-rect.width / 2"
          />

          <g id="editDots">
            <use
              id="pivot"
              xlink:href="#moveIcon"
            />
          </g>
        </g>
      </defs>
      <image ref="barcodeImage" xlink:href="~/static/r30.jpeg" height="500" @load="onLoad" />
      <use
        id="scanHelper"
        xlink:href="#scanHelperDef"
        :x="pivot.x"
        :y="pivot.y"
        :transform="`rotate(${deg}, ${pivot.x}, ${pivot.y})`"
      />
    </svg>
    <div
      ref="uiCapture"
      :class="{ uiCapture: true, show: true }"
      style="position: relative; width: 500px; height: 500px; opacity: 0.3"
      @mousemove="setPoint"
      @mousedown="onStart"
      @mouseup="onStop"
      @mouseleave="onStop"
      @touchstart="onStart"
      @touchmove="setPoint"
      @touchend="onStop"
      @touchcancel="onStop"
    >
    </div>
    <canvas
      ref="canvasHelper"
      width="500"
      height="500"
    />
    {{ code }}
    <img ref="image" :src="src" style="opacity: 0" />
  </div>
</template>

<script lang="ts">
/* eslint require-await: "error" */
import Vue from 'vue'
import { Component, Ref } from 'vue-property-decorator'
import { Point2D, Matrix2D, Vector2D, ICoordinate2D } from 'kld-affine'
import consola from 'consola'
import decoder from 'javascript-barcode-reader'
// import { pick } from 'lodash'

let count = 0
function degree (alpha) {
  return alpha * (180 / Math.PI)
}

const initialPoint = new Point2D(180, 250)
const initialWidth = 100

function noop () {}

@Component
export default class BC extends Vue {
  consola = consola

  @Ref()
  readonly codeBoundary!: SVGUseElement

  @Ref()
  readonly svgHelper!: SVGElement

  @Ref()
  readonly uiCapture!: HTMLElement

  @Ref()
  readonly image!: HTMLImageElement

  @Ref()
  readonly canvasHelper!: HTMLCanvasElement

  @Ref()
  readonly barcodeImage!: CanvasImageSource

  deg = 0

  rad = 0

  evt: string[] = []

  src = 'r30.jpeg'

  handleRadius = 12

  codeBoundaryRatio = 9 / 16

  get height () {
    return this.codeBoundaryRatio
  }

  rect: {x, y, height, width} | null = null

  action: (Point: ICoordinate2D) => void = noop

  uiPointer: Point2D | null = null

  uiVector: Vector2D | null = null

  pivot: Point2D = initialPoint

  resizeHandle: Point2D = initialPoint.subtract({ x: initialWidth / 2, y: 0 })

  rotationHandle: Point2D = initialPoint.add({ x: initialWidth / 2, y: 0 })

  size: number = 100

  scale: number = 1

  code: string | null = null

  get show (): boolean { return this.uiPointer !== null }

  created () {
    this.buildRectangle()
  }

  private extractPointFromMouseEvent (event: MouseEvent) {
    return new Point2D(event.offsetX, event.offsetY)
  }

  private extractPointFromTouchEvent (event: TouchEvent) {
    const touch = event.touches[0]
    const bbox = this.uiCapture.getBoundingClientRect()
    return new Point2D(touch.clientX, touch.clientY).subtract({ x: bbox.left, y: bbox.top })
  }

  private extractTouchRadius (event: TouchEvent) {
    const touch = event.touches[0]
    this.uiVector = new Vector2D(touch.radiusY, touch.radiusY)
    return Math.max(touch.radiusX, touch.radiusY, this.handleRadius)
  }

  setPoint (event) {
    if (this.action === noop) {
      return
    }
    event.preventDefault()
    this.evt.push(++count + event.type)
    switch (event.type) {
      case 'mousedown':
        // falls through
      case 'mousemove': {
        this.uiVector = null
        this.uiPointer = new Point2D(event.offsetX, event.offsetY)
        // this.evt.push(this.uiPointer.toString())
        break
      }
      case 'touchstart':
        // falls through
      case 'touchmove': {
        const touch = event.touches[0]
        const bbox = this.svgHelper.getBoundingClientRect()
        // consola.info('TOUCHMOVE', touch, event, bbox)
        // const newPoint = new Point2D(touch.clientX, touch.clientY).transform(this.svgHelper.getSceet)
        this.uiPointer = new Point2D(touch.clientX, touch.clientY).subtract({ x: bbox.left, y: bbox.top })
        break
      }
    }
    if (this.uiPointer) {
      this.action(this.uiPointer)
    }
    if (this.evt.length > 10) {
      this.evt.shift()
    }
  }

  onLoad () {
    consola.info('>>> loaded')
    if (!this.image) {
      return
    }
    this.scale = this.image.naturalHeight / 500
  }

  async checkBarcode () {
    if (!this.canvasHelper || !this.barcodeImage || !this.rect || !this.svgHelper || !this.codeBoundary) {
      return
    }

    const scale = this.scale
    this.canvasHelper.height = this.rect.height * scale
    this.canvasHelper.width = this.rect.width * scale
    const ctx = this.canvasHelper.getContext('2d')
    if (!ctx) {
      return
    }
    const halfDiagonal = (this.pivot.distanceFrom({ x: this.rect.x, y: this.rect.y }))
    const cropPoint = this.pivot.transform(Matrix2D.translation(-halfDiagonal, -halfDiagonal))
    const cropEdge = 2 * halfDiagonal

    consola.info('checking', scale, halfDiagonal, cropPoint)
    // const min = this.resizeHandle.min(this.rotationHandle)
    // const max = this.resizeHandle.max(this.rotationHandle)
    // const vector = Vector2D.fromPoints(min, max)
    ctx.clearRect(0, 0, this.canvasHelper.width, this.canvasHelper.height)
    ctx.save()
    ctx.translate(-this.rect.x * scale, -this.rect.y * scale)
    ctx.rotate(-this.rad)
    ctx.drawImage(this.barcodeImage, cropPoint.x * scale, cropPoint.y * scale, cropEdge * scale, cropEdge * scale, -halfDiagonal * scale, -halfDiagonal * scale, cropEdge * scale, cropEdge * scale)
    ctx.restore()
    try {
      // try to read 3 pixel height from selected area
      this.code = await decoder(ctx.getImageData(0, this.canvasHelper.height / 2, this.canvasHelper.width, 3), {
        barcode: 'code-2of5',
        type: 'interleaved'
      })
    } catch (error) {
      this.code = error.message
    }
  }

  buildRectangle () {
    const vector = Vector2D.fromPoints(this.resizeHandle, this.rotationHandle)
    const width = vector.length()
    const height = width * this.codeBoundaryRatio
    this.rect = {
      x: -(width / 2),
      y: -(height / 2),
      width,
      height
    }
  }

  onStart (event) {
    let eventPoint!: Point2D
    let precision = this.handleRadius
    switch (event.type) {
      case 'mousedown': {
        eventPoint = this.extractPointFromMouseEvent(event as MouseEvent)
        break
      }
      case 'touchstart': {
        eventPoint = this.extractPointFromTouchEvent(event as TouchEvent)
        precision += this.extractTouchRadius(event as TouchEvent)
        break
      }
    }
    // check witch transformation to perform
    if (this.resizeHandle.distanceFrom(eventPoint) <= precision) {
      this.action = this.onResize
    } else if (this.pivot.distanceFrom(eventPoint) <= precision) {
      this.action = this.onMove
    } else if (this.rotationHandle.distanceFrom(eventPoint) <= precision) {
      this.action = this.onRotate
    } else {
      this.action = noop
    }
    this.setPoint(event)
  }

  onStop () {
    if (this.action === noop) {
      return
    }
    consola.info('Stopping')
    this.action = noop
    this.checkBarcode()
  }

  onStartResize (event) {
    event.preventDefault()
    consola.info('Start Resizing')
    this.action = this.onResize
  }

  onMove ({ x, y }) {
    const movement = Matrix2D.translation(x - this.pivot.x, y - this.pivot.y)
    this.pivot = this.pivot.transform(movement)
    this.resizeHandle = this.resizeHandle.transform(movement)
    this.rotationHandle = this.rotationHandle.transform(movement)
    this.buildRectangle()
  }

  onRotate ({ x, y }) {
    const vStart1 = Vector2D.fromPoints(this.pivot, this.rotationHandle)
    const vStart = Vector2D.fromPoints(this.pivot, { x: this.pivot.x + 10, y: this.pivot.y })
    const vEnd = Vector2D.fromPoints(this.pivot, { x, y })
    this.rad = vStart.angleBetween(vEnd)
    this.deg = degree(this.rad)
    consola.info('Rotating', this.deg, this.rad)
    const mx = Matrix2D.rotationAt(vStart1.angleBetween(vEnd), this.pivot)
    this.rotationHandle = this.rotationHandle.transform(mx)
    this.resizeHandle = this.resizeHandle.transform(mx)
  }

  onResize ({ x, y }) {
    const vMouse = Vector2D.fromPoints(this.pivot, { x, y })
    const vHandle = Vector2D.fromPoints(this.pivot, this.resizeHandle)
    const resize = Matrix2D.scalingAt(vMouse.length() / vHandle.length(), this.pivot)
    consola.info(`Resizing ${resize}`)
    this.resizeHandle = this.resizeHandle.transform(resize)
    this.rotationHandle = this.rotationHandle.transform(resize)
    this.buildRectangle()
  }
}
</script>

<style lang="scss" scoped>
  #barcode {
    opacity: 0.3;
  }

  #codeBoundary {
    // stroke-width: 1px;
    // stroke: blue;
    fill-opacity: 0.3;
    fill: green;
  }

  #scanLine {
    stroke: red;
    stroke-width: 2px;
  }

  svg {
    border: 1px solid black;
  }

  canvas {
    border: 1px solid red;
  }

  .uiCapture {
    display: none;

    &.show {
      display: block;
    }
  }

</style>
