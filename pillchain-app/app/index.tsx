import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";


async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function RedirectScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getValueFor('token').then((value) => {
      setToken(value);
      setLoading(false);
    });
  })

  if (!loading && !token) {
    return (
      <Redirect href={"/login/choose"} />
    )
  }

  return (
    <ThemedView>
      <ThemedText>Gabriel Scarpelin</ThemedText>
    </ThemedView>
  );
}
