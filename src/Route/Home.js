/*eslint-disable*/ 
import React, { useEffect, useState, useRef, } from 'react';
import { Link, Route, Routes, useNavigate} from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function Home() {
  const [quiz_list, setQuizList] = useState([]);
  const navigate = useNavigate(); 

  // 대분류 퀴즈목록 가져 오는 비동기 함수 
  const getQuizs = async () => {
      const {data} = await axios.get('http://127.0.0.1:8000/quiz/');
      console.log(data);
      setQuizList(data);

  };

  useEffect(() => {
    // 로그인후 페이지 새로고침 하면 axios기본 헤더는 초기화되므로, 
    // axios기본 헤더에 Authorization설정 다시 불러와서 설정 해줘야함.
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.alert('고객 전용 입니다. 로그인 먼저 해주세요.');
      navigate('/joinSign');
    }

    // 대분류 퀴즈목록 가져 오는 비동기 함수 호출
    getQuizs();

  }, []);
 

  return (
      <div id="quiz_main">
        <ul id="quizBox">
          { quiz_list.map((item, i) =>{
                return (
                    <li key={i}>
                      <div className="card">  
                         <h3>{item.title}</h3>
                         <p><Link to={`/questions/${item.id}`}>GO</Link></p>
                      </div>
                    </li> 
                );
            })

          }
        </ul>

      </div>  
   
  );
}

export default Home;
