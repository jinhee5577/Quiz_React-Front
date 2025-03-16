/*eslint-disable*/ 
import React, { useEffect, useState, useRef, } from 'react';
import { Link, Route, Routes, useNavigate} from 'react-router-dom';
import $ from 'jquery';
import Home from './Route/Home.js';
import QuestionList from './Route/QuestionList.js';
import Joinsign from './Route/Joinsign.js';
import './App.css';
import axios from 'axios';

function App() {
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();

  // JWT 현재 로그인된 유저정보 가져오는 함수.
  const getUserInfo = async () => {
      const access_token = localStorage.getItem('access_token');
      
      if (access_token) {
        try {
            // 현재 로그인된 사용자 정보 조회함.
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/');
            console.log(data);
            setLoginUser(data);

        } catch (e) {
           console.log(e);
        }
      }
  };


  // 로그아웃 함수.
  const logout = () => {
      const access_token = localStorage.getItem('access_token');
      
      if (access_token) { 
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
      } 

      setLoginUser({});
      window.alert('정상 로그아웃 되었습니다.');
      navigate('/joinSign');
  };
  

  useEffect(() => {
    // 로그인후 페이지 새로고침 하면 axios기본 헤더는 초기화되므로, 
    // axios기본 헤더에 Authorization설정 다시 불러와서 설정 해줘야함.
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }

    // 현재 로그인되 유저정보 가져오기.
    getUserInfo();

  }, []);

  $(document).ready(function(){
    $(".menuItem").hover(function(){
        var pos=$(this).attr("alt");
    $( "#slider" ).stop().animate({
        marginLeft: 150*(pos-1),
      }, 300)
          
      });
  });
   

  return (
    <div className="App">
       <div id="Navbar">
          <div id="slider"></div>
          <div alt="1" className="menuItem"><Link to={`/home`}>HOME</Link></div>
          <div alt="2" className="menuItem"><Link to={`/joinSign`}>Login/Sign up</Link></div>
          <div alt="3" className="menuItem" onClick={logout}>Logout</div>
          <div alt="4" className="menuItem">{loginUser.username ? `${loginUser.username} 님` : '고객 전용'}</div>
        </div>

        <Routes>
           <Route exact path='/' element={<Joinsign />} />
           <Route exact path='/home' element={<Home />} />
           <Route path='/questions/:quiz_id' element={<QuestionList />} />
           <Route path='/joinSign' element={<Joinsign />} />
        </Routes>
      
    </div>
  );
}

export default App;
