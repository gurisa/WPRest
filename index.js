var app = new Vue({
  el: '#app',
  data: {
    api: {      
      'ngaret': {
        'url': 'https://ngaret.com/wp-json/wp/v2/posts',
        'endpoint': '',
        'version': 'v2',
        'key': '',
        'target': 'en',
        'format': 'json',
      },
    },
    result: {
      'ngaret': {
        'posts': {},
      },
      'status': {
        'text': '',
        'alert': 'alert-info',
      },
    },
    comment: {
      'post': -1,
      'content': '',
      'author_name': '',
      'author_website': '',
      'author_email': '',
    },
    state: 'wait', //wait, load, finish
  },
  mounted: function() {
    this.start();
  },
  methods: {
    post: function(url, data) {      
      return axios.post(url, data).then(function(response) {            
        return response;
      }).catch(function (error) {
        console.log(error);
      });
    },
    get: function(url) {    
      return axios.get(url).then(function(response) {
        return response;
      }).catch(function (error) {
        console.log(error);
      });
    },
    // showModal: function(element, options) {
    //   $(element).modal(options)
    // },
    resetData: function() {
      this.result.ngaret.posts = {};
      this.state = 'wait';
      this.result.status.text = 'Sedang memuat..';
      this.result.status.alert = 'alert-warning';
    },
    start: function() {
      this.resetData();      
      var curr = this;      
      this.get(this.api.ngaret.url).then(function(response) {
        curr.state = 'load';        
        if (response && response.status === 200) {          
          curr.result.status.text = 'Berhasil mendapatkan data..';
          curr.result.status.alert = 'alert-info';
          return response;
        }
      }).then(function(response) {
        if (response.data && response.data.length > 0) {
          curr.result.ngaret.posts = response.data;
          curr.result.status.text = 'Berhasil memuat data..';
          curr.result.status.alert = 'alert-success';
          console.log(response.data);
        }
      }).catch(function(error) {
        console.log(error);
        curr.result.status = 'Terjadi kesalahan';
        curr.result.status.alert = 'alert-danger';
        curr.state = 'finish';
      });        
    },
    parseOneWord: function(data) {
      return (data.indexOf(' ')  === -1) ? data : data.substr(0, data.indexOf(' '));
    },
    validateComment: function() {
      if (this.comment.post !== null && this.comment.post !== -1 &&
        this.comment.content !== null && this.comment.content !== '' &&
        this.comment.author_name !== null && this.comment.author_name !== '' && 
        this.comment.author_website !== null && this.comment.author_website !== '' &&
        this.comment.author_email !== null && this.comment.author_email !== '') {
          return true;
      }
      return false;
    },
    sendComment: function() {
      var curr = this;
      if (this.validateComment()) {
        let data = {
          'post': this.comment.post,
          'content': this.comment.content,
          'author_name': this.comment.author_name,
          'author_email': this.comment.author_email,
          'author_website': this.comment.author_website,
        };
        console.log(data);
        this.post('https://ngaret.com/wp-json/wp/v2/comments', data).then(function(response) {
          if (response && (response.status === 200 || response.status === 201)) {          
            alert('Berhasil mengirim komentar\nSilahkan tunggu moderasi komentar');
            if (confirm('Lihat tautan komentar')) {
              window.location = response.data.link;
            }
          }
          else {
            alert('Gagal mengirim komentar');
          }
          console.log(response);
        }).catch(function(error) {
          console.log(error);
        });
      }
      else {
        alert('Silahkan isi data komentar terlebih dahulu');
      }      
    }
  },
  watch: {
    // wordOriginal(value) {
      
    // },
    // wordTranslated(value) {
      
    // },
  },
  computed: {
    // wordOriginal() {
      // return this.word.original;
    // },
    // wordTranslated() {
      // return this.word.translated;
    // },
  }
});

// document.onreadystatechange = function () {
//   if (document.readyState == "interactive") {
    
//   }
// }
