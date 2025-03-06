import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS

// Fake API
const createOption = async (option) => console.log("Option Created:", option);
const createContent = async (content) => console.log("Content Created:", content);

const QuestionDetailPage = () => {
    const { questionId } = useParams();
    const [newOption, setNewOption] = useState({ text: "", questionId: questionId });
    const [newContent, setNewContent] = useState({
        text: "",
        type: "text",
        questionId: questionId,
    });

    const handleOptionCreate = async () => {
        if (newOption.text.trim() === "") return alert("Option text cannot be empty!");
        await createOption(newOption);
        setNewOption({ text: "", questionId: questionId });
    };

    const handleContentCreate = async () => {
        if (newContent.text.trim() === "") return alert("Content text cannot be empty!");
        await createContent(newContent);
        setNewContent({ text: "", type: "text", questionId: questionId });
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10">
            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
                    Manage Question {questionId}
                </h2>

                {/* Options */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-inner mb-12">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Add Option
                    </h3>
                    <input
                        type="text"
                        placeholder="Option Text"
                        value={newOption.text}
                        onChange={(e) =>
                            setNewOption({ ...newOption, text: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                    />
                    <button
                        onClick={handleOptionCreate}
                        className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Add Option
                    </button>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-inner mb-12">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Add Content
                    </h3>
                    <textarea
                        placeholder="Content Text"
                        value={newContent.text}
                        onChange={(e) =>
                            setNewContent({ ...newContent, text: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                        rows="4"
                    />
                    <button
                        onClick={handleContentCreate}
                        className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Add Content
                    </button>
                </div>

                <div className="text-center mt-6">
                    <Link
                        to="/tests"
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                        ← Back to Tests
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
