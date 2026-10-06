import { Image, StyleSheet, Text, View } from 'react-native';
import LOGO from '../../img/1.jpg';

/** Pie de página con el crédito del autor. */
export default function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.content}>
                <Image source={LOGO} style={styles.logo} accessibilityLabel="Logo" />
                <View style={styles.text}>
                    <Text style={styles.name}>Realizado por Joan Sanchez</Text>
                    <Text style={styles.copy}>{new Date().getFullYear()} Juego</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        marginTop: 24,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 12,
    },
    text: {
        flex: 1,
        gap: 4,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    copy: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});
