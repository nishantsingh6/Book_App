import React, { useEffect, useState } from 'react';
import API from '../apiConnecter';
import { toast } from 'react-toastify';

const DashBoard = ({
  primaryText,
  secText,
  func,
  secFunc,
  cart = [],
  dismissedBookIds = [],
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState({});
  const [genre, setGenre] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token) {
        toast.error("Token missing");
        return;
      }

      const endpoint = role === 'Admin' ? "/admin/getBook" : "/customer/getBook";
      const res = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data?.books || []);
    } catch (err) {
      toast.error("Failed to fetch data");
      setError("Failed to fetch book data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchByTitle = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const query = search.trim();

      if (!token || !query) {
        toast.error("Token or search input missing");
        return;
      }

      const url = role === 'Admin'
        ? `/admin/get?title=${encodeURIComponent(query)}`
        : `/customer/get?title=${encodeURIComponent(query)}`;

      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data?.books || []);
      toast.success("Book found successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error finding book");
    }
  };

  const handleSearchByGenre = async (genre) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token) {
        toast.error("Token missing");
        return;
      }

      if (genre === "") {
        fetchData();
        return;
      }

      const endpoint = role === 'Admin' ? `/admin/${genre}` : `/customer/${genre}`;
      const res = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data?.books || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch books');
      setData([]);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div className="flex justify-center items-center min-h-[80vh]">Loading...</div>;

  const visibleBooks = data.filter(book => !dismissedBookIds.includes(book._id));

  return (
    <div className="min-h-[80vh] p-4 bg-gray-50">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 max-w-5xl mx-auto">
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            handleSearchByGenre(e.target.value);
          }}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/2"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="History">History</option>
          <option value="Biography">Biography</option>
          <option value="Science">Science</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author"
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/2"
        />

        <button
          onClick={handleSearchByTitle}
          className="text-white bg-blue-500 px-4 py-2 rounded mt-4 sm:mt-0"
        >
          Search
        </button>
      </div>

      {/* Books Display */}
      {visibleBooks.length > 0 ? (
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto gap-8">
          {visibleBooks.map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center justify-between gap-3"
            >
              <img
                src={book.image}
                alt={`Cover of the book ${book.title}`}
                className="h-[180px] w-full object-contain rounded"
              />

              <div className="w-full">
                <h2 className="text-gray-800 font-bold text-lg truncate">{book.title}</h2>
                <p className="text-sm text-gray-600 italic">{book.author}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {view[index]
                    ? book.description
                    : book.description.split(" ").slice(0, 15).join(" ") + "..."}
                  <span
                    onClick={() => setView((prev) => ({ ...prev, [index]: !prev[index] }))}
                    className="text-blue-600 ml-1 cursor-pointer text-[11px] underline"
                  >
                    {view[index] ? "Show Less" : "View More"}
                  </span>
                </p>

                <ul className="text-[12px] mt-2 space-y-1 text-gray-700">
                  <li><strong>Price:</strong> {book.price}₹</li>
                  <li><strong>Edition:</strong> {book.edition}</li>
                  <li><strong>Condition:</strong> {book.condition}</li>
                  <li><strong>Genre:</strong> {book.genre}</li>
                  <li><strong>Status:</strong> {book.status}</li>
                </ul>
              </div>

              <div className="flex justify-between gap-2 flex-wrap mt-4 w-full">
                <button
                  className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold text-xs p-1 px-3 uppercase hover:bg-gray-700 hover:text-white transition duration-300 ease-in"
                  onClick={() => func(book)}
                >
                  {primaryText}
                </button>

                <button
                  className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold text-xs p-1 px-3 uppercase hover:bg-red-500 hover:text-white transition duration-300 ease-in"
                  onClick={() => secFunc(book._id)}
                >
                  {secText}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg font-medium text-gray-500">No Books Found</p>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
