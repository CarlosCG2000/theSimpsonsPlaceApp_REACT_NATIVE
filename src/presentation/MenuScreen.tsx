import { View, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }: { navigation: any }) {
    return (
        <View style={styles.container}>
            <Button
                title="Entrar a los episodios"
                onPress={() => navigation.navigate('EpisodeTabs', { screen: 'AllEpisodeStack' })}
            />
            <Button
                title="Entrar a los citas"
                onPress={() => navigation.navigate('QuoteTabs', { screen: 'AllQuoteStack' })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
