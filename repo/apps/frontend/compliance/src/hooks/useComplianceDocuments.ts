import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComplianceDocuments,
  uploadComplianceDocument,
} from "../api/complianceApi";
import { ComplianceDocument } from "../types/compliance";

export const useComplianceDocuments = () =>
  useQuery({
    queryKey: ["compliance-documents"],
    queryFn: fetchComplianceDocuments,
  });

interface UploadDocumentParams {
  file: File;
  docType: string;
}

export const useUploadComplianceDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<ComplianceDocument, Error, UploadDocumentParams>({
    mutationFn: async ({ file, docType }) => {
      return await uploadComplianceDocument(file, docType);
    },
    onSuccess: () => {
      // Invalidate and refetch compliance documents
      queryClient.invalidateQueries({ queryKey: ["compliance-documents"] });
    },
  });
};
