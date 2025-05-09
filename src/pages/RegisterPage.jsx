import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setHata("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);

      await updateProfile(userCredential.user, {
        displayName: `${ad} ${soyad}`,
      });

      // ✅ E-posta doğrulama bağlantısını gönder
      await sendEmailVerification(userCredential.user);

      alert("Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama bağlantısına tıklayın.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setHata("Kayıt başarısız: " + err.message);
    }
  };

  return (
    <div className="register-page-container">
      <h2 className="register-page-title">Kayıt Ol</h2>
      <form onSubmit={handleRegister} className="register-page-form">
        <input
          type="text"
          placeholder="Ad"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Soyad"
          value={soyad}
          onChange={(e) => setSoyad(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          required
        />
        <button type="submit" className="register-page-button">Kayıt Ol</button>
      </form>
      {hata && <p className="register-page-error">{hata}</p>}
    </div>
  );
};

export default RegisterPage;
