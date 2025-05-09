import React, { useState, useRef } from "react";
import "./UploadPage.css";
import UploadPopup from "../components/UploadPopup";
import CryptoJS from "crypto-js";
import { ref, uploadBytes } from "firebase/storage";
import { storage, db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // ✅ Buton durumu
  const fileInputRef = useRef(null); // ✅ Dosya input sıfırlama

  const generateRandomCode = () => {
    return `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789.";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true); // ✅ Tıklamayı engelle

    try {
      const accessCode = generateRandomCode();
      const password = generateRandomPassword();

      const reader = new FileReader();
      reader.onload = async (event) => {
        const wordArray = CryptoJS.lib.WordArray.create(event.target.result);
        const base64 = CryptoJS.enc.Base64.stringify(wordArray);
        const encrypted = CryptoJS.AES.encrypt(base64, password).toString();

        const encryptedBlob = new Blob([encrypted], { type: "text/plain" });
        const storageRef = ref(storage, `files/${accessCode}`);
        await uploadBytes(storageRef, encryptedBlob);

        const user = auth.currentUser;
        await addDoc(collection(db, "uploads"), {
          fileName: selectedFile.name,
          accessCode,
          password,
          uploadedBy: user?.email || "anonim",
          createdAt: serverTimestamp(),
          downloaded: false,
        });

        setPopupData({ fileName: selectedFile.name, accessCode, password });

        // Dosya ve input'u sıfırla
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Yükleme hatası:", error);
    } finally {
      setIsUploading(false); // ✅ Yükleme bitince buton tekrar aktif
    }
  };

  return (
    <div className="upload-page-container">
      <h2>Dosya Yükle ve Şifrele</h2>

      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
      </div>

      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={`upload-button ${isUploading ? "disabled" : ""}`}
      >
        {isUploading ? "Yükleniyor..." : "Şifrele ve Yükle"}
      </button>

      {popupData && (
        <UploadPopup
          fileName={popupData.fileName}
          accessCode={popupData.accessCode}
          password={popupData.password}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default UploadPage;
