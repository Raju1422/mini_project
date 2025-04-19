import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewType, setReviewType] = useState("positive");
  const [description, setDescription] = useState("");
  const [likedReviews, setLikedReviews] = useState([]);
  const [reviews, setReviews] = useState([]);

  const API_URL = "http://localhost:8000/api/feedback/reviews/"; // change to your domain
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username"); // assuming token is stored in localStorage

  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const res = await axios.get(API_URL);
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRating === 0 || description.trim() === "") return;

    try {
      await axios.post(
        API_URL,
        {
          rating: selectedRating,
          description,
          review_type: reviewType,
          user: username
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDescription("");
      setSelectedRating(0);
      fetchReviews(); // refresh list
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  const toggleLike = (index) => {
    setLikedReviews((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-gray-900 text-gray-100 font-sans min-h-screen p-5">
      <div className="flex flex-col md:flex-row">
        {/* Review Form */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg mr-4">
          <h2 className="text-2xl font-bold mb-4">Share Your Review</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="type" className="block text-lg mb-2">
              Review Type
            </label>
            <select
              id="type"
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-200 rounded mb-4"
            >
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>

            <label htmlFor="desc" className="block text-lg mb-2">
              Review Description
            </label>
            <textarea
              id="desc"
              className="w-full p-3 bg-gray-700 text-gray-200 rounded mb-4"
              rows="4"
              placeholder="Share your experience"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>

            <label className="block text-lg mb-2">Rate Us:</label>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star text-2xl cursor-pointer ${selectedRating >= rating ? "text-yellow-400" : "text-gray-500"
                    }`}
                  onClick={() => setSelectedRating(rating)}
                >
                  &#9733;
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 p-3 text-white rounded hover:bg-gray-500"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Reviews Section */}
        <div className="w-full md:w-2/5 bg-opacity-50 bg-white bg-blur-md p-6 rounded-lg shadow-lg mt-6 md:mt-0">
          <h3 className="text-xl font-bold text-center mb-4">Previous Reviews</h3>
          <div>
            {reviews.map((review, index) => (
              <div key={review.id} className="bg-gray-800 p-4 rounded mb-4">
                <h4 className="text-lg font-semibold">{review.user}</h4>
                <p className="text-sm mb-2">{review.description}</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star text-2xl ${star <= review.rating ? "text-yellow-400" : "text-gray-500"
                          }`}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <button
                    className={`ml-4 text-lg ${likedReviews.includes(index) ? "text-pink-400" : "text-gray-400"
                      }`}
                    onClick={() => toggleLike(index)}
                  >
                    Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
