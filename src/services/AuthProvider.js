import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  //   const [exercises, setExercises] = useState([]);
  // Check if user is logged in on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      //   fetchUserDetails(savedToken);
    } else {
      setLoading(false);
    }
  }, []);
  //   useEffect(() => {
  //     // Fetch all exercises when the component mounts
  //     getExercises().then((data) => setExercises(data));
  //   }, []);

  // Fetch user details using the token
  //   const fetchUserDetails = async (token) => {
  //     try {
  //       const response = await axios.get("/api/auth/user", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Register a new user
  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      //   showSuccessToast("Registration successful");
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      //   showErrorToast("Registration failed");
      throw error;
    }
  };

  // Login a user
  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { token, role } = response.data;
      setToken(token);
      setUser({ ...response.data, role });
      localStorage.setItem("authToken", token);
      //   showSuccessToast("Login successful");
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      //   showErrorToast("Login failed");
      throw error;
    }
  };

  // Logout a user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    // showSuccessToast("Logout successful");
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      //   showSuccessToast("OTP sent to email");
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      //   showErrorToast("Error requesting password reset");
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (otp, password, confirmPassword) => {
    try {
      const response = await axios.post(`/api/auth/reset-password/${otp}`, {
        password,
        confirmPassword,
      });
      //   showSuccessToast("Password reset successful");
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      //   showErrorToast("Error resetting password");
      throw error;
    }
  };

  // Function to call the backend API to set a new password
  const setPassword = async ({ token, password, confirm_password }) => {
    try {
      const response = await axios.post("/api/patients/set-password", {
        token,
        password,
        confirm_password,
      });
      return response.data;
    } catch (error) {
      // Handle errors and throw them to be caught in the UI component
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          error.response.data.message || "Error setting password"
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error setting up request");
      }
    }
  };

  const createExercise = async (exerciseData) => {
    try {
      const response = await axios.post("/api/exercises", exerciseData);
      console.log("Exercise created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating exercise:", error);
      throw error;
    }
  };
  const getExercises = async () => {
    try {
      const response = await axios.get("/api/exercises/");
      console.log("Fetched exercises:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }
  };
  const getExerciseById = async (id) => {
    try {
      const response = await axios.get(`/api/exercises/${id}`);
      console.log("Fetched exercise:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise:", error);
      throw error;
    }
  };
  const updateExercise = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/exercises/${id}`, updatedData);
      console.log("Updated exercise:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating exercise:", error);
      throw error;
    }
  };
  const deleteExercise = async (id) => {
    try {
      const response = await axios.delete(`/api/exercises/${id}`);
      console.log("Deleted exercise:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting exercise:", error);
      throw error;
    }
  };

  // Fetch all clinics
  // const getAllClinics = async () => {
  //   try {
  //     const response = await axios.get('/api/clinics');
  //     console.log("Fetched all clinics:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching all clinics:", error);
  //     throw error;
  //   }
  // };

  // Fetch a clinic by ID
  // const getClinicById = async (id) => {
  //   try {
  //     const response = await axios.get(`/api/clinics/${id}`);
  //     console.log("Fetched clinic by ID:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching clinic by ID:", error);
  //     throw error;
  //   }
  // };

  // Create a new clinic
  const createClinic = async (clinicData) => {
    try {
      const response = await axios.post("/api/clinic", clinicData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Created clinic:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating clinic:", error);
      console.log("Clinic Data:", clinicData);
      throw error;
    }
  };

  // Update a clinic by ID
  const updateClinic = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/clinic/${id}`, updatedData);
      console.log("Updated clinic:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating clinic:", error);
      throw error;
    }
  };

  // Delete a clinic by ID
  const deleteClinic = async (id) => {
    try {
      const response = await axios.delete(`/api/clinic/${id}`);
      console.log("Deleted clinic:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting clinic:", error);
      throw error;
    }
  };

  // Fetch clinics for a specific doctor
  const getClinicsForDoctor = async () => {
    try {
      const response = await axios.get("/api/clinic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched clinics for doctor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching clinics for doctor:", error);
      throw error;
    }
  };
  // Function to create a patient
  const createPatient = async (patientData) => {
    try {
      const response = await axios.post("/api/patients", patientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Created patient:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating patient:", error);
      console.log("Patient Data:", patientData);
      throw error;
    }
  };

  // Function to update a patient by ID
  const updatePatient = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/patients/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Updated patient:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  };

  // Function to delete a patient by ID
  const deletePatient = async (id) => {
    try {
      const response = await axios.delete(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Deleted patient:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  };

  // Function to fetch patients by clinic ID
  const getPatientsByClinic = async (clinicId, token) => {
    try {
      const response = await axios.get(`/api/patients/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched patients:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  };
  // Function to fetch patients by doctor ID
  const getPatientsByDoctor = async () => {
    try {
      const response = await axios.get(`/api/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched patients:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  };
  // Update patient count for all clinics
  // const updatePatientCount = async () => {
  //   try {
  //     const response = await axios.put('/api/clinics/updatePatientCount');
  //     console.log("Updated patient counts:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating patient counts:", error);
  //     throw error;
  //   }
  // };

  const createDoctorProfile = async (profileData) => {
    try {
      const response = await axios.post(
        `/api/doctors/upload-profile/`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Created doctor profile:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      throw error;
    }
  };
  const removeDoctorProfile = async () => {
    try {
      const response = await axios.delete(`/api/doctors/remove-profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Removed doctor profile:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing doctor profile:", error);
      throw error;
    }
  };
  const fetchDoctorProfilePicture = async () => {
    try {
      const response = await axios.get("/api/doctors/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("doctor profile:", response.data.profileUrl);
      return response.data.profileUrl;
      // setAvatar(response.data.profileUrl || avatar8); // Set the avatar with the profile picture or default
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  // Function to create a device
  const createDevice = async (deviceData) => {
    try {
      const response = await axios.post("/api/device", deviceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Created device:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating device:", error);

      throw error;
    }
  };

  // Function to update a device by ID
  const updateDevice = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/device/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Updated device:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  };

  // Function to delete a device by ID
  const deleteDevice = async (id) => {
    try {
      const response = await axios.delete(`/api/device/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Deleted device:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  };

  // Function to fetch devices by doctor ID
  const getDevicesByDoctor = async () => {
    try {
      const response = await axios.get(`/api/device`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched device:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching device:", error);
      throw error;
    }
  };
  // Function to create a device
  const createSession = async (sessionData) => {
    try {
      const response = await axios.post("/api/session", sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Created Session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);

      throw error;
    }
  };

  // Function to update a device by ID
  const updateSession = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/session/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Updated session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  };

  // Function to delete a device by ID
  const deleteSession = async (id) => {
    try {
      const response = await axios.delete(`/api/session/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Deleted session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  };

  // Function to fetch devices by doctor ID
  const getSessionByDoctor = async () => {
    try {
      const response = await axios.get(`/api/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching session:", error);
      throw error;
    }
  };
  // Function to fetch exercise-raw-data by patient ID
  const getExerciseRawDataByPatient = async (patientId, date) => {
    try {
      const response = await axios.get(
        `/api/exercise-raw-data/${patientId}/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched RawData:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching RawData:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        createExercise,
        getExercises,
        getExerciseById,
        updateExercise,
        deleteExercise,
        setPassword,
        createClinic,
        updateClinic,
        deleteClinic,
        getClinicsForDoctor,
        createPatient,
        updatePatient,
        deletePatient,
        getPatientsByClinic,
        getPatientsByDoctor,
        createDoctorProfile,
        removeDoctorProfile,
        fetchDoctorProfilePicture,
        createDevice,
        updateDevice,
        deleteDevice,
        getDevicesByDoctor,
        createSession,
        updateSession,
        deleteSession,
        getSessionByDoctor,
        getExerciseRawDataByPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
