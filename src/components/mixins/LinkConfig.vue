<script>
export default {
  name: 'LinkConfig',
  mounted () {
    this.$bus.$on('block-editor-save-link-popup', this.saveLinkConfig);
  },
  methods: {
    saveLinkConfig (blockID, linkConfig) {
      if (blockID !== this.id) {
        return;
      }

      this.config.link = JSON.parse(JSON.stringify(linkConfig));
      this.save();
    },
    showLinkPopup () {
      this.$bus.$emit('block-editor-show-link-popup', this.id, this.config.link);
    },
    removeLink () {
      this.config.link = {
        url: '',
        noFollow: false,
        targetBlank: false
      };
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-save-link-popup', this.saveLinkConfig);
  }
};
</script>
