<template>
  <component
    :is="config.listType"
    contenteditable="true"
    v-html="content"
    ref="content" />
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'List',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {
        listType: 'ul'
      },
      content: '<li></li>'
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

</style>
