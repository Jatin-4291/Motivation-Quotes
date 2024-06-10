import React, { useState, useEffect } from "react";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
import "./App.css"; // Import your CSS file for styling

const fetchQuotes = async () => {
  try {
    const res = await fetch(
      "https://ron-swanson-quotes.herokuapp.com/v2/quotes"
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return ["Failed to fetch quotes"];
  }
};

function App() {
  const [quotes, setQuotes] = useState([]);
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState([]);
  const [getQuotes, setGetQuotes] = useState([]);
  const [showQuoteList, setShowQuoteList] = useState(false);

  const handleClick = async () => {
    const quotesData = await fetchQuotes();
    setQuotes(quotesData);
  };

  const handleBookMark = () => {
    const updatedBookmarks = [...bookmarkedQuotes, quotes[0]];
    setBookmarkedQuotes(updatedBookmarks);
    localStorage.setItem("quotes", JSON.stringify(updatedBookmarks));
    setShowQuoteList(true);
  };

  const handleCross = () => {
    setShowQuoteList(false);
  };

  const handleHamburger = () => {
    setShowQuoteList(true);
  };
  const handleDeleteQuote = (index) => {
    const updatedBookmarks = [...bookmarkedQuotes];
    updatedBookmarks.splice(index, 1);
    setBookmarkedQuotes(updatedBookmarks);
    localStorage.setItem("quotes", JSON.stringify(updatedBookmarks));
  };
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("quotes")) || [];
    setGetQuotes(storedBookmarks);
  }, [bookmarkedQuotes]);

  useEffect(() => {
    const getQuotes = async () => {
      const quotesData = await fetchQuotes();
      setQuotes(quotesData);
    };
    getQuotes();
  }, []);

  return (
    <div className="bg-gray-100 w-full h-screen flex items-center justify-center">
      <div className="relative w-4/5 h-4/5 bg-white rounded-lg shadow-lg p-8 overflow-hidden">
        {showQuoteList && (
          <div className="absolute top-0 left-0 h-full w-1/2 bg-white border border-s-black border-s-4 shadow-md z-10 overflow-y-auto">
            <div className="flex">
              <h1 className="m-5 text-3xl text-center font-bold">
                Quotes List
              </h1>
              <button onClick={handleCross} className="ml-10 mt-1">
                <RxCross1 className="text-2xl font-bold" />
              </button>
            </div>

            <div className="flex flex-col justify-center">
              {getQuotes.map((quote, index) => (
                <div
                  key={index}
                  className="m-3 text-center shadow-md rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>{quote}</div>
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteQuote(index)}
                    >
                      <RxCross1 className="text-xl" />
                    </button>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-around">
          <button onClick={handleHamburger} className="mb-6 -translate-x-14">
            <RxHamburgerMenu className="text-2xl" />
          </button>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Motivating Quotes
          </h1>
        </div>
        <div className="h-4/5 flex gap-3">
          <div className="w-full mt-10 h-84 flex flex-col justify-between border border-gray-300 rounded-lg p-4">
            <p className="font-serif text-3xl text-gray-700">{quotes[0]}</p>
            <div className="flex flex-row justify-end gap-2">
              <button onClick={handleBookMark}>
                <CiBookmarkPlus className="text-xl" />
              </button>
              <button onClick={handleClick}>
                <IoReload className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
