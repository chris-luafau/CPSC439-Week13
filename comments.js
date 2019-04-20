(function(window) {
  'use strict';

  let body = document.querySelector('body');

  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then((data) => {
      var output = "";
      data.forEach(function(post) {

        post.body = post.body.replace(/\n/g, "<br>");

        output += `
        <article>
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <button data-posts="id" value="${post.id}" type="button">Show comments</button>
          <section class="comments" id="comments-${post.id}" fetched="false" hidden>
              <h3>Comments</h3>
          </section>
        </article>
          `;
      });
      $(body).append(output);
    })
    .then(function() {
      const BUTTON_SELECTOR = '[data-posts="id"]';
      let buttons = document.querySelectorAll(BUTTON_SELECTOR);
      buttons.forEach(function(button) {

        let sectionSelector = `#comments-${button.value}`;
        let commentSection = document.querySelector(sectionSelector);

        button.addEventListener('click', function(event) {
          if (commentSection.hidden) {
            commentSection.hidden = false;
            button.textContent = 'Hide comments';

            if (!commentSection.fetched) {
              fetch(`https://jsonplaceholder.typicode.com/comments?postId=${button.value}`)
                .then(response => response.json())
                .then((data) => {
                  var output = "";
                  data.forEach(function(comment) {

                    comment.body = comment.body.replace(/\n/g, "<br>");

                    output += `
                  <p data-comments="body">${comment.body}</p>
                  <address data-comments="name">
                  <a data-comments="email" href="mailto:${comment.email}">${comment.name}</a>
                  </address>
                    `;
                  });
                  $(commentSection).append(output);
                });
              commentSection.fetched = true;
            } else
              console.log('Comments already fetched.');
          } else {
            commentSection.hidden = true;
            button.textContent = 'Show comments';
          }
          event.preventDefault();
        });
      });
    });


})(window);
