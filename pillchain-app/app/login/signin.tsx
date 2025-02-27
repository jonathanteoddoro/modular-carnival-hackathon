import { Button } from "@/components/Button";
import IconSolo from "@/components/svgs/IconSolo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { InputOutline, InputStandard } from 'react-native-input-outline';



export default function SigninScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.wrapper}>
                <IconSolo  width={120}/>
            </ThemedView>
            <ThemedView style={styles.formContainer}>
                <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 32}}>Login</ThemedText>
                <InputOutline placeholder="E-mail *" />
                <InputOutline placeholder="Senha *" secureTextEntry />
                <Button color="#434371">
                    <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
                        Entrar
                    </ThemedText>
                </Button>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 32
    },
    wrapper: {
        alignItems: "center",
        paddingVertical: 32
    },

    formContainer: {
        width: "100%",
        gap: 32
    }
})