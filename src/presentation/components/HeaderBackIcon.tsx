import React from 'react';
import { TouchableOpacity } from 'react-native';
import EvilIcon from '@react-native-vector-icons/evil-icons';

function HeaderBack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <TouchableOpacity onPress={ () => rootNavigation.goBack()}>
            {/* <Text style={styles.inicioText}>Inicio</Text> */}
            <EvilIcon name="arrow-left" size={32} color="#FFC107" />
        </TouchableOpacity>
    );
}

export function headerBack(rootNavigation: any) {
    return () => <HeaderBack rootNavigation={rootNavigation} />;
}
