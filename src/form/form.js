import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'


function ChatForm() {
    const [text, setText] = React.useState("");
    const [file, setFile] = React.useState("");
    const [answerData, setAnswerData] = React.useState({
        answer_text: '',
        voice_src: '',
        hidden: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(); 
        if (text != null)  {
            data.append('text', text);
        }
        if (file != null) {
            data.append('input_file', file);
        }
    
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                body: data
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }
            const resp_data = await response.json()
            
            setAnswerData({
                answer_text: resp_data.short_text,
                voice_src: resp_data.voice,
                hidden: false,
            })
            
        } catch (error) {
            console.error('Ошибка:', error);
        }
        
    }
    return (
        <Container>
        <Row className="justify-content-center mt-5">
            <Col xs={12} sm={8} md={6} lg={6}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formText">
                <Form.Label>Статья</Form.Label>
                <Form.Control as="textarea" type="text" placeholder="Введите текст" value={text} onChange={(e) => setText(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mt-3">
                <Form.Control type="file" value={file} onChange={(e) => setFile(e.target.files[0])}/>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                Отправить
                </Button>
            </Form>
            </Col>
            <Answer hidden={answerData.hidden} answer_text={answerData.answer_text} voice_src={answerData.voice_src}></Answer>
        </Row>
        </Container>
    )
}


class Answer extends React.Component {
    render() {
        console.log(this.props)
        if (this.props.hidden) {
            return
        }
        return (
            <div id="hidden-answer-component" className="p-3">
                <Form.Group controlId="formReadOnlyTextArea">
                <Form.Label>Answer</Form.Label>
                <Form.Control 
                    id="answer-textarea"
                    as="textarea" 
                    rows={3} 
                    readOnly 
                    value={this.props.answer_text} 
                />
                </Form.Group>
        
                <div className="mt-3">
                <audio controls>
                    <source id="answer-audio" src={this.props.voice_src} type="audio/wav" />
                    Ваш браузер не поддерживает элемент audio.
                </audio>
                </div>
            </div>
        )
    }
}
  

export default ChatForm;