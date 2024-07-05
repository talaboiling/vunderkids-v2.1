import axios from "axios";
import { API_URL } from "./config";
import { getAccessToken, refreshAccessToken, clearTokens } from "./authService";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchStudentsAdmin = async () => {
  try {
    const response = await instance.get("/all-students");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchStudentsOfClass = async (schoolId, classId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/students/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchUserData = async (childId) => {
  try {
    const endpoint = childId ? `/children/${childId}` : "/current-user";
    const response = await instance.get(endpoint);
    return childId ? response.data : response.data.user;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchChildren = async () => {
  try {
    const endpoint = `/children/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const addChild = async (formData) => {
  try {
    const response = await instance.post("/children/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addStudent = async (schoolId, classId, formData) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/students/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deleteChild = async (childId) => {
  try {
    const response = await instance.delete(`/children/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSchools = async () => {
  try {
    const endpoint = `/schools`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchClass = async (schoolId, classId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchCourses = async (childId) => {
  try {
    const endpoint = childId ? `/courses?child_id=${childId}` : "/courses";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchCourse = async (courseId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}?child_id=${child_id}`
      : `/courses/${courseId}`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await instance.post("/courses/", courseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await instance.patch(`/courses/${courseId}/`, courseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await instance.delete(`/courses/${courseId}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const createSections = async (courseId, sections) => {
  try {
    const response = await instance.post(
      `/courses/${courseId}/sections/`,
      sections
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateSection = async (courseId, sectionId, sectionData) => {
  try {
    const response = await instance.patch(
      `/courses/${courseId}/sections/${sectionId}/`,
      sectionData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const deleteSection = async (courseId, sectionId) => {
  try {
    const response = await instance.delete(
      `/courses/${courseId}/sections/${sectionId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchSections = async (courseId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/?child_id=${child_id}`
      : `/courses/${courseId}/sections/`;
    console.log(endpoint);
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSection = async (courseId, sectionId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchContents = async (courseId, sectionId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/contents?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/contents`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchLessons = async (courseId, sectionId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/lessons`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchTasks = async (courseId, sectionId, childId) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/tasks?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/tasks`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchQuestions = async (courseId, sectionId, taskId, childId) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

// Fetch specific objects
export const fetchTask = async (courseId, sectionId, taskId, childId) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchQuestion = async (
  courseId,
  sectionId,
  taskId,
  questionId
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions/${questionId}`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchWeeklyProgress = async (childId) => {
  try {
    const endpoint = childId
      ? `/progress/weekly?child_id=${childId}`
      : "/progress/weekly";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchRatings = async (childId) => {
  try {
    const endpoint = childId
      ? `/rating/global?child_id=${childId}`
      : `/rating/global`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const activateAccount = async (activationToken) => {
  try {
    const endpoint = `/activate/${activationToken}/`;
    const response = await instance.get(endpoint);
    return response;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const registerParent = async (formData) => {
  try {
    const endpoint = `/register-parent/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSchoolData = async (schoolId) => {
  try {
    const endpoint = `/schools/${schoolId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addSchool = async (formData) => {
  try {
    const response = await instance.post("/schools/", formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchClassesData = async (schoolId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addClasses = async (schoolId, formData) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createLesson = async (courseId, sectionId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/lessons/`;
    const response = await instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const updateLesson = async (courseId, sectionId, lessonId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/`;
    const response = await instance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deleteLesson = async (courseId, sectionId, lessonId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const createTask = async (courseId, sectionId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/`;
    const response = await instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const updateTask = async (courseId, sectionId, taskId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/`;
    const response = await instance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const deleteTask = async (courseId, sectionId, taskId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createQuestion = async (courseId, sectionId, taskId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions/`;
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await instance.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const updateQuestion = async (
  courseId,
  sectionId,
  taskId,
  questionId,
  data
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions/${questionId}/`;
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await instance.patch(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const deleteQuestion = async (
  courseId,
  sectionId,
  taskId,
  questionId
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions/${questionId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

// SUPERVISOR

export const assignSupervisor = async (schoolId, formData) => {
  try {
    const response = await instance.post(
      `/schools/${schoolId}/assign_supervisor/`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deassignSupervisor = async (schoolId) => {
  try {
    const response = await instance.get(
      `/schools/${schoolId}/deassign_supervisor/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSupervisorSchoolData = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/school/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorClassesData = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/classes/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorClassData = async (classId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/classes/${classId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentsData = async (classId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/classes/${classId}/students/`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentData = async (studentId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentProgress = async (studentId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/students/${studentId}/progress/`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorTopStudents = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/top-students/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const answerQuestion = async (
  courseId,
  sectionId,
  taskId,
  questionId,
  data,
  childId
) => {
  try {
    console.log(courseId, sectionId, taskId, questionId, data, childId);
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions/${questionId}/answer/`;
    const requestData = {
      answer: data,
      ...(childId && { child_id: childId }),
    };
    const response = await instance.post(endpoint, requestData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const playGame = async (childId) => {
  try {
    const endpoint = childId
      ? `/play-game/?child_id=${childId}`
      : "/play-game/";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
