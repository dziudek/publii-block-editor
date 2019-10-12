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

      if (this.config.link.url !== '') {
        if (this.linkCreationMode === 'new') {
          this.createNewLinkFromSelection();
        } else if (this.linkCreationMode === 'edit') {
          this.editSelectedLink();
        }
      }

      this.save();
    },
    showLinkPopup () {
      this.foundedLink = null;
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
      let selection = document.getSelection();
      let linkInSelection = this.findFirstLinkInSelection(selection);

      if (linkInSelection) {
        this.linkCreationMode = 'edit';
        this.selectElement(linkInSelection);
        linkInSelection.setAttribute('data-link-popup-id', this.id);

        this.config.link = {
          url: linkInSelection.getAttribute('href'),
          noFollow: linkInSelection.getAttribute('rel') === 'nofollow noopener',
          targetBlank: linkInSelection.getAttribute('target') === '_blank'
        };
      } else {
        let wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'is-highlighted');
        wrapper.setAttribute('id', 'link-popup-highlighted-text-' + this.id);
        let range = selection.getRangeAt(0).cloneRange();
        range.surroundContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(range);
        this.linkCreationMode = 'new';
      }
    },
    removeHighlight () {
      setTimeout(() => {
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
      }, 100);
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

      this.selectedText.containedTags.a = true;
    },
    editSelectedLink () {
      if (this.config.link.url === '') {
        this.removeLink();
        return;
      }

      let selectedLink = document.querySelector('a[data-link-popup-id="' + this.id + '"]');
      selectedLink.setAttribute('href', this.config.link.url);

      if (this.config.link.targetBlank) {
        selectedLink.setAttribute('target', '_blank');
      }

      if (this.config.link.noFollow) {
        selectedLink.setAttribute('rel', 'nofollow noopener');
      }

      setTimeout(() => {
        let selectedLink = document.querySelector('a[data-link-popup-id="' + this.id + '"]');
        this.selectElement(selectedLink);

        setTimeout(() => {
          let selectedLink = document.querySelector('a[data-link-popup-id="' + this.id + '"]');
          selectedLink.removeAttribute('data-link-popup-id');
        }, 0);
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
