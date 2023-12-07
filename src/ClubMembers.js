import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function ClubMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getMembersData = async () => {
      const membersCollection = collection(db, 'clubs/myClub/members');
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = membersSnapshot.docs.map(doc => doc.data());
      setMembers(membersData);
    };

    getMembersData();
  }, []);

  if (members.length === 0) return 'Loading...';

  return (
    <div>
      <h2>Members</h2>
      {members.map((member, index) => (
        <div key={index}>
          <p>{member.name}</p>
          {/* 필요한 다른 회원 정보를 이곳에 추가 */}
        </div>
      ))}
    </div>
  );
}

export default ClubMembers;