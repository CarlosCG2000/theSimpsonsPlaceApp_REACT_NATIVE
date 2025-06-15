
import React from 'react';
import { QuoteRepository } from '../../../domain/repository/QuoteRepository';
import { Question, quotesToQuestions } from '../../../domain/model/Question';
import { Quote } from '../../../domain/model/Quote';
import { Text, TouchableOpacity, View, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import { Logger } from '../../../utils/Logger';

export interface QuestionGameProps {
    readonly navigation: any
}

interface QuestionGameState {
    currentIndex: number
    selectedAnswer: string | null
    score: number
    isAnswered: boolean
    isLoading: boolean
    showModal: boolean // controla si se muestra el popup
    isAnswerCorrect: boolean, // indica si la respuesta fue correcta
}

const logger = new Logger('QuestionGame');

export default class QuestionGame extends React.Component<QuestionGameProps, QuestionGameState> {
    quoteRepository: QuoteRepository;
    questions: Question[] = [];
    opciones: string[] = [];

    constructor(props: QuestionGameProps) {
        super(props);

        this.state = {
            currentIndex: 0, // Índice de la pregunta actual
            selectedAnswer: null, // Respuesta seleccionada por el usuario
            score: 0, // Puntuación del usuario
            isAnswered: false, // Indica si la pregunta ha sido respondida
            isLoading: true, // Indica si las preguntas están cargando
            showModal: false, // Controla si se muestra el popup
            isAnswerCorrect: false, // Indica si la respuesta fue correcta
        };

        this.quoteRepository = new QuoteRepository();

        props.navigation.setOptions({
            headerShown: true,
            headerTintColor: '#FFC107',
            headerBackTitle: 'Atrás',
            headerTitle: 'Pantalla de Preguntas',
            headerStyle: { backgroundColor: '#09184D' },
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }

    async componentDidMount() {
        const quotes: Quote[] = await this.quoteRepository.getQuotes(5, '');
        this.questions = quotesToQuestions(quotes);
        logger.info(`Preguntas cargadas: ${this.questions.length}`);

        this.opciones = [
            this.questions[0].personajeCorrecto,
            ... this.questions[0].personajeIncorrectos,
        ].sort(() => Math.random() - 0.5);

        this.setState({ isLoading: false });
    }

    handleSelectAnswer = (answer: string) => {
        this.setState({ selectedAnswer: answer, isAnswered: true });
    };

    handleNextQuestion = () => {
        const { currentIndex, selectedAnswer } = this.state; // Obtener el índice actual, la respuesta seleccionada y la puntuación actual
        const currentQuestion = this.questions[currentIndex]; // Obtener la pregunta actual

        const isCorrect = selectedAnswer === currentQuestion.personajeCorrecto; // Verificar si la respuesta seleccionada es correcta
        logger.info(`Pregunta ${currentIndex + 1}: ${currentQuestion.cita}`);

        if (currentIndex + 1 < this.questions.length) {
            const nextQuestion = this.questions[currentIndex + 1];
            this.opciones = [
                nextQuestion.personajeCorrecto,
                ...nextQuestion.personajeIncorrectos,
            ].sort(() => Math.random() - 0.5);
        }

        this.setState({
            isAnswerCorrect: isCorrect,
            showModal: true, // muestra el modal antes de avanzar
        });

    };

    handleCloseModal = () => {
        const { currentIndex, score, isAnswerCorrect } = this.state;
        const updatedScore = isAnswerCorrect ? score + 1 : score;
        logger.info(`Respuesta ${isAnswerCorrect ? 'correcta' : 'incorrecta'}. Puntuación actual: ${updatedScore}`);

        if (currentIndex + 1 < this.questions.length) {
            this.setState({
                currentIndex: currentIndex + 1,
                selectedAnswer: null,
                isAnswered: false,
                showModal: false,
                isAnswerCorrect: false,
                score: updatedScore,
            });

        } else {
            logger.info(`Juego terminado. Puntuación final: ${updatedScore}`);
            this.setState({ showModal: false }, () => {
                this.props.navigation.navigate('ResultGame', {
                    puntuacion: updatedScore,
                });
            });
        }
    };

    render() {
        const { currentIndex, selectedAnswer, isAnswered, isLoading } = this.state;

        if (isLoading && this.questions.length === 0) {
            return (
                // Mostramos un indicador de carga mientras se obtienen las episodios
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            );
        }

        const currentQuestion = this.questions[currentIndex];

        return (
            <View style={styles.container}>
                <Text style={styles.questionText}>{currentQuestion.cita}</Text>

                {this.opciones.map((opcion, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.handleSelectAnswer(opcion)}
                    style={{
                        backgroundColor: selectedAnswer === opcion ? '#FFC107' : 'white',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 12,
                    }}
                >
                    <Text style={styles.optionText}>{opcion}</Text>
                </TouchableOpacity>
                ))}

                {isAnswered && (
                    <TouchableOpacity
                        onPress={this.handleNextQuestion}
                        style={styles.nextButton}
                    >
                        <Text style={styles.optionText}>
                        {currentIndex === this.questions.length - 1 ? 'Ver resultado' : 'Siguiente'}
                        </Text>
                    </TouchableOpacity>
                )}

                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {this.state.isAnswerCorrect ? '¡Correcto! ✅' : 'Incorrecto ❌'}
                            </Text>
                            <Text style={styles.correctAnswerText}>
                                {`La respuesta correcta era: ${currentQuestion.personajeCorrecto}`}
                            </Text>
                            <Image
                                source={{ uri: currentQuestion.imagen }}
                                style={styles.questionImage}
                                resizeMode="contain"
                            />
                            <TouchableOpacity onPress={this.handleCloseModal} style={styles.nextButton}>
                                <Text style={styles.optionText}>
                                    {currentIndex === this.questions.length - 1 ? 'Ver resultado' : 'Siguiente'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#09184D',
        justifyContent: 'center',

        width: '100%',
    },
    questionText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    nextButton: {
        backgroundColor: '#FFC107',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    optionText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
        backgroundColor: '#4E5D9C',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFC107',
    },
    correctAnswerText: {
        marginVertical: 10,
        textAlign: 'center',
        color: '#FFC107',
    },
    questionImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});
