import CryptoJS from "crypto-js";

export const generateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(buffer);
    return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Base64);
}