import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./SentFilesPage.css";

const SentFilesPage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const uploadsRef = collection(db, "uploads");
      const q = query(uploadsRef, where("uploadedBy", "==", user.email));
      const querySnapshot = await getDocs(q);

      const fileList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFiles(fileList);
    };

    fetchFiles();
  }, []);

  return (
    <div className="sent-files-container">
      <h2 className="sent-files-title">Gönderilen Dosyalar</h2>

      <div className="sent-files-table-wrapper">
        <table className="sent-files-table">
          <thead>
            <tr>
              <th>Dosya Adı</th>
              <th>Erişim Kodu</th>
              <th>Gönderme Tarihi</th>
              <th>Durum</th>
              <th>İndiren</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr key={file.id}>
                  <td>{file.fileName}</td>
                  <td>{file.accessCode}</td>
                  <td>{file.createdAt?.toDate().toLocaleString() || "-"}</td>
                  <td>{file.downloaded ? "İndirildi" : "İndirilmedi"}</td>
                  <td>{file.downloadedBy || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  Henüz dosya yüklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentFilesPage;
