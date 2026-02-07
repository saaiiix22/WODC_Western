// export const avoidSpecialCharUtil = (str = '') => {
//   return str.replace(/[^a-zA-Z ]/g, '').trim();
// };

// export const avoidAllSpaceUtil = (str = '') => {
//   return str.replace(/\s+/g, '').trim();
// };

// export const cleanStringUtil = (str = '') => {
//   return avoidAllSpaceUtil(avoidSpecialCharUtil(str));
// };

// export const prevDateUtil = () => {
//   const d = new Date();
//   return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
//     .toISOString()
//     .split("T")[0];
// };
// export const alphaNumericUtil = (str = '') => {
//   return str.replace(/[^a-zA-Z0-9]/g, '').trim();
// };
// export const numberOnlyUtil = (str = '') => {
//   return str.replace(/[^0-9]/g, '').trim();
// }
// export const convertIntoINRutil = (str = "") => {
//   const num = Number(str);

//   if (isNaN(num)) return str;

//   return num.toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//   });
// };
// export const formatDateToDDMMYYYY = (dateStr = "") => {
//   if (!dateStr) return "";
//   const [yyyy, mm, dd] = dateStr.split("-");
//   return `${dd}/${mm}/${yyyy}`;
// };
// export const LGDutil = (value) => {
//   if (!value) return "";

//   return value.toUpperCase().replace(/[^0-9A-Z]/g, "");
// };
// export const IFSCutil = (value) => {
//   if (!value) return "";

//   return value.toUpperCase().replace(/[^0-9A-Z]/g, "");
// };
// export const onlyNumberUtil = (str = '') => {
//   if (!str) return "";
//   return str.toUpperCase().replace(/[^0-9]/g, "");
// }
// export const accountNumberUtil = (str = "") => {
//   if (!str) return "";
//   return str.replace(/[^0-9]/g, "");
// };
// export const ifscUtil = (str = "") => {
//   if (!str) return "";
//   return str
//     .toUpperCase()
//     .replace(/[^A-Z0-9]/g, "")
//     .slice(0, 11);
// };



// /* --------------------------
//     NEW VALIDATION FUNCTIONS
// ---------------------------*/
// export const validateAccountNoUtil = (accNo = '') => {
//   const cleaned = accNo.replace(/\s+/g, '');

//   if (!/^[0-9]{8,18}$/.test(cleaned)) {
//     return false;
//   }
//   return true;
// };

// export const validateIfscUtil = (ifsc = '') => {
//   const cleaned = ifsc.trim().toUpperCase();
//   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

//   return ifscRegex.test(cleaned);
// };

// export const validateAadhaarUtil = (input) => {
//   // Remove non-digits
//   let aadhaar = input.replace(/[^0-9]/g, "");

//   // Limit to 12 digits
//   if (aadhaar.length > 12) aadhaar = aadhaar.slice(0, 12);

//   // Validate Aadhaar rule: must start 2–9 and be exactly 12 digits
//   const aadhaarRegex = /^[2-9][0-9]{11}$/;
//   const isValid = aadhaarRegex.test(aadhaar);

//   // Format: XXXX XXXX XXXX
//   const formatted = aadhaar.replace(
//     /(\d{4})(\d{1,4})?(\d{1,4})?/,
//     (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(" ")
//   );

//   // If valid → return formatted Aadhaar
//   return isValid ? formatted : "";
// };

// export const cleanAadhaarUtil = (str = "") => {
//   let value = str.replace(/[^0-9]/g, ""); // Only digits
//   return value.slice(0, 12); // Max 12 digits
// };


// // Must be exactly 10 digits and start with 6,7,8,9
// // export const validateContactNoUtil = (contactNo = "") => {
// //   return /^[6-9][0-9]{9}$/.test(contactNo);
// // };

// export const cleanContactNoUtil = (input = "") => {
//   return input.replace(/[^0-9]/g, "").slice(0, 10);
// };

// export const validateContactNoUtil = (contactNo = "") => {
//   if (!contactNo) {
//     return "Mobile number is required";
//   }

//   if (!/^[0-9]+$/.test(contactNo)) {
//     return "Mobile number must contain only digits";
//   }

//   if (contactNo.length !== 10) {
//     return "Mobile number must be exactly 10 digits";
//   }

//   if (!/^[6-9]/.test(contactNo)) {
//     return "Mobile number must start with 6, 7, 8, or 9";
//   }

//   return "";
// };




// export const cleanEmailUtil = (input = "") => {
//   return input.replace(/\s/g, "");
// };

// export const validateEmailUtil = (email = "") => {
//   if (!email) {
//     return "Email is required";
//   }

//   // Basic email format check
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

