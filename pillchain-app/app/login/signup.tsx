import { Button } from "@/components/Button";
import IconSolo from "@/components/svgs/IconSolo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { InputOutline, InputStandard } from "react-native-input-outline";

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.wrapper}>
        <IconSolo width={120} />
      </ThemedView>
      <ThemedView style={styles.formContainer}>
        <ThemedText style={{ fontFamily: "FiraCode_700Bold", fontSize: 32 }}>
          Cadastro
        </ThemedText>
        <InputOutline placeholder="E-mail *" onChangeText={setEmail} />
        <InputOutline placeholder="Nome *" onChangeText={setName} />
        <InputOutline placeholder="CPF *" onChangeText={setCpf} />
        <InputOutline
          placeholder="Senha *"
          secureTextEntry
          onChangeText={setPassword}
        />
        <InputOutline
          placeholder="Confirmar senha *"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />
        <Button
          color="#434371"
          onPress={() => {
            fetch("http://10.254.17.228:3000/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                name: name,
                cpf: cpf,
                password: password,
                confirmPassword: confirmPassword,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  console.error("Erro ao cadastrar");
                }
              })
              .then(() => {
                router.navigate("/login/signin");
              });
          }}
        >
          <ThemedText
            darkColor="#fff"
            lightColor="#fff"
            style={{ fontFamily: "Montserrat_500Medium" }}
          >
            Cadastrar
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
