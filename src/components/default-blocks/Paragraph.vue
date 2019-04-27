<template>
  <p
    contenteditable="true"
    v-html="content"
    ref="content" />
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {},
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
p {
  outline: none;
}
</style>
