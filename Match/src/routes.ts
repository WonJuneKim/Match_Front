import React from 'react';

const Home = React.lazy(() => import('@/pages/home/Home.tsx'));
// const Login = React.lazy(() => import('./pages/Login'));
const SignIn = React.lazy(() => import('./pages/signIn/SignIn.tsx'));
const Favorites = React.lazy(() => import('@/pages/favorites/Favorites.tsx'));
const Archive = React.lazy(() => import('@/pages/archive/Archive.tsx'));
const Ranking = React.lazy(() => import('./pages/ranking/Ranking.tsx'));
const NearBy = React.lazy(() => import('./pages/nearBy/NearBy.tsx'));
const Login = React.lazy(() => import('./pages/login/Login.tsx'));
const Mypage = React.lazy(() => import('./pages/myPage/MyPage.tsx'));
const Block = React.lazy(() => import('./pages/block/Block.tsx'));
const Graph = React.lazy(() => import('./pages/graph/Graph.tsx'));
const PlaceMatch = React.lazy(
  () => import('./pages/placeMatches/PlaceMatch.tsx'),
);
const MatchPageDetail = React.lazy(
  () => import('./pages/matchDetail/MatchDetail.tsx'),
);
const routes = [
  {path: '/', element: Home},
  {path: '/login', element: Login},
  {path: '/signin', element: SignIn},
  {path: '/favorites', element: Favorites},
  {path: '/archive', element: Archive},
  {path: '/ranking', element: Ranking},
  {path: '/nearby', element: NearBy},
  {path: '/block', element: Block},
  {path: '/mypage', element: Mypage},
  {path: '/graph', element: Graph},
  {path: 'places/:placeId/matches', element: PlaceMatch},
  {path: 'match/detail/:matchId', element: MatchPageDetail},
];

export default routes;
