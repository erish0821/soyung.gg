import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import itemsData from "./items.json";

function ItemDetail() {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchItemData = async () => {
      const item = itemsData.data[id];
      if (item) {
        setItemData(item);
      } else {
        console.log("No such item!");
      }
    };

    fetchItemData();
  }, [id]);

  useEffect(() => {
    if (itemData) {
      const fetchImageUrl = async () => {
        const imageName = `${id}.png`; // 파일명은 ID 기반으로 설정
        const imageRef = ref(storage, `item/${imageName}`);
        try {
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      };

      fetchImageUrl();
    }
  }, [itemData, id]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{itemData.name}</h2>
      <p>{itemData.plaintext}</p> {/* plaintext를 출력합니다 */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={itemData.name}
        />
      )}
      <h3>Stats</h3>
      <ul>
        {itemData.stats && Object.entries(itemData.stats).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <h3>Other Information</h3>
      <ul>
        <li>Gold Cost: {itemData.gold.total}</li>
        <li>Sell Value: {itemData.gold.sell}</li>
        {/* 다른 필요한 정보들도 추가 가능 */}
      </ul>
    </div>
  );
}

export default ItemDetail;
