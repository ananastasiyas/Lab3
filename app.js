const loadButton = document.querySelector('#load-posts');
const createButton = document.querySelector('#create-post');
const postsContainer = document.querySelector('#posts');
const form = document.querySelector('#post-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const message = document.querySelector('#message');

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = type;
}

function setLoading(loading) {
  loadButton.disabled = loading;
  createButton.disabled = loading;
}

function addPost(title, body, id) {
  const article = document.createElement('article');
  const heading = document.createElement('h3');
  heading.textContent = title;
  article.append(heading);

  if (body !== undefined) {
    const paragraph = document.createElement('p');
    paragraph.textContent = body;
    article.append(paragraph);
  }

  if (id !== undefined) {
    const idText = document.createElement('p');
    idText.textContent = `ID: ${id}`;
    article.append(idText);
  }

  postsContainer.append(article);
}

loadButton.addEventListener('click', async () => {
  setLoading(true);
  showMessage('Загрузка публикаций...');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const posts = await response.json();
    postsContainer.replaceChildren();
    posts.forEach(post => addPost(post.title, post.body));
    showMessage('Публикации загружены.', 'success');
  } catch (error) {
    showMessage(`Не удалось загрузить публикации: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    setLoading(false);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    showMessage('Заполните заголовок и текст.', 'error');
    return;
  }

  setLoading(true);
  showMessage('Отправка публикации...');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const createdPost = await response.json();
    addPost(createdPost.title, undefined, createdPost.id);
    showMessage('Публикация успешно создана.', 'success');
    form.reset();
  } catch (error) {
    showMessage(`Не удалось создать публикацию: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    setLoading(false);
  }
});
