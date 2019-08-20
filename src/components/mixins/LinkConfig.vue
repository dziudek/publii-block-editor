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
      if (this.config.link) {
        this.$bus.$emit('block-editor-show-link-popup', this.id, this.config.link);
      } else {
        let linkConfig = {
          url: '',
          noFollow: false,
          targetBlank: false
        };

        this.$bus.$emit('block-editor-show-link-popup', this.id, linkConfig);
      }
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
