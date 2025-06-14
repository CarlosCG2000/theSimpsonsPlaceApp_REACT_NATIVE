
import Ionicons from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function EyeToggleIcon() {
  const [visible, setVisible] = useState(false);

  return (
    <TouchableOpacity onPress={() => setVisible(!visible)}>
      <Ionicons
        name={visible ? 'eye' : 'eye-off'}
        size={28}
        color={visible ? 'orange' : 'gray'} // cambia de color según el estado
      />
    </TouchableOpacity>
  );
}
