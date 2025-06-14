
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import i18n from '../i18n/i18n';

export default function MenuScreen({ navigation }: { navigation: any }) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../utils/assets/logo.png')} // Usa tu donut
                style={styles.logo}
                resizeMode="contain"
            />

            <Image
                source={require('../utils/assets/donut.png')} // Usa tu donut
                style={styles.donut}
                resizeMode="contain"
            />

            <View style={styles.menuContainer}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('EpisodeTabs', { screen: 'AllEpisodeStack' })}>
                    <Text style={styles.buttonText}>{ i18n('episodes') }</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('QuoteTabs', { screen: 'AllQuoteStack' })}>
                    <Text style={styles.buttonText}>{ i18n('quotes') }</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1444', // Azul oscuro
        alignItems: 'center',
        justifyContent: 'center',
    },
    donut: {
        width: 280,
        height: 280,
        marginBottom: 40,
    },
    logo: {
        width: 280,
        height: 150,
        marginBottom: 20,
    },
    menuContainer: {
        width: '80%',
        gap: 20,
    },
    button: {
        backgroundColor: '#4E5D9C', // 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFC107', // Amarillo Simpsons
    },
    buttonText: {
        color: '#FFC107',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
