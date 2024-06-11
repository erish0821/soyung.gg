export const fetchMatchHistory = async (summonerNameTag) => {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const riotApiUrl = 'https://asia.api.riotgames.com';
    const apiKey = 'RGAPI-a4dc668a-0e92-45eb-a779-decb2ace960b';
    const [summonerName, tagLine] = summonerNameTag.split("#");
  
    if (!summonerName || !tagLine) {
      alert("Invalid format. Please use the format: name#tag");
      return;
    }
  
    try {
      const puuidResponse = await fetch(
        `${proxyUrl}${encodeURIComponent(`${riotApiUrl}/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagLine}?api_key=${apiKey}`)}`
      );
      const puuidData = await puuidResponse.json();
      if (puuidResponse.ok) {
        const matchesResponse = await fetch(
          `${proxyUrl}${encodeURIComponent(`${riotApiUrl}/lol/match/v5/matches/by-puuid/${puuidData.puuid}/ids?start=0&count=10&api_key=${apiKey}`)}`
        );
        const matchesData = await matchesResponse.json();
  
        if (matchesResponse.ok && Array.isArray(matchesData)) {
          return { puuid: puuidData.puuid, matches: matchesData };
        } else {
          throw new Error("Invalid match data");
        }
      } else {
        throw new Error("Invalid summoner data");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data");
      return { puuid: null, matches: [] };
    }
  };
  
  export const fetchMatchDetails = async (matchId) => {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const riotApiUrl = 'https://asia.api.riotgames.com';
    const apiKey = 'RGAPI-a4dc668a-0e92-45eb-a779-decb2ace960b';
  
    try {
      const response = await fetch(
        `${proxyUrl}${encodeURIComponent(`${riotApiUrl}/lol/match/v5/matches/${matchId}?api_key=${apiKey}`)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch match details");
    }
  };
  