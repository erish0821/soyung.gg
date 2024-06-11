// src/MatchDetails.js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchMatchDetails } from "./api";
import championsData from "./champions.json";

const getChampionImage = (championKey) => {
  const champion = Object.values(championsData.data).find(champ => champ.key === championKey);
  return champion ? champion.image.full : null;
};

const getChampionName = (championKey) => {
  const champion = Object.values(championsData.data).find(champ => champ.key === championKey);
  return champion ? champion.name : null;
};

const getItemImage = (itemId) => {
  return itemId ? `https://firebasestorage.googleapis.com/v0/b/soyung-gg.appspot.com/o/item%2F${itemId}.png?alt=media` : null;
};

const MatchDetails = ({ matchId }) => {
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMatchDetails = async () => {
      try {
        const data = await fetchMatchDetails(matchId);
        setMatchDetails(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getMatchDetails();
  }, [matchId]);

  if (loading) {
    return <div className="loading">Loading match details...</div>;
  }

  if (!matchDetails) {
    return <div className="loading">Failed to load match details.</div>;
  }

  const gameDurationMinutes = Math.floor(matchDetails.info.gameDuration / 60);
  const teams = matchDetails.info.teams;
  const participants = matchDetails.info.participants;

  const team1 = teams.find(team => team.teamId === 100);
  const team2 = teams.find(team => team.teamId === 200);
  const team1Players = participants.filter(player => player.teamId === team1.teamId);
  const team2Players = participants.filter(player => player.teamId === team2.teamId);

  return (
    <div className="match-details">
      <h2>Match ID: {matchId}</h2>
      <p><strong>Game Duration:</strong> {gameDurationMinutes} minutes</p>
      <div className="teams-horizontal">
        <div className="team team1">
          <h3>Red Team {team2.win ? "(Winner)" : ""}</h3>
          <ul>
            {team2Players.map(player => {
              const championImage = getChampionImage(player.championId.toString());
              const championName = getChampionName(player.championId.toString());
              return (
                <li key={player.summonerName} className="participant">
                  {championImage && (
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/soyung-gg.appspot.com/o/champion%2F${championImage}?alt=media`}
                      alt={championName}
                      className="champion-icon"
                    />
                  )}
                  <div className="participant-info">
                    <strong>{player.summonerName}</strong> - {championName}
                    <ul>
                      <li><strong>Kills:</strong> {player.kills}</li>
                      <li><strong>Deaths:</strong> {player.deaths}</li>
                      <li><strong>Assists:</strong> {player.assists}</li>
                      <li><strong>Items:</strong>
                        <div className="items">
                          {player.item0 > 0 && <img src={getItemImage(player.item0)} alt={`Item ${player.item0}`} />}
                          {player.item1 > 0 && <img src={getItemImage(player.item1)} alt={`Item ${player.item1}`} />}
                          {player.item2 > 0 && <img src={getItemImage(player.item2)} alt={`Item ${player.item2}`} />}
                          {player.item3 > 0 && <img src={getItemImage(player.item3)} alt={`Item ${player.item3}`} />}
                          {player.item4 > 0 && <img src={getItemImage(player.item4)} alt={`Item ${player.item4}`} />}
                          {player.item5 > 0 && <img src={getItemImage(player.item5)} alt={`Item ${player.item5}`} />}
                          {player.item6 > 0 && <img src={getItemImage(player.item6)} alt={`Item ${player.item6}`} />}
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="team team2">
          <h3>Blue Team {team1.win ? "(Winner)" : ""}</h3>
          <ul>
            {team1Players.map(player => {
              const championImage = getChampionImage(player.championId.toString());
              const championName = getChampionName(player.championId.toString());
              return (
                <li key={player.summonerName} className="participant">
                  {championImage && (
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/soyung-gg.appspot.com/o/champion%2F${championImage}?alt=media`}
                      alt={championName}
                      className="champion-icon"
                    />
                  )}
                  <div className="participant-info">
                    <strong>{player.summonerName}</strong> - {championName}
                    <ul>
                      <li><strong>Kills:</strong> {player.kills}</li>
                      <li><strong>Deaths:</strong> {player.deaths}</li>
                      <li><strong>Assists:</strong> {player.assists}</li>
                      <li><strong>Items:</strong>
                        <div className="items">
                          {player.item0 > 0 && <img src={getItemImage(player.item0)} alt={`Item ${player.item0}`} />}
                          {player.item1 > 0 && <img src={getItemImage(player.item1)} alt={`Item ${player.item1}`} />}
                          {player.item2 > 0 && <img src={getItemImage(player.item2)} alt={`Item ${player.item2}`} />}
                          {player.item3 > 0 && <img src={getItemImage(player.item3)} alt={`Item ${player.item3}`} />}
                          {player.item4 > 0 && <img src={getItemImage(player.item4)} alt={`Item ${player.item4}`} />}
                          {player.item5 > 0 && <img src={getItemImage(player.item5)} alt={`Item ${player.item5}`} />}
                          {player.item6 > 0 && <img src={getItemImage(player.item6)} alt={`Item ${player.item6}`} />}
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

MatchDetails.propTypes = {
  matchId: PropTypes.string.isRequired,
};

export default MatchDetails;
