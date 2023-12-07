import { useEffect, useState } from 'react';
import { db } from './firebase'; // firebase 설정 파일의 실제 경로로 변경해주세요.
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function ClubInfo() {
  const [club, setClub] = useState(null);

  useEffect(() => {
    const getClubData = async () => {
      const clubsCollection = collection(db, 'clubs');
      const clubSnapshot = await getDocs(clubsCollection);
      const clubData = clubSnapshot.docs.map(doc => doc.data());
      if (clubData.length > 0) {
        setClub(clubData); // clubData는 배열입니다.
      } else {
        console.error('No data from Firestore');
      }
    };
      
    getClubData();
  }, []);

  if (!club) return 'Loading...';

  return (
    <div className="container" style={{ background:'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)' }}>
      {club.map((c, index) => (
        <div key={index} className="card mb-4">
          <h2 className="card-header">{c.name}</h2>
          <div className="card-body">
            <p className="card-text">{c.description}</p>
            <img src={c.image} alt={c.name} style={{width: '100%'}} />
            <div>
              <h3 className="h4">토트넘 구단 소개</h3>
              <p className="card-text">{c.desc}</p>
              <h3 className="h4">토트넘에 대한 비판</h3>
              <p className="card-text">{c.desc1}</p>
              <h3 className="h4">북런던 더비</h3>
              <img src={c.image1} alt={c.name} style={{width: '100%'}} />
              <p className="card-text">{c.desc2}</p>
              <h3 className="h4">서북런던 더비</h3>
              <img src={c.image2} alt={c.name} style={{width: '100%'}} />
              <p className="card-text">{c.desc3}</p>
              <h3 className="h4">동북런던 더비</h3>
              <img src={c.image3} alt={c.name} style={{width: '100%'}} />
              <p className="card-text">{c.desc4}</p>
              <h3 className="h4">역대 일어난 논란들</h3>
              <p className="card-text">{c.desc5}</p>
              <h3 className="h4">한국에서의 인지도</h3>
              <img src={c.image4} alt={c.name} style={{width: '100%'}} />
              <p className="card-text">{c.desc6}</p>
              <h3 className="h4">기타 TMI</h3>
              <p className="card-text">{c.desc7}</p>
              <h3 className="h4">토트넘과 유대인</h3>
              <p className="card-text">{c.desc8}</p>
              <h3 className="h4">챔피언스리그와의 인연</h3>
              <p className="card-text">{c.desc9}</p>
              <h3 className="h4">AI가 본 토트넘</h3>
              <p className="card-text">{c.desc10}</p>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClubInfo;
