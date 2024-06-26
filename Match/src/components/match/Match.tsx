import {useState} from 'react';
import {useQuery} from 'react-query';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import {MatchListState, SelectedDateState} from '@/recoil/match/States';
import * as L from './Styles';
import MatchStatus from './matchstatus/MatchStatus';
import {fetchMatches} from '@/apis/apis';

const Match = () => {
  const matches = useRecoilValue(MatchListState);
  const setMatches = useSetRecoilState(MatchListState);
  const selectedDate = useRecoilValue(SelectedDateState);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const take = 5; // 한 페이지에 나올 항목의 수

  useQuery(
    ['matches', page, selectedDate],
    () => fetchMatches(page, take, format(selectedDate, 'yyyy-MM-dd')),
    {
      keepPreviousData: true,
      onSuccess: data => {
        setMatches(data);
      },
    },
  );

  const handleStatusClick = (matchId: number) => {
    navigate(`/match/detail/${matchId}`);
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <L.ListContainer>
      {matches.map(m => (
        <L.MatchItem key={m.matchId}>
          <L.TimeWrap>{m.time}</L.TimeWrap>
          <L.TitleWrap>
            <L.LocationWrap>{m.name}</L.LocationWrap>
            <L.TextWrap>{m.type}</L.TextWrap>
          </L.TitleWrap>
          <MatchStatus
            status={m.status as '신청' | '마감 임박' | '마감'}
            onClick={() => handleStatusClick(m.matchId)}
          />
        </L.MatchItem>
      ))}
      <L.PaginationWrap>
        <L.Pagination>
          <L.PaginationButton
            onClick={handlePreviousPage}
            disabled={page === 0}
          >
            이전
          </L.PaginationButton>
          <L.PageNumber>{page + 1}</L.PageNumber>
          <L.PaginationButton onClick={handleNextPage}>다음</L.PaginationButton>
        </L.Pagination>
      </L.PaginationWrap>
    </L.ListContainer>
  );
};

export default Match;
