import { View, Text, StyleSheet } from 'react-native';
import { ToggleIcon } from './Icons';

type Props = {
  title: string;
  description: string;
  iconName?: string; // MaterialCommunityIcons
};

export default function EmptyStateView({ title, description }: Props) {
    return (
        <View style={styles.container}>
            <ToggleIcon />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        flex: 1,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD100',
        margin: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#E0E0E0',
        textAlign: 'center',
        lineHeight: 22,
    },
});
