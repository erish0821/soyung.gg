import React, { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import championsData from './champions.json'; // 챔피언 데이터를 가져옵니다.

function ImageGallery() {
  const [imageData, setImageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const imagesRef = ref(storage, "champion/");
      try {
        const imageRefs = await listAll(imagesRef);
        const urls = await Promise.all(
          imageRefs.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const name = itemRef.name.replace(".png", "");
            const champion = championsData.data[name];
            return { 
              url, 
              name, 
              title: champion ? champion.title : "", 
              tags: champion ? champion.tags : [] 
            };
          })
        );

        // 한글 가나다 순으로 정렬
        urls.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

        setImageData(urls);
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };

    fetchImages();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageClick = (name) => {
    navigate(`/champion/${name}`);
  };

  const filteredImages = imageData.filter((image) =>
    image.name.includes(searchTerm) ||
    image.title.includes(searchTerm) ||
    image.tags.some(tag => tag.includes(searchTerm))
  );

  return (
    <div>
      <h2>Image Gallery</h2>
      <input
        type="text"
        placeholder="Search by name, title or tag"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredImages.map((image, index) => (
          <div key={index} style={{ margin: "10px", cursor: "pointer" }} onClick={() => handleImageClick(image.name)}>
            <img
              src={image.url}
              alt={image.name}
              style={{ width: "200px" }}
            />
            <p>{image.name} ({image.title})</p>
            <p>{image.tags.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
