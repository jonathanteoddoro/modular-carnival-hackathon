import { Button } from "@/components/Button";
import ListaPill from "@/components/svgs/ListaPill";
import PillIcon from "@/components/svgs/PillIcon";
import QRCodeIcon from "@/components/svgs/QrCodeIcon";
import ShareIcon from "@/components/svgs/ShareIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  PanResponder,
  Animated,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as SecureStore from "expo-secure-store";

function ProfilePhoto({ router }: { router: any }) {
  return (
    <TouchableOpacity
      style={{
        width: 128,
        height: 128,
        borderRadius: 1000,
        backgroundColor: "#E2E2E2",
        alignSelf: "center",
        top: 16,
        elevation: 20,
        shadowColor: "#000",
        zIndex: 100,
      }}
      onPress={async () => {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          SecureStore.deleteItemAsync("token");
          router.navigate("/index");
        }
      }}
    ></TouchableOpacity>
  );
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
  SvgIcon: React.FC<{ width: number }>;
  style?: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "space-between",
          elevation: 4,
          shadowColor: "#000",
          gap: 12,
          flex: 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      <SvgIcon width={60} />
      <ThemedText
        style={{ fontFamily: "FiraCode_700Bold", textAlign: "center" }}
      >
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function AccessScreen() {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("Gabriel");
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
        if (gestureState.dy > 100) {
          // Fecha o modal se arrastado para baixo o suficiente
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

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado para gerar um QR Code");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://10.254.17.228:3000/api/users/qrcode`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao gerar QR Code");
      }

      const data = await response.json();
      setQrCode(data.code);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o QR Code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQR = async () => {
    setShowQR(true);
    if (!qrCode) {
      await fetchQRCode();
    }
  };

  const handleShare = async () => {
    if (!qrCode) return;

    try {
      await Share.share({
        message: `Acesse minha carteira médica com o código: ${qrCode}`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o QR Code");
    }
  };

  // Fetch user info on mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await SecureStore.getItemAsync("userInfo");
        if (userInfo) {
          const parsedInfo = JSON.parse(userInfo);
          if (parsedInfo.name) {
            setUserName(parsedInfo.name.split(" ")[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}
    >
      <View style={styles.topContainer}>
        <ThemedText
          lightColor="#fff"
          darkColor="#fff"
          style={{ fontFamily: "FiraCode_700Bold" }}
        >
          Bem vindo, {userName}👋
        </ThemedText>
        <ProfilePhoto router={router} />
      </View>
      <ThemedView>
        <ThemedView style={styles.rowContainer}>
          <MainPageButton
            redirectTo="/pages/access"
            text="Acessar última receita"
            SvgIcon={PillIcon}
            onPress={() => router.push("/pages/transcript/3")}
          />
          <MainPageButton
            redirectTo="/pages/transcriptList"
            text="Acessa lista de prescrições"
            SvgIcon={ListaPill}
            onPress={() => router.push("/pages/transcriptList")}
          />
        </ThemedView>
        <ThemedView style={styles.rowContainer}>
          <MainPageButton
            redirectTo="/pages/access"
            text="Compartilhar carteira com o seu médico"
            SvgIcon={QRCodeIcon}
            onPress={handleOpenQR}
          />
        </ThemedView>
      </ThemedView>
      {showQR && (
        <BlurView
          intensity={190}
          style={{
            position: "absolute",
            top: 0,
            zIndex: 1000,
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
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
              paddingHorizontal: 32,
            }}
            {...panResponder.panHandlers}
          >
            <View
              style={{
                backgroundColor: "#484041",
                height: 4,
                width: "50%",
                position: "absolute",
                top: 16,
                left: "50%",
                borderRadius: 1000,
                transform: [{ translateX: "-30%" }],
                zIndex: 1001,
              }}
            />

            {loading ? (
              <View style={{ marginTop: 40 }}>
                <ActivityIndicator size="large" color="#E51717" />
                <ThemedText
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Gerando QR Code...
                </ThemedText>
              </View>
            ) : qrCode ? (
              <QRCode value={qrCode} size={200} />
            ) : (
              <View style={{ marginTop: 40 }}>
                <ThemedText
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Não foi possível gerar o QR Code
                </ThemedText>
                <Button
                  color="#E51717"
                  style={{
                    marginTop: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={fetchQRCode}
                >
                  <ThemedText
                    darkColor="#fff"
                    lightColor="#fff"
                    style={{ fontFamily: "Montserrat_500Medium" }}
                  >
                    Tentar novamente
                  </ThemedText>
                </Button>
              </View>
            )}

            {qrCode && (
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  gap: 16,
                  marginTop: 32,
                }}
              >
                <ThemedText
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Código: {qrCode}
                </ThemedText>
                <Button
                  color="#06770E"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={handleShare}
                >
                  <ThemedText
                    darkColor="#fff"
                    lightColor="#fff"
                    style={{
                      fontFamily: "Montserrat_500Medium",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    Compartilhar
                    <ShareIcon width={24} />
                  </ThemedText>
                </Button>

                <Button
                  color="#E51717"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setQrCode(null);
                    fetchQRCode();
                  }}
                >
                  <ThemedText
                    darkColor="#fff"
                    lightColor="#fff"
                    style={{ fontFamily: "Montserrat_500Medium" }}
                  >
                    Gerar novo QR Code
                  </ThemedText>
                </Button>
              </View>
            )}
          </Animated.View>
        </BlurView>
      )}
    </SafeAreaView>
  );
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
  },
});
