import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // firebase 설정 파일의 실제 경로로 변경해주세요.
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Schedule.css';

function Schedule() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const getScheduleData = async () => {
      const scheduleCollection = collection(db, 'schedule');
      const scheduleSnapshot = await getDocs(scheduleCollection);
      const scheduleData = scheduleSnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate() // Firestore의 timestamp를 JavaScript의 Date 객체로 변환합니다.
      }));

      // 날짜를 기준으로 정렬하는 부분
      scheduleData.sort((a, b) => {
        return a.date - b.date;
      });

      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
      } else {
        console.error('No data from Firestore');
      }
    };

    getScheduleData();
  }, []);

  if (!schedule) return 'Loading...';

  return (
    <div className="container" style={{ background:'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)' }}>
      {schedule.map((s, index) => (
        <div key={index} className="card mb-4">
          <h2 className="card-header date-header">{s.date.toLocaleDateString()}</h2>
          <div className="card-body">
            <h3 className="h4">{s.match}</h3>
            {s.result && <p className="card-text">결과: {s.result}</p>}
            <p className="card-text">{s.location}</p>
            <p className="card-text">{s.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Schedule;
