import { SafeAreaView, StyleSheet } from 'react-native';
import Game from '../components/Game';

/** Pantalla inicial: el juego Triqui. */
export default function Index() {
    return (
        <SafeAreaView style={styles.safe}>
            <Game />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
});
