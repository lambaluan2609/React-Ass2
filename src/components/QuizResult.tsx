import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Answer, answerState } from '../state';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography } from 'antd'; // Import thêm Card, Row, Col và Typography từ Ant Design

const { Title, Text } = Typography;

export const QuizResult: React.FC = () => {
  const [answer] = useRecoilState(answerState); // Lấy câu trả lời và thông tin quiz từ state
  const [point, setPoint] = useState(0); // Khởi tạo biến state để lưu điểm số
  const nav = useNavigate(); // useNavigate để điều hướng

  useEffect(() => {
    if (answer.quiz) {
      let count = 0;
      answer.answers.forEach(item => {
        const question = answer.quiz?.questions.find(q => q._id === item.questionId);
        if (question?.correctAnswerIndex === item.answerIndex) count++;
      });
      setPoint(count);
    } else {
      nav('/');
    }
  }, [answer, nav]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false} style={{ background: '#fafafa', marginBottom: '20px', textAlign: 'center' }}>
        <Title level={2}>Quiz Result</Title>
        <Title level={3}>Your Points: {point}</Title>
      </Card>

      <Card bordered={false} style={{ background: '#f0f2f5', marginBottom: '20px' }}>
        <Title level={4}>Correct Answers:</Title>
        {answer.quiz &&
          answer.quiz.questions.map((question, index) => {
            const yourAnswer = answer.answers.find(ans => ans.questionId === question._id);
            const yourAnswerIndex = yourAnswer?.answerIndex || -1;

            return (
              <Card key={index} title={`Question ${index + 1}`} style={{ marginBottom: '15px' }} hoverable bordered={true}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text strong>{question.text}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="success">Correct Answer: {question.options[question.correctAnswerIndex]}</Text>
                  </Col>
                  {yourAnswerIndex > -1 && (
                    <Col span={12}>
                      <Text type={yourAnswerIndex === question.correctAnswerIndex ? 'success' : 'danger'}>
                        Your Answer: {question.options[yourAnswerIndex]}
                      </Text>
                    </Col>
                  )}
                </Row>
              </Card>
            );
          })}
      </Card>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Button type="primary" onClick={() => nav('/')} style={{ backgroundColor: 'orange', borderColor: 'orange', width: '200px' }}>
          Go to Home
        </Button>
      </div>
    </div>
  );
};
