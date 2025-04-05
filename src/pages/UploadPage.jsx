import React, { useState } from "react";
import "./UploadPage.css";
import UploadPopup from "../components/UploadPopup";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupData, setPopupData] = useState(null);

  // Rastgele kod/şifre üretici
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

  const handleUpload = () => {
    if (!selectedFile) return;

    const accessCode = generateRandomCode();
    const password = generateRandomPassword();

    // Burada ileride Firebase'e yükleme ve Firestore kaydı yapılacak
    setPopupData({
      fileName: selectedFile.name,
      accessCode,
      password,
    });

    // Panoya otomatik kopyala
    navigator.clipboard.writeText(`Erişim Kodu: ${accessCode}\nŞifre: ${password}`);

    setSelectedFile(null); // formu sıfırla
  };

  return (
    <div className="upload-page-container">
      <h2>Dosya Yükle ve Şifrele</h2>

      <div className="file-input-wrapper">
  <input type="file" onChange={handleFileChange} />
</div>
      <button onClick={handleUpload} disabled={!selectedFile}>
        Şifrele ve Yükle
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
