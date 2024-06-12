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
    console.log("hello");
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        console.log(newAccessToken);
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

export const fetchCourses = async (childId) => {
  try {
    const endpoint = childId ? `/courses?child_id=${childId}` : "/courses";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSections = async (courseId) => {
  try {
    const response = await instance.get(`/courses/${courseId}/sections/`);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchContents = async (courseId, sectionId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/contents`;
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

export const fetchTasks = async (courseId, sectionId) => {
  try {
    const response = await instance.get(
      `/courses/${courseId}/sections/${sectionId}/tasks/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchQuestions = async (courseId, sectionId, taskId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}/questions`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

// Fetch specific objects
export const fetchTask = async (courseId, sectionId, taskId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/tasks/${taskId}`;
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

export const fetchCourse = async (courseId) => {
  try {
    const endpoint = `/courses/${courseId}`;
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
// Add other fetch functions as needed
