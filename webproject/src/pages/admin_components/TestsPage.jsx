import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS

// Fake API
const fetchTests = async () => [
    { id: 1, title: "Sample Test 1", description: "Description 1", test_type: "modo" },
    { id: 2, title: "Sample Test 2", description: "Description 2", test_type: "modo" },
];
const createTest = async (test) => console.log("Test Created:", test);

const TestsPage = () => {
    const [tests, setTests] = useState([]);
    const [newTest, setNewTest] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state

    useEffect(() => {
        const loadTests = async () => {
            const data = await fetchTests();
            setTests(data);
            setLoading(false);
        };
        loadTests();
    }, []);

    const handleTestCreate = async () => {
        if (newTest.title.trim() === "") return alert("Test title cannot be empty!");
        await createTest(newTest);
        setTests([...tests, { ...newTest, id: Date.now(), test_type: "modo" }]);
        setNewTest({ title: "", description: "" });
        setIsModalOpen(false);  // Close modal after creating test
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-gray-500 text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10">
            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700">Manage Tests</h2>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Test List</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        + Add New Test
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {tests.map((test) => (
                        <Link
                            to={`/tests/${test.id}/questions`}
                            key={test.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
                        >
                            <p className="text-xl font-semibold text-gray-800 mb-2">{test.title}</p>
                            <p className="text-gray-600">Type: {test.test_type}</p>
                        </Link>
                    ))}
                </div>

                {/* Modal for Adding New Test */}
                {isModalOpen && (
                    <>
                        {/* Transparent Backdrop */}
                        <div className="fixed inset-0 bg-blue bg-opacity-50 z-40"></div>

                        {/* Modal Window */}
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                                <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create a New Test</h3>
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Test Title"
                                        value={newTest.title}
                                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                    <textarea
                                        placeholder="Test Description"
                                        value={newTest.description}
                                        onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                        rows="4"
                                    />
                                </div>
                                <button
                                    onClick={handleTestCreate}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Create Test
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TestsPage;
