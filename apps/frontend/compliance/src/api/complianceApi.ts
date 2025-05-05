import axios from "axios";
import { ComplianceDocument } from "../types/compliance";

// Configure axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Could redirect to login or refresh token here
      console.error("Authentication failed: ", error);
    }
    return Promise.reject(error);
  }
);

export const fetchComplianceDocuments = async (): Promise<
  ComplianceDocument[]
> => {
  try {
    const { data } = await api.get<ComplianceDocument[]>(
      "/compliance-documents"
    );
    return data;
  } catch (error) {
    console.error("Error fetching compliance documents:", error);
    return []; // Return empty array on error
  }
};

export const uploadComplianceDocument = async (
  file: File,
  docType: string
): Promise<void> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);

    // Create document metadata
    const metadata = {
      filename: file.name,
      complianceType: docType,
      riskScore: "MEDIUM", // Default risk score
      tags: [docType],
    };

    formData.append("metadata", JSON.stringify(metadata));

    await api.post("/compliance-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

export const searchComplianceDocuments = async (
  searchTerm: string
): Promise<ComplianceDocument[]> => {
  try {
    const { data } = await api.get<ComplianceDocument[]>(
      `/compliance-documents?search=${searchTerm}`
    );
    return data;
  } catch (error) {
    console.error("Error searching documents:", error);
    return [];
  }
};

export const getDocumentsByRiskScore = async (
  riskScore: string
): Promise<ComplianceDocument[]> => {
  try {
    const { data } = await api.get<ComplianceDocument[]>(
      `/compliance-documents?riskScore=${riskScore}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching documents by risk score:", error);
    return [];
  }
};

export default api;
