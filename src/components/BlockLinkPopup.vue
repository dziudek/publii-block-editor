<template>
  <div
    @click.stop="hide()"
    :class="{ 'block-link-popup-overlay': true, 'is-visible': isVisible }">
    <div
      @click.prevent.stop
      class="block-link-popup">
      <div class="wrapper-ui-inline-menu-link-type">
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': linkType === 'post' }"
          @click="setLinkType('post')">
          Post
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': linkType === 'tag' }"
          @click="setLinkType('tag')">
          Tag
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': linkType === 'author' }"
          @click="setLinkType('author')">
          Author
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': linkType === 'external' }"
          @click="setLinkType('external')">
          External
        </div>
      </div>
      <vue-select
        v-if="linkType === 'post'"
        slot="field"
        ref="postPagesSelect"
        :options="postPages"
        v-model="linkSelectedPost"
        :custom-label="customPostLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select post page"></vue-select>
      <vue-select
        v-if="linkType === 'tag'"
        slot="field"
        ref="tagPagesSelect"
        :options="tagPages"
        v-model="linkSelectedTag"
        :custom-label="customTagLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select tag page"></vue-select>
      <vue-select
        v-if="linkType === 'author'"
        slot="field"
        ref="authorPagesSelect"
        :options="authorPages"
        v-model="linkSelectedAuthor"
        :custom-label="customAuthorsLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select author page"></vue-select>
      <input
        v-if="linkType === 'external'"
        type="text"
        class="wrapper-ui-inline-menu-link-external-input"
        v-model="link.url"
        placeholder="https://example.com"
        @keyup.enter="save()" />
      <div class="wrapper-ui-inline-menu-link-switcher">
        <switcher
          :is-mini="true"
          v-model="link.targetBlank" />
        Open in new tab
      </div>

      <div class="wrapper-ui-inline-menu-link-switcher">
        <switcher
          :is-mini="true"
          v-model="link.nofollow" />
        Add rel="nofollow" attribute
      </div>

      <div class="block-link-popup-buttons">
        <button @click="save()">
          Save
        </button>
        <button @click="hide()">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Switcher from './elements/Switcher.vue';
import LinkHelpers from './mixins/LinkHelpers.vue';
import vSelect from 'vue-multiselect/dist/vue-multiselect.min.js';

export default {
  name: 'block-link-popup',
  mixins: [
    LinkHelpers
  ],
  components: {
    'switcher': Switcher,
    'vue-select': vSelect
  },
  data () {
    return {
      isVisible: false,
      currentBlockID: '',
      linkType: 'post',
      linkSelectedAuthor: '',
      linkSelectedPost: '',
      linkSelectedTag: '',
      link: {
        url: '',
        noFollow: false,
        targetBlank: false
      }
    };
  },
  mounted () {
    this.$bus.$on('block-editor-show-link-popup', this.show);
  },
  methods: {
    show (blockID, link) {
      this.isVisible = true;
      this.currentBlockID = blockID;
      this.link = JSON.parse(JSON.stringify(link));
      this.parseLink();
    },
    hide () {
      this.isVisible = false;

      setTimeout(() => {
        this.currentBlockID = '';
      }, 500);
    },
    parseLink () {
      if (this.link.url === '') {
        this.linkType = 'post';
        return;
      }

      if (this.link.url.indexOf('#INTERNAL_LINK#') > -1) {
        if (this.link.url.indexOf('POST') > -1) {
          this.linkType = 'post';
          this.linkSelectedPost = parseInt(this.link.url.split('/').pop(), 10);
        } else if (this.link.url.indexOf('TAG') > -1) {
          this.linkType = 'tag';
          this.linkSelectedTag = parseInt(this.link.url.split('/').pop(), 10);
        } else if (this.link.url.indexOf('AUTHOR') > -1) {
          this.linkType = 'author';
          this.linkSelectedAuthor = parseInt(this.link.url.split('/').pop(), 10);
        }
      } else {
        this.linkType = 'external';
      }
    },
    setLinkType (type) {
      this.linkType = type;
    },
    prepareLink () {
      if (this.linkType === 'post') {
        return '#INTERNAL_LINK#/POST/' + this.linkSelectedPost;
      } else if (this.linkType === 'author') {
        return '#INTERNAL_LINK#/AUTHOR/' + this.linkSelectedAuthor;
      } else if (this.linkType === 'tag') {
        return '#INTERNAL_LINK#/TAG/' + this.linkSelectedTag;
      }

      return this.link.url;
    },
    save () {
      this.link.url = this.prepareLink();
      this.$bus.$emit('block-editor-save-link-popup', this.currentBlockID, this.link);
      this.hide();
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-show-link-popup', this.show);
  }
};
</script>

<style lang="scss">
@import '../assets/variables.scss';

.block-link-popup {
  background: $block-editor-color-light;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  border-radius: $block-editor-form-input-border-radius;
  padding: 20px;
  transform: translateY(30px);
  transition: all .3s ease-out;
  width: 320px;

  &-overlay {
    align-items: center;
    background: rgba(255, 255, 255, .9);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    transition: all .3s ease-out;
    width: 100%;
    z-index: 10000;

    &.is-visible {
      opacity: 1;
      pointer-events: auto;

      .block-link-popup {
        transform: translateY(0);
      }
    }
  }
}
</style>
