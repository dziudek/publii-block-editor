<template>
  <div
    v-if="showInlineMenu"
    class="wrapper-ui-inline-menu"
    :style="'left: ' + left + '; top: ' + top + ';'"
    :key="'inline-menu-' + $parent.id">
    <div class="wrapper-ui-inline-menu-buttons">
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.bold }"
        @click.stop="$parent.doInlineOperation('strong');">
        <icon name="bold" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.italic }"
        @click.stop="$parent.doInlineOperation('em');">
        <icon name="italic" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.underline }"
        @click.stop="$parent.doInlineOperation('u');">
        <icon name="underline" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.strikethrough }"
        @click.stop="$parent.doInlineOperation('s');">
        <icon name="strikethrough" />
      </button>
      <button
        v-if="!$parent.selectedTextContains.link"
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.linkUI.visible }"
        @click.stop="$parent.toggleLinkUI();">
        <icon name="link" />
      </button>
      <button
        v-if="$parent.selectedTextContains.link"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        @click.stop="$parent.doInlineOperation('unlink');">
        <icon name="unlink" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.code }"
        @click.stop="$parent.doInlineOperation('code');">
        <icon name="code" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.mark }"
        @click.stop="$parent.doInlineOperation('mark');">
        <icon name="marker" />
      </button>
    </div>

    <div
      v-if="$parent.linkUI.visible || $parent.selectedTextContains.link"
      class="wrapper-ui-inline-menu-link">
      <div class="wrapper-ui-inline-menu-link-type">
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': $parent.linkUI.linkType === 'post' }"
          @click="$parent.setLinkType('post')">
          Post
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': $parent.linkUI.linkType === 'tag' }"
          @click="$parent.setLinkType('tag')">
          Tag
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': $parent.linkUI.linkType === 'author' }"
          @click="$parent.setLinkType('author')">
          Author
        </div>
        <div
          :class="{ 'wrapper-ui-inline-menu-link-type-item': true, 'is-active': $parent.linkUI.linkType === 'external' }"
          @click="$parent.setLinkType('external')">
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
    </div>
  </div>
</template>

<script>
import EditorIcon from './../elements/EditorIcon.vue';
import Switcher from './../elements/Switcher.vue';
import vSelect from 'vue-multiselect/dist/vue-multiselect.min.js';

export default {
  name: 'inline-menu-ui',
  components: {
    'icon': EditorIcon,
    'switcher': Switcher,
    'vue-select': vSelect
  },
  computed: {
    showInlineMenu () {
      return this.$parent.$parent.isSelected && this.$parent.textIsHighlighted && !this.$parent.$parent.uiOpened;
    }
  },
  watch: {
    showInlineMenu (newValue, oldValue) {
      if (!newValue) {
        this.$highlighter.removeAllHighlights();
      }
    }
  },
  data () {
    return {
      left: '',
      top: ''
    };
  },
  methods: {
    setPosition (left, top) {
      this.left = left;
      this.top = top;
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/variables.scss';
@import '../../assets/vue-multiselect.scss';

.is-highlighted {
  background: $block-editor-color-gradient-end;
}

.wrapper-ui-inline-menu {
  animation: inlineMenuIn .15s ease backwards;
  align-items: center;
  background: $block-editor-color-light;
  border: none;
  border-radius: 4px;
  box-shadow: 0 5px 10px -5px $block-editor-color-shadow, 4px -11px 26px -12px $block-editor-color-shadow, 0 24px 50px 2px $block-editor-color-shadow;
  left: 50%;
  margin-top: 16px;
  min-height: 43px;
  padding: 0 4px;
  position: absolute;
  top: 0%;
  transform: scale(1) translateX(-50%) translateY(64px);
  transform-origin: center left; 
  width: auto;
  z-index: 10;  

  @keyframes inlineMenuIn {
    0% {
        opacity: 0;
        transform: scale(.9) translateX(-50%) translateY(78px);
    }  
   
    100% {
        opacity: 1;                 
    }
  }

  &::after {
    border: 9px solid $block-editor-color-light;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";   
    height: 18px;
    left: 50%;
    position: absolute;
    top: -18px;
    transform: translateX(-50%);
    width: 18px;
    z-index: 1;
  }

  &-button {
    align-items: center;
    background: transparent;
    border: none;   
    color: $block-editor-color-text-medium-dark;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    position: relative;
    width: 38px;
   
      
    // hover effect
    &::before {
       content: "";
       background: $block-editor-color-light-dark; 
       border-radius: 3px;
       display: block;
       left: 50%;
       opacity: 0;
       position: absolute;         
       height: 34px;
       top: 50%;
       transition: all .15s cubic-bezier(.4,0,.2,1);
       transform: scale(.5) translate(-50%, -50%);
       transform-origin: left top;           
       width: 34px;
       z-index: -1;
    }

    &:hover,
    &.is-active {
      color: $block-editor-color-text;
        
      &::before {
         opacity: 1;
         transform: scale(1) translate(-50%, -50%);
      }
    }
  }

  &-buttons { 
    cursor: pointer;
    display: flex;
    height: 43px;
    width: 100%;
  }

  &-link {
    width: 100%;

    &-type {
      border-radius: $block-editor-form-input-border-radius;
      display: flex;
      margin: 3px 0 12px 0;

      &-item {
        border: 1px solid $block-editor-form-input-border;
        border-right: none;
        cursor: pointer;
        font-size: 12px;
        padding: 5px;
        text-align: center;
        width: 25%;

        &:first-child {
          border-radius: 20px 0 0 20px;
        }

        &:last-child {
          border-radius: 0 20px 20px 0;
          border-right: 1px solid $block-editor-form-input-border;
        }

        &.is-active {
          background: $block-editor-color-primary;
          border-color: $block-editor-color-primary;
          color: $block-editor-color-light;
        }
      }
    }

    &-external-input {
      background: $block-editor-color-light-dark;
      border: none;
      border-radius: $block-editor-form-input-border-radius;
      padding: 8px;
      margin-bottom: 12px;
      outline: none;
      width: 100%;
    }

    &-switcher {
      align-items: center;
      color: $block-editor-color-text-medium;
      display: flex;
      font-size: 12px;
      margin-bottom: 2px;

      .switcher {
        top: 0;
      }

      &:last-of-type {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
