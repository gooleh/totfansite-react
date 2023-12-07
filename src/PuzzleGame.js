import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Grid, Paper } from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import image1 from './images/001.jpeg';
import image2 from './images/002.jpeg';
import image3 from './images/003.jpeg';
import image4 from './images/004.jpeg';
import image5 from './images/005.jpeg';
import image6 from './images/006.jpeg';
import image7 from './images/007.jpeg';
import image8 from './images/008.jpeg';
import image9 from './images/009.jpeg';

const db = getFirestore();
const auth = getAuth();

const type = 'Tile';

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const Tile = ({ id, tile, index, moveTile }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (item) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveTile(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  return (
    <Grid
      item
      xs={4}
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1, height: '33.33%' }}
    >
      <Paper variant="outlined" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
        <img src={tile.image} alt={`tile-${tile.number}`} style={{ width: '100%', height: '100%', objectFit: 'contain', margin: 'auto' }} />
      </Paper>
    </Grid>
  );
};

const PuzzleGame = () => {
  const initialTiles = [
    { id: 1, image: image1 },
    { id: 2, image: image2 },
    { id: 3, image: image3 },
    { id: 4, image: image4 },
    { id: 5, image: image5 },
    { id: 6, image: image6 },
    { id: 7, image: image7 },
    { id: 8, image: image8 },
    { id: 9, image: image9 },
  ];

  // 타일의 순서를 무작위로 섞습니다.
  const shuffledTiles = shuffle([...initialTiles]);

  const [tiles, setTiles] = useState(shuffledTiles);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              setPoints(userDoc.data().points);
            }
          });
      } else {
        console.log("User is not logged in.");
      }
    });

    // cleanup function
    return () => unsubscribe();
  }, []);

  const moveTile = (dragIndex, hoverIndex) => {
    const newTiles = [...tiles];
    const draggedTile = newTiles[dragIndex];

    newTiles.splice(dragIndex, 1);
    newTiles.splice(hoverIndex, 0, draggedTile);

    setTiles(newTiles);
  };

  useEffect(() => {
    const isComplete = tiles.slice().sort((a, b) => a.id - b.id).every((tile, index) => tile.id === index + 1);
  
    if (isComplete) {

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const newPoints = points + 1000;
  
        updateDoc(userRef, {
          points: newPoints
        }).then(() => {
          setPoints(newPoints); // 포인트 업데이트가 성공적으로 완료된 후에만 상태를 업데이트합니다. 
        });
      } else {
        console.log("User is not logged in.");
      }
    }
  }, [tiles]);
  

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={0} style={{ maxWidth: '700px', maxHeight: '700px', margin: '0 auto', justifyContent: 'space-between' }}>
        {tiles.map((tile, index) => (
          <Tile
            key={tile.id}
            id={tile.id}
            tile={tile}
            index={index}
            moveTile={moveTile}
          />
        ))}
      </Grid>
    </DndProvider>
  );
};

export default PuzzleGame;
