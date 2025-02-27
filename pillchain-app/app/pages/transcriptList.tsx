import { Button } from "@/components/Button";
import IconSolo from "@/components/svgs/IconSolo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";

function CardTranscript({
    transcriptId,
    date,
    onPress,
}: {
    transcriptId: string;
    date: string;
    onPress?: () => void;
}) {
    return (
        <ThemedView style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
            elevation: 20,
            shadowColor: "#000",
            gap: 12,
            alignItems: "flex-start",
            marginTop: 32
        }}>
            <ThemedText style={{ fontFamily: "FiraCode_700Bold", textAlign: "center", color:"#000", fontSize: 14 }}>Receita: {transcriptId}</ThemedText>
            <ThemedText style={{ fontFamily: "FiraCode_700Bold", textAlign: "center", fontSize: 14 }}>Data: {new Date(date).toLocaleDateString("pt-br")}</ThemedText>
            <Button color="#D5A021" style={{ alignSelf: "stretch", width: "100%" }} onPress={onPress}>
                <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
                    Ver receita
                </ThemedText>
            </Button>
        </ThemedView>
    )
}

export default function TranscriptListScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.wrapper}>
                <IconSolo  width={120}/>
            </ThemedView>
            <ScrollView style={{ width: "100%", gap: 32, backgroundColor: "#fff", flex: 1}}>
                <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 28}}>Lista de receitas</ThemedText>
                <CardTranscript transcriptId="1" date="2021-09-01" onPress={() => router.push("/pages/transcript/1")}/>
                <CardTranscript transcriptId="2" date="2021-09-02" />  
            </ScrollView>  
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