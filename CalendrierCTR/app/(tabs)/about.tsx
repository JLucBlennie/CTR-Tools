import { Text, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import appJson from '@/app.json';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.aboutcontainer}>
        <MaterialCommunityIcons name="diving-helmet" size={50} style={{ padding: 10 }} color="#ffd33d" />
        <Text style={styles.text}>Version de l'application</Text>
        <Text style={styles.text}>{appJson.expo.name} by JLuc - V{appJson.expo.version} </Text>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16
  },
  aboutcontainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  }
});
