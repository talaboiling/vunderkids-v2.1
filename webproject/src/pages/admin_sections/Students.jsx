import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Superside from "../admin_components/Superside";
import Studenttable from "../admin_components/Studentstable";
import "/src/superdash.css";
import { fetchStudentsAdmin } from "../../utils/apiService";
import Loader from "../Loader";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const Students = () => {
  const [searchItem, setSearchItem] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await fetchStudentsAdmin();
        setStudents(studentsData);
        setFilteredStudents(studentsData); // Initialize filtered students
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    if (searchTerm === "") {
      setFilteredStudents(students); // Reset to original students list
    } else {
      const filteredItems = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filteredItems);
    }
  };

  const downloadExcel = () => {
    // Translate gender values
    const translatedStudents = filteredStudents.map((student) => ({
      ...student,
      gender:
        student.gender === "M"
          ? "Мужской"
          : student.gender === "F"
          ? "Женский"
          : "Не указан",
    }));

    const worksheet = XLSX.utils.json_to_sheet(translatedStudents, {
      header: [
        "id",
        "first_name",
        "last_name",
        "email",
        "school_name",
        "grade",
        "gender",
      ],
    });

    // Set custom headers in Russian
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["ID", "Имя", "Фамилия", "Email", "Школа", "Класс", "Пол"]],
      { origin: "A1" }
    );

    // Apply styles to header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, sz: 14 }, // Set font size to 14 and bold
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Adjust column widths to fit names
    const columnWidths = [
      { wch: 5 }, // ID
      { wch: 20 }, // Имя
      { wch: 20 }, // Фамилия
      { wch: 30 }, // Email
      { wch: 25 }, // Школа
      { wch: 10 }, // Класс
      { wch: 15 }, // Пол
    ];

    worksheet["!cols"] = columnWidths;

    // Add grid lines (although grid lines are usually a feature of the viewer, not the file itself)
    worksheet["!gridlines"] = true;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "students.xlsx");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <Link to={"/login"}>
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#444",
              fontSize: "large",
              float: "right",
            }}
          >
            Выйти
          </button>
        </Link>

        <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
          Ученики
        </p>
        <div className="superCont">
          <div className="superSearch">
            <input
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder="Поиск ученика по имени или почте"
              style={{ border: "none", width: "50%" }}
            />
          </div>
          <div className="downloadButtons">
            <button onClick={downloadExcel}>Скачать Excel</button>
          </div>
          <div className="superTable">
            <Studenttable students={filteredStudents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
