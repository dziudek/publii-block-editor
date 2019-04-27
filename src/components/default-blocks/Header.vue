<template>
  <component
    :is="'h' + config.headingLevel"
    contenteditable="true"
    ref="content"
    v-html="content" />
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
      config: {
        headingLevel: 2
      },
      content: ''
    };
  },
  mounted () {
    this.content = this.inputContent;
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  outline: none;
}
</style>
