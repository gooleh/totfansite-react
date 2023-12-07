import React, { useState, useEffect }from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, collection,query, where, getDocs, addDoc, setDoc,onSnapshot } from 'firebase/firestore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Menu, MenuItem, ListItemText } from '@mui/material';
import PlayersList from './PlayersList';
import characterImage from './images/qfeweqd.png';
import ClubInfo from './ClubInfo';
import Schedule from './Schedule';
import NewsApi from './NewsApi'
import BettingForm from './BettingForm';
import BetService from './BetService';
import PlayerDetail from './PlayerDetail';
import QuizGame from './QuizGame';
import MemoryGame from './MemoryGame';
import PuzzleGame from './PuzzleGame';





const theme = createTheme();


//firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCZsfoGKcn8N4bm7Z960zXfg6NDqAh6ihI",
  authDomain: "totfansitedb.firebaseapp.com",
  databaseURL: "https://totfansitedb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "totfansitedb",
  storageBucket: "totfansitedb.appspot.com",
  messagingSenderId: "963480836149",
  appId: "1:963480836149:web:4eeecd547a75efb26ab97c",
  measurementId: "G-L4MX7LPE59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

//회원가입 컴포넌트
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Firestore에 사용자 정보와 포인트를 저장
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);  // 문서 ID를 uid로 설정
      const betRef = doc(db, 'bets', user.uid);  // 'bets' 컬렉션에도 문서 ID를 uid로 설정
      const userInfo = {  // 사용자 정보
        uid: user.uid,
        email: user.email,
        points: 100000  // 기본 포인트
      };
  
      // 'users' 컬렉션에 사용자 정보 저장
      await setDoc(userRef, userInfo);
  
      // 'bets' 컬렉션에 사용자 정보 저장
      await setDoc(betRef, userInfo);
  
      alert('회원가입이 완료되었습니다.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.background}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.button}>회원가입</button>
      </form>
    </div>
  );
}



// 로그인 컴포넌트
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인이 완료되었습니다.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={styles.input} />
      <button type="submit" style={styles.button}>로그인</button>
    </form>
  );
}

