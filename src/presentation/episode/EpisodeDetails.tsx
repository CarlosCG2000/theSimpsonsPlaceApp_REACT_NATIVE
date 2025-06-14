import React from 'react';
import { Episode } from '../../domain/model/Episode';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
// import EyeToggleIcon from '../components/ToggleIcon';
import i18n from '../../i18n/i18n';
import { AppDatabase } from '../../../App';
import Ionicons from '@react-native-vector-icons/ionicons';

interface EpisodeDetailsProps {
    readonly navigation: any; // Propiedades de navegación

    readonly route: {
        readonly params: {
            readonly episode: Episode; // Episodio seleccionada
        };
    };
}

interface EpisodeDetailsState {
    readonly episodeDetails: Episode | null; // Detalles de la episodio
    readonly loading: boolean; // Indicador de carga
    readonly error: string | null; // Mensaje de error
    readonly initialAnimated: boolean; // Indicador de si la animación inicial se ha completado
    isViewed: boolean; // <-- NUEVO ESTADO para controlar si el episodio está visto
}

const logger = new Logger('EpisodeDetails'); // Instancia del logger para registrar mensajes
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Función para simular una espera

export default class EpisodeDetails extends React.Component<EpisodeDetailsProps, EpisodeDetailsState> {
    private episodeRepository: any; // Repositorio de episodios, se debe inicializar en el constructor (modificar a visto o no visto el episodio)

    private posterOpacity: Animated.Value = new Animated.Value(0); // Valor animado para la opacidad del poster
    private posterScale: Animated.Value = new Animated.Value(0.8); // Valor animado para la escala del poster
    private scrollY: Animated.Value = new Animated.Value(0); // Valor animado para el desplazamiento del scroll

    // Contexto para la base de datos, ¡se debe tipar correctamente!
    // Para componentes de clase, se usa `static contextType = AppDatabase;`
    static contextType = AppDatabase;
    // context!: React.ContextType<typeof AppDatabase>; // Para TypeScript: asegurar el tipo correcto del contexto

    // Inicializamos el componente con las propiedades recibidas
    public constructor(props: EpisodeDetailsProps) {
        super(props);

        this.state = {
            episodeDetails: null, // Inicialmente no hay detalles de la película
            loading: true, // Indicamos que estamos cargando los detalles
            error: null, // No hay errores inicialmente
            initialAnimated: true, // Indicador de si la animación inicial se ha completado
            isViewed: false, // Inicialmente asumimos que no está visto
        };

        const { navigation, route } = props; // Obtenemos las propiedades de navegación
        const { episode } = route.params; // Obtenemos la película desde las propiedades de navegación

        navigation.setOptions({
                headerShown: true, // Esto activa el header
                headerTintColor: '#FFC107', // Color del icono hacia atrás
                headerBackTitle: 'Atrás', // Texto del botón de retroceso
                headerTitle: `${i18n('detailsEpisode')}: ${episode.titulo}`, // Título del header
                // headerTitleAlign: 'center', // Alineación del título
                headerStyle: { backgroundColor: '#09184D' }, // Color de fondo del header
                headerTitleStyle: { fontWeight: 'bold' },
        });

        this.episodeRepository = new EpisodeRepository(); // Inicializamos el repositorio de episodios
    }

