import React from 'react';
import { Episode } from '../../domain/model/Episode';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
// import EyeToggleIcon from '../components/ToggleIcon';
import i18n from '../../i18n/i18n';
import { AppDatabase } from '../../../App';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CreditsList } from './CreditsList';

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
                <Animated.ScrollView style={[styles.scrollView]}>
                    <View style={styles.container}>
                        {/* --- CABECERA --- */}
                        <View style={styles.headerContainer}>
                        <Text style={styles.titleText}>{episodeDetails?.titulo}</Text>
                        <Text style={styles.overviewText}>{episodeDetails?.descripcion}</Text>
                        <Text style={styles.releaseDateText}>
                            Fecha de lanzamiento: {episodeDetails?.lanzamiento}
                        </Text>
                        </View>

                        {/* --- ACCIONES --- */}
                        <View style={styles.actionsContainer}>
                        <Text style={styles.actionLabel}>Marcar como visto</Text>
                        <TouchableOpacity onPress={this.toggleViewedStatus}>
                            <Ionicons
                                name={isViewed ? 'eye' : 'eye-off'}
                                size={30}
                                color={isViewed ? '#FFC107' : '#6d758c'}
                            />
                        </TouchableOpacity>
                        </View>

                        {/* --- LISTAS DE CRÉDITOS ANIMADAS --- */}
                        <CreditsList
                        title="Directores"
                        items={episodeDetails?.directores ?? []}
                        iconName="videocam-outline"
                        animation={this.posterOpacity} // Usamos la opacidad del poster como animación
                        />
                        <CreditsList
                        title="Escritores"
                        items={episodeDetails?.escritores  ?? []}
                        iconName="pencil-outline"
                        animation={this.posterOpacity}
                        />
                        <CreditsList
                        title="Invitados"
                        items={episodeDetails?.invitados  ?? []}
                        iconName="star-outline"
                        animation={this.posterOpacity}
                        />
                    </View>
                </Animated.ScrollView>
        );
    }
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#09184D',
    },
    container: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    // Estilos de Carga y Error
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09184D',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#FFC107',
        fontFamily: 'System',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0d1117',
        padding: 20,
    },
    errorText: {
        marginTop: 15,
        fontSize: 18,
        color: '#FF7575',
        textAlign: 'center',
        fontFamily: 'System',
    },
    // Estilos de la cabecera
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#30363d',
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#c9d1d9',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'System',
    },
    overviewText: {
        fontSize: 16,
        color: '#8b949e',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
        fontFamily: 'System',
    },
    releaseDateText: {
        fontSize: 14,
        color: '#8b949e',
        fontStyle: 'italic',
        fontFamily: 'System',
    },
    // Estilos de la sección de acciones
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    actionLabel: {
        fontSize: 16,
        color: '#c9d1d9',
        fontWeight: '600',
    },
    // Estilos para las tarjetas de créditos
    creditsCard: {
        backgroundColor: '#161b22', // Azul oscuro, más claro que el fondo
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#30363d',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    creditsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    creditsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFC107', // Color acentuado para los títulos
        marginLeft: 10,
        fontFamily: 'System',
    },
    creditsItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Permite que los nombres pasen a la siguiente línea si no caben
    },
    creditsItemText: {
        fontSize: 16,
        color: '#8b949e',
        lineHeight: 22,
        fontFamily: 'System',
    },
});
