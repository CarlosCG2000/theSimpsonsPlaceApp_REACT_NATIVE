import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Quote } from '../../domain/model/Quote';

interface QuoteRowProps {
    readonly quote: Quote;
    readonly index: number;
}

export default function QuoteItem(props: QuoteRowProps) {

    const { quote, index } = props;

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        delay: index * 250,
        useNativeDriver: true,
        }).start();
    }, [opacity, index]);

    return (
            <Animated.View style={[styles.container_item, { opacity }]}>
                    <View style={styles.container_info}>
                        <Text numberOfLines={ 4 } style={styles.title}>{quote.cita}</Text>
                        <Text style={styles.description}>{quote.personaje}</Text>
                    </View>
                    <Image
                        source={{ uri: quote.imagen }}
                        style={styles.image}
                        resizeMode="cover"
                    />
            </Animated.View>
    );
}

const styles = StyleSheet.create({
    container_item: {
        height: 180,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderColor: '#4E209C',
        borderRadius: 10,
        backgroundColor: '#4E5D9C',
        borderWidth: 1,
        margin: 10,
        paddingEnd: 12,
    },
    container_info: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        gap: 2,
        padding: 15,
    },
    image: {
        width: 80,
        height: 140,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 5,
        color: '#FFC107',
    },
    description: {
        fontSize: 16,
        color: '#FFC107',
        fontStyle: 'italic',
    },
});

