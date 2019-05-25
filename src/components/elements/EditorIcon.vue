<template>
  <svg
    :style="style"
    :width="width"
    :height="height">
    <use :xlink:href="iconPath" />
  </svg>
</template>

<script>
export default {
  name: 'editor-icon',
  props: {
    'name': {
      default: '',
      type: String
    },
    'color': {
      default: 'currentColor',
      type: String
    },
    'width': {
      default: '',
      type: String
    },
    'height': {
      default: '',
      type: String
    }
  },
  computed: {
    style () {
      let style = [];
      style.push(`fill: ${this.color}`);
      return style.join(';')
    },
    iconPath () {
      return `assets/svg/editor-ui-svg-map.svg#${this.name}`;
    }
  }
}
</script>
