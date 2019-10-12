<script>
import EditorIcon from './../elements/EditorIcon.vue';
import LinkHelpers from './../mixins/LinkHelpers.vue';
import LinkConfig from './../mixins/LinkConfig.vue';
import SelectedText from './../utils/SelectedText.js';
import Vue from 'vue';

export default {
  name: 'InlineMenu',
  mixins: [
    LinkConfig,
    LinkHelpers
  ],
  components: {
    'icon': EditorIcon
  },
  data () {
    return {
      inlineMenuContainer: 'block',
      selectedText: {
        containedTags: {},
        allowedOperations: {}
      }
    };
  },
  methods: {
    handleMouseUp (e) {
      setTimeout(() => {
        let sel = document.getSelection();

        if (sel.isCollapsed) {
          this.textIsHighlighted = false;
        } else {
          this.textIsHighlighted = !sel.isCollapsed || (sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset);
        }

        if (this.textIsHighlighted) {
          setTimeout(() => {
            this.showInlineMenu();
          }, 0);
        }
      }, 0);
    },
    showInlineMenu () {
      let sel = document.getSelection();
      this.selectedText = new SelectedText(this.$refs[this.inlineMenuContainer], this.$parent.blockType);
      this.selectedText.analyzeSelectedText();
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs[this.inlineMenuContainer].getBoundingClientRect();
      let inlineMenuOffsets = this.getInlineMenuOffsets();
      let inlineMenuLeft = (((oRect.left - wrapperRect.left) + (oRect.width / 2)) + inlineMenuOffsets.x) + 'px';
      let inlineMenuTop = ((oRect.top - wrapperRect.top) + oRect.height + inlineMenuOffsets.y) + 'px';
      this.$refs['inline-menu'].setPosition(inlineMenuLeft, inlineMenuTop);
      this.$highlighter.removeAllHighlights();
    },
    updateInlineMenuPosition () {
      let sel = document.getSelection();

      if (sel.toString() === '') {
        this.closeInlineMenu();
        return;
      }

      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs[this.inlineMenuContainer].getBoundingClientRect();
      let inlineMenuOffsets = this.getInlineMenuOffsets();
      let inlineMenuLeft = (((oRect.left - wrapperRect.left) + (oRect.width / 2)) + inlineMenuOffsets.x) + 'px';
      let inlineMenuTop = ((oRect.top - wrapperRect.top) + oRect.height + inlineMenuOffsets.y) + 'px';
      this.$refs['inline-menu'].setPosition(inlineMenuLeft, inlineMenuTop);
    },
    closeInlineMenu () {
      this.textIsHighlighted = false;
    },
    getInlineMenuOffsets () {
      let x = 30;
      let y = -50;

      if (this.$parent.blockType === 'publii-quote') {
        y = -40;
      }

      if (this.$parent.blockType === 'publii-list') {
        x = 65;
      }

      return { x, y };
    },
    doInlineOperation (operationType) {
      switch (operationType) {
        case 'strong': this.execCommand('strong'); break;
        case 'em': this.execCommand('em'); break;
        case 's': this.execCommand('s'); break;
        case 'u': this.execCommand('u'); break;
        case 'code': this.execCommand('code'); break;
        case 'mark': this.execCommand('mark'); break;
        case 'a': this.addLink(); break;
        // case 'unlink': this.removeLink(savedSel); break;
        case 'indent': this.indentList(); break;
        case 'outdent': this.outdentList(); break;
      }

      this.selectedText = new SelectedText(this.$refs[this.inlineMenuContainer], this.$parent.blockType);
      this.selectedText.analyzeSelectedText();
    },
    execCommand (tagToUse) {
      if (this.selectedText.containedTags[tagToUse]) {
        this.selectedText.removeStyle(tagToUse);
        setTimeout(() => {
          Vue.set(this.selectedText.containedTags, tagToUse, false);
        }, 0);
      } else {
        let range = window.getSelection().getRangeAt(0);
        let newTag = document.createElement(tagToUse);
        newTag.appendChild(range.extractContents());
        range.insertNode(newTag);
      }
    },
    indentList () {
      document.execCommand('indent', false, null);
      setTimeout(() => {
        this.updateInlineMenuPosition();
      }, 100);
    },
    outdentList () {
      document.execCommand('outdent', false, null);
      setTimeout(() => {
        this.updateInlineMenuPosition();
      }, 100);
    },

    /*

    -

    -

    -

    -

    -

    -
    */
    addLink () {
      let selection = document.querySelector('.is-highlighted');

      if (!selection) {
        return;
      }

      if (this.linkIsInvalid(this.linkUI.url)) {
        this.linkUI.url = 'https://' + this.linkUI.url;
      }

      selection.outerHTML = '<a href="' + this.linkUI.url + '">' + selection.innerHTML + '</a>';
      this.selectedTextcontainedTags['a'] = true;
    },
    removeLink (rangyData) {
      let startID = rangyData.rangeInfos[0].startMarkerId;
      let endID = rangyData.rangeInfos[0].endMarkerId;
      let html = [
        '<span id="' + startID + '"></span>',
        document.getSelection().toString().replace(/&nbsp;/gmi, ''),
        '<span id="' + endID + '"></span>'
      ];

      document.execCommand('insertHTML', false, html.join(''));
      this.selectedTextcontainedTags['a'] = false;
    },
    checkTagPosition (tag, startID, endID) {
      let codeToAnalyze = this.$refs[this.inlineMenuContainer].innerHTML.split(startID)[1];
      codeToAnalyze = codeToAnalyze.split(endID)[0];

      if (codeToAnalyze.indexOf('<' + tag) > -1) {
        return codeToAnalyze.indexOf('<' + tag);
      }

      return -1;
    }
  }
}
</script>
