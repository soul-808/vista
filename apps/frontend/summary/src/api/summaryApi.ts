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
): Promise<ComplianceDocument> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    const { data } = await api.post<ComplianceDocument>(
      "/document-upload/analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error: unknown) {
    console.error("Error uploading document:", error);

    // Type guard to handle axios error
    const isAxiosError = (
      err: unknown
    ): err is {
      response?: {
        status: number;
        data?: { message?: string };
      };
    } => {
      return typeof err === "object" && err !== null && "response" in err;
    };

    // Extract specific error message from response if available
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 413) {
        throw new Error(
          "The file size is too large. Please upload a smaller document (max 10MB)."
        );
      } else if (status === 415) {
        throw new Error(
          "Unsupported file format. Please use PDF, DOCX, XLSX, or TXT files."
        );
      } else if (status === 500) {
        throw new Error(
          "Server error processing your document. The file may be too complex or contain data that exceeds database limits."
        );
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Generic error message if we can't determine the specific issue
    throw new Error(
      "Failed to upload document. Please try again with a different file or contact support."
    );
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
