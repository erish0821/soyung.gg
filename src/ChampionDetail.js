// src/ChampionDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import championsData from "./champions.json";

function ChampionDetail() {
  const { name } = useParams();
  const [championData, setChampionData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchChampionData = async () => {
      const champion = championsData.data[name];
      if (champion) {
        setChampionData(champion);
      } else {
        console.log("No such champion!");
      }
    };

    fetchChampionData();
  }, [name]);

  useEffect(() => {
    if (championData) {
      const fetchImageUrl = async () => {
        const imageName = `${championData.name}_0.jpg`; // 챔피언명_0.jpg 형식으로 파일명 설정
        const imageRef = ref(storage, `champion_full/${imageName}`);
        try {
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      };

      fetchImageUrl();
    }
  }, [championData]);

  if (!championData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="champion-detail">
      <h2>{championData.name}</h2>
      <p>{championData.title}</p>
      <p>{championData.blurb}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={championData.name}
          className="champion-image"
        />
      )}
      <h3>Stats</h3>
      <ul>
        <li>HP: {championData.stats.hp}</li>
        <li>MP: {championData.stats.mp}</li>
        <li>Attack Damage: {championData.stats.attackdamage}</li>
        <li>Armor: {championData.stats.armor}</li>
        <li>Spell Block: {championData.stats.spellblock}</li>
        <li>Attack Speed: {championData.stats.attackspeed}</li>
        <li>Movement Speed: {championData.stats.movespeed}</li>
        <li>Attack Range: {championData.stats.attackrange}</li>
      </ul>
      <h3>Skills</h3>
      <ul>
        {championData.spells.map((spell, index) => (
          <li key={index}>
            <h4>{spell.name}</h4>
            <p>{spell.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChampionDetail;
