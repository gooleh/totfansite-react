import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const client_id = 'VnVSSIWa_K5s8LvnER1F'; 
const client_secret = 'Mb7BrmosuW'; 

function NewsApi() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/v1/search/news', {
            params: {
              query: '토트넘', 
              display: 52, // 뉴스 개수를 52개로 설정
            },
            headers: {
              'X-Naver-Client-Id': client_id,
              'X-Naver-Client-Secret': client_secret
            }
          });
        const newsData = response.data.items.map(item => ({
          ...item,
          title: item.title.replace(/&quot;/g, ''),
          description: item.description.replace(/&quot;/g, '')
        }));
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };

    fetchNews();
  }, []);

  if (news.length === 0) return 'Loading...';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '15px' }}>
      {news.map((article, index) => (
        <Card key={index} style={{ margin: '10px' }}>
  <CardContent>
    <Typography variant="h5" component="div">
      {article.title.replace(/<b>|<\/b>/g, '')}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {article.description.replace(/<b>|<\/b>/g, '')}
    </Typography>
  </CardContent>
  <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>더보기</a>
</Card>

      ))}
    </div>
  ); 
}

export default NewsApi;
