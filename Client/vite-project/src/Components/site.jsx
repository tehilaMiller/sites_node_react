import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ name: "", url: "", image: "", score: 0 });

  // שליפת כל האתרים מהשרת
  useEffect(() => {
    axios.get("http://localhost:3000/site")
      .then(res => setSites(res.data))
      .catch(err => console.error(err));
  }, []);

  // הוספת אתר חדש
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/site", form);
      setSites([...sites, res.data]); // עדכון הרשימה
      setForm({ name: "", url: "", image: "", score: 0 }); // איפוס הטופס
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 רשימת אתרים</h2>
      <ul>
        {sites.map(site => (
          <li key={site._id} style={{ marginBottom: "10px" }}>
            <img src={site.image} alt={site.name} width="50" style={{ marginRight: "10px" }} />
            <a href={site.url} target="_blank" rel="noreferrer">{site.name}</a>  
            <span> - ציון: {site.score}</span>
          </li>
        ))}
      </ul>

      <h3>➕ הוספת אתר חדש</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
        <input
          type="text"
          placeholder="שם האתר"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="כתובת URL"
          value={form.url}
          onChange={e => setForm({ ...form, url: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="קישור לתמונה"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
        />
        <input
          type="number"
          placeholder="ציון"
          value={form.score}
          onChange={e => setForm({ ...form, score: e.target.value })}
        />
        <button type="submit" style={{ marginTop: "10px" }}>הוסף</button>
      </form>
    </div>
  );
}