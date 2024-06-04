import * as React from "react";
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

export default function Studenttable({ students }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Имя</StyledTableCell>
            <StyledTableCell align="right">ID Ученика&nbsp;</StyledTableCell>
            <StyledTableCell align="right">
              Адрес электронной почты
            </StyledTableCell>
            <StyledTableCell align="right">Школа</StyledTableCell>
            <StyledTableCell align="right">Класс</StyledTableCell>
            <StyledTableCell align="right">Пол</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <StyledTableRow key={student.id}>
              <StyledTableCell component="th" scope="row">
                {student.first_name} {student.last_name}
              </StyledTableCell>
              <StyledTableCell align="right">{student.id}</StyledTableCell>
              <StyledTableCell align="right">{student.email}</StyledTableCell>
              <StyledTableCell align="right">
                {student.school_name}
              </StyledTableCell>
              <StyledTableCell align="right">{student.grade}</StyledTableCell>
              <StyledTableCell align="right">{student.gender}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