// CSS 스타일
const styles = {
  background: {
    width: '100%',
    height: '100vh',
    backgroundImage: 'url("https://cdn.eyesmag.com/content/uploads/posts/2022/04/12/son-heung-min-named-in-best-11-by-epl-fd330c0f-36c4-4155-a20c-232406191a84.jpg")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
    width: '300px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'skyblue',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

// 게시글 작성
const addPost = async (title, content) => {
  try {
    await addDoc(collection(db, 'posts'), {
      title,
      content,
      createdAt: Date.now(),
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// 모든 게시글 불러오기
const getPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error('Error getting documents: ', e);
  }
};

function NoticeBoradPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const posts = await getPosts();
      setPosts(posts);
    }

    fetchData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await addPost(title, content);
    setTitle('');
    setContent('');
  };

  // 말풍선 꼬리 스타일
  const bubbleStyle = {
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: '#f0f0f0',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    margin: '20px 0',
  };
  
  const tailStyle = {
    position: 'absolute',
    left: '10%',
    top: '100%',
    width: '0',
    height: '0',
    borderTop: '15px solid #f0f0f0',
    borderRight: '15px solid transparent',
  };
  
  const postStyle = {
    position: 'relative',
    margin: '10px',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    width: '30%',
  };

  const selectedPostStyle = {
    ...postStyle,
    width: '90%',
    maxWidth: '90%',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("https://mblogthumb-phinf.pstatic.net/MjAxOTEyMzBfNzAg/MDAxNTc3NzAzMDQzNjky.IvjEr0cgncE4-qIi1cYDsx27ulno6Cez9GHrwfV0B9sg.IyLn94louGxmHvGfVyNQxUhNeemzq-yXyIVO2Me5CAEg.JPEG.tg_family/20191206_144639.jpg?type=w800")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height:'85vh',
      position: 'relative',
      marginTop: '0' , 
      marginBottom:'0'
    }}>
<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
<img src={characterImage} alt="character" style={{ width: '500px', height: '500px', marginRight: '0px',marginTop:"350px" }} />
  <form onSubmit={handleSubmit} style={{ ...bubbleStyle, width: '50%', textAlign: 'right' }}>
    <div style={tailStyle}></div>
    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
    <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
    <button type="submit">Submit</button>
  </form>
</div>

      <div style={{ width: '50%', textAlign: 'center' }}>
        {posts.map((post, index) => (
          <div 
            key={index} 
            style={selectedPost === post ? selectedPostStyle : postStyle} 
            onClick={() => setSelectedPost(post)}
          >
            <h2>{post.title}</h2>
            {selectedPost === post && <p>{post.content}</p>}
            <div style={tailStyle}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

//로그인,로그아웃 기능
function LoginStatus({ user, setUser }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('로그아웃 중 에러가 발생했습니다', error);
    }
  };


  return (
    <div style={{ textAlign: 'right', marginTop: '20px'}}>
      <p style={{ color: 'white', fontSize: '20px' }}>
        {user ? `${user.email}` : '현재 로그아웃 상태입니다'}
      </p>
      {user && <button onClick={handleLogout}>로그아웃</button>}
      
    </div>
  );
}

function DropdownMenu({ title, menuItems }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{ color: 'white', fontSize: '35px' }}>
        {title}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem onClick={handleClose} key={index} component={Link} to={`/game/${item.toLowerCase().replace('게임', 'game')}`}>
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

function MenuBar() {
  const games = ['경기 결과 맞추기', '선수 맞추기', '선수 얼굴 기억하기','퍼즐 맞추기'];

  return (
    <AppBar position="static" style={{ background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)' }}>
      <Toolbar style={{ justifyContent: 'space-around' }}>
        <Button color="inherit" component={Link} to='/' style={{ fontSize: '35px' }}>홈</Button>
        <Button color="inherit" component={Link} to='/news' style={{ fontSize: '35px' }}>뉴스</Button>
        <Button color="inherit" component={Link} to='/schedule' style={{ fontSize: '35px' }}>경기 일정</Button>
        <Button color="inherit" component={Link} to='/players' style={{ fontSize: '35px' }}>선수 정보</Button>
        <Button color="inherit" component={Link} to='/club' style={{ fontSize: '35px' }}>클럽 정보</Button>
        <Button color="inherit" component={Link} to='/noticeboard' style={{ fontSize: '35px' }}>락커룸(게시판)</Button>
        <DropdownMenu title="게임하기" menuItems={games} />
        <Button color="inherit" component={Link} to='/signup' style={{ fontSize: '35px' }}>회원가입</Button>
      </Toolbar>
    </AppBar>
  );
}



function FanSite() {
  return (
    <MenuBar />
   
  );

 
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)', minHeight: '100vh'}}>
          <MenuBar />
          <LoginStatus user={user} setUser={setUser} />
          <Routes>
            <Route path='/' element={<HomePage user={user} />} />
            <Route path='/news' element={<NewsPage />} />
            <Route path='/schedule' element={<SchedulePage />} />
            <Route path='/club' element={<ClubPage />} />
            <Route path='/noticeboard' element={<NoticeBoradPage />} />
            <Route path='/game' element={<GamePage />} />
            <Route path='/game/경기 결과 맞추기' element={<GamePage />} />
            <Route path='/game/선수 맞추기' element={<QuizGamePage />}/>
            <Route path='/game/선수 얼굴 기억하기' element={<MemoryGamePage />}/>
            <Route path='/game/퍼즐 맞추기' element={<PuzzleGamePage />}/>
            <Route path='/fansite' element={<FanSite />} />
            {!user && <Route path='/signup' element={<Signup />} />}
            {!user && <Route path='/login' element={<Login />} />}
            <Route path='/players/*' element={<PlayersPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}



   
  
function HomePage({user}) {
  return (
    <div style={{ backgroundImage: `url('https://i.namu.wiki/i/D6dYdqmqHYXWwDF4X2nkICAjAc6bNFXLz7_EzFDllnRZgiTlpGVTcTCxqgVngOnF-0fCL2HSFqXizxcIvZzvWQ.webp')`,
     backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height:'100vh',position: 'relative', zIndex: 10,marginTop: '0' , marginBottom:'0'}}>
      <header>
        <h1 style={ {color : 'white', fontSize : '64px', textAlign: 'center'}}>TOTTENHAM HOTSPUR</h1>
      </header>
            {/* 로그인 컴포넌트 */}
            {!user && <Login />}
      <main>
        <section style={ {color : 'white', fontSize : '25px',textAlign:'right'}}>
          <img
            src="https://t1.daumcdn.net/media/img-section/sports13/logo/team/14/33_300300.png"
            alt="토트넘 핫스퍼 FC 로고"
          />
          <p style={{fontSize:'20px',textAlign:'left',color:'white',marginTop:'0',marginBottom:'2'}}>영국 잉글랜드의 프리미어 리그 소속 프로 축구단. 연고지는 런던, 홈구장은 토트넘 홋스퍼 스타디움이다.</p>
          <p style={{fontSize:'20px',textAlign:'left',color:'white',marginTop:'0',marginBottom:'2'}}> 애칭은 스퍼스 Spurs. 1882년 창단되었으며, 토트넘에 소재하고 있는 화이트 하트 레인을 2017년 5월 14일까지 홈구장으로 사용했다.</p>
          <p style={{fontSize:'20px',textAlign:'left',color:'white',marginTop:'0',marginBottom:'2'}}>이후 2019년 4월 3일부터 같은 자리에 세워진 토트넘 홋스퍼 스타디움을 새로운 홈구장으로 사용하고 있다.</p> 
        </section>
      </main>
    </div>
  );
}

function NewsPage() {
  
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 120%)'}}>
      <NewsApi/>
    </div>
  );
}

function SchedulePage() {
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
<Schedule/>
    </div>
  );
}

