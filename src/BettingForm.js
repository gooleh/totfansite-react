import React, { useState, useEffect } from 'react';
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Card, CardContent, Grid } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs, limit,where } from 'firebase/firestore';

function BettingForm({ onBet }) {
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState('win');
  const [match, setMatch] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
        const db = getFirestore();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정합니다.
      
        // 'date' 필드의 값이 오늘 날짜 이후인 문서 중에서 가장 빠른 날짜의 문서를 가져옵니다.
        const querySnapshot = await getDocs(query(collection(db, 'schedule'), where('date', '>=', today), orderBy('date'), limit(1)));
      
        querySnapshot.forEach(doc => {
          setMatch(doc.data().match);
        });
      };
      
      fetchData();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
  
    if (auth.currentUser === null) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    onBet(amount, selectedOption);
    setAmount('');
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '50px' }}>
      <Card style={{ width: '100%', maxWidth: '1200px', height: '500px' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" style={{ fontSize: '35px', marginBottom: '2%', textAlign: 'center' }}>다음 경기: {match}</FormLabel>
              <RadioGroup row aria-label="position" name="position" defaultValue="win" onChange={e => setSelectedOption(e.target.value)} style={{ justifyContent: 'center', marginBottom: '2%' }}>
                <FormControlLabel value="win" control={<Radio color="primary" />} label="승" style={{ marginRight: '3%', fontSize: '30px' }} />
                <FormControlLabel value="draw" control={<Radio color="primary" />} label="무" style={{ marginRight: '3%', fontSize: '30px' }} />
                <FormControlLabel value="lose" control={<Radio color="primary" />} label="패" style={{ marginRight: '3%', fontSize: '30px' }} />
              </RadioGroup>
            </FormControl>
            <TextField
              label="포인트"
              variant="outlined"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ marginTop: '4%', fontSize: '30px',marginBottom: '1%' }}
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginBottom: '1%',marginTop: '12%', fontSize: '35px' }} fullWidth>게임하기</Button>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default BettingForm;
