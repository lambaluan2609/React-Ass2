import React, { useEffect, useState } from 'react';
import { answerState, Quiz, quizzesState } from '../state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CountdownProps, Typography, Space } from 'antd';
import Countdown from 'antd/es/statistic/Countdown';
import { QuestionDetail } from './QuestionDetail';
import axios from 'axios';

const { Title } = Typography;

export const QuizDetailPage: React.FC = () => {
  const { id } = useParams(); // Lấy ID của quiz từ URL
  const nav = useNavigate(); // Sử dụng để điều hướng
  const [timeout, setTimeout] = useState<number>(0); // Thời gian đếm ngược
  const [status, setStatus] = useState<boolean>(false); // Trạng thái bắt đầu bài kiểm tra
  const quizzes: Quiz[] = useRecoilValue(quizzesState); // Lấy danh sách quizzes từ state
  const setAnswer = useSetRecoilState(answerState); // Cập nhật state answer
  const [detail, setDetail] = useState<Quiz | undefined>(); // Lưu thông tin chi tiết của quiz

  const fetchDetailQuizApi = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const result = await axios.get(`${apiUrl}/quizzes/${id}`).then(data => data.data);
    if (result?.data) {
      setDetail(result?.data); // Lưu thông tin chi tiết của quiz
    }
  };

  useEffect(() => {
    if (quizzes && quizzes.length) {
      const result = quizzes.find(quiz => quiz._id === id); // Tìm quiz theo ID
      result && setDetail(result);
    } else {
      fetchDetailQuizApi(); // Gọi API nếu không có dữ liệu quizzes
    }
  }, [quizzes]);

  const onFinish: CountdownProps['onFinish'] = () => {
    nav('/quiz-result'); // Điều hướng đến trang kết quả khi hết thời gian
  };

  const onStartHandle = () => {
    if (detail) {
      const plusMinutes = 60 * 3 * 1000; // Thời gian đếm ngược 3 phút
      setTimeout(Date.now() + plusMinutes); // Cập nhật thời gian hết hạn
      setStatus(true); // Bắt đầu bài kiểm tra
      setAnswer({
        quiz: detail,
        answers: detail.questions.map(question => ({
          questionId: question._id,
          answerIndex: null,
        })),
      });
    }
  };

  const onSubmit = () => {
    nav('/quiz-result'); // Điều hướng đến trang kết quả khi submit
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>{detail?.title || 'Quiz Detail'}</Title>

      {!status && (
        <Button type="primary" onClick={onStartHandle} style={{ marginBottom: '20px' }}>
          Start Test
        </Button>
      )}

      {status && (
        <div style={{ marginBottom: '20px' }}>
          <Countdown title="Time Left" value={timeout} onFinish={onFinish} />
        </div>
      )}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {status && detail && detail.questions.map((data, index) => <QuestionDetail key={data._id} data={data} num={index} />)}

        {status && (
          <Button type="primary" onClick={onSubmit} style={{ alignSelf: 'flex-end' }}>
            Submit
          </Button>
        )}
      </Space>
    </div>
  );
};
