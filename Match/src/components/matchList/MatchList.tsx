import React, {useState, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {
  gameDataState,
  selectedQuarterState,
  selectedTeamState,
} from '@/recoil/matchlist/States';
import * as S from './Styles';
import POMImage from '@/assets/POM 😎.png';
import Red2Image from '@/assets/red_2.png';
import GreenImage from '@/assets/green.png';
import BlueImage from '@/assets/blue.png';
import GoalImage from '@/assets/goal.png';
import AssistImage from '@/assets/assist.png';
import DefenseImage from '@/assets/defense.png';
import {GameData} from '@/recoil/matchlist/Types';

const getTeamImage = (team: string) => {
  switch (team) {
    case 'RED':
      return Red2Image;
    case 'GREEN':
      return GreenImage;
    case 'BLUE':
      return BlueImage;
    default:
      return '';
  }
};

const MatchList: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/graph');
  };
  const [gameData, setGameData] = useRecoilState<GameData[]>(gameDataState);
  const [selectedQuarter, setSelectedQuarter] =
    useRecoilState(selectedQuarterState);
  const [selectedTeam, setSelectedTeam] = useRecoilState(selectedTeamState);
  const [dropdownOpen, setDropdownOpen] = useState<{[key: number]: boolean}>(
    {},
  );

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get('https://kusitms28.store/api/record?userId=2')
      .then(response => {
        if (response.data.code === '200' && response.data.isSuccess) {
          const {data} = response.data;
          setGameData(data);
          if (data.length > 0) {
            setSelectedQuarter(data[0].quarterRecords[0].quarter); // 처음 1쿼터 자동 선택
          }
        }
      })
      .catch(error => {
        console.error('Error fetching game data:', error);
      });
  }, [setGameData, setSelectedQuarter]);

  const handleQuarterChange = (quarter: string) => {
    setSelectedQuarter(quarter);
  };

  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
  };

  const handlePlayerSelect = (userId: number) => {
    setSelectedPlayer(userId);
  };

  const toggleDropdown = (index: number) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const blockUser = () => {
    if (selectedPlayer !== null) {
      axios
        .post(
          `https://kusitms28.store/users/2/blocks?blockedUserId=${selectedPlayer}`,
        )
        .then(response => {
          console.log('User blocked successfully:', response.data);
        })
        .catch(error => {
          console.error('Error blocking user:', error);
        });
    }
  };

  return (
    <S.AppContainer>
      <S.GraphButton onClick={handleNavigate}>그래프</S.GraphButton>
      {gameData.length > 0 &&
        gameData.map((game, index) => (
          <div key={index}>
            <S.GameInfo
              isWin={game.isWin}
              onClick={() => toggleDropdown(index)}
            >
              <S.InfoWrap>
                <S.InfoItem>
                  <S.DateValue>{game.date}</S.DateValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.PlaceValue>{game.place}</S.PlaceValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.TypeValue>{game.type}</S.TypeValue>
                </S.InfoItem>
              </S.InfoWrap>
              <S.ImgWrap>
                {game.isPom && <S.POM src={POMImage} alt='POM' />}
                <S.PointValue>
                  {game.point > 0 ? `+${game.point}P` : `${game.point}P`}
                </S.PointValue>
              </S.ImgWrap>
              <S.NumberColorImage src={Red2Image} alt='RED 2' />
            </S.GameInfo>

            {dropdownOpen[index] && (
              <>
                <S.QuarterButtonContainer>
                  {game.quarterRecords.map(record => (
                    <S.QuarterButton
                      key={record.quarter}
                      onClick={() => handleQuarterChange(record.quarter)}
                      active={selectedQuarter === record.quarter}
                    >
                      {record.quarter}
                    </S.QuarterButton>
                  ))}
                </S.QuarterButtonContainer>

                {selectedQuarter && (
                  <S.QuarterInfo>
                    {game.quarterRecords
                      .filter(record => record.quarter === selectedQuarter)
                      .map(record => (
                        <div key={record.quarter}>
                          <S.UpperContainer>
                            <S.ScoreContainer>
                              <S.TeamScore>
                                <img
                                  src={getTeamImage(record.team1)}
                                  alt={record.team1}
                                />
                                <S.Score>{record.team1Goal}</S.Score>
                                <S.Score>:</S.Score>
                                <S.Score>{record.team2Goal}</S.Score>
                                <img
                                  src={getTeamImage(record.team2)}
                                  alt={record.team2}
                                />
                              </S.TeamScore>
                            </S.ScoreContainer>
                            <S.TeamContainer>
                              <S.Team>
                                {record.team1Record.map(player => (
                                  <S.PlayerStats key={player.num} active>
                                    <img
                                      src={getTeamImage(record.team1)}
                                      alt={record.team1}
                                    />
                                    <p>{player.goal}</p>
                                    <img src={GoalImage} alt='Goal' />
                                    <p>{player.assist}</p>
                                    <img src={AssistImage} alt='Assist' />
                                    <p>{player.defense}</p>
                                    <img src={DefenseImage} alt='Defense' />
                                  </S.PlayerStats>
                                ))}
                              </S.Team>
                              <S.Team>
                                {record.team2Record.map(player => (
                                  <S.PlayerStats key={player.num} active>
                                    <img
                                      src={getTeamImage(record.team2)}
                                      alt={record.team2}
                                    />
                                    <p>{player.goal}</p>
                                    <img src={GoalImage} alt='Goal' />
                                    <p>{player.assist}</p>
                                    <img src={AssistImage} alt='Assist' />
                                    <p>{player.defense}</p>
                                    <img src={DefenseImage} alt='Defense' />
                                  </S.PlayerStats>
                                ))}
                              </S.Team>
                            </S.TeamContainer>
                          </S.UpperContainer>
                        </div>
                      ))}
                  </S.QuarterInfo>
                )}

                <S.TeamButtonContainer>
                  <S.TeamButton
                    onClick={() => handleTeamChange('RED')}
                    active={selectedTeam === 'RED'}
                  >
                    레드팀
                  </S.TeamButton>
                  <S.TeamButton
                    onClick={() => handleTeamChange('GREEN')}
                    active={selectedTeam === 'GREEN'}
                  >
                    그린팀
                  </S.TeamButton>
                  <S.TeamButton
                    onClick={() => handleTeamChange('BLUE')}
                    active={selectedTeam === 'BLUE'}
                  >
                    블루팀
                  </S.TeamButton>
                </S.TeamButtonContainer>

                {selectedTeam === 'RED' && (
                  <S.TeamInfo>
                    {game.redTeam.map(player => (
                      <S.PlayerStats
                        key={player.userId}
                        onClick={() => handlePlayerSelect(player.userId)}
                        active={selectedPlayer === player.userId}
                      >
                        <S.PlayerSelectButton
                          active={selectedPlayer === player.userId}
                        />
                        <img
                          src={getTeamImage(player.color)}
                          alt={player.color}
                        />
                        <p>{player.name}</p>
                        <p>{player.age}세</p>
                        <p>{player.location}</p>
                      </S.PlayerStats>
                    ))}
                  </S.TeamInfo>
                )}
                {selectedTeam === 'GREEN' && (
                  <S.TeamInfo>
                    {game.greenTeam.map(player => (
                      <S.PlayerStats
                        key={player.userId}
                        onClick={() => handlePlayerSelect(player.userId)}
                        active={selectedPlayer === player.userId}
                      >
                        <S.PlayerSelectButton
                          active={selectedPlayer === player.userId}
                        />
                        <img
                          src={getTeamImage(player.color)}
                          alt={player.color}
                        />
                        <p>{player.name}</p>
                        <p>{player.age}세</p>
                        <p>{player.location}</p>
                      </S.PlayerStats>
                    ))}
                  </S.TeamInfo>
                )}
                {selectedTeam === 'BLUE' && (
                  <S.TeamInfo>
                    {game.blueTeam.map(player => (
                      <S.PlayerStats
                        key={player.userId}
                        onClick={() => handlePlayerSelect(player.userId)}
                        active={selectedPlayer === player.userId}
                      >
                        <S.PlayerSelectButton
                          active={selectedPlayer === player.userId}
                        />
                        <img
                          src={getTeamImage(player.color)}
                          alt={player.color}
                        />
                        <p>{player.name}</p>
                        <p>{player.age}세</p>
                        <p>{player.location}</p>
                      </S.PlayerStats>
                    ))}
                  </S.TeamInfo>
                )}

                <S.BlockButton onClick={blockUser}>차단하기</S.BlockButton>
              </>
            )}
          </div>
        ))}
    </S.AppContainer>
  );
};

export default MatchList;
