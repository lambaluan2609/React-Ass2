import React, { useEffect, useState } from 'react';
import { answerState, Question } from '../state';
import { Card, Radio, Typography } from 'antd';
import { useSetRecoilState } from 'recoil';

const { Title, Paragraph } = Typography;

export const QuestionDetail: React.FC<{ data: Question; num: number }> = ({ data: question, num }) => {
  const [selected, setSelected] = useState<number | null>(null); // Trạng thái lưu đáp án đã chọn
  const setAnswer = useSetRecoilState(answerState); // Cập nhật trạng thái answer

  useEffect(() => {
    if (selected !== null) {
      // Cập nhật trạng thái câu trả lời sau khi người dùng chọn đáp án
      setAnswer(preState => {
        const newAnswers = [...preState.answers]; // Sao chép mảng câu trả lời
        const answerIndex = newAnswers.findIndex(ans => ans.questionId === question._id); // Tìm chỉ số câu hỏi đã trả lời
        if (answerIndex > -1) {
          // Nếu câu hỏi đã có trong mảng, cập nhật đáp án
          newAnswers[answerIndex] = {
            ...newAnswers[answerIndex],
            answerIndex: selected,
          };
        }

        return { ...preState, answers: newAnswers }; // Cập nhật state
      });
    }
  }, [selected, question._id, setAnswer]);

  const handleOptionChange = (e: any) => {
    setSelected(e.target.value); // Cập nhật đáp án được chọn
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      {' '}
      {/* Thêm margin để tạo khoảng cách giữa các câu hỏi */}
      <Title level={4}>
        Question {num + 1}: {question.text} {/* Hiển thị số thứ tự câu hỏi */}
      </Title>
      <Radio.Group onChange={handleOptionChange} value={selected}>
        {' '}
        {/* Nhóm các đáp án */}
        {question.options.map((option, index) => (
          <Radio key={option} value={index}>
            {' '}
            {/* Hiển thị từng đáp án */}
            {option}
          </Radio>
        ))}
      </Radio.Group>
    </Card>
  );
};
