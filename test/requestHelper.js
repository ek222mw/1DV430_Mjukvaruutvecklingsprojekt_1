/*jshint esversion: 6 */

var rp = require('request-promise-native');






function postPromise(username, password,email, url) {
  var options = { url:url,
    method: "POST",
    form:{
      username: username,
      password: password,
      email:email

    }


  };
    return rp(options);
}

function genrePromise(genre, username,test, url) {
  var options = { url:url,
    method: "POST",
    form:{
      genre: genre,
      username: username,
      test:test
    }

  };
    return rp(options);
}





module.exports = () => {
    return {

      getPost: function(username, password,email, url) {

          return postPromise(username, password,email, url);
      },
      postGenre: function(genre, username,test, url) {

          return genrePromise(genre, username,test, url);
      }





    };
};
