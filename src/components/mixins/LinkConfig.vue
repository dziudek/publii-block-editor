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
      let highlightedText = document.querySelector('#link-popup-highlighted-text-' + this.id);
      let range = document.getSelection().getRangeAt(0);

      if (highlightedText) {
        range.setStartBefore(highlightedText);
        range.setEndAfter(highlightedText);

        setTimeout(() => {
          let extractedContent = range.extractContents();
          let extractedContentChildren = extractedContent.children;
          let nodesToInsert = extractedContentChildren[0].childNodes;
          let firstNode = nodesToInsert[0];
          let lastNode = nodesToInsert[nodesToInsert.length - 1];

          for (let i = nodesToInsert.length - 1; i >= 0; i--) {
            range.insertNode(nodesToInsert[i]);
          }

          setTimeout(() => {
            range.setStartBefore(firstNode);
            range.setEndAfter(lastNode);
          }, 0);
        }, 0);
      }
    },
    createNewLinkFromSelection () {
      let highlightedText = document.querySelector('#link-popup-highlighted-text-' + this.id);
      let linkElement = document.createElement('a');
      let temporaryID = +new Date();
      linkElement.setAttribute('href', this.config.link.url);
      linkElement.setAttribute('data-temp-id', temporaryID);

      if (this.config.link.targetBlank) {
        linkElement.setAttribute('target', '_blank');
      }

      if (this.config.link.noFollow) {
        linkElement.setAttribute('rel', 'nofollow noopener');
      }

      linkElement.innerHTML = highlightedText.innerHTML;
      highlightedText.parentNode.insertBefore(linkElement, highlightedText);
      highlightedText.parentNode.removeChild(highlightedText);

      setTimeout(() => {
        let element = document.querySelector('a[data-temp-id="' + temporaryID + '"]');
        element.removeAttribute('data-temp-id');
        this.selectElement(element);
      }, 0);
    },
    selectElement (element) {
      let selection = window.getSelection();
      selection.removeAllRanges();
      let range = document.createRange();
      range.selectNodeContents(element);
      selection.addRange(range);
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-save-link-popup', this.saveLinkConfig);
    this.$bus.$off('block-editor-hide-link-popup', this.removeHighlight);
  }
};
</script>
