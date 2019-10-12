<template>
  <div
    @click.stop="hide()"
    :class="{ 'block-link-popup-overlay': true, 'is-visible': isVisible }">
    <div
      @click.prevent.stop
      class="block-link-popup">
      <div class="block-link-popup-link-type">
        <div
          :class="{ 'block-link-popup-link-type-item': true, 'is-active': linkType === 'post' }"
          @click="setLinkType('post')">
          Post
        </div>
        <div
          :class="{ 'block-link-popup-link-type-item': true, 'is-active': linkType === 'tag' }"
          @click="setLinkType('tag')">
          Tag
        </div>
        <div
          :class="{ 'block-link-popup-link-type-item': true, 'is-active': linkType === 'author' }"
          @click="setLinkType('author')">
          Author
        </div>
        <div
          :class="{ 'block-link-popup-link-type-item': true, 'is-active': linkType === 'external' }"
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
        class="block-link-popup-link-external-input"
        v-model="link.url"
        placeholder="https://example.com"
        @keyup.enter="save()" />
      <div class="block-link-popup-link-switcher">
        <switcher
          v-model="link.targetBlank" />
        Open in new tab
      </div>

      <div class="block-link-popup-link-switcher">
        <switcher
          v-model="link.noFollow" />
        Add rel="nofollow" attribute
      </div>

      <div class="block-link-popup-buttons">
        <button @click="save()">
          Save
        </button>
        <button @click="hide()" class="outline">
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
      this.$bus.$emit('block-editor-hide-link-popup');

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

      if (type === 'external' && this.link.url.indexOf('#INTERNAL_LINK#') === 0) {
        this.link.url = '';
      }
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
  border-radius: 6px;
  box-shadow: 0 0 32px $block-editor-color-shadow;
  padding: 2rem;
  transform: scale(.5);
  transition: all .24s cubic-bezier(0, 0, 0.25, 0.99);
  width: 580px;

  &-overlay {
    align-items: center;
    background: rgba($block-editor-color-light, .85);
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
        transform: scale(1);
      }
    }
  }

  &-link {
    width: 100%;

    &-type {
      display: flex;
      justify-content: space-between;
      margin: -20px 0 3rem;

      &-item {
        border-bottom: 2px solid $block-editor-color-light-dark;
        color: $block-editor-color-text;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        padding: 12px 12px 20px;
        text-align: center;
        transition: all .24s ease-out;
        user-select: none;
        width: 25%;

        &:hover {
           border-bottom-color: $block-editor-color-primary;
        }

        &.is-active {
          border-bottom-color: $block-editor-color-primary;
          font-weight: $font-weight-bold;
          color: $block-editor-color-primary;
        }
      }
    }

    &-external-input {
      border: 1px solid $block-editor-form-input-border;
      border-radius: $block-editor-form-input-border-radius;
      color: $block-editor-color-text;
      display: block;
      font-size: 16px;
      margin: 32px 0 24px;
      padding: 14px;
      width: 100%;
    }

    &-switcher {
      align-items: center;
      color: $block-editor-color-dark;
      display: flex;
      margin-bottom: 12px;

      .switcher {
        top: 0;
      }

      &:last-of-type {
        margin-bottom: 12px;
      }
    }
  }

  .multiselect {
    margin: 32px 0 24px;
  }

  &-buttons {
    margin: 3rem -2rem -2rem;

    button {
      background: $block-editor-color-primary;
      border: none;
      box-shadow: none;
      border-bottom-left-radius: 6px;
      border-top: 1px solid $block-editor-color-primary;
      color: $block-editor-color-light;
      cursor: pointer;
      font-size: 15px;
      font-weight: $font-weight-semibold;
      line-height: 1;
      width: 50%;
      padding: 18px;
      transition: all .25s ease-out;

      &:hover {
        background: $block-editor-color-primary-dark;
      }

      &.outline {
        background: transparent;
        border-bottom-right-radius: 6px;
        border-top: 1px solid #ddd;
        color: $block-editor-color-text-medium-dark;

        &:hover {
          background: $color-editor-color-light-medium;
        }
      }
    }
  }
}
</style>
