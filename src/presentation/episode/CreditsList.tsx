
import { Animated, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import i18n from '../../i18n/i18n';

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
            <Text style={styles.creditsItemText}>{ i18n('notAvailable') }</Text>
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
                        {item}{index < items.length - 1 ? '  •  ' : ''}
                    </Text>
                ))}
            </View>
        </Animated.View>
    );
};


// Estilos para las tarjetas de créditos
const styles = StyleSheet.create({
    creditsCard: {
        backgroundColor: '#4E5D9C',
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
        color: '#FFC107',
        marginLeft: 10,
        fontFamily: 'System',
    },
    creditsItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    creditsItemText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 22,
        fontFamily: 'System',
    },
});
