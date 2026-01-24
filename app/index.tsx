import { Redirect } from "expo-router";

export default function Index() {
  // ✅ Redirect to the welcome screen inside the (auth) group
  return <Redirect href="/(auth)/welcome" />;
}
