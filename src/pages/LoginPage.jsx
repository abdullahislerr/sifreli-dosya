import React, { useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setHata("");

    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      navigate("/"); // Giriş başarılıysa anasayfaya yönlendir
    } catch (err) {
      setHata("Giriş başarısız: " + err.message);
    }
  };

  return (
    <div className="login-page-container">
      <h2 className="login-page-title">Giriş Yap</h2>
      <form onSubmit={handleLogin} className="login-page-form">
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
        <button type="submit" className="login-page-button">Giriş Yap</button>
      </form>
      <p className="login-page-link">
  Hesabın yok mu?{" "}
  <Link to="/register">Kayıt ol</Link>
</p>
      {hata && <p className="login-page-error">{hata}</p>}
    </div>
  );
};

export default LoginPage;
