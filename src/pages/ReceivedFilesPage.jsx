import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import CryptoJS from "crypto-js";
import "./ReceivedFilesPage.css";

const ReceivedFilesPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessedFiles, setAccessedFiles] = useState([]);

  useEffect(() => {
    const userEmail = auth.currentUser?.email;
    if (userEmail) {
      const storageKey = `receivedHistory_${userEmail}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAccessedFiles(JSON.parse(saved));
      }
    }
  }, []);

  const updateHistory = (newEntry) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
  
    const storageKey = `receivedHistory_${userEmail}`;
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];
    const updated = [newEntry, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setAccessedFiles(updated);
  };
  
  const handleSearch = async () => {
    setError("");
    setSuccessMsg("");
    setFileInfo(null);

    const querySnapshot = await getDocs(collection(db, "uploads"));
    const found = querySnapshot.docs.find((doc) => doc.data().accessCode === accessCode);

    if (!found) {
      setError("Dosya bulunamadı.");
      return;
    }

    setFileInfo({ id: found.id, ...found.data() });
  };

  const handleDecryptAndDownload = async () => {
    if (!fileInfo || !password || loading) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const fileRef = ref(storage, `files/${fileInfo.accessCode}`);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const encryptedText = await response.text();

      const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
      const base64 = decrypted.toString(CryptoJS.enc.Utf8);
      if (!base64) throw new Error("Şifre çözülemedi.");

      const wordArray = CryptoJS.enc.Base64.parse(base64);
      const typedArray = new Uint8Array(wordArray.sigBytes);
      for (let i = 0; i < wordArray.sigBytes; i++) {
        typedArray[i] = (wordArray.words[Math.floor(i / 4)] >> (24 - (i % 4) * 8)) & 0xff;
      }

      const blob = new Blob([typedArray], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileInfo.fileName;
      link.click();

      await updateDoc(doc(db, "uploads", fileInfo.id), {
        downloaded: true,
        downloadedBy: auth.currentUser?.email || "bilinmiyor",
      });

      setSuccessMsg("İndirme başarılı.");

      updateHistory({
        fileName: fileInfo.fileName,
        accessCode: fileInfo.accessCode,
        downloadedAt: new Date().toLocaleString(),
        uploadedBy: fileInfo.uploadedBy,
      });

      setFileInfo(null);
      setPassword("");
      setAccessCode("");
    } catch (err) {
      console.error(err);
      setError("Şifre yanlış veya dosya çözülemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="received-container">
      <h2 className="received-title">Gelen Dosya</h2>

      <div className="received-form">
        <input
          type="text"
          placeholder="Erişim Kodunu Gir"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        <button onClick={handleSearch} disabled={!accessCode}>
          Ara
        </button>
      </div>

      {fileInfo && (
        <div className="received-file-info">
          <p><strong>Dosya Adı:</strong> {fileInfo.fileName}</p>
          <input
            type="password"
            placeholder="Şifreyi Gir"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleDecryptAndDownload}
            disabled={!password || loading}
          >
            {loading ? "İndiriliyor..." : "Şifreyi Doğrula ve İndir"}
          </button>
        </div>
      )}

      {error && <p className="received-error">{error}</p>}
      {successMsg && <p className="received-success">{successMsg}</p>}

      <div className="received-history">
        <h3>Geçmişte Erişilen Dosyalar</h3>
        <table className="received-history-table">
          <thead>
            <tr>
              <th>Dosya Adı</th>
              <th>Erişim Kodu</th>
              <th>İndirme Tarihi</th>
              <th>Gönderen</th>
            </tr>
          </thead>
          <tbody>
            {accessedFiles.length > 0 ? (
              accessedFiles.map((item, index) => (
                <tr key={index}>
                  <td>{item.fileName}</td>
                  <td>{item.accessCode}</td>
                  <td>{item.downloadedAt}</td>
                  <td>{item.uploadedBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Henüz bir dosya erişilmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceivedFilesPage;
