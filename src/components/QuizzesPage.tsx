import { Button, Table, Space, Popconfirm, message, Input, Card, Row, Col } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { quizzesState } from '../state';
import { useNavigate } from 'react-router-dom';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useRecoilState(quizzesState);
  const nav = useNavigate();

  // State để quản lý thông tin quiz mới
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDescription, setNewQuizDescription] = useState('');

  const fetchQuizzesApi = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const result = await axios.get(`${apiUrl}/quizzes`);
      setQuizzes(result.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes', error);
    }
  };

  useEffect(() => {
    fetchQuizzesApi();
  }, []);

  const handleAddQuiz = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const newQuizData = {
      title: newQuizTitle,
      description: newQuizDescription,
    };

    try {
      await axios.post(`${apiUrl}/quizzes`, newQuizData);
      message.success('Quiz added successfully');
      fetchQuizzesApi(); // Tải lại danh sách quizzes
      setNewQuizTitle(''); // Reset input title
      setNewQuizDescription(''); // Reset input description
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to add quiz', error.response?.data || error.message);
        message.error('Failed to add quiz');
      } else {
        console.error('Failed to add quiz', error);
        message.error('Failed to add quiz');
      }
    }
  };

  const handleDelete = async (quizId: string) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.delete(`${apiUrl}/quizzes/${quizId}`);
      message.success('Quiz deleted successfully');
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
    } catch (error) {
      message.error('Failed to delete quiz');
    }
  };

  const handleUpdateQuiz = async (quizId: string, updatedTitle: string, updatedDescription: string) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const updatedQuizData = {
      id: quizId,
      title: updatedTitle,
      description: updatedDescription,
    };

    try {
      await axios.put(`${apiUrl}/quizzes`, updatedQuizData);
      message.success('Quiz updated successfully');
      fetchQuizzesApi(); // Tải lại danh sách quizzes
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to update quiz', error.response?.data || error.message);
        message.error('Failed to update quiz');
      } else {
        console.error('Failed to update quiz', error);
        message.error('Failed to update quiz');
      }
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Input
          defaultValue={text}
          onBlur={e => handleUpdateQuiz(record._id, e.target.value, record.description)}
          style={{ borderRadius: '4px', borderColor: '#1890ff' }}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (
        <Input.TextArea
          defaultValue={text}
          onBlur={e => handleUpdateQuiz(record._id, record.title, e.target.value)}
          style={{ borderRadius: '4px', borderColor: '#1890ff' }}
          rows={2}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (data: { _id: any }) => (
        <Space size="middle">
          <Button type="primary" onClick={() => nav(`/quiz/${data._id}`)}>
            Start Test
          </Button>
          <Popconfirm title="Are you sure you want to delete this quiz?" onConfirm={() => handleDelete(data._id)} okText="Yes" cancelText="No">
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Add New Quiz" style={{ marginBottom: '20px' }} bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Quiz Title"
              value={newQuizTitle}
              onChange={e => setNewQuizTitle(e.target.value)}
              style={{ marginBottom: '10px', borderRadius: '4px', borderColor: '#1890ff' }}
            />
          </Col>
          <Col span={12}>
            <Input.TextArea
              placeholder="Quiz Description"
              value={newQuizDescription}
              onChange={e => setNewQuizDescription(e.target.value)}
              rows={2}
              style={{ marginBottom: '10px', borderRadius: '4px', borderColor: '#1890ff' }}
            />
          </Col>
        </Row>
        <Button type="primary" onClick={handleAddQuiz} style={{ float: 'right' }}>
          Add Quiz
        </Button>
      </Card>

      <Table
        dataSource={quizzes}
        columns={columns}
        rowKey={record => record._id}
        pagination={{ pageSize: 5 }} // Hiển thị 5 quizzes mỗi trang
        bordered
        style={{ borderRadius: '4px' }}
      />
    </div>
  );
};
