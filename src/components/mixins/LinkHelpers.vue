<script>
export default {
  name: 'link-helpers',
  computed: {
    tagPages () {
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.tags.length) {
        return [0];
      }

      return window.publiiCurrentSiteData.tags.map(tag => tag.id);
    },
    authorPages () {
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.authors.length) {
        return [''];
      }

      return window.publiiCurrentSiteData.authors.map(author => author.username).sort((a, b) => {
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
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.posts.length) {
        return [0];
      }

      return window.publiiCurrentSiteData.posts.map(post => post.id);
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
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.tags.length) {
        return '';
      }

      return window.publiiCurrentSiteData.tags.filter(tag => tag.id === value).map(tag => tag.name)[0];
    },
    customAuthorsLabels (value) {
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.authors.length) {
        return '';
      }

      return window.publiiCurrentSiteData.authors.filter(author => author.username === value).map(author => author.name)[0];
    },
    customPostLabels (value) {
      if (!window.publiiCurrentSiteData || !window.publiiCurrentSiteData.posts.length) {
        return '';
      }

      return window.publiiCurrentSiteData.posts.filter(post => post.id === value).map(post => post.title)[0];
    }
  }
}
</script>
