async function fetchBooks() {
  const res = await fetch('/web215/api/books');
  const books = await res.json();
  const tableBody = document.getElementById('book-list');
  tableBody.innerHTML = '';

  books.forEach((book) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <button class="edit-button"
          data-id="${book._id}"
          data-title="${book.title.replace(/"/g, '&quot;')}"
          data-author="${book.author.replace(/"/g, '&quot;')}">
          Edit
        </button>
        <button onclick="deleteBook('${book._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function addBook() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  await fetch('/web215/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author })
  });

  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  fetchBooks();
}

function editBook(id, title, author) {
  document.getElementById('title').value = decodeURIComponent(title);
  document.getElementById('author').value = decodeURIComponent(author);

  const button = document.querySelector('button[onclick^="addBook"]') || document.querySelector('button[onclick^="updateBook"]');
  button.textContent = 'Update Book';
  button.setAttribute('onclick', `updateBook('${id}')`);
}

async function updateBook(id) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  await fetch(`/web215/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author })
  });

  document.getElementById('title').value = '';
  document.getElementById('author').value = '';

  const button = document.querySelector('button[onclick^="updateBook"]');
  button.textContent = 'Add Book';
  button.setAttribute('onclick', 'addBook()');

  fetchBooks();
}

async function deleteBook(id) {
  await fetch(`/web215/api/books/${id}`, {
    method: 'DELETE'
  });
  fetchBooks();
}

// Safe handler for edit buttons with special characters
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('edit-button')) {
    const button = e.target;
    const id = button.getAttribute('data-id');
    const title = button.getAttribute('data-title');
    const author = button.getAttribute('data-author');
    editBook(id, title, author);
  }
});

// Initial Load
fetchBooks();

