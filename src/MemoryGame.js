import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';
import { Card as MUICard, CardMedia, Grid } from '@mui/material';
import { styled } from '@mui/system';

const CardBack = styled('div')(({ theme }) => ({
  width: '100%',
  height: 0,
  paddingBottom: '100%',
  backgroundColor: theme.palette.grey[300],
}));

function Card({ card, onCardClick }) {
  return (
    <Grid item xs={2}>
      <MUICard 
        sx={{ 
          width: 300, // 카드의 너비를 200px로 고정
          height: 300, // 카드의 높이를 300px로 고정
        }}
        onClick={() => onCardClick(card)}
      >
        {card.isFlipped
          ? <CardMedia 
              component="img" 
              image={card.image} 
              alt={card.name} 
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          : <CardBack />
        }
      </MUICard>
    </Grid>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);

    const fetchCards = async () => {
      const playersCollection = collection(db, 'players');
      const playerSnapshot = await getDocs(playersCollection);
      const playerData = playerSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      const randomPlayerData = shuffleArray(playerData).slice(0, 9);
      const randomCards = shuffleArray([...randomPlayerData, ...randomPlayerData]);
      
      setCards(randomCards.map(card => ({ ...card, isFlipped: true, isMatched: false })));

      const timer = setTimeout(() => {
        setCards(currentCards => currentCards.map(card => ({ ...card, isFlipped: false })));
        setGameStarted(true);
      }, 5000);
  
      return () => clearTimeout(timer);
    };
  
    fetchCards();
  }, []);

  useEffect(() => {
    const matchedCards = cards.filter(card => card.isMatched).length;
    if (matchedCards === Math.floor(cards.length) && !gameOver && gameStarted) {
      setGameOver(true);
      alert('게임이 끝났습니다!');
      alert('9000포인트가 지급됩니다.');

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              updateDoc(userRef, {
                points: userData.points + points,
              });
            }
          });
      }
    }
  }, [cards, gameStarted, user, points]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  const handleFlip = (card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const index = cards.indexOf(card);
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, newCards[index]];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].name === newFlippedCards[1].name) {
        setFlippedCards([]);
        setCards(cards.map(card => 
          card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, isMatched: true } : card
        ));
        setPoints(points => points + 1000);
      } else {
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Card key={`${card.id}-${index}`} card={card} onCardClick={handleFlip} />
      ))}
    </Grid>
  );
}

export default MemoryGame;
