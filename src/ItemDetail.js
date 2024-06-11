import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import itemsData from "./items.json";

function ItemDetail() {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [subItems, setSubItems] = useState([]);

  useEffect(() => {
    const fetchItemData = async () => {
      const item = itemsData.data[id];
      if (item) {
        setItemData(item);
        if (item.from) {
          const subItemPromises = item.from.map(async (subItemId) => {
            const subItem = itemsData.data[subItemId];
            const imageRef = ref(storage, `item/${subItem.image.full}`);
            const url = await getDownloadURL(imageRef);
            return { ...subItem, imageUrl: url, id: subItemId };
          });
          const subItemDetails = await Promise.all(subItemPromises);
          setSubItems(subItemDetails);
        }
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
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '20px' }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={itemData.name}
          style={{ width: '150px', height: 'auto', borderRadius: '8px', marginRight: '20px' }}
        />
      )}
      <div>
        <h2>{itemData.name}</h2>
        <p>{itemData.plaintext}</p> {/* plaintext를 출력합니다 */}
        <h3>Stats</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {itemData.stats && Object.entries(itemData.stats).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
        <h3>Other Information</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>Gold Cost: {itemData.gold.total}</li>
          <li>Sell Value: {itemData.gold.sell}</li>
          {/* 다른 필요한 정보들도 추가 가능 */}
        </ul>
        {subItems.length > 0 && (
          <>
            <h3>하위 아이템</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {subItems.map(subItem => (
                <div key={subItem.id} style={{ textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', width: '100px' }}>
                  <img
                    src={subItem.imageUrl}
                    alt={subItem.name}
                    style={{ width: '50px', height: 'auto', borderRadius: '8px' }}
                  />
                  <p style={{ fontSize: '12px' }}>{subItem.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
