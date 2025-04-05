import React from "react";
import "./UploadPopup.css";

const UploadPopup = ({ fileName, accessCode, password, onClose }) => {
  return (
    <div className="upload-popup-overlay">
      <div className="upload-popup-box">
        <h3>Dosya Başarıyla Şifrelendi</h3>
        <p><strong>Dosya Adı:</strong> {fileName}</p>
        <p><strong>Erişim Kodu:</strong> {accessCode}</p>
        <p><strong>Şifre:</strong> {password}</p>
        <p className="popup-warning">Bu bilgiler panoya kopyalandı. Lütfen güvende tutun. Bu ekran bir daha gösterilmeyecek.</p>
        <button onClick={onClose}>Tamam</button>
      </div>
    </div>
  );
};

export default UploadPopup;
