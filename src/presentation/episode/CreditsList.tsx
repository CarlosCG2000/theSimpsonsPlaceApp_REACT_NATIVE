
import { Animated, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Este componente crea las tarjetas estilizadas para directores, escritores, etc.
interface CreditsListProps {
  title: string;
  items: string[];
  iconName: any;
  animation: Animated.Value | Animated.AnimatedInterpolation<string | number>;
}

// --- Componente Reutilizable para las Listas de Créditos ---
export const CreditsList: React.FC<CreditsListProps> = ({ title, items, iconName, animation }) => {
    if (!items || items.length === 0) {
        return (
        <Animated.View style={[styles.creditsCard, { transform: [{ translateY: animation }] }]}>
            <View style={styles.creditsHeader}>
            <Ionicons name={iconName} size={20} color="#FFC107" />
            <Text style={styles.creditsTitle}>{title}</Text>
            </View>
            <Text style={styles.creditsItemText}>No disponible</Text>
        </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.creditsCard, { transform: [{ translateY: animation }] }]}>
        <View style={styles.creditsHeader}>
            <Ionicons name={iconName} size={20} color="#FFC107" />
            <Text style={styles.creditsTitle}>{title}</Text>
        </View>
        <View style={styles.creditsItemsContainer}>
            {items.map((item, index) => (
            <Text key={index} style={styles.creditsItemText}>
                {/* Añade un punto separador excepto para el último elemento */}
                {item}{index < items.length - 1 ? '  •  ' : ''}
            </Text>
            ))}
        </View>
        </Animated.View>
    );
};


// --- ESTILOS ---
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#0d1117', // Un azul muy oscuro, casi negro
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
        backgroundColor: '#0d1117',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#c9d1d9',
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
        color: 'black',
        fontWeight: '600',
    },
    // Estilos para las tarjetas de créditos
    creditsCard: {
        backgroundColor: '#4E5D9C', // Azul oscuro, más claro que el fondo
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
        color: 'rgba(255, 255, 255, 0.7)', // blanco con opacidad
        lineHeight: 22,
        fontFamily: 'System',
    },
});
