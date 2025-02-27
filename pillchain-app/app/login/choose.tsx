import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function ChooseScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image source={require("../../assets/images/splash-icon.png")} style={{
        resizeMode: "contain",
        width: 200,
      }} />
      <ThemedView style={styles.buttonContainer}>
        <Button color="#06770E">
          <Link href="/pages/access">
            <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
              Fazer login
            </ThemedText>
          </Link>
        </Button>
        <Button color="#434371">
          <Link href="/login/signup">
            <ThemedText darkColor="#fff" lightColor="#fff" style={{ fontFamily: "Montserrat_500Medium" }}>
              Criar conta
            </ThemedText>
          </Link>
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  buttonContainer: {
    width: "100%",
    padding: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});