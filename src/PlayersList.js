// PlayersList.js
import { Grid } from '@mui/material';
import { styled } from '@mui/system';
import PlayerCard from './PlayerCard';

const StyledDiv = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

// 포지션 순서
const positions = ['FW', 'MF', 'DF', 'GK'];

function PlayersList({ players }) {
  // 포지션별로 선수 데이터 정렬
  const sortedPlayers = players.sort((a, b) => {
    return positions.indexOf(a.position) - positions.indexOf(b.position);
  });

  return (
    <StyledDiv>
      <Grid container spacing={3}>
        {sortedPlayers.map((player, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <PlayerCard player={player} />
          </Grid>
        ))}
      </Grid>
    </StyledDiv>
  );
}




export default PlayersList;
