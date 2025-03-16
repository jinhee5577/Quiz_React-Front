/*eslint-disable*/ 
import React, { useEffect, useState, useRef, } from 'react';
import { useNavigate } from 'react-router-dom';
import './join.css';
import axios from 'axios';

function Joinsign() {
    const navigate = useNavigate();
    const userNameRef = useRef();
    const userPassRef = useRef();
    const signUserPassRef = useRef();
    const signUserNameRef = useRef();
    const signUserEmailRef = useRef();
  
    //  JWT 로그인 요청 
    const login = async () => {
          console.log("학인",userNameRef.current.value, userPassRef.current.value);
  
          try {
              const {data} = await axios.post('http://127.0.0.1:8000/api/token/',{
                  username: userNameRef.current.value,
                  password: userPassRef.current.value
          });
  
          // 토큰 저장
          const { access, refresh } = data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          // axios 기본 헤더설정 (이후 모든 요청에 자동 포함)
          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          window.alert('로그인 되셨습니다. Home으로 이동합니다.');
          location.replace('http://localhost:3000/home');
    
          } catch (error) {
              console.error("로그인 실패", error.response?.data || error.message);
          }
    };
  

    // JWT 회원가입 함수
    const signup = async () => {
          console.log("학인sign",signUserNameRef.current.value, signUserPassRef.current.value,signUserEmailRef.current.value);
  
          try {
              const {data} = await axios.post('http://127.0.0.1:8000/api/register/', {
                  username: signUserNameRef.current.value,
                  password: signUserPassRef.current.value,
                  email: signUserEmailRef.current.value
              });
  
          console.log(data);
          window.alert('정상 회원가입 되셨습니다. 로그인 해주세요.');
  
          } catch (error) {
              console.error("회원가입 실패", error.response?.data || error.message);
          }
  
  };


  useEffect(() => {
    // 대분류 퀴즈목록 가져 오는 비동기 함수 호출
    // getQuizs();

  },[]);
 

  return (
    <div className="section">
		<div className="container">
			<div className="row full-height justify-content-center">
				<div className="col-12 text-center align-self-center py-5">
					<div className="section pb-5 pt-5 pt-sm-2 text-center">
						<h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
			          	<input className="checkbox" type="checkbox" id="reg-log" name="reg-log"/>
			          	<label htmlFor="reg-log"></label>
						<div className="card-3d-wrap mx-auto">
							<div className="card-3d-wrapper">
								<div className="card-front">
									<div className="center-wrap">
										<div className="section text-center">
											<h4 className="mb-4 pb-3">Log In</h4>
											<div className="form-group">
                                                 <input type="text" name="logname" ref={userNameRef} className="form-style" placeholder="Your userName" id="logname" autoComplete="off"/>
											</div>	
											<div className="form-group mt-2">
                                                 <input type="password" name="logpass" ref={userPassRef} className="form-style" placeholder="Your Password" id="logpass" autoComplete="off"/>
											</div>
											<button className="btn mt-4" onClick={login}>submit</button>
				      					</div>
			      					</div>
			      				</div>
								<div className="card-back">
									<div className="center-wrap">
										<div className="section text-center">
											<h4 className="mb-4 pb-3">Sign Up</h4>
											<div className="form-group">
                                                <input type="text" name="signname" ref={signUserNameRef} className="form-style" placeholder="Your userName" id="signname" autoComplete="off"/>
											</div>	
											<div className="form-group mt-2">
                                               <input type="email" name="signemail" ref={signUserEmailRef} className="form-style" placeholder="Your Email" id="signemail" autoComplete="off"/>
											</div>
											</div>	
											<div className="form-group mt-2">
                                                <input type="password" name="signpass" ref={signUserPassRef} className="form-style" placeholder="Your Password" id="signpass" autoComplete="off"/>
											</div>
											<button className="btn mt-4" onClick={signup}>submit</button>
				      					</div>
			      					</div>
			      				</div>
			      			</div>
			      		</div>
			      	</div>
		      	</div>
	      	</div>
	   </div>
  );
}

export default Joinsign;
