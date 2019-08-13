<script>
export default {
  name: 'link-helpers',
  computed: {
    tagPages () {
      if (!this.$store) {
        return [1];
      }

      return this.$store.state.currentSite.tags.map(tag => tag.id);
    },
    authorPages () {
      if (!this.$store) {
        return ['test author'];
      }

      return this.$store.state.currentSite.authors.map(author => author.username).sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1;
        }

        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        }

        return 0;
      });
    },
    postPages () {
      if (!this.$store) {
        return [1];
      }

      return this.$store.state.currentSite.posts.map(post => post.id);
    }
  },
  methods: {
    linkIsInvalid (link) {
      if (
        link.indexOf('http://') === -1 &&
        link.indexOf('https://') === -1 &&
        link.indexOf('://') === -1 &&
        link.indexOf('dat://') === -1 &&
        link.indexOf('ipfs://') === -1 &&
        link.indexOf('//') !== 0 &&
        link.indexOf('#') !== 0
      ) {
        return true;
      }

      return false;
    },
    customTagLabels (value) {
      if (!this.$store) {
        return 'Test tag';
      }

      return this.$store.state.currentSite.tags.filter(tag => tag.id === value).map(tag => tag.name)[0];
    },
    customAuthorsLabels (value) {
      if (!this.$store) {
        return 'Test author';
      }

      return this.$store.state.currentSite.authors.filter(author => author.username === value).map(author => author.name)[0];
    },
    customPostLabels (value) {
      if (!this.$store) {
        return 'Test post';
      }

      return this.$store.state.currentSite.posts.filter(post => post.id === value).map(post => post.title)[0];
    }
  }
}
</script>
