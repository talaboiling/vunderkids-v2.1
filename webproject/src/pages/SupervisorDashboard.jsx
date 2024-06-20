import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Modal,
  Box,
  IconButton,
  Button,
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import {
  fetchSupervisorSchoolData,
  fetchSupervisorClassesData,
  fetchSupervisorStudentsData,
  fetchSupervisorStudentData,
  fetchSupervisorStudentProgress,
  fetchSupervisorTopStudents, // New import
} from "../utils/apiService";
import { Navigate, useNavigate } from "react-router-dom"; // Import useHistory
import { logout } from "../utils/authService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PREFIX = "SupervisorDashboard";

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
  header: `${PREFIX}-header`,
  sectionTitle: `${PREFIX}-sectionTitle`,
  modal: `${PREFIX}-modal`,
  paper: `${PREFIX}-paper`,
  closeButton: `${PREFIX}-closeButton`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: "#f0f4f8",
  },
  [`& .${classes.card}`]: {
    backgroundColor: "#e3f2fd",
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: "#2196f3",
  },
  [`& .${classes.header}`]: {
    marginBottom: theme.spacing(2),
    fontSize: "1.8rem",
  },
  [`& .${classes.sectionTitle}`]: {
    margin: theme.spacing(2, 0),
    fontSize: "1.5rem",
  },
  [`& .${classes.modal}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${classes.paper}`]: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
  [`& .${classes.closeButton}`]: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const SupervisorDashboard = () => {
  const [school, setSchool] = useState(null);
  const [classList, setClassList] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [topStudents, setTopStudents] = useState([]); // New state for top students
  const [loading, setLoading] = useState(true);
  const [openClassModal, setOpenClassModal] = useState(false);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSupervisorSchoolData().then(setSchool);
      await fetchSupervisorClassesData().then(setClassList);
      await fetchSupervisorTopStudents().then(setTopStudents); // Fetch top students
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleClassClick = async (classId) => {
    await fetchSupervisorStudentsData(classId).then(setStudents);
    setOpenClassModal(true);
  };

  const handleStudentClick = async (studentId) => {
    await fetchSupervisorStudentData(studentId).then(setSelectedStudent);
    const progressData = await fetchSupervisorStudentProgress(studentId);
    setWeeklyProgress(progressData.weekly_progress);
    setOpenStudentModal(true);
  };

  const handleCloseClassModal = () => {
    setOpenClassModal(false);
  };

  const handleCloseStudentModal = () => {
    setOpenStudentModal(false);
  };

  const handleLogout = () => {
    navigate("/login");
    logout();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  const daysInRussian = {
    Monday: "Пон",
    Tuesday: "Вто",
    Wednesday: "Сре",
    Thursday: "Чет",
    Friday: "Пят",
    Saturday: "Суб",
    Sunday: "Вос",
  };

  const data = {
    labels: weeklyProgress.map((day) => daysInRussian[day.day] || day.day),
    datasets: [
      {
        label: "Кубки",
        data: weeklyProgress.map((day) => day.cups),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Кубки",
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: false,
    maintainAspectRatio: false,
  };

  return (
    <Root className={classes.root}>
      <Typography variant="h4" className={classes.header} align="center">
        Панель супервайзера
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        Выйти
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Информация о школе
              </Typography>
              {school ? (
                <>
                  <Typography variant="body1">
                    <strong>Название:</strong> {school.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Город:</strong> {school.city}
                  </Typography>{" "}
                  <Typography variant="body1">
                    <strong>Email:</strong> {school.email}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">Нет информации о школе</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Топ Студенты
              </Typography>
              <List>
                {topStudents.length > 0 ? (
                  topStudents.map((student) => (
                    <ListItem
                      button
                      onClick={() => handleStudentClick(student.id)}
                      key={student.id}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.avatar} src={student.avatar}>
                          {!student.avatar && student.user.first_name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.user.first_name} ${student.user.last_name}`}
                        secondary={`Кубки: ${student.cups}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">
                    Нету информации о студентах
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Классы
              </Typography>
              <List>
                {classList.length > 0 ? (
                  classList.map((classItem) => (
                    <ListItem
                      key={classItem.id}
                      button
                      onClick={() => {
                        setSelectedClass(classItem);
                        handleClassClick(classItem.id);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          {classItem.grade}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={`${classItem.section}`} />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">
                    Нету информации о классах
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal
        open={openClassModal}
        onClose={handleCloseClassModal}
        className={classes.modal}
      >
        <Box sx={style} className={classes.paper}>
          <IconButton
            className={classes.closeButton}
            onClick={handleCloseClassModal}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4">
            Класс: {selectedClass?.grade} {selectedClass?.section}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Студенты
          </Typography>
          <List>
            {students.length > 0 ? (
              students.map((student) => (
                <React.Fragment key={student.id}>
                  <ListItem
                    button
                    onClick={() => handleStudentClick(student.id)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar} src={student.avatar}>
                        {!student.avatar && student.user.first_name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.user.first_name} ${student.user.last_name}`}
                      secondary={`Уровень: ${student.level} | Кубки: ${student.cups}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1">Класс пуст</Typography>
            )}
          </List>
        </Box>
      </Modal>

      <Modal
        open={openStudentModal}
        onClose={handleCloseStudentModal}
        className={classes.modal}
      >
        <Box sx={style} className={classes.paper}>
          <IconButton
            className={classes.closeButton}
            onClick={handleCloseStudentModal}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Информация о студенте
          </Typography>
          {selectedStudent ? (
            <>
              <Avatar
                className={classes.avatar}
                src={selectedStudent.avatar}
                sx={{ width: 80, height: 80, fontSize: "2rem" }}
              >
                {!selectedStudent.avatar && selectedStudent.user.first_name[0]}
              </Avatar>
              <Typography variant="body1">
                <strong>Имя:</strong> {selectedStudent.user.first_name}{" "}
                {selectedStudent.user.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedStudent.user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Класс:</strong> {selectedStudent.grade}
              </Typography>
              <Typography variant="body1">
                <strong>Уровень:</strong> {selectedStudent.level}
              </Typography>
              <Typography variant="body1">
                <strong>Серия:</strong> {selectedStudent.streak}
              </Typography>
              <Typography variant="body1">
                <strong>Кубки:</strong> {selectedStudent.cups}
              </Typography>
              <Typography variant="body1">
                <strong>Звёзды:</strong> {selectedStudent.stars}
              </Typography>
              <Line data={data} options={options} />
            </>
          ) : (
            <Typography variant="body1">
              Отсутствуют данные у студенте
            </Typography>
          )}
        </Box>
      </Modal>
    </Root>
  );
};

export default SupervisorDashboard;
