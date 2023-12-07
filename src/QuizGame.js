import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Card, CardContent, Grid, Typography,Box } from '@mui/material';

function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('0');
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const quizCollection = collection(db, "Quiz");
      const quizSnapshot = await getDocs(quizCollection);
      setQuestions(quizSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (snap) => {
        setPoints(snap.data().points || 0);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleGameEnd = async () => {
    setShowScore(true);
  
    console.log('score:', score);  // 점수 출력
  
    const finalScore = score + 1000;  // 마지막 문제에 대한 점수를 계산
  
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const currentPoints = userSnap.data().points || 0;
      console.log('currentPoints:', currentPoints);  // 현재 포인트 출력
  
      const newPoints = currentPoints + finalScore;  // 마지막 문제에 대한 점수를 추가하여 총 포인트 계산
      console.log('newPoints:', newPoints);  // 새로운 포인트 출력
  
      await updateDoc(userRef, {
        points: newPoints,
      });
    }
  };
  
  

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1000);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      handleGameEnd();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('selectedOption:', selectedOption);  // 선택한 답변 출력
    console.log('correctAnswer:', questions[currentQuestion].correctAnswer);  // 정답 출력
    handleAnswerOptionClick(selectedOption === questions[currentQuestion].correctAnswer);
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
      <Typography variant="h4" style={{ color: '#FFFFFF', fontFamily: 'Arial' }}>선수 이름 맞추기</Typography>
      <Box mt={2}> {/* mt은 마진 탑을 의미하며, 2는 테마 스페이싱에 따른 값입니다. */}
        {user && <Typography variant="h5" style={{ color: '#FFFFFF', fontFamily: 'Courier New' }}>현재 포인트: {points}점</Typography>}
      </Box>
      <Card 
        sx={{ 
          width: 700, // 카드의 너비를 600px로 고정
          height: 800, // 카드의 높이를 800px로 고정
        }}
        style={{ maxWidth: '90%', maxHeight: '1000px', overflow: 'auto' }}
      >
        <CardContent>
          {showScore ? (
            <Typography variant="h4" style={{ color: 'black', fontFamily: 'Courier New' }}>당신의 점수: {score}점</Typography>
          ) : (
            questions[currentQuestion] ? (
              <form onSubmit={handleSubmit}>
                <FormControl component="fieldset" fullWidth>
                <img 
                    src={questions[currentQuestion].image} 
                    alt="선수 사진" 
                    style={{ 
                      width: '100%', // 이미지의 너비를 100%로 설정
                      height: '680px', // 이미지의 높이를 300px로 고정
                      objectFit: 'cover' // 이미지의 비율을 유지하면서, 지정된 너비와 높이에 맞게 이미지를 조절
                    }} 
                  />
                  <RadioGroup row aria-label="position" name="position" defaultValue="0" onChange={e => setSelectedOption(e.target.value)}>
                    {questions[currentQuestion].answers.map((answer, index) => (
                      <FormControlLabel key={index} value={index.toString()} control={<Radio color="primary" />} label={answer} />
                    ))}
                  </RadioGroup>
                  <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }} fullWidth>답변 제출</Button>
                </FormControl>
              </form>
            ) : (
              <Typography variant="h4">데이터를 불러오는 중...</Typography>
            )
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default QuizGame;
