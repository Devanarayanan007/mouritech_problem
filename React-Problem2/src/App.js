import React, { useEffect, useState } from 'react';
import './BookList.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);

  //List of books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://api.potterdb.com/v1/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  //Chapters for the selected book and log for the last chapter summary
  const fetchChapters = async (bookId) => {
    try {
        const response = await fetch(`https://api.potterdb.com/v1/books/${bookId}/chapters`);
        if (!response.ok) {
          throw new Error('Failed to fetch chapters');
        }
        const data = await response.json();
        const lastChapter = data.data[data.data.length - 1];
        console.log('Summary of the last chapter:', lastChapter.attributes.summary);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching chapters:', err);
    }
  };

  // Handle book select
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    if (book.id === books[0].id) {
      fetchChapters(book.id); // Only fetch chapters for the first book
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="book-container">
      <h1 className="title">Harry Potter Books List</h1>
      
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item" onClick={() => handleSelectBook(book)}>
              {book.attributes.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="loading-text">Loading...</p>
      )}

      {selectedBook && (
        <div className="book-details">
          <h2>Selected Book: {selectedBook.attributes.title}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
