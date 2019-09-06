<template>
  <div id="publii-block-editor">
    <div
      id="post-title"
      ref="post-title"
      class="post-editor-form-title"
      contenteditable="true"
      @keyup="updateTitle"></div>

    <block-editor ref="block-editor" />
    <textarea id="post-editor"></textarea>
  </div>
</template>

<script>
import Vue from 'vue';
import BlockEditor from './components/BlockEditor.vue';
import Rangy from 'rangy-updated';
import 'rangy-updated/lib/rangy-selectionsaverestore.js';
import 'rangy-updated/lib/rangy-classapplier.js';
import 'rangy-updated/lib/rangy-highlighter.js';

if (!Vue.prototype.$bus) {
  if (window.app && window.app.$bus) {
    Vue.prototype.$bus = window.app.$bus;
  } else {
    Vue.prototype.$bus = new Vue();
  }
}

if (!Vue.prototype.$rangy) {
  Vue.prototype.$rangy = Rangy;
}

export default {
  name: 'publii-block-editor',
  components: {
    BlockEditor
  },
  mounted () {
    window.publiiBlockEditorInstance = this;

    if (!Vue.prototype.$highlighter) {
      Vue.prototype.$highlighter = this.$rangy.createHighlighter();
    }

    this.$highlighter.addClassApplier(this.$rangy.createClassApplier('is-highlighted', {
      ignoreWhiteSpace: true,
      tagNames: ['span', 'a']
    }));

    if (this.$ipcRenderer) {
      this.$ipcRenderer.on('set-post-id', this.setPostID);
      this.$ipcRenderer.on('set-post-text', this.setPostText);
      this.$ipcRenderer.on('set-post-title', this.setPostTitle);
      this.$ipcRenderer.on('post-save', this.postSave);
    }
  },
  methods: {
    setPostID (event, postID) {
      this.$refs['block-editor'].setPostID(postID);
    },
    setPostText (event, postText) {
      document.getElementById('post-editor').value = postText;

      setTimeout(() => {
        this.$bus.$emit('publii-block-editor-load');
      }, 0);
    },
    setPostTitle (event, postTitle) {
      this.$refs['post-title'].innerText = postTitle;
    },
    updateTitle () {
      let title = this.$refs['post-title'].innerText.replace(/\n/gmi, ' ');

      if (this.$ipcRenderer) {
        this.$ipcRenderer.sendToHost('editor-title-updated', title);
      }
    },
    postSave () {
      this.$bus.$emit('publii-block-editor-save');

      setTimeout(() => {
        if (this.$ipcRenderer) {
          this.$ipcRenderer.sendToHost('editor-post-saved', document.querySelector('#post-editor').value);
        }
      }, 500);
    }
  }
}
</script>

<style>
#post-title {
  border: none;
  box-shadow: none;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, Arial, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 35px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 10% 26px;
  outline: none;
  padding: 0;
  text-align: center;
  width: 80%;
}

#post-editor {
  display: none;
}

#post-title:empty {
  color: rgba(29, 42, 56, .5);
}

#post-title:empty:before {
  content: "Add post title"
}

@media (max-width: 1400px) {
  #post-title {
    font-size: 28px;
    margin: 0 0 26px;
  }
}

@media (max-width: 1600px) {
  #post-title {
    font-size: 28px;
    margin: 0 0 26px;
    width: 100%;
  }
}
</style>
