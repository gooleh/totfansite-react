import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardMedia, Typography, Container,Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(8),
  width: '90%', // 카드의 너비를 90%로 설정
}));

  
const StyledCardMedia = styled(CardMedia)({
  height: '0px',
  paddingTop: '56.25%', // 16:9
  transition: 'transform 0.3s', // 애니메이션 속성 추가
  '&:hover': {
    transform: 'scale(1.03)', // 호버했을 때 스케일이 커지도록 설정
  },
});

  function PlayerDetail() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
  
    useEffect(() => {
      const fetchPlayer = async () => {
        try {
          const db = getFirestore();
          const playerDoc = await getDoc(doc(db, 'players', id));
          if (playerDoc.exists()) {
            setPlayer({ ...playerDoc.data(), id: playerDoc.id });
          } else {
            console.log('No such player!');
          }
        } catch (error) {
          console.error('Failed to fetch player', error);
        }
      };
  
      fetchPlayer();
    }, [id]);
  
    if (!player) return 'Loading...';
  
    return (
      <Box sx={{ background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)' }}> {/* 그라디언트 배경 설정 */}
        <Container maxWidth="lg">
          <StyledCard>
            <StyledCardMedia
              image={player.image}
              title={player.name}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {player.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Position: {player.position}
              </Typography>
              <Typography variant="body3" color="text.secondary">
                {player.content1}
              </Typography>
              <StyledCardMedia
                image = {player.image1}
                />
             <Typography variant="body3" color="text.secondary">
                {player.content2}
                </Typography>
                <StyledCardMedia
                image = {player.image2}
                />
             <Typography variant="body3" color="text.secondary">

                {player.content3}
                {player.content4}
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    );
  }

export default PlayerDetail;
