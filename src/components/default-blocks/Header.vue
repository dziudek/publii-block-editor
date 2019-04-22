<template>
  <component
    :is="'h' + headingLevel"
    contenteditable="true">
    {{ headerText }}
  </component>
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'Header',
  mixins: [
    Block
  ],
  data () {
    return {
      headingLevel: 2,
      headerText: ''
    };
  },
  mounted () {
    this.headerText = this.content;
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
