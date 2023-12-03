const posts = [{ title: 'POST1' }, { title: 'POST2' }];
let lastActivityTime = null;

function printPostAndLastActivityTime() {
  console.log("Posts:");
  posts.forEach((post) => {
    console.log(post.title);
  });
  console.log("Last Activity Time:", lastActivityTime);
}

function createPost() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push({ title: 'POST3' });
      resolve();
    }, 3000);
  });
}

function updateLastUserActivityTime() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      lastActivityTime = new Date().toLocaleTimeString();
      resolve(lastActivityTime);
    }, 1000);
  });
}

function deleteLastPost() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.pop();
      resolve();
    }, 1000);
  });
}

createPost()
  .then(updateLastUserActivityTime)
  .then((updatedTime) => {
    lastActivityTime = updatedTime;
    return deleteLastPost();
  })
  .then(printPostAndLastActivityTime);