//   if (!emailRegex.test(email)) {
//     return "Enter a valid email address";
//   }

//   return "";
// };


// export const formatWithCommas = (value) => {
//   if (!value) return "";
//   return Number(value).toLocaleString("en-IN");
// };

// export const removeCommas = (value) => {
//   if (!value) return "";
//   return value.replace(/,/g, "");
// };

export const avoidSpecialCharUtil = (str = '') => {
  return str.replace(/[^a-zA-Z ]/g, '').trim();
};

export const avoidAllSpaceUtil = (str = '') => {
  return str.replace(/\s+/g, '').trim();
};

export const cleanStringUtil = (str = '') => {
  return avoidAllSpaceUtil(avoidSpecialCharUtil(str));
};

export const prevDateUtil = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};
export const alphaNumericUtil = (str = '') => {
  return str.replace(/[^a-zA-Z0-9]/g, '').trim();
};
export const numberOnlyUtil = (str = '') => {
  return str.replace(/[^0-9]/g, '').trim();
}
export const convertIntoINRutil = (str = "") => {
  const num = Number(str);

  if (isNaN(num)) return str;

  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
};


export const dateToDDMMYYYY = (date) => {
  if (!date || isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
export const formatToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";

  // If already dd/MM/yyyy
  if (dateStr.includes("/")) return dateStr;

  const d = new Date(dateStr);
  if (isNaN(d)) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = (dateStr = "") => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}/${mm}/${yyyy}`;
};
export const LGDutil = (value) => {
  if (!value) return "";

  return value.toUpperCase().replace(/[^0-9A-Z]/g, "");
};
export const IFSCutil = (value) => {
  if (!value) return "";

  return value.toUpperCase().replace(/[^0-9A-Z]/g, "");
};
export const onlyNumberUtil = (str = '') => {
  if (!str) return "";
  return str.toUpperCase().replace(/[^0-9]/g, "");
}
export const accountNumberUtil = (str = "") => {
  if (!str) return "";
  return str.replace(/[^0-9]/g, "");
};
export const ifscUtil = (str = "") => {
  if (!str) return "";
  return str
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 11);
};



/* --------------------------
    NEW VALIDATION FUNCTIONS
---------------------------*/
export const validateAccountNoUtil = (accNo = '') => {
  const cleaned = accNo.replace(/\s+/g, '');

  if (!/^[0-9]{8,18}$/.test(cleaned)) {
    return false;
  }
  return true;
};

export const validateIfscUtil = (ifsc = '') => {
  const cleaned = ifsc.trim().toUpperCase();
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  return ifscRegex.test(cleaned);
};

export const validateAadhaarUtil = (input) => {
  // Remove non-digits
  let aadhaar = input.replace(/[^0-9]/g, "");

  // Limit to 12 digits
  if (aadhaar.length > 12) aadhaar = aadhaar.slice(0, 12);

  // Validate Aadhaar rule: must start 2–9 and be exactly 12 digits
  const aadhaarRegex = /^[2-9][0-9]{11}$/;
  const isValid = aadhaarRegex.test(aadhaar);

  // Format: XXXX XXXX XXXX
  const formatted = aadhaar.replace(
    /(\d{4})(\d{1,4})?(\d{1,4})?/,
    (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(" ")
  );

  // If valid → return formatted Aadhaar
  return isValid ? formatted : "";
};

export const cleanAadhaarUtil = (str = "") => {
  let value = str.replace(/[^0-9]/g, ""); // Only digits
  return value.slice(0, 12); // Max 12 digits
};


// Must be exactly 10 digits and start with 6,7,8,9
// export const validateContactNoUtil = (contactNo = "") => {
//   return /^[6-9][0-9]{9}$/.test(contactNo);
// };

export const cleanContactNoUtil = (input = "") => {
  return input.replace(/[^0-9]/g, "").slice(0, 10);
};

export const validateContactNoUtil = (contactNo = "") => {
  if (!contactNo) {
    return "Mobile number is required";
  }

  if (!/^[0-9]+$/.test(contactNo)) {
    return "Mobile number must contain only digits";
  }

  if (contactNo.length !== 10) {
    return "Mobile number must be exactly 10 digits";
  }

  if (!/^[6-9]/.test(contactNo)) {
    return "Mobile number must start with 6, 7, 8, or 9";
  }

  return "";
};




export const cleanEmailUtil = (input = "") => {
  return input.replace(/\s/g, "");
};

export const validateEmailUtil = (email = "") => {
  if (!email) {
    return "Email is required";
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return "";
};


export const formatWithCommas = (value) => {
  if (!value) return "";
  return Number(value).toLocaleString("en-IN");
};

export const removeCommas = (value) => {
  if (!value) return "";
  return value.replace(/,/g, "");
};