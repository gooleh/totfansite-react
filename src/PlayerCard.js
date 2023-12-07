import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundImage: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)',  // 토트넘스러운 색상의 그라디언트 적용
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '320px',
  objectFit: 'cover',
});

const StyledLink = styled(Link)({
  textDecoration: 'none',  // 밑줄 제거
  color: 'inherit',  // 부모 요소의 글자색을 상속
});

function PlayerCard({ player }) {
  return (
    <StyledLink to={`/players/${player.id}`}>
      <StyledPaper>
        <StyledImage src={player.image} alt={player.name} />
        <Typography variant="h6" component="h3">{player.name}</Typography>
        <Typography color="textSecondary">{player.position}</Typography>
      </StyledPaper>
    </StyledLink>
  );
}


export default PlayerCard;

