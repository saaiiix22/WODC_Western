export const feedbacktypeValidationSchema = {
    typeName:[
        {type: "required", message: "Name is required"},
        {type: "alphaSpace", message: "Only letters and sapce allowed"}
    ],

    typeDescription:[
        {type: "required", message: "Description is required"},
        {type: "maxLength", value: 500, message: "Max 500 characters allowed"}
    ],

    typeDocumentPath:[
        {type: "fileRequired", message: "Document is required"},
        {
            type: "fileType",
            value:["application/pdf", "image/jpeg", "image/png"],
            message: "Only PDF, JPG or PNG allowed",
        }
    ]
}