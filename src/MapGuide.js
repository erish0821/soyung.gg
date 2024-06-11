import React, { useState, useEffect } from "react";
import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import { Box, Paper, Typography } from '@mui/material';

const locations = [
  { name: "탑", x: 15, y: 15, description: "This is location 1" },
  { name: "유충, 전령, 바론", x: 33.5, y: 29, description: "This is location 2" },
  { name: "고대 돌거북 & 돌거북", x: 43.5, y: 17, description: "큰 몬스터인 고대 돌거북은 잡은 챔피언의 체력과 마나를 소량 회복시킨다. 죽이면 고대 돌거북은 돌거북 2마리로, 돌거북은 작은 돌거북 2마리로 분열한다." },
  { name: "핏빛 칼날부리 & 칼날부리", x: 52.8, y: 35, description: "크기가 큰 대형 몬스터인 핏빛 칼날부리는 '재생의 문장'을 가져서 처치한 챔피언의 체력과 마나를 소량 회복시킨다." },
  { name: "큰 어스름 늑대 & 어스름 늑대", x: 75, y: 43.3, description: "머리가 두 개 달린 큰 어스름 늑대는 잡은 챔피언의 체력과 마나를 소량 회복시킨다." },
  { name: "푸른 파수꾼", x: 75.3, y: 53.1, description: "푸른 파수꾼을 처치 시 스킬 가속 +10, 초당 5와 최대 마나의 1%만큼의 마나 재생, 기력 챔피언의 경우 초당 5와 최대 기력의 1%만큼의 기력 재생을 주는 '통찰력의 문장'을 보상으로 획득한다. " },
  { name: "심술 두꺼비", x: 85.3, y: 56.3, description: "심술 두꺼비를 처치하면 체력 회복과 함께 챔피언 고유 자원이 일부 회복된다." },
  { name: "미드", x: 49.5, y: 50, description: "This is location 8" },
  { name: "바텀", x: 85, y: 85, description: "This is location 9" },
  { name: "핏빛 칼날부리 & 칼날부리", x: 47.8, y: 64.2, description: "크기가 큰 대형 몬스터인 핏빛 칼날부리는 '재생의 문장'을 가져서 처치한 챔피언의 체력과 마나를 소량 회복시킨다." },
  { name: "붉은 덩굴정령", x: 48.2, y: 26, description: "붉은 덩굴정령을 처치 시 포탑, 에픽 몬스터, 챔피언과 전투 중이 아닐 때 5초당 최대 체력의 1/3/9%(1/6/11레벨)만큼 회복, 건물을 제외한 유닛을 기본 공격 시 레벨에 따라 3초 동안 12 ~ 114의 고정 피해와 10/15/25%의 둔화를 입히는 '잉걸불의 문장'을 보상으로 획득한다." },
  { name: "붉은 덩굴정령", x: 52.2, y: 73.5, description: "붉은 덩굴정령을 처치 시 포탑, 에픽 몬스터, 챔피언과 전투 중이 아닐 때 5초당 최대 체력의 1/3/9%(1/6/11레벨)만큼 회복, 건물을 제외한 유닛을 기본 공격 시 레벨에 따라 3초 동안 12 ~ 114의 고정 피해와 10/15/25%의 둔화를 입히는 '잉걸불의 문장'을 보상으로 획득한다." },
  { name: "고대 돌거북 & 돌거북", x: 57, y: 82.7, description: "큰 몬스터인 고대 돌거북은 잡은 챔피언의 체력과 마나를 소량 회복시킨다. 죽이면 고대 돌거북은 돌거북 2마리로, 돌거북은 작은 돌거북 2마리로 분열한다." },
  { name: "큰 어스름 늑대 & 어스름 늑대", x: 25.5, y: 56, description: "머리가 두 개 달린 큰 어스름 늑대는 잡은 챔피언의 체력과 마나를 소량 회복시킨다." },
  { name: "드래곤", x: 67.3, y: 69.9, description: "This is location 15" },
  { name: "푸른 파수꾼", x: 25.5, y: 46, description: "푸른 파수꾼을 처치 시 스킬 가속 +10, 초당 5와 최대 마나의 1%만큼의 마나 재생, 기력 챔피언의 경우 초당 5와 최대 기력의 1%만큼의 기력 재생을 주는 '통찰력의 문장'을 보상으로 획득한다. 6" },
  { name: "심술 두꺼비", x: 15.3, y: 42.8, description: "심술 두꺼비를 처치하면 체력 회복과 함께 챔피언 고유 자원이 일부 회복된다." },
  { name: "협곡 바위 게", x: 30, y: 35, description: "협곡 바위게를 처치 시 강쪽 시야를 장악할 수 있다." },
  { name: "협곡 바위 게", x: 70, y: 63, description: "협곡 바위게를 처치 시 강쪽 시야를 장악할 수 있다." }
];

function MapGuide() {
  const [mapImageUrl, setMapImageUrl] = useState("");
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [locationImages, setLocationImages] = useState({});

  useEffect(() => {
    const fetchMapImage = async () => {
      const mapRef = ref(storage, "map/map11.png");
      try {
        const url = await getDownloadURL(mapRef);
        setMapImageUrl(url);
      } catch (error) {
        console.error("Error fetching map image: ", error);
      }
    };

    const fetchLocationImages = async () => {
      const newLocationImages = {};
      for (const location of locations) {
        const imageRef = ref(storage, `monster/${location.name}.jpg`);
        try {
          const url = await getDownloadURL(imageRef);
          newLocationImages[location.name] = url;
        } catch (error) {
          console.error(`Error fetching image for ${location.name}: `, error);
        }
      }
      setLocationImages(newLocationImages);
    };

    fetchMapImage();
    fetchLocationImages();
  }, []);

  const handleMouseOver = (location) => {
    setHoveredLocation(location);
  };

  const handleMouseOut = () => {
    setHoveredLocation(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        맵 가이드
      </Typography>
      <div className="map-guide-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div className="map-container" style={{ position: 'relative', width: '50%', marginRight: '16px' }}>
          {mapImageUrl && (
            <img
              src={mapImageUrl}
              alt="Map Guide"
              className="map-image"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }} // 테두리 둥글게 설정
            />
          )}
          {locations.map((location, index) => (
            <div
              key={index}
              className="map-location"
              style={{
                position: 'absolute',
                left: `${location.x}%`,
                top: `${location.y}%`,
                width: '30px',
                height: '30px',
                transform: 'translate(-50%, -50%)',
              }}
              onMouseOver={() => handleMouseOver(location)}
              onMouseOut={handleMouseOut}
            >
              {locationImages[location.name] ? (
                <img
                  src={locationImages[location.name]}
                  alt={location.name}
                  className="location-icon"
                  style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    borderRadius: ["탑", "미드", "바텀"].includes(location.name) ? "0" : "50%"
                  }}
                />
              ) : (
                <div
                  className="location-placeholder"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red',
                    pointerEvents: 'none',
                    borderRadius: ["탑", "미드", "바텀"].includes(location.name) ? "0" : "50%"
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {hoveredLocation && (
          <Paper elevation={3} style={{ padding: '10px', border: '1px solid #ccc', width: '200px', backgroundColor: 'white', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>
              {hoveredLocation.name}
            </Typography>
            <Typography variant="body2">
              {hoveredLocation.description}
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
}

export default MapGuide;
