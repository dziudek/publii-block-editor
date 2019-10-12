<script>
export default {
  name: 'LinkConfig',
  data () {
    return {
      linkCreationMode: 'new'
    };
  },
  mounted () {
    this.$bus.$on('block-editor-save-link-popup', this.saveLinkConfig);
    this.$bus.$on('block-editor-hide-link-popup', this.removeHighlight);
  },
  methods: {
    saveLinkConfig (blockID, linkConfig) {
      if (blockID !== this.id) {
        return;
      }

      this.config.link = JSON.parse(JSON.stringify(linkConfig));

      if (this.linkCreationMode === 'new') {
        this.createNewLinkFromSelection();
      } else {

      }

      this.save();
    },
    showLinkPopup () {
      this.addHighlight();

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
    },
    addHighlight () {
      // create highlight wrapper
      let wrapper = document.createElement('span');
      wrapper.setAttribute('class', 'is-highlighted');
      wrapper.setAttribute('id', 'link-popup-highlighted-text-' + this.id);
      // make selection
      let selection = document.getSelection();
      let range = selection.getRangeAt(0).cloneRange();
      range.surroundContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(range);
      // Set creation mode
      this.linkCreationMode = 'new';
    },
    removeHighlight () {

    },
    createNewLinkFromSelection () {
      let highlightedText = document.querySelector('#link-popup-highlighted-text-' + this.id);
      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', this.config.link.url);

      if (this.config.link.targetBlank) {
        linkElement.setAttribute('target', '_blank');
      }

      if (this.config.link.noFollow) {
        linkElement.setAttribute('rel', 'nofollow noopener');
      }

      linkElement.innerHTML = highlightedText.innerHTML;

      highlightedText.parentNode.replaceChild(linkElement, highlightedText);
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-save-link-popup', this.saveLinkConfig);
    this.$bus.$off('block-editor-hide-link-popup', this.removeHighlight);
  }
};
</script>
