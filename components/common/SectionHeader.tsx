import { TypographyStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { StyleSheet, Text } from "react-native";

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.header}>{title}</Text>;
}

const styles = StyleSheet.create({
  header: {
    ...TypographyStyles.h4,
    marginVertical: Spacing.md,
  },
});
