<template>
  <component
    :is="listType"
    contenteditable="true"
    v-html="innerContent">
  </component>
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
      listType: 'ul',
      innerContent: '<li></li>'
    };
  },
  mounted () {
    this.innerContent = this.content;
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
