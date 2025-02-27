import { Button } from "@/components/Button";
import ListaPill from "@/components/svgs/ListaPill";
import PillIcon from "@/components/svgs/PillIcon";
import QRCodeIcon from "@/components/svgs/QrCodeIcon";
import ShareIcon from "@/components/svgs/ShareIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { SafeAreaView, StyleSheet, View, PanResponder, Animated, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

function ProfilePhoto() {
    return (
        <View style={{
            width: 128,
            height: 128,
            borderRadius: 1000,
            backgroundColor: "#E2E2E2",
            alignSelf: "center",
            top: 16,
            elevation: 20,
            shadowColor: "#000",
            zIndex: 100,
        }}>
        </View>
    )
}

function MainPageButton({
    redirectTo,
    text, 
    SvgIcon,
    style,
    onPress,
}: {
    redirectTo: string;
    text: string;
    SvgIcon: React.FC<{width: number}>;
    style?: any;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity style={[{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-between",
            elevation: 4,
            shadowColor: "#000",
            gap: 12,
            flex: 1
        }, style]} onPress={onPress}>
            <SvgIcon width={60} />
            <ThemedText style={{ fontFamily: "FiraCode_700Bold", textAlign: "center" }}>{text}</ThemedText>
        </TouchableOpacity>
    )
}

export default function AccessScreen() {
    const router = useRouter();
    const [showQR, setShowQR] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                // Permite apenas movimento para baixo
                if (gestureState.dy > 0) {
                    pan.setValue({ x: 0, y: gestureState.dy });
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) { // Fecha o modal se arrastado para baixo o suficiente
                    setShowQR(false);
                    pan.setValue({ x: 0, y: 0 }); // Reseta a posição
                } else {
                    // Retorna à posição inicial com animação
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", position: "relative"}}>
            <View style={styles.topContainer}>
                <ThemedText lightColor="#fff" darkColor="#fff" style={{ fontFamily: "FiraCode_700Bold"}}>Bem vindo, Gabriel👋</ThemedText>
                <ProfilePhoto />
            </View>
            <ThemedView>
                <ThemedView style={styles.rowContainer}>
                    <MainPageButton redirectTo="/pages/access" text="Acessar última receita" SvgIcon={PillIcon} />
                    <MainPageButton redirectTo="/pages/transcriptList" text="Acessa lista de prescrições" SvgIcon={ListaPill} onPress={() => router.push("/pages/transcriptList")} />
                </ThemedView>
                <ThemedView style={styles.rowContainer}>
                    <MainPageButton 
                        redirectTo="/pages/access" 
                        text="Compartilhar carteira com o seu médico" 
                        SvgIcon={QRCodeIcon} 
                        onPress={() => setShowQR(true)}
                    />
                </ThemedView>
            </ThemedView>
            {showQR && (
                <BlurView intensity={190} style={{ position: "absolute", top: 0, zIndex: 1000, flex: 1, width: "100%", height: "100%"}}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateY: pan.y }],
                            backgroundColor: "#fff", 
                            height: "70%", 
                            position: "absolute", 
                            bottom: 0, 
                            width: "100%", 
                            borderTopLeftRadius: 100, 
                            borderTopRightRadius: 100, 
                            elevation: 40, 
                            shadowColor: "#000",
                            alignItems: "center", 
                            paddingVertical: 48, 
                            paddingHorizontal: 32
                        }}
                        {...panResponder.panHandlers}
                    >
                        <View style={{ backgroundColor: "#484041", height: 4, width: "50%", position: "absolute", top: 16, left: "50%", borderRadius: 1000, transform: [{ translateX: "-30%" }], zIndex:1001}} />
                        <QRCode
                            value="gabriel scarpelin"
                            size={200}
                        />
                        <ThemedText style={{ fontFamily: "Montserrat_500Medium", fontSize: 20, textAlign: "center", width: "100%", marginTop: 32}}>Gabriel Scarpelin</ThemedText>
                        <Button color="#06770E" style={{ marginTop: 32, alignItems: "center", justifyContent: "center"}}>
                            <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
                                Compartilhar
                                <ShareIcon width={32} />
                            </ThemedText>
                        </Button>
                    </Animated.View>
                </BlurView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        backgroundColor: "#E51717",
        paddingTop: 48,
        gap: 64,
        position: "relative",
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        paddingHorizontal: 32,
    },
    rowContainer: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        marginTop: 48,
        paddingHorizontal: 16,
    }
});