function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const data = await getDocs(collection(db, "players"));
      setPlayers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PlayersList players={players} />} />
      <Route path=":id" element={<PlayerDetail />} />
    </Routes>
  );
}


function ClubPage() {
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
      <ClubInfo />
      <img
            src="https://t1.daumcdn.net/media/img-section/sports13/logo/team/14/33_300300.png"
            alt="토트넘 핫스퍼 FC 로고"
          />
    </div>
  );
}



function GamePage() {
  const [uid, setUid] = useState(null);
  const [points, setPoints] = useState(0); // 사용자의 포인트를 저장할 상태 변수

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);

        const userRef = doc(db, 'users', user.uid);
        // 사용자 정보가 변경될 때마다 포인트 정보를 업데이트합니다.
        const unsubscribeUser = onSnapshot(userRef, doc => {
          if (doc.exists()) {
            setPoints(doc.data().points);
          }
        });

        return unsubscribeUser;
      }
    });

    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'yyyy-mm-dd' 형식으로 가져옵니다.
    const docRef = doc(db, 'schedule', today);

    // 오늘의 경기 결과를 가져옵니다.
    let previousBetting; // 이전 'betting' 필드의 값을 저장할 변수
    const unsubscribeGame = onSnapshot(docRef, async doc => {
      if (doc.exists()) {
        const gameData = doc.data();
        if(gameData.betting !== undefined && gameData.betting !== previousBetting){
          handleGameResult(gameData.betting);
          previousBetting = gameData.betting; // 'betting' 필드의 값을 저장
        }
      }
    });

    // 컴포넌트가 언마운트될 때 구독을 취소합니다.
    return () => {
      unsubscribeAuth();
      unsubscribeGame();
    };
  }, []);

  const handleBet = async (amount, selectedOption) => {
    if (!uid) return;
    const success = await BetService.placeBet(uid, parseInt(amount), selectedOption);
    if (!success) {
      return;
    }
  };

  const handleGameResult = async (gameResult) => {
    const db = getFirestore();
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'yyyy-mm-dd' 형식으로 가져옵니다.

 // 오늘 배팅한 사용자들의 배팅 정보를 가져옵니다.
    const q = query(collection(db, 'bets'), where('date', '==', today), where('processed', '==', false));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async doc => {
      const betData = doc.data();
      const betId = doc.id; // 배팅 문서 ID를 가져옵니다.
      let result;
      if (betData.selectedOption === gameResult) {
        result = 'win';
      } else if (gameResult === 'draw') {
        result = 'draw';
      } else {
        result = 'lose';
      }

      // 각 사용자의 배팅 결과에 따라 포인트를 업데이트합니다.
      await BetService.handleBetResult(betData.uid, betId, betData.amount, result); // 배팅 문서 ID를 넘겨줍니다.
    });
  };

  return (
<div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
  <h1 style={{ fontSize: '30px', color: 'white' }}>다음경기 결과 맞추기(성공시 2배의 포인트 지급!)</h1>
  <p style={{ fontSize: '20px', color: 'yellow' }}>현재 포인트: {points}</p>
  <BettingForm onBet={handleBet} />
</div>
  );
}

function QuizGamePage() {
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
<QuizGame/>
    </div>
  );
}

function MemoryGamePage() {
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
<MemoryGame/>
    </div>
  );
}

function PuzzleGamePage() {
  return (
    <div style={{background: 'linear-gradient(45deg, #91A9CF 30%, #1D2951 90%)'}}>
<PuzzleGame/>
    </div>
  );
}


export default App;
export {FanSite, MenuBar};