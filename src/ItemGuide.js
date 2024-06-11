import React, { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import itemsData from './items.json'; // 아이템 데이터를 가져옵니다.

function ItemGuide() {
  const [itemData, setItemData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const itemsRef = ref(storage, "item/");
      try {
        const itemRefs = await listAll(itemsRef);
        const urls = await Promise.all(
          itemRefs.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const id = itemRef.name.replace(".png", "");
            const item = itemsData.data[id];
            if (item) {
              return { 
                url, 
                id, 
                name: item.name 
              };
            } else {
              return null; // JSON에 없는 아이템은 null로 반환
            }
          })
        );

        // null 값 필터링 및 아이템 이름으로 정렬
        const filteredUrls = urls.filter(url => url !== null);
        filteredUrls.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

        setItemData(filteredUrls);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  const filteredItems = itemData.filter((item) =>
    item.name.includes(searchTerm)
  );

  return (
    <div>
      <h2>아이템 가이드</h2>
      <input
        type="text"
        placeholder="아이템 이름으로 검색"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredItems.map((item, index) => (
          <div key={index} style={{ margin: "10px", cursor: "pointer" }} onClick={() => handleItemClick(item.id)}>
            <img
              src={item.url}
              alt={item.name}
              style={{ width: "200px" }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemGuide;
