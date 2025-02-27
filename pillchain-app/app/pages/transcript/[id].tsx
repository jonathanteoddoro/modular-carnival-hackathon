import { Button } from "@/components/Button";
import IconSolo from "@/components/svgs/IconSolo";
import ShareIcon from "@/components/svgs/ShareIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

function Item({ title, content, isSameLine}: { title: string, content: string, isSameLine?: boolean }) {
    return (
        <ThemedView style={{ padding: 16, borderRadius: 8, flexDirection: isSameLine ? "row" : "column", gap: 8 }}>
            <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 14 }}>{title}</ThemedText>
            <ThemedText style={{ fontFamily: "FiraCode_400Regular", fontSize: 14, textAlign: "left", marginLeft : isSameLine ? 8 : 0 }}>{content}</ThemedText>
        </ThemedView>
    )
}

export default function TranscriptScreen(){
    const { id } = useLocalSearchParams() as { id: string };

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.wrapper}>
                <IconSolo  width={120}/>
            </ThemedView>
            <ScrollView style={{ width: "100%", gap: 32, backgroundColor: "#fff", flex: 1}}>
                <Item title="Receita" content={`
Ritalina 1co v/o a cada 24h
Rivotril 1co v/o a cada 48h
Zulpidem 1co v/o antes de dormir
                `} />
                <Item title="Data validade da receita" content="2022-09-01" />
                <Item title="Dr(a)" content="Dr. Fulano de Tal" />
                <Item title="CRM" content="123456" />
                <Item title="Data de emissão" content="2021-09-01" />

                <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 32 }}>
                    <QRCode value={id} size={200} />
                    <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 14, marginTop: 16 }}>Código: {id}</ThemedText>
                </View>
                <Button color="#06770E" style={{ marginTop: 32, alignItems: "center", justifyContent: "center"}}>
                            <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
                                Compartilhar
                                <ShareIcon width={32} />
                            </ThemedText>
                        </Button>
            </ScrollView>  
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 32,
        paddingVertical: 16
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