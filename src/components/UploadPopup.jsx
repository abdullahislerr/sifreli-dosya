import React, { useEffect, useState } from "react";
import "./UploadPopup.css";

const UploadPopup = ({ fileName, accessCode, password, onClose }) => {
  const [copyStatus, setCopyStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(true); // buton kontrolü

  useEffect(() => {
    const copyText = `Erişim Kodu: ${accessCode}\nŞifre: ${password}`;

    // Şifreyi panoya kopyala (sayfa aktifse)
    if (document.hasFocus()) {
      navigator.clipboard.writeText(copyText)
        .then(() => setCopyStatus("✅ Şifre panoya kopyalandı."))
        .catch(() => setCopyStatus("⚠️ Şifre panoya kopyalanamadı."));
    } else {
      setCopyStatus("⚠️ Şifre panoya kopyalanamadı. Sayfa aktif değil.");
    }

    // Butonu 1.5 saniye sonra aç (kopyalama için gecikme)
    const timeout = setTimeout(() => {
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [accessCode, password]);

  return (
    <div className="upload-popup">
      <h3>📁 Dosya Başarıyla Yüklendi!</h3>
      <p><strong>Dosya:</strong> {fileName}</p>
      <p><strong>Erişim Kodu:</strong> {accessCode}</p>
      <p><strong>Şifre:</strong> {password}</p>
      <p className="popup-warning">{copyStatus}</p>
      <button onClick={onClose} disabled={isProcessing}>
        {isProcessing ? "Hazırlanıyor..." : "Tamam"}
      </button>
    </div>
  );
};

export default UploadPopup;
