import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
    cursor: "pointer", // Indicate that the header is clickable
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const getGenderLabel = (gender) => {
  if (gender === "M") return "Мужской";
  if (gender === "F") return "Женский";
  return "Не указан";
};

export default function Studenttable({ students }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell onClick={() => handleSort("first_name")}>
              Имя
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("id")}>
              ID Ученика&nbsp;
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("email")}>
              Адрес электронной почты
            </StyledTableCell>
            <StyledTableCell
              align="right"
              onClick={() => handleSort("school_name")}
            >
              Школа
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("grade")}>
              Класс
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("gender")}>
              Пол
            </StyledTableCell>
            <StyledTableCell
              align="right"
              onClick={() => handleSort("child_id")}
            >
              ID Родителя
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStudents.map((student, index) => (
            <StyledTableRow
              key={`${student.id}-${student.first_name}-${student.last_name}-${index}`}
            >
              <StyledTableCell component="th" scope="row">
                {student.first_name} {student.last_name}
              </StyledTableCell>
              <StyledTableCell align="right">{student.id}</StyledTableCell>
              <StyledTableCell align="right">{student.email}</StyledTableCell>
              <StyledTableCell align="right">
                {student.school_name}
              </StyledTableCell>
              <StyledTableCell align="right">{student.grade}</StyledTableCell>
              <StyledTableCell align="right">
                {getGenderLabel(student.gender)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {student.parent_id ? student.parent_id : "-"}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