     // Método despues del montaje del componente (primer renderizado)
    public async componentDidMount() {

        const db = this.context; // Accede a la instancia de la BD desde el contexto

        if (!db) {
            logger.error('Base de datos no disponible en EpisodeDetails.');
            this.setState({ loading: false, error: 'Error: Base de datos no inicializada.' });
            return;
        }

        // Pasa la instancia de la BD al repositorio
        this.episodeRepository.setDatabaseInstance(db);

        try {
            const { episode } = this.props.route.params; // Obtenemos el episodio desde las propiedades de navegación
            await sleep(300); // Simulamos una espera de 0,2 segundos para mostrar el indicador de carga

            // Comprobar si el episodio ya está visto
            const isViewed = await this.episodeRepository.isEpisodeViewed(episode.id);

            this.setState({
                episodeDetails: episode,
                loading: false,
                error: null,
                isViewed: isViewed, // Actualiza el estado de isViewed
            });

            logger.info('[componentDidMount] Detalles de la episodio:' + episode);
        } catch (error) {
            this.setState({
                loading: false, // Indicamos que ya no estamos cargando
                error: 'Error al obtener los detalles de la episodio', // Guardamos el mensaje de error
            });
            logger.error('Error al obtener los detalles de la episodio:' + error);
            return; // Si hay un error, no continuamos con el renderizado
        }

        // Iniciamos la animación de opacidad y escala del poster
        Animated.parallel([
            Animated.timing(this.posterOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(this.posterScale, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
            this.setState({ initialAnimated: false });
            logger.info('[componentDidMount] Animación inicial completada');
        });
    }

    // Nuevo método para alternar el estado de "visto"
    private toggleViewedStatus = async () => {
        const { episodeDetails, isViewed } = this.state;
        if (!episodeDetails) {return;}

        try {
            if (isViewed) {
                await this.episodeRepository.removeViewedEpisode(episodeDetails.id);
                logger.info(`👁️ Episodio ${episodeDetails.titulo} marcado como NO visto.`);
            } else {
                await this.episodeRepository.addViewedEpisode(episodeDetails);
                logger.info(`👁️ Episodio ${episodeDetails.titulo} marcado como visto.`);
            }
            this.setState(prevState => ({ isViewed: !prevState.isViewed })); // Alternar el estado local
        } catch (error) {
            logger.error(`Error al alternar estado de visto para ${episodeDetails.titulo}: ${error}`);
            // Podrías mostrar un Toast o alerta al usuario aquí
        }
    };

        public render() {
        const { episodeDetails, loading, error, isViewed } = this.state;

        // Renderiza el botón de ojo dinámicamente en el header
        // this.props.navigation.setOptions({
        //     headerRight: () => (
        //         <TouchableOpacity onPress={this.toggleViewedStatus} style={styles.eyeIconContainer}>
        //             <Ionicons
        //                 name={isViewed ? 'eye' : 'eye-off'} // 'eye' si visto, 'eye-slash' si no visto
        //                 size={24}
        //                 color={isViewed ? 'orange' : 'gray'} // Color diferente para indicar estado
        //             />
        //         </TouchableOpacity>
        //     ),
        // });

        return (
            loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFC107" />
                    <Text style={styles.loadingText}>Cargando detalles del episodio...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) :
                <Animated.ScrollView contentContainerStyle={styles.container}
                    onScroll={this.state.initialAnimated
                        ? undefined
                        : Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                            { useNativeDriver: true }
                        )}
                >
                    <View style={styles.detailsContainer}>
                        <Text style={styles.titleText}>{episodeDetails?.titulo}</Text>
                        <Text style={styles.overviewText}>
                            {episodeDetails?.descripcion}
                        </Text>
                        <Text>Directores: {episodeDetails?.directores?.join(', ') || 'N/A'}</Text>
                        <Text>Escritores: {episodeDetails?.escritores?.join(', ') || 'N/A'}</Text>
                        <Text>Invitados: {episodeDetails?.invitados?.join(', ') || 'N/A'}</Text>

                        <Text style={styles.releaseDateText}>
                            Fecha de lanzamiento: {episodeDetails?.lanzamiento}
                        </Text>
                        <Text style={styles.ratingText}>
                            Calificación: {episodeDetails?.valoracion ? 'Sí' : 'No'}
                        </Text>
                        <TouchableOpacity onPress={this.toggleViewedStatus} style={styles.eyeIconContainer}>
                            <Ionicons
                                name={isViewed ? 'eye' : 'eye-off'} // 'eye' si visto, 'eye-slash' si no visto
                                size={24}
                                color={isViewed ? 'orange' : 'gray'} // Color diferente para indicar estado
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingTop: 16,
    },
    overview: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    releaseDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    rating: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    poster: {
        width: 100,
        height: 150,
        marginBottom: 16,
    },
    backdrop: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        paddingTop: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    posterImage: {
        width: 100,
        height: 150,
        borderRadius: 5,
        marginBottom: 16,
    },
    backdropImage: {
        width: '50%',// '100%',
        height: 100,
        borderRadius: 5,
        marginBottom: 16,
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 30,
        shadowColor: '#000',    // Sombra para el contenedor de detalles
        shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
        shadowOpacity: 0.25,    // Opacidad de la sombra
        shadowRadius: 3.84,     // Radio de la sombra
        elevation: 5,           // Elevación para Android
        margin: 16,             // Margen alrededor del contenedor
        flex: 1,                // Ocupa todo el espacio disponible
        justifyContent: 'center', // Centrado vertical
        alignItems: 'center',    // Centrado horizontal
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',          // Color del texto del título
    },
    overviewText: {
        fontSize: 16,
        color: '#666',          // Color del texto de la descripción
        marginBottom: 16,
    },
    releaseDateText: {
        fontSize: 14,
        color: '#999',          // Color del texto de la fecha de lanzamiento
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#999',          // Color del texto de la calificación
        marginBottom: 8,
    },
    genres: {
        fontSize: 14,
        color: '#999',          // Color del texto de los géneros
        marginBottom: 8,
    },
        eyeIconContainer: {
        marginRight: 15, // Espacio a la derecha en el header
    },
});
