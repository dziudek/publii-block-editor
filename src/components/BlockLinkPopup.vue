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
        v-if="$parent.linkUI.linkType === 'post'"
        slot="field"
        ref="postPagesSelect"
        :options="$parent.postPages"
        v-model="$parent.linkUI.linkSelectedPost"
        :custom-label="$parent.customPostLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select post page"></vue-select>
      <vue-select
        v-if="$parent.linkUI.linkType === 'tag'"
        slot="field"
        ref="tagPagesSelect"
        :options="$parent.tagPages"
        v-model="$parent.linkUI.linkSelectedTag"
        :custom-label="$parent.customTagLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select tag page"></vue-select>
      <vue-select
        v-if="$parent.linkUI.linkType === 'author'"
        slot="field"
        ref="authorPagesSelect"
        :options="$parent.authorPages"
        v-model="$parent.linkUI.linkSelectedAuthor"
        :custom-label="$parent.customAuthorsLabels"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Select author page"></vue-select>
      <input
        v-if="$parent.linkUI.linkType === 'external'"
        type="text"
        class="wrapper-ui-inline-menu-link-external-input"
        v-model="$parent.linkUI.url"
        placeholder="https://example.com"
        @keyup.enter="$parent.doInlineOperation('link')" />
      <div class="wrapper-ui-inline-menu-link-switcher">
        <switcher
          :is-mini="true"
          v-model="$parent.linkUI.linkTargetBlank" />
        Open in new tab
      </div>

      <div class="wrapper-ui-inline-menu-link-switcher">
        <switcher
          :is-mini="true"
          v-model="$parent.linkUI.linkNofollow" />
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

export default {
  name: 'block-link-popup',
  components: {
    'switcher': Switcher
  },
  data () {
    return {
      isVisible: false,
      currentBlockID: '',
      linkType: '',
      link: {
        url: '',
        rel: '',
        target: ''
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
      this.linkType = this.getLinkType(this.link.url);
    },
    hide () {
      this.isVisible = false;

      setTimeout(() => {
        this.currentBlockID = '';
      }, 500);
    },
    getLinkType (linkUrl) {

    },
    setLinkType (type) {
      this.linkType = type;
    },
    save () {
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
  width: 580px;

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
