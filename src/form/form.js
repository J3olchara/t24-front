import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'


function onChangeAudio(e) {
    if (e.target.files.length > 0) {
        // Получаем первый выбранный файл
        const file = e.target.files[0];
        
        // Выводим информацию о файле в консоль
        console.log('Выбран файл:', file.name);
        console.log('Размер файла:', file.size);
        console.log('Тип файла:', file.type);
    } else {
        console.log('Файл не выбран.');
    }
}

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
            const response = await fetch('http://localhost:8080/chat', {
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
            setAnswerData({
                answer_text: resp_data.short_text,
                voice_src: resp_data.voice,
                hidden: false,
            })
            
        } catch (error) {
            console.error('Ошибка:', error);
        }
        
    }
    // const handleTextChange = useCallback((e) => {
    //     setText(e.target.value);
    //     adjustTextareaHeight(e.target);
    // }, []);

    // const adjustTextareaHeight = (textarea) => {
    //     textarea.style.height = 'auto';  // Сбрасываем предыдущую высоту
    //     textarea.style.height = textarea.scrollHeight + "px";  // Устанавливаем новую высоту
    // };

    return (
        <Container>
        <Row className="justify-content-center mt-5">
            <Col xs={12} sm={8} md={6} lg={6}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formText">
                <Form.Label>Статья</Form.Label>
                <Form.Control as="textarea" height="auto" type="text" placeholder="Введите текст" value={text} onChange={(e) => setText(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mt-3">
                <Form.Control type="file" onChange={(e) => {
                    if (e.target.files.length > 0) {
                        // Получаем первый выбранный файл
                        const file = e.target.files[0];
                        setFile(file)
                    } else {
                        console.log('Файл не выбран.');
                    }
                }}/>
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
        if (this.props.hidden) {
            return null;  // Возвращаем null вместо undefined
        }

        return (
            <div id="hidden-answer-component" className="p-3">
                <Form.Group controlId="formReadOnlyTextArea">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control 
                        id="answer-textarea"
                        as="textarea" 
                        height="auto"
                        rows={3} 
                        readOnly 
                        value={this.props.answer_text} 
                    />
                </Form.Group>
            
                <Audio voice_src={this.props.voice_src}></Audio>
            </div>
        );
    }
}

class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.audioRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        // Проверяем, изменился ли voice_src
        if (prevProps.voice_src !== this.props.voice_src) {
            // Перезагружаем аудио-элемент
            if (this.audioRef.current) {
                this.audioRef.current.load(); // Загружаем новый источник
                this.audioRef.current.play(); // (опционально) Автоматически воспроизводим аудио
            }
        }
    }

    render() {
        if (!this.props.voice_src) {
            return null;
        }

        return (
            <div className="mt-3">
                <audio controls ref={this.audioRef}>
                    <source src={this.props.voice_src} type="audio/wav" />
                    Ваш браузер не поддерживает элемент audio.
                </audio>
            </div>
        );
    }
}


export default ChatForm;