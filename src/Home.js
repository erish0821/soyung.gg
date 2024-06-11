// src/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { fetchMatchHistory, fetchMatchDetails } from "./api";
import MatchDetails from "./MatchDetails";
import championsData from "./champions.json";

const getChampionName = (championKey) => {
  const champion = Object.values(championsData.data).find(champ => champ.key === championKey);
  return champion ? champion.name : null;
};

const Home = () => {
  const [summonerNameTag, setSummonerNameTag] = useState("");
  const [puuid, setPuuid] = useState("");
  const [matchHistory, setMatchHistory] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const handleFetchMatchHistory = async () => {
    const { puuid, matches } = await fetchMatchHistory(summonerNameTag);
    setPuuid(puuid);
    setMatchHistory(matches);
  };

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(prevMatchId => (prevMatchId === matchId ? null : matchId));
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          전적 검색
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="소환사 이름#태그"
              variant="outlined"
              value={summonerNameTag}
              onChange={(e) => setSummonerNameTag(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant="contained" color="primary" onClick={handleFetchMatchHistory}>
              전적 검색
            </Button>
          </Grid>
        </Grid>
      </Box>
      <MatchHistoryList
        matchHistory={matchHistory}
        selectedMatchId={selectedMatchId}
        onSelectMatch={handleSelectMatch}
        puuid={puuid}
      />
    </Container>
  );
};

const MatchHistoryList = ({ matchHistory, selectedMatchId, onSelectMatch, puuid }) => (
  <Box>
    <Typography variant="h5" gutterBottom>
      최근 전적
    </Typography>
    {matchHistory.map((matchId) => (
      <MatchSummary
        key={matchId}
        matchId={matchId}
        isSelected={matchId === selectedMatchId}
        onSelect={() => onSelectMatch(matchId)}
        puuid={puuid}
      />
    ))}
  </Box>
);

const MatchSummary = ({ matchId, isSelected, onSelect, puuid }) => {
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    const getMatchInfo = async () => {
      try {
        const data = await fetchMatchDetails(matchId);
        const participant = data.info.participants.find(p => p.puuid === puuid);
        const team = data.info.teams.find(t => t.teamId === participant.teamId);
        setMatchInfo({
          champion: participant.championName,
          championId: participant.championId,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          win: team.win
        });
      } catch (error) {
        console.error(error);
      }
    };

    getMatchInfo();
  }, [matchId, puuid]);

  const championName = matchInfo ? getChampionName(matchInfo.championId.toString()) : null;

  return (
    <Box mb={2} p={2} border={1} onClick={onSelect}>
      {matchInfo ? (
        <>
          <Typography variant="h6">{matchInfo.win ? "Win" : "Loss"}</Typography>
          <Typography variant="body1">{championName}</Typography>
          <Typography variant="body2">K/D/A: {matchInfo.kills}/{matchInfo.deaths}/{matchInfo.assists}</Typography>
        </>
      ) : (
        <Typography variant="body2">Loading...</Typography>
      )}
      <span>{isSelected ? "▼" : "▶"}</span>
      {isSelected && <MatchDetails matchId={matchId} />}
    </Box>
  );
};

export default Home;
