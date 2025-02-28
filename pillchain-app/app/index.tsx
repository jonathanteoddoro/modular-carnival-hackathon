import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
    getValueFor("token").then((value) => {
      if (value) {
        fetch("http://10.254.17.228:3000/api/auth/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${value}`,
          },
        })
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json();
            } else {
              console.error("Invalid token");
              throw new Error("Invalid token");
            }
          })
          .then((data) => {
            if (!data) {
              setToken(null);
            }
            setToken(value);
          })
          .catch(() => {
            setToken(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  });
  if (loading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!token) {
    return <Redirect href={"/login/choose"} />;
  }

  return <Redirect href={"/pages/access"} />;
}
