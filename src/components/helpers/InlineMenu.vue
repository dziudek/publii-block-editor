<script>
export default {
  name: 'InlineMenu',
  methods: {
    showInlineMenu () {
      let sel = window.getSelection();
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs['block'].getBoundingClientRect();
      this.$refs['inline-menu'].style.left = ((oRect.left - wrapperRect.left) + (oRect.width / 2)) + 'px';
      this.$refs['inline-menu'].style.top = (oRect.top - wrapperRect.top - 20) + 'px';
    },
    doInlineOperation (operationType) {
      switch (operationType) {
        case 'strong': document.execCommand('bold', false, null); break;
        case 'em': document.execCommand('italic', false, null); break;
        case 's': document.execCommand('strikeThrough', false, null); break;
        case 'u': document.execCommand('underline', false, null); break;
        case 'code': document.execCommand('insertHTML', false, '<code>' + document.getSelection() + '</code>'); break;
        case 'mark': document.execCommand('insertHTML', false, '<mark>' + document.getSelection() + '</mark>'); break;
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper-ui-inline-menu {
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0%;
  transform: translateX(-50%);
  z-index: 1;

  &-button {
    align-items: center;
    border: none;
    cursor: pointer;
    display: flex;
    height: 32px;
    justify-content: center;
    outline: none;
    width: 32px;

    &.is-active {
      background: #eee;
    }
  }
}
</style>
