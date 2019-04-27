<template>
  <hr />
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'Separator',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {},
      content: ''
    };
  },
  mounted () {},
  methods: {

  }
}
</script>

<style scoped lang="scss">
hr {
  margin: 32px 0;
}
</style>
