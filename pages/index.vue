<template>
  <v-card>
    <v-card-title class="headline">
      {{ $i18n.t('cps.titolo') }}
    </v-card-title>
    <v-card-text>
      descrione pagina
    </v-card-text>
    <barcode></barcode>
    <video ref="video" width="480" />
    <img ref="img" src="~/static/barcode2mmb.jpeg" @load="onImage" />
  </v-card>
</template>

<script>
// le pagine devono essere in javascript perche'
// nuxt-i18n non supporta correttamente typescript
// creare un'immaggine di qrcode con una barra rossa
// usare eventualmente insieme di qudarti
// piu' la linea rossa.
// proporzioni fisse.
// linea rossa alta 1px centrato all'elemento vericalmente e orizontalmente
// questo fara' da base di riferimento per la striscia
// dell'immagine da estrarre.
// per la versione con immagine si puo' usare una linea dragable
// con gli angoli come pivot per individuare manualmente il qr.
// il sistema estrae sempre una porzione alta 2pixel.
// 1px e' troppo poco.
import x from 'javascript-barcode-reader'
import consola from 'consola'
import Barcode from '~/components/barcode/BC'

export default {
  components: {
    Barcode
  },
  methods: {
    async onImage (evt) {
      consola.log('onImage', evt)
      const code = await x(this.$refs.img, {
        barcode: 'code-2of5',
        type: 'interleaved'
      })
      consola.log(code)
    }
  }
}
</script>
