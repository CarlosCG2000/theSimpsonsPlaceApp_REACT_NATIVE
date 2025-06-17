import React from 'react';
import { TouchableOpacity } from 'react-native';
import EvilIcon from '@react-native-vector-icons/evil-icons';

function HeaderBack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <TouchableOpacity onPress={ () => rootNavigation.goBack()}>
            <EvilIcon name="arrow-left" size={38} color="#FFC107" />
        </TouchableOpacity>
    );
}

export function HeaderBackButton(rootNavigation: any) {
    return () => <HeaderBack rootNavigation={rootNavigation} />;
}
