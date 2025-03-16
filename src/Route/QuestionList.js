/*eslint-disable*/ 
import React, { useEffect, useState, useRef, } from 'react';
import { useNavigate, } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {ListGroup, Card} from 'react-bootstrap';
import '../App.css';
import axios from 'axios';

function QuestionList() {
  const { quiz_id } = useParams();
  const navigate = useNavigate(); 
  const [loginUser, setLoginUser] = useState({});
  const [questionList, setQuestionList] = useState([]); // 해당 퀴즈의 모든 문제List
  const [userExistAnswers, setUserExistAnswers] = useState([]);  // 선택한 답안 저장

  // JWT 현재 로그인된 유저정보 가져오는 함수.
  const getUserInfo = async () => {
    const access_token = localStorage.getItem('access_token');
    
    if (access_token) {
      try {
          // 현재 로그인된 사용자 정보 조회함.
          const {data} = await axios.get('http://127.0.0.1:8000/api/user/');
        //  console.log(data);
          setLoginUser(data);

      } catch (e) {
         console.log(e);
      }
    }
};

  // 대분류 퀴즈목록에서 선태한 질문 목록 가져 오는 비동기 함수 호출
  const getQuestionList = async () => {
      const {data} = await axios.get(`http://127.0.0.1:8000/quiz/questions/${quiz_id}/`);
     // console.log(data);
      setQuestionList(data);

  };

  // 퀴즈 응시 답안 제출. 
  const saveUserAttempt = async () => {    
      // 답안 제출때 해당 문제와, 내가 선택한 답안 {}배열
      const payloadQuestAnswers = [];

      // 모든 문제list돌려서 해당 문제의 체크된 input들 가져오기 (radio로 하면 하나만 선택됨)
      questionList.forEach((question) => {
          // question.id에 해당하는 체크한 박스 찾기
          const checkedBoxe = document.querySelector(`input[name="question-${question.id}"]:checked`);

          if (checkedBoxe) { // 체크 한 경우
              payloadQuestAnswers.push({
                question: question.id,
                selected_choice: Number(checkedBoxe.value)
              });
          } else { // 체크 안한경우 
              payloadQuestAnswers.push({
                question: question.id,
                selected_choice: 0
              });
          }
      });

      console.log("보낼 데이터",{
          quiz: quiz_id,
          answers: payloadQuestAnswers,
      });

      const access_token = localStorage.getItem('access_token');

      try {
            const {data} = await axios.post('http://127.0.0.1:8000/quiz/attempts/save/', {
                quiz: Number(quiz_id),
                answers: payloadQuestAnswers,
            }, { headers: {
                   Authorization: `Bearer ${access_token}`,
                   'Content-Type': 'application/json'
                }
            });
          //  console.log("답안 제출 확인", data);
            localStorage.setItem('score', data.score);
            window.alert(`응시한 답안이 정상 저장되었습니다. 현재 점수: ${data.score}점 입니다. 다른 퀴즈도 풀어주세요.`);
            navigate('/home');

          } catch (e) {
              if (e.response) {
                 console.log("에러 응답:", e.response.data);  // 에러 상세
              } else {
                 console.log("요청 실패:", e.message);  // 네트워크 등 기타 문제
              }
          } 
  };


  // 새로고침 시 유저의 최근 응시상태 정보 가져오는 함수.
  const getUserAttemptInfo = async () => {
      const access_token = localStorage.getItem('access_token');
    
      try {
        const {data} = await axios.get(`http://127.0.0.1:8000/quiz/attempts/fetch/`, {
          params: {quiz: quiz_id},
          headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json'
          }
        });
    
        // 유저가 최근에 저장한 답안 정보가 도착함.
        console.log('응시 상태 불러오기', data);
        if (data?.id) { 
           setUserExistAnswers(data?.answers);
        } else {
          setUserExistAnswers([]);
        }
       

      } catch (error) {
          console.log("응시 상태 불러오기 실패", error.response.data);
      }
  };


  // 상태 유지중 다른 옵션으로 변경하고 싶을때
  const handleAnswerChange = (questionId, choiceId) => {
    setUserExistAnswers((prevAnswerArr) => {
        // 기존 답안 중 해당 question이 있으면 업데이트
        const updatedAnswers = prevAnswerArr.filter(ans => ans.question !== questionId);
        return [...updatedAnswers, { question: questionId, selected_choice: choiceId }];
      });
  };


  useEffect(() => {
    // 대분류 퀴즈목록에서 선태한 질문 목록 가져 오는 비동기 함수 호출
    getQuestionList();

    // 현재 로그인되 유저정보 가져오기.
    getUserInfo();

     // 새로고침 시 유저의 최근 응시상태 정보 가져오기.
    getUserAttemptInfo();

  }, []);
 

  return (
      <div id="QuestionWrap" style={{marginTop:'100px'}}>
        <ul>
            <ListGroup as="ol" numbered style={{ width: '100%'}} >
                { questionList.map((item, i) => {
                        const selected = userExistAnswers.find((ans) => {
                             return ans.question === item.id;
                        });

                        return (
                           <Card key={i} style={{ width: '100%', height: '160px', textAlign:'left', fontSize:'1.2rem', color: 'white',marginBottom:'18px'}}>
                             <ListGroup.Item variant="flush" as="li" >{item.text}</ListGroup.Item>
                             <Card style={{ width: '38rem', paddingLeft:'25px', marginTop:'10px'}}>
                                <ListGroup variant="flush">
                                    { item.choices.map((cho, i) => {
                                         return(
                                            <ListGroup.Item key={i} style={{lineHeight: '30px', width:'100%'}}>
                                              <label className='choice'>
                                                <input className='chkAns' name={`question-${item.id}`} type="radio" 
                                                  checked={selected && selected.selected_choice === cho.id ? true : false}
                                                  onChange={() => handleAnswerChange(item.id, cho.id)}  // 선택 변경도 반영, controlled component로 전환 시 필요
                                                  value={cho.id}/>
                                                  <span>{`${i+1}).`} {cho.text}</span>
                                              </label>
                                            </ListGroup.Item>
                                         );
                                      })
                                    }
                                </ListGroup>
                             </Card>
                           </Card>
                        );
                    })

                }
            </ListGroup>
        </ul>

        <button onClick={saveUserAttempt}>답안 제출</button>

      </div> 
  );
}

export default QuestionList;
