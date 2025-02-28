import { Button } from "@/components/Button";
import IconSolo from "@/components/svgs/IconSolo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { InputOutline, InputStandard } from "react-native-input-outline";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function SigninScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.wrapper}>
        <IconSolo width={120} />
      </ThemedView>
      <ThemedView style={styles.formContainer}>
        <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 32 }}>
          Fazer login
        </ThemedText>

        {error && <ThemedText style={{ color: "red" }}>{error}</ThemedText>}

        <InputOutline placeholder="E-mail *" onChangeText={setEmail} />
        <InputOutline
          placeholder="Senha *"
          onChangeText={setSenha}
          secureTextEntry
        />
        <Button
          color="#434371"
          onPress={() => {
            fetch("http://10.254.17.228:3000/api/auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: senha,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  console.error("Erro ao fazer login");
                  setError("Erro ao fazer login");
                }
              })
              .then((data) => {
                SecureStore.setItemAsync("token", data.token).then(() => {
                  router.navigate("/pages/access");
                });
              });
          }}
        >
          <ThemedText
            darkColor="#fff"
            lightColor="#fff"
            style={{ fontFamily: "Montserrat_500Medium" }}
          >
            Fazer login
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
    paddingHorizontal: 32,
  },
  wrapper: {
    alignItems: "center",
    paddingVertical: 32,
  },

  formContainer: {
    width: "100%",
    gap: 32,
  },
});
