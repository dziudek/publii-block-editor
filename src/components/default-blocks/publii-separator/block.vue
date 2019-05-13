<template>
  <div>
    <div
      class="publii-block-separator"
      contenteditable="true"
      @keyup="getFocusFromTab"
      @paste="pastePlainText"
      ref="block">
      <hr :class="config.type" />
    </div>

    <div
      class="wrapper-ui-top-menu"
      v-if="$parent.isSelected">
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.type === 'long' }"
        tabindex="-1"
        @click.stop="setType('long')">—</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.type === 'medium' }"
        tabindex="-1"
        @click.stop="setType('medium')">–</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.type === 'short' }"
        tabindex="-1"
        @click.stop="setType('short')">‑</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.type === 'dots' }"
        tabindex="-1"
        @click.stop="setType('dots')">∙∙∙</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.type === 'dot' }"
        tabindex="-1"
        @click.stop="setType('dot')">•</button>
    </div>
  </div>
</template>

<script>
import Block from './../../Block.vue';

export default {
  name: 'Separator',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {
        type: 'long'
      },
      content: ''
    };
  },
  mounted () {
    this.$refs['block'].addEventListener('keydown', this.handleKeyboard);
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter') {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Backspace') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (e.code !== 'Tab') {
        e.returnValue = false;
      }
    },
    setType (type) {
      this.config.type = type;
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleKeyboard);
  }
}
</script>

<style lang="scss">
.publii-block-separator {
  caret-color: transparent;
  margin: 32px 0;
  outline: none;
  width: 100%;

  hr {
    margin: 5px auto;
    position: relative;
  }

  hr.long {
    width: 100%;
  }

  hr.medium {
    width: 50%;
  }

  hr.short {
    width: 25%;
  }

  hr.dots,
  hr.dot {
    border: none;
    height: 12px;
    margin: 0 auto;

    &:before {
      content: "* * *";
      left: 50%;
      line-height: 6px;
      position: absolute;
      top: 75%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  hr.dot {
    &:before {
      content: "*";
    }
  }
}
</style>
