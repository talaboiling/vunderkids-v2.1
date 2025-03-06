import React from "react";
import PDFViewer from "../components/PDFViewer";
import { Link } from "react-router-dom";

const Ktp = () => {
    const pdfUrl = "docs.pdf";

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <Link to="/" className="self-start mb-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                    ← Назад
                </button>
            </Link>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">КТП</h1>
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
                <PDFViewer pdfUrl={pdfUrl} initialPage={1} />
            </div>
        </div>
    );
};

export default Ktp;
