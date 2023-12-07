import { getFirestore, doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

const BetService = {
  async placeBet(uid, betAmount, selectedOption) {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', uid);
  
      const userDoc = await getDoc(userRef);
  
      // 문서가 존재하는지 확인
      if (!userDoc.exists()) {
        console.error(`Document with ID ${uid} does not exist.`);
        return false;
      }

      // 사용자의 현재 포인트를 불러옵니다.
      const currentPoints = userDoc.data().points;

      // 배팅 금액이 현재 포인트보다 많으면 배팅을 할 수 없습니다.
      if (currentPoints < betAmount) {
        alert('포인트가 부족합니다.');
        return false;
      }

      // 배팅 금액만큼 포인트를 차감합니다.
      await updateDoc(userRef, {
        points: currentPoints - betAmount
      });

      // 배팅 정보를 Firestore에 저장합니다.
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'yyyy-mm-dd' 형식으로 가져옵니다.
      const betRef = await addDoc(collection(db, 'bets'), {
        uid,
        amount: betAmount,
        selectedOption,
        date: today,
        processed: false, // 배팅 결과 처리 여부를 나타내는 필드를 추가합니다.
      });

      return betRef.id ? true : false;
    } catch (error) {
      console.error('Failed to place bet:', error);
      return false;
    }
  },

  async handleBetResult(uid, betId, betAmount, result) {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', uid);
      const betRef = doc(db, 'bets', betId); // 배팅 문서의 ID를 사용해서 레퍼런스를 생성합니다.
  
      // 사용자의 현재 포인트를 불러옵니다.
      const userDoc = await getDoc(userRef);
      const currentPoints = userDoc.data().points;
  
      let earnedPoints;
      if (result === 'win') {
        earnedPoints = betAmount * 2;
        alert(`축하합니다! 배팅에 승리하여 ${earnedPoints}포인트를 얻었습니다.`);
      } else if (result === 'draw') {
        earnedPoints = betAmount * 2;
        alert(`무승부입니다! 배팅금액의 2배인 ${earnedPoints}포인트를 얻었습니다.`);
      } else {
        earnedPoints = betAmount * 2;
        alert(`축하합니다! 배팅에 승리하여 ${earnedPoints}포인트를 얻었습니다.`);
      }
  
      // Firestore에 새로운 포인트를 업데이트합니다.
      await updateDoc(userRef, {
        points: currentPoints + earnedPoints
      });
  
      // 배팅 결과 처리가 완료되었음을 표시합니다.
      await updateDoc(betRef, {
        processed: true
      });
    } catch (error) {
      console.error('Failed to handle bet result:', error);
    }
  }
  

}

export default BetService;
