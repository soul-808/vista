import { useQuery } from "@tanstack/react-query";
import { fetchComplianceDocuments } from "../api/complianceApi";
import { useMutation } from "@tanstack/react-query";
import { uploadComplianceDocument } from "../api/complianceApi";

export const useComplianceDocuments = () =>
  useQuery({
    queryKey: ["compliance-documents"],
    queryFn: fetchComplianceDocuments,
  });

export const useUploadComplianceDocument = () =>
  useMutation<void, Error, { file: File; docType: string }>({
    mutationFn: async ({ file, docType }) => {
      await uploadComplianceDocument(file, docType);
    },
  });
