<template>
  <p
    contenteditable="true"
    v-html="innerContent">
  </p>
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
      innerContent: ''
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
