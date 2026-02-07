export const feedbackValidationSchema = {
  projectId: [
    {type: "required", message: "Project is required",}
  ],

  typeId: [
    {type: "required", message: "Feedback type is required",}
  ],
};